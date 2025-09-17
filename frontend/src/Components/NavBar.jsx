import { useContext, useState } from "react";
import { Link, NavLink } from 'react-router-dom';
import { shopContext } from "../Context/ShopContext";
import { AuthContext } from "../Context/AuthContext"; // 🔹 import AuthContext
import Logo from '../assets/My_assets/logo.jpg';
import { assets } from "../assets/assets";

const NavBar = () => {
  const [menuVisible, setmenuVisible] = useState(false);
  const { showSeach, setShowSearch, CartCount, get_Cart_Count } = useContext(shopContext);
  const { user, logout } = useContext(AuthContext); // 🔹 akses user & logout

  return (
    <div className="flex items-center justify-between font-medium">
      <NavLink to='/'><img className="w-40 cursor-pointer" src={Logo} alt="NavBar" /></NavLink>

      {/* Menu utama */}
      <ul className="hidden sm:flex gap-5 ">
        <NavLink to='/' className="flex flex-col items-center gap-1">
          <p>Home</p>
        </NavLink>
        <NavLink to='/Collections' className="flex flex-col items-center gap-1">
          <p>Collections</p>
        </NavLink>
        <NavLink to='/About' className="flex flex-col items-center gap-1">
          <p>About</p>
        </NavLink>
        <NavLink to='/Contact' className="flex flex-col items-center gap-1">
          <p>Contact</p>
        </NavLink>

        {/* 🔹 Login / Register / Logout */}
        {!user ? (
          <>
            <NavLink to='/login' className="flex flex-col items-center gap-1">
              <p>Login</p>
            </NavLink>
            <NavLink to='/register' className="flex flex-col items-center gap-1">
              <p>Register</p>
            </NavLink>
          </>
        ) : (
          <button onClick={logout} className="flex flex-col items-center gap-1">
            <p>Logout</p>
          </button>
        )}
      </ul>

      {/* Bagian kanan */}
      <div className="flex items-center gap-6">
        <img onClick={() => setShowSearch(!showSeach)} className="w-4 cursor-pointer" src={assets.search_icon} alt="Search_icon" />

        <div className="group relative cursor-pointer shadow-lg">
          <Link to={'/Orders'}><i className="fa-regular fa-user"></i></Link>
        </div>

        <Link to={'/Cart'} className="relative">
          <img className="w-5 min-w-5" src={assets.cart_icon} alt="cart_NavBar" />
          <p className={`absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 ${CartCount == 0 ? '' : 'bg-black'} text-white aspect-square rounded-full text-[9px]`}>{get_Cart_Count()}</p>
        </Link>

        <img onClick={() => { setmenuVisible(true) }} className="pr-3 w-7 sm:hidden cursor-pointer" src={assets.menu_icon} alt="SideMenu" />
      </div>

      {/* Mobile menu */}
      <div className={`absolute right-0 bottom-0 top-0 overflow-hidden bg-white transition-all ${menuVisible ? 'w-full' : 'w-0'}`} style={{ zIndex: 999 }}>
        <div>
          <div onClick={() => { setmenuVisible(false) }} className="flex gap-2 mt-3 items-center cursor-pointer py-2 pl-6">
            <img className="w-3" src={assets.dropdown_icon} alt="arraw back" />
            <p>Back</p>
          </div>
          <div className="flex flex-col gap-5 m-6">
            <NavLink onClick={() => { setmenuVisible(false) }} className='py-2 pl-6 border' to='/'>Home</NavLink>
            <NavLink onClick={() => { setmenuVisible(false) }} className='py-2 pl-6 border' to='/Collections'>Collections</NavLink>
            <NavLink onClick={() => { setmenuVisible(false) }} className='py-2 pl-6 border' to='/About'>About</NavLink>
            <NavLink onClick={() => { setmenuVisible(false) }} className='py-2 pl-6 border' to='/Contact'>Contact</NavLink>

            {/* 🔹 Mobile Login / Register / Logout */}
            {!user ? (
              <>
                <NavLink onClick={() => setmenuVisible(false)} className='py-2 pl-6 border' to='/login'>Login</NavLink>
                <NavLink onClick={() => setmenuVisible(false)} className='py-2 pl-6 border' to='/register'>Register</NavLink>
              </>
            ) : (
              <button onClick={() => { logout(); setmenuVisible(false); }} className='py-2 pl-6 border text-left'>Logout</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
