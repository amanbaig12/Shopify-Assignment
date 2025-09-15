import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";
// import { products } from '../assets/frontend_assets/assets';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cartItems")) || {};
  });
  const [orders, setOrders] = useState(() => {
    return JSON.parse(localStorage.getItem("orders")) || [];
  }); // New state to hold orders

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);
  const navigate = useNavigate(); // to navigate to different pages

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const query = `
    query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
   `;

    try {
      const res = await fetch(
        `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/${import.meta.env.VITE_SHOPIFY_API_VERSION}/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token":
              import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
          },
          body: JSON.stringify({ query, variables: { first: 50 } }),
        }
      );

      const data = await res.json();
      console.log("Products:", data);

      const fetchedProducts = data.data.products.edges.map(({ node }) => ({
        _id: node.id.split("/").pop(),
        title: node.title,
        description: node.description,
        image: node.images.edges[0]?.node?.url || "",
        price: node.variants.edges[0]?.node?.price?.amount || 0,
        currency: node.variants.edges[0]?.node?.price?.currencyCode || "USD",
      }));

      setProducts(fetchedProducts);
      console.log("setproducts(fetchedproducts): ", fetchedProducts);
    } catch (error) {
      console.error(error);
    }
  };

  // Auto fetch on mount
  useEffect(() => {
    fetchProducts();
    console.log("products context state", products);
  }, []);

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] ? (cartData[itemId] += 1) : (cartData[itemId] = 1);
    } else {
      cartData[itemId] = {};
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    console.log("addtoCart:", itemId);
    console.log("cartData :", cartData);
  };

  const addOrder = () => {
    let tempOrders = structuredClone(orders);
    let newOrder = [];

    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          newOrder.push({
            _id: item,
            size,
            quantity: cartItems[item][size],
          });
        }
      }
    }
    setOrders([...tempOrders, ...newOrder]);
    //setCartItems({}); // Clear cart after placing the order
  };

  const getCartCount = () => {
    let totalCount = 0;

    for (const item in cartItems) {
      totalCount += cartItems[item]; // directly add number
    }

    console.log("getCartCount:", totalCount);
    return totalCount;
  };

  const updateQuantity = async (itemId, quantity) => {
    console.log("cartItems at updatequantity: ", cartItems);
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const quantity = cartItems[itemId];
      if (quantity > 0) {
        const productInfo = products.find(
          (product) => String(product._id) === String(itemId)
        );

        if (productInfo) {
          totalAmount += productInfo.price * quantity;
        } else {
          console.warn("Product not found for ID:", itemId);
        }
      }
    }

    return totalAmount;
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    addOrder, // Add this to allow placing orders
    orders,
    navigate,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ShopContextProvider;
