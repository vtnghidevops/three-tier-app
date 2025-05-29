import React, { useEffect, useState } from "react";
import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Dropdown,
  Badge,
  Modal,
  Form,
  Input,
} from "antd";
import "./style-dashboard-employee.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo_admin.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faDumpsterFire,
  faMoneyBill1Wave,
  faTags,
  faUserGroup,
  faBoxesPacking,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import SubMenu from "antd/es/menu/SubMenu";
import {
  GetNotification,
  SetNotification,
  UpdateNotification,
} from "../../../src/app/reducer/Notification.reducer";

import { deleteUserToken } from "../../helper/useCookies";
import { toast } from "react-toastify";
import { LoginApi } from "../../api/employee/login/Login.api";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../../helper/CookiesRequest";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { NotificationClientApi } from "../../api/customer/notification/notificationClient.api";
import dayjs from "dayjs";
import { dispatch } from "../../app/store";
import { useAppSelector } from "../../app/hook";
import ModalPoin from "./modal/ModalPoin";
const { Header, Sider, Content } = Layout;

const DashBoardEmployee = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [listNotification, setListNotification] = useState([]);
  const [openInfor, setOpenInfo] = useState(false);
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location]);

  const handleMenuHover = () => {
    setOpenInfo(true);
  };

  const handleMenuLeave = () => {
    setOpenInfo(false);
  };
  const socket = new SockJS("http://beeshoes.devopsedu.vn/ws");
  const stompClient = Stomp.over(socket);

  const data = useAppSelector(GetNotification);
  useEffect(() => {
    if (data != null) {
      setListNotification(data);
      NotificationClientApi.getNotRead().then((res) => {
        if (res.data.data.length > 0) {
          setNotificationCount(res.data.data.length);
        }
      });
    }
  }, [data]);
  useEffect(() => {
    NotificationClientApi.getAll().then((res) => {
      dispatch(SetNotification(res.data.data));
      setListNotification(res.data.data);
      console.log(res.data.data);
    });
    stompClient.connect({}, () => {
      stompClient.subscribe("/app/admin-notifications", (response) => {
        NotificationClientApi.getNotRead().then((res) => {
          setNotificationCount(res.data.data.length);
        });
        NotificationClientApi.getAll().then((res) => {
          dispatch(SetNotification(res.data.data));
          setListNotification(res.data.data);
          // toast.success("Bạn có đơn hàng mới.");
        });
      });
    });

    return () => {
      // Ngắt kết nối khi component unmount
      stompClient.disconnect();
    };
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = getCookie("userToken");

  const loadUser = () => {
    const decodedToken = jwtDecode(token);
    setUser({
      id: decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role,
      fullName: decodedToken.fullName,
      avata: decodedToken.avata,
      expirationTime: new Date(decodedToken.exp * 1000),
    });
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const isAdmin = user?.role?.includes("ROLE_ADMIN");

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có đồng ý thêm không?",
            okText: "Đồng ý",
            cancelText: "Hủy",
            onOk: () => resolve(values),
            onCancel: () => reject(),
          });
        });
      })
      .then((value) => {
        if (value.resetPassword !== value.newPassword) {
          toast.warning("Xác nhận lại mật khẩu sai.");
          return;
        }
        LoginApi.changePassword(value)
          .then((value) => {
            toast.success("Đổi mật khẩu thành công.");
            handleCancel();
          })
          .catch((err) => {});
      })
      .catch((error) => {});
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    deleteUserToken();
    nav("/login-management");
    toast.success("Đăng xuất thành công");
  };

  const [isModalOpenPoin, setIsModalOpenPoin] = useState(false);

  const showModalPoin = () => {
    setIsModalOpenPoin(true);
  };

  const handleCancelPoin = () => {
    setIsModalOpenPoin(false);
  };

  const menu = (
    <Menu>
      <Menu.Item icon={<UserOutlined />} key="1">
        Thông tin người dùng
      </Menu.Item>
      <Menu.Item icon={<SettingOutlined />} key="4" onClick={showModalPoin}>
        Thiết lập tính điểm
      </Menu.Item>
      <Menu.Item icon={<SyncOutlined />} key="2" onClick={showModal}>
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Item icon={<LogoutOutlined />} key="3" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  const viewNotify = (idNotify, idBill) => {
    NotificationClientApi.setStatus(idNotify).then((res) => {
      dispatch(UpdateNotification(res.data.data));
    });
    window.location.href =  `/bill-management/detail-bill/${idBill}`;
  };

  return (
    <Layout className="layout-employee">
      <Sider trigger={null} collapsible width={225} collapsed={collapsed}>
        <Link to="/dashboard">
          <div className="logo">
            <img src={Logo} className="logo-content" alt="Logo" />
          </div>
        </Link>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" selectedKeys={selectedKey}>
          {isAdmin && (
            <Menu.Item
              key="/dashboard"
              className="menu-item"
              icon={
                <FontAwesomeIcon
                  icon={faChartLine}
                  style={{ color: "white" }}
                />
              }
            >
              <Link to="/dashboard">Thống Kê</Link>
            </Menu.Item>
          )}
          <Menu.Item
            key="/sale-counter"
            icon={
              <FontAwesomeIcon
                icon={faDumpsterFire}
                style={{ color: "white" }}
              />
            }
          >
            <Link to="/sale-counter">Bán Hàng Tại Quầy</Link>
          </Menu.Item>
          <Menu.Item
            key="/bill-management"
            icon={
              <FontAwesomeIcon
                icon={faMoneyBill1Wave}
                style={{ color: "white" }}
              />
            }
          >
            <Link to="/bill-management">Quản Lý Hóa Đơn</Link>
          </Menu.Item>
          <Menu.Item
            key="/give-back-management"
            icon={
              <FontAwesomeIcon icon={faTruckFast} style={{ color: "white" }} />
            }
          >
            <Link to="/give-back-management">Trả Hàng</Link>
          </Menu.Item>

          {isAdmin && (
            <SubMenu
              key="6"
              icon={
                <FontAwesomeIcon
                  icon={faBoxesPacking}
                  style={{ color: "white" }}
                />
              }
              title="Quản Lý Sản Phẩm"
            >
              <Menu.Item key="/product-management">
                <Link to="/product-management">Sản Phẩm</Link>
              </Menu.Item>
              <Menu.Item key="/category-management">
                <Link to="/category-management">Thể Loại</Link>
              </Menu.Item>
              <Menu.Item key="/sole-management">
                <Link to="/sole-management">Đế Giày</Link>
              </Menu.Item>
              <Menu.Item key="/brand-management">
                <Link to="/brand-management">Thương Hiệu</Link>
              </Menu.Item>
              <Menu.Item key="/material-management">
                <Link to="/material-management">Chất Liệu</Link>
              </Menu.Item>
            </SubMenu>
          )}

          <SubMenu
            key="7"
            icon={
              <FontAwesomeIcon icon={faUserGroup} style={{ color: "white" }} />
            }
            title="Quản Lý Tài Khoản"
          >
            {isAdmin && (
              <Menu.Item key="/staff-management">
                <Link to="/staff-management">Nhân Viên</Link>
              </Menu.Item>
            )}
            <Menu.Item key="/customer-management">
              <Link to="/customer-management">Khách Hàng</Link>
            </Menu.Item>
          </SubMenu>

          {isAdmin && (
            <SubMenu
              key="8"
              icon={
                <FontAwesomeIcon icon={faTags} style={{ color: "white" }} />
              }
              title="Giảm Giá"
            >
              <Menu.Item key="/promotion-management">
                <Link to="/promotion-management">Đợt Giảm Giá</Link>
              </Menu.Item>
              <Menu.Item key="/voucher-management">
                <Link to="/voucher-management">Phiếu Giảm Giá</Link>
              </Menu.Item>
            </SubMenu>
          )}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="header-layout"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Badge
              className="content-notify"
              onMouseEnter={handleMenuHover}
              onMouseLeave={handleMenuLeave}
              count={notificationCount}
              style={{ backgroundColor: "red" }}
            >
              <Button type="text">
                <BellOutlined />
              </Button>

              {openInfor ? (
                <ul className="dropdown-list-notify">
                  {listNotification.map((item, index) => (
                    <li
                      key={index}
                      className="dropdown-item-notify"
                      onClick={() => viewNotify(item.id, item.bill.id)}
                    >
                      <div style={{ marginRight: 20 }}>
                        <BellOutlined />
                      </div>
                      <div>
                        <div
                          style={{
                            marginBottom: 10,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ fontSize: 17, fontWeight: 600 }}>
                            {item.bill.userName}
                          </div>
                          <div style={{ color: "#ff4400", marginLeft: "auto" }}>
                            {item.notifyContent}
                          </div>
                        </div>
                        <div style={{ display: "flex" }}>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>
                            <span style={{ fontSize: 14, fontWeight: 500 }}>
                              Thời gian:
                            </span>{" "}
                            {dayjs(item.createdDate).format(
                              "HH:mm:ss DD-MM-YYYY"
                            )}
                          </div>
                          <div
                            style={{
                              marginLeft: "20px",
                              color:
                                item.status === "CHUA_DOC" ? "blue" : "green",
                            }}
                          >
                            {item.status === "CHUA_DOC" ? "Chưa đọc" : "Đã đọc"}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                ""
              )}
            </Badge>

            <span style={{ fontWeight: "bold", marginLeft: "20px" }}>
              {user !== null && user.fullName}
            </span>
            <Dropdown overlay={menu} placement="bottomRight">
              <img
                src={user !== null && user.avata}
                alt="User Avatar"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  marginRight: "40px",
                  marginLeft: "20px",
                }}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            paddingTop: 24,
            paddingBottom: 24,
            paddingLeft: 24,
            paddingRight: 7,
            minHeight: 280,
            borderRadius: "15px",
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
      <Modal
        title="Đổi mật khẩu"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            cập nhập
          </Button>,
        ]}
      >
        <Form
          style={{
            maxWidth: 600,
            marginTop: "30px",
          }}
          name="validateOnly"
          layout="vertical"
          form={form}
        >
          <Form.Item
            name="password"
            label="Mật khẩu cũ : "
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu cũ.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới :"
            name="resetPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới.",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Xác nhận lại mật khẩu :"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lại mật khẩu mới.",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
      <ModalPoin visible={isModalOpenPoin} onCancel={handleCancelPoin} />
    </Layout>
  );
};

export default DashBoardEmployee;
