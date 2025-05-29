import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import { LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import "./style-login-management.css";
import Logo from "../../../assets/images/logo_client.png";
import { LoginApi } from "../../../api/employee/login/Login.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { setToken, setUserToken } from "../../../helper/useCookies";
import { jwtDecode } from "jwt-decode";
const LoginManagement = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);

  const showPasswordModal = () => {
    setPasswordModalVisible(true);
  };

  const handleForgotPasswordCancel = () => {
    setPasswordModalVisible(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    LoginApi.authenticationIn(values)
      .then((res) => {
        setToken(res.data.token);
        setUserToken(res.data.token);
        const decodedToken = jwtDecode(res.data.token);
        if (decodedToken.role.includes("ROLE_ADMIN")) {
          nav("/dashboard");
        } else {
          nav("/sale-counter");
        }
        toast.success("Đăng nhập thành công");
      })
      .catch((error) => {});
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handResetPassword = () => {
    form
      .validateFields()
      .then((values) => {
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có muốn tiếp tục không?",
            okText: "Đồng ý",
            cancelText: "Hủy",
            onOk: () => resolve(values),
            onCancel: () => reject(),
          });
        });
      })
      .then((values) => {
        LoginApi.restPassword(values)
          .then((res) => {
            setPasswordModalVisible(false);
            toast.success("Đổi mật khẩu thành công");
            nav("/login-management");
          })
          .catch((err) => {
            console.log("Tài khoản hoặc mật khẩu không đúng");
          });
      })
      .catch(() => {});
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          <img
            src="data:image/jpeg;base64,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"
            alt="Login"
          />
        </div>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <img src={Logo} className="logo-admin" alt="Logo" />
          <p className="form-title">Welcome back</p>
          <p>Login to the Dashboard</p>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ Email" },
              {
                type: "email",
                message: "Định dạng Email không hợp lệ",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email address"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              LOGIN
            </Button>
            <Button type="link" onClick={showPasswordModal}>
              Forgot Password ?
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Modal
        title="Forgot Password"
        visible={isPasswordModalVisible}
        onCancel={handleForgotPasswordCancel}
        footer={null}
      >
        <Form form={form}>
          <Form.Item
            name="emailForgot"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ Email" },
              {
                type: "email",
                message: "Định dạng Email không hợp lệ",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email address"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              size="large"
              placeholder="Phone Number"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handResetPassword}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoginManagement;
