import {
  EnvironmentOutlined,
  FileSearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style-header.css";
import { deleteToken } from "../../../helper/useCookies";
function SalesHeader() {
  const idUser = sessionStorage.getItem("idAccount");
  const [openInfor, setOpenInfo] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    console.log(idUser);
  }, []);
  const handleMenuHover = () => {
    setOpenInfo(true);
  };

  const handleMenuLeave = () => {
    setOpenInfo(false);
  };

  const logout = () => {
    deleteToken();
    sessionStorage.removeItem("idAccount");
    window.location.href = "/home";
  };

  return (
    <div className="header">
      <div className="content-header-home">
        <Link to="/sreach-bill" className="title-header">
          <span className="header-icon">
            <FileSearchOutlined />
          </span>{" "}
          Tra cứu đơn hàng
        </Link>
      </div>

      {/* <div className="content-header-home">
        <Link to="#" className="title-header">
          <span className="header-icon"><EnvironmentOutlined /></span> Tìm kiếm cửa hàng
        </Link>
      </div> */}
      <div
        className="content-header-account"
        onMouseEnter={handleMenuHover}
        onMouseLeave={handleMenuLeave}
      >
        <Link
          to={idUser === null ? "/login" : "#"}
          className="title-header-account"
        >
          <span className="header-icon">
            <UserOutlined />
          </span>{" "}
          {idUser === null ? "Đăng nhập" : "Thông tin"}
        </Link>
        {openInfor && idUser !== null ? (
          <ul className="dropdown-list">
            <li className="dropdown-item" onClick={() => nav("/profile")}>
              Tài khoản của tôi
            </li>
            <li className="dropdown-item" onClick={() => nav("/purchase")}>
              Đơn mua
            </li>
            <li className="dropdown-item" onClick={logout}>
              Đăng xuất
            </li>
          </ul>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default SalesHeader;
