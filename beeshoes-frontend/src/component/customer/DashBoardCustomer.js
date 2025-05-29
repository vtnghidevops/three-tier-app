import { useState, useEffect } from "react";
import SalesHeader from "./header/Header";
import HeaderMenu from "./menu/Menu";
import Footer from "./footer/Footer";
import "./style-dashboard-customer.css";

const DashBoardCustomer = ({ children }) => {
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 110) {
        setShowHeaderMenu(true);
      } else {
        setShowHeaderMenu(false);
      }
    };

    // Gắn sự kiện cuộn vào cửa sổ
    window.addEventListener("scroll", handleScroll);

    // Gỡ bỏ sự kiện cuộn khi component bị hủy
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="dashboard-customer">
      <div>
        <SalesHeader />
      </div>
      <div>
        <HeaderMenu />
      </div>
      <div className={`header-menu ${showHeaderMenu ? "visible" : "hidden"}`}>
        <HeaderMenu />
      </div>
      <div>{children}</div>
      <div>
        {" "}
        <Footer />
      </div>
    </div>
  );
};

export default DashBoardCustomer;
