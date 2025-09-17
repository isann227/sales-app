import React, { useContext } from "react";
import { shopContext } from "../Context/ShopContext";
import { AuthContext } from "../Context/AuthContext";
import Title from "../Components/Title";
import CartProduct from "../Components/CartProduct";
import TotalCart from "../Components/TotalCart";

const Cart = () => {
  const { cartItems, products, navigate, DataCart, setDataCart } = useContext(shopContext);
  const { user } = useContext(AuthContext); // ambil data user login

  const check_cart = () => {
    let tempData = [];
    for (const itemsID in cartItems) {
      for (const itemSize in cartItems[itemsID]) {
        if (cartItems[itemsID][itemSize] > 0) {
          tempData.push({
            id: itemsID,
            size: itemSize,
            quantitty: cartItems[itemsID][itemSize],
          });
        }
      }
    }
    setDataCart(tempData);
  };

  React.useEffect(() => {
    check_cart();
  }, [cartItems]);

  const handleCheckout = () => {
    if (!user) {
      alert("Mohon login terlebih dahulu untuk checkout!");
      navigate("/login");
      return;
    }
    navigate("/Placeorder");
  };

  return (
    <div className="px-5">
      <div>
        <Title text1={"Your "} text2={"Cart"} />

        <div>
          {DataCart.map((item) => {
            const productData = products.find((product) => product._id == item.id);

            return (
              <CartProduct
                key={item.id}
                Image1={productData.image}
                Name1={productData.name}
                Price1={productData.price}
                Size1={item.size}
                countProduct={item.quantitty}
                ID={item.id}
              />
            );
          })}
          <hr className="mt-5" />
        </div>
      </div>

      <div className="flex justify-end">
        <TotalCart />
      </div>

      <div className="flex flex-col items-end ">
        <button
          onClick={handleCheckout}
          className="bg-black text-white w-40 h-10 text-xl mt-10 hover:bg-gray-700"
        >
          CheckOut
        </button>
      </div>
    </div>
  );
};

export default Cart;
