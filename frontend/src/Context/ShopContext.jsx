import React, { createContext, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

export const shopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [Size, setSize] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // fetch produk dari backend
 useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get("/products");
      // Mapping agar setiap produk punya field id
      const productsWithId = res.data.map(item => ({
        ...item,
        id: item.id || item._id, // utamakan id, fallback ke _id
        image: getImageUrl(item.image_url) // pakai helper
      }));
      setProducts(productsWithId);
    } catch (err) {
      console.error(err);
      toast.error("Gagal ambil data produk");
    }
  };
  fetchData();
}, []);

  const Add_Cart = (itemID, itemSize) => {
    if (!Size) {
      toast.error("Sorry, choose the size first");
      return;
    }

    let CartData = structuredClone(cartItems);
    if (CartData[itemID]) {
      if (CartData[itemID][itemSize]) {
        CartData[itemID][itemSize] += 1;
      } else {
        CartData[itemID][itemSize] = 1;
      }
    } else {
      CartData[itemID] = { [itemSize]: 1 };
    }
    setCartItems(CartData);
  };

  const get_Cart_Count = () => {
    let count = 0;
    for (let items in cartItems)
      for (let item in cartItems[items]) count += cartItems[items][item] || 0;
    return count;
  };

  const updateQuantity = (itemID, itemSize, quantity) => {
    let copy = structuredClone(cartItems);
    copy[itemID][itemSize] = quantity;
    setCartItems(copy);
  };

  const get_TotalCart = () => {
    let Total = 0;
    for (let items in cartItems) {
      for (let item in cartItems[items]) {
        const itemInfo = products.find((p) => p.id === parseInt(items));
        if (itemInfo) {
          Total += itemInfo.price * cartItems[items][item];
        }
      }
    }
    return Total;
  };

  const value = {
    products, currency, delivery_fee,
    cartItems, Add_Cart, Size, setSize,
    search, setSearch,
    updateQuantity, get_Cart_Count, get_TotalCart,
    navigate
  };

  return (
    <shopContext.Provider value={value}>
      {children}
    </shopContext.Provider>
  );
};

export default ShopContextProvider;
