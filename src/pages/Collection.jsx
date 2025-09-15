import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortType, setSortType] = useState("relevent");

  // search bar state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // loading state
  const [loading, setLoading] = useState(true);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // kitne products ek page par dikhane hai

  const toggleCategory = (e) => {
    const value = e.target.value;
    category.includes(value)
      ? setCategory((prev) => prev.filter((item) => item !== value))
      : setCategory((prev) => [...prev, value]);
  };

  // Filtering + Sorting
  const applyFilter = () => {
    if (!products || products.length === 0) {
      setFilterProducts([]);
      return;
    }

    let productsCopy = [...products];

    // SEARCH
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      productsCopy = productsCopy.filter((item) =>
        String(item.title || "").toLowerCase().includes(q)
      );
    }

    // CATEGORY
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    // PRICE
    const min = minPrice !== "" ? Number(minPrice) : 0;
    const max = maxPrice !== "" ? Number(maxPrice) : Infinity;
    productsCopy = productsCopy.filter((item) => {
      const priceNum = Number(item.price) || 0;
      return priceNum >= min && priceNum <= max;
    });

    // SORTING
    if (sortType === "low-high") {
      productsCopy.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortType === "high-low") {
      productsCopy.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFilterProducts(productsCopy);
    setCurrentPage(1); // filter lagane ke baad page reset
  };

  useEffect(() => {
    if (products && products.length > 0) {
      setLoading(false); // products loaded
    }
  }, [products]);

  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, minPrice, maxPrice, searchQuery, products, sortType]);

  const applyPreset = (preset) => {
    switch (preset) {
      case "under50":
        setMinPrice("");
        setMaxPrice(50);
        break;
      case "50-100":
        setMinPrice(50);
        setMaxPrice(100);
        break;
      case "above100":
        setMinPrice(100);
        setMaxPrice("");
        break;
      default:
        setMinPrice("");
        setMaxPrice("");
    }
  };

  // Suggestions list
  const suggestions = searchQuery
    ? products.filter((item) =>
        String(item.title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filterProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Option */}
      <div className="min-w-52">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          Filters
          <img
            src={assets.dropdown_icon}
            alt=""
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
          />
        </p>

        {/* Category Filter */}
         

        {/* PRICE Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">PRICE</p>
          <div className="flex items-center gap-2 text-sm mb-3">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border px-2 py-1 w-[45%]"
              min={0}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border px-2 py-1 w-[45%]"
              min={0}
            />
          </div>
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => applyPreset("under50")}
              className="px-2 py-1 border text-sm"
            >
              Under $50
            </button>
            <button
              onClick={() => applyPreset("50-100")}
              className="px-2 py-1 border text-sm"
            >
              $50 - $100
            </button>
            <button
              onClick={() => applyPreset("above100")}
              className="px-2 py-1 border text-sm"
            >
              Above $100
            </button>
            <button
              onClick={() => applyPreset("clear")}
              className="px-2 py-1 border text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            className="w-full border px-3 py-2 rounded"
          />

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 bg-white border w-full mt-1 rounded shadow">
              {suggestions.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setSearchQuery(item.title);
                    setShowSuggestions(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {item.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Title + Sort */}
        <div className="flex justify-between text-sm sm:text-xl lg:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
            className="border border-gray-300 text-sm px-2"
          >
            <option value="relevent">Sort by: Relevent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Product List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : currentProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
              {currentProducts.map((product) => (
                <ProductItem
                  key={product._id}
                  id={product._id}
                  image={product.image}
                  name={product.title}
                  price={product.price}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-300"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === totalPages
                      ? "text-gray-400 border-gray-300"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Collection;
