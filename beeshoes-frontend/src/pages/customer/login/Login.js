import "./style-login.css";
import logoLogin from "./../../../assets/images/logo_client.png";
import { Form, Input } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { GooglePlusOutlined, FacebookFilled } from "@ant-design/icons";
import Footer from "./../../../component/customer/footer/Footer";
import { LoginApi } from "../../../api/employee/login/Login.api";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { setToken, setUserToken } from "../../../helper/useCookies";
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formLogin, setFormLogin] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const handleSowPassword = () => {
    if (showPassword === false) {
      setShowPassword(true);
    } else {
      setShowPassword(false);
    }
  };
  const changeFormLogin = (name, value) => {
    setFormErrors({});
    setFormLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const nav = useNavigate();
  const login = (form) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isFormValid =
      form.password && form.email && emailPattern.test(form.email);

    if (!isFormValid) {
      const errors = {
        password: !form.password ? "Vui lòng nhập mật khẩu" : "",
        email: !form.email
          ? "Vui lòng nhập email"
          : !emailPattern.test(form.email)
          ? "Email không hợp lệ"
          : "",
      };
      setFormErrors(errors);
      return;
    }
    LoginApi.authenticationIn(form)
      .then((res) => {
        toast.success("Đăng nhập thành công");
        console.log(res.data);
        setToken(res.data.token);
        setUserToken(res.data.token);
        sessionStorage.setItem("idAccount", jwtDecode(res.data.token).id);
        console.log(jwtDecode(res.data.token));
        nav("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="login-account">
      <div className="header-login">
        <Link style={{ marginLeft: "20%" }} to="/home">
          <img className="logo-login" src={logoLogin} alt="..." />
        </Link>
      </div>
      <div className="box-content-login">
        <div className="content-login">
          <div className="box-form-login">
            <div className="form-login">
              <h1 style={{ marginBottom: 30 }}>Đăng nhập</h1>

              <Form.Item
                name="email"
                validateStatus={formErrors["email"] ? "error" : ""}
                help={formErrors["email"] || ""}
              >
                <Input
                  className="input-username"
                  placeholder=" "
                  onChange={(e) => changeFormLogin("email", e.target.value)}
                />
                <lable for="username" className="title-username">
                  Tên đăng nhập
                </lable>
              </Form.Item>
              <Form.Item
                validateStatus={formErrors["password"] ? "error" : ""}
                help={formErrors["password"] || ""}
              >
                <Input
                  type={showPassword === false ? "password" : "text"}
                  className="input-password"
                  placeholder=" "
                  onChange={(e) => changeFormLogin("password", e.target.value)}
                />
                <lable for="password" className="title-password">
                  Mật khẩu
                </lable>
                <FontAwesomeIcon
                  className="icon-show-password"
                  icon={showPassword === false ? faEyeSlash : faEye}
                  onClick={handleSowPassword}
                />
              </Form.Item>

              <div
                className="box-submit-login"
                onClick={() => login(formLogin)}
              >
                Đăng nhập
              </div>
              <div className="box-forgot-pass">
                <Link className="forgot-pass" to="#">
                  Quên mật khẩu
                </Link>
              </div>
            </div>
            <div className="or">Hoặc</div>
            <div className="form-login-with-social">
              <div className="login-facebook">
                <FacebookFilled style={{ fontSize: 30, marginRight: 10 }} />{" "}
                Facebook
              </div>

              <div className="login-google">
                <GooglePlusOutlined style={{ fontSize: 30, marginRight: 10 }} />{" "}
                Google
              </div>
              <div style={{ color: "grey" }}>
                Bạn mới biết đến BeeSneaker?{" "}
                <Link className="register" to="/signup">
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
