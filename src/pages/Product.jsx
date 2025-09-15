import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Loading state

  // ✅ Get product by id
  useEffect(() => {
    setLoading(true); // start loading
    if (products && products.length > 0) {
      const foundProduct = products.find((p) => p._id === productId);
      if (foundProduct) {
        setProductData(foundProduct);
        setImage(foundProduct.image || "");
      }
    }
    setLoading(false); // stop loading
  }, [productId, products]);

  // ✅ Loading skeleton
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // ✅ If product not found
  if (!productData) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Product Loading ...
      </div>
    );
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* ---------------- Product Section ---------------- */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* ---------------- Images ---------------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* Thumbnail Images */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            <img
              src={productData.image}
              alt="product"
              onClick={() => setImage(productData.image)}
              className={`cursor-pointer w-[24%] sm:w-full sm:mb-3 flex-shrink-0 object-cover ${
                image === productData.image ? "border border-orange-500" : ""
              }`}
            />
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[80%]">
            <img
              src={image}
              alt="product"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* ---------------- Product Details ---------------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          {/* Ratings */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <img
                key={i}
                src={assets.star_icon}
                alt="star"
                className="w-3.5"
              />
            ))}
            <img src={assets.star_dull_icon} alt="star" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>

          {/* Price */}
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>

          {/* Description */}
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {/* Sizes */}
          <div className="flex flex-col gap-4 my-8">
            <div className="flex gap-2">{/* You can add size buttons here */}</div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => addToCart(productData._id)}
            className="bg-black text-white py-3 px-8 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          {/* Extra Info */}
          <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
            <p>✅ 100% Original product</p>
            <p>🚚 Free delivery on orders above $49</p>
            <p>↩️ Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>

      {/* ---------------- Description + Reviews ---------------- */}
      <div className="mt-10">
        <div className="flex">
          <b className="px-5 py-3 text-sm border">Description</b>
          <p className="px-5 py-3 text-sm border">Reviews (122)</p>
        </div>

        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence.
          </p>
          <p>
            E-commerce websites typically display products with detailed
            descriptions, images, prices, and available variations (e.g., sizes,
            colors). Each product usually has its own dedicated page with
            relevant information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;
