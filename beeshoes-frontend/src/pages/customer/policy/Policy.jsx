import {
  faCircle,
  faLandmark,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Menu, Row } from "antd";
import { useState } from "react";
import ContentDisplay from "./ContentDisplay";

export default function Policy() {
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem(
      "Chính sách và điều khoản",
      "sub1",
      <FontAwesomeIcon icon={faLandmark} style={{ fontSize: "25px" }} />,
      [
        getItem("Chính sách bảo hàng sản phẩm", "5"),
        getItem("Chính sách bảo mật", "6"),
        getItem("Chính sách bảo mật thông tin thanh toán", "7"),
        getItem("Chính sách dành cho khách hàng", "8"),
        getItem("Chính sách điểm thưởng thành viên", "16"),
        getItem("Chính sách thanh toán", "9"),
        getItem("Điều khoản dịch vụ", "10"),
        getItem("Chính sách trả hàng", "4"),
      ]
    ),
    getItem(
      "Các điều khoản khác",
      "sub2",
      <FontAwesomeIcon icon={faLayerGroup} style={{ fontSize: "25px" }} />,
      [
        getItem("Chính sách vận chuyển", "11"),
        getItem("Các điều khoản khác", "12"),
        getItem("Hạn chế về thời gian và pháp lý", "13"),
        getItem("Nghĩa vụ của khách hàng", "14"),
        getItem("Nghĩa vụ của người bán", "15"),
      ]
    ),
  ];
  const [selectedItem, setSelectedItem] = useState("5");
  const defaultOpenKeys = items.map((item) => item.key);

  const handleMenuSelect = ({ key }) => {
    setSelectedItem(key);
  };

  return (
    <>
      <Row
        justify={"center"}
        style={{ marginTop: "30px", marginBottom: "30px" }}
      >
        <Col span={8}>
          <Card style={{ maxHeight: "750px" }}>
            <h2>Thông tin bạn cần biết</h2>
            <hr />
            <Menu
              mode="inline"
              defaultOpenKeys={defaultOpenKeys}
              onSelect={handleMenuSelect}
            >
              {items.map((item) => (
                <Menu.SubMenu
                  key={item.key}
                  icon={item.icon}
                  title={item.label}
                >
                  {item.children.map((childItem) => (
                    <Menu.Item key={childItem.key}>
                      {" "}
                      <FontAwesomeIcon
                        icon={faCircle}
                        style={{ fontSize: "10px", marginRight: "5px" }}
                      />{" "}
                      {childItem.label}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ))}
            </Menu>
          </Card>
        </Col>
        <Col span={12} style={{ marginLeft: "20px" }}>
          <Card style={{ maxHeight: "670px", overflowY: "auto" }}>
            <ContentDisplay selectedItem={selectedItem} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
