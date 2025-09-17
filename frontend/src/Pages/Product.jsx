import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { shopContext } from "../Context/ShopContext";
import RelatedProducts from "../Components/RelatedProducts";
import { assets } from "../assets/assets.js";
import api from "../api/axios";
import { getImageUrl } from "../utils/getImageUrl";
import { formatRupiah } from "../utils/formatRupiah";

const Product = () => {
  const { Add_Cart, Size, setSize } = useContext(shopContext);
  const { id } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const product = {
        ...res.data,
        image: getImageUrl(res.data.image_url) // generate full url
      };
      setSelectedProduct(product);
    } catch (err) {
      console.error("Failed to fetch product", err);
    } finally {
      setLoading(false);
    }
  };
  fetchProduct();
}, [id]);


  if (loading) return <div className="text-center py-20">Loading product details...</div>;
  if (!selectedProduct) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="mt-11">
      <div className="gap-10 sm:flex p-5">
        <img
          src={selectedProduct.image}
          alt={selectedProduct.name}
          className="w-full sm:max-w-md object-cover"
        />

        <div className="flex flex-col gap-4 mt-6 sm:mt-0">
          <h1 className="text-3xl font-bold">{selectedProduct.name}</h1>

          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(4)].map((_, i) => (
                <img key={i} src={assets.star_icon} alt="star rating" className="w-5 h-5" />
              ))}
              <img src={assets.star_dull_icon} alt="star rating" className="w-5 h-5" />
            </div>
            <span className="text-gray-600">(121 reviews)</span>
          </div>

          <p className="text-2xl font-bold">
            {formatRupiah(selectedProduct.price)}
          </p>

          <p className="text-gray-700 max-w-prose">{selectedProduct.description}</p>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Select Size</h2>
            <div className="flex flex-wrap gap-3">
              {selectedProduct.sizes?.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSize(size)}
                  className={`px-4 py-2 border-2 rounded-md transition-colors
                    ${Size === size
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-orange-400"}
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => Add_Cart(selectedProduct._id, Size)}
            className="bg-black text-white w-48 h-12 rounded-md mt-6 hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>

          <div className="mt-8 space-y-2 text-sm text-gray-600">
            <p>✓ 100% Egyptian Cotton</p>
            <p>✓ 100% Original Quality</p>
          </div>
        </div>
      </div>

      <hr />

      {/* Description and rates */}
      <div className="flex flex-col gap-3 px-5 mt-10">
        <div className="flex gap-3">
          <b>Description</b>
          <p>(121) Review</p>
        </div>
        <p>{selectedProduct.description || "No detailed description provided."}</p>
      </div>

      {/* Related Products */}
      {/* Related Products */}
    <RelatedProducts productId={selectedProduct.id} />
    </div>
  );
};

export default Product;
