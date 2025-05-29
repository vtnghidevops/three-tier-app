import { Col } from "antd";
import "./style-footer.css";
import logoFooter from "./../../../assets/images/logo_admin.png";
import { Link } from "react-router-dom";
import {
  FacebookOutlined,
  GoogleOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import ReactPlayer from "react-player";
import { Row } from "antd/es";
function Footer() {
  return (
    <>
      <div className="footer">
        <Row>
          <Col className="header-footer" lg={{ span: 16, offset: 4 }}>
            <Link>
              <img style={{ width: 120 }} src={logoFooter} alt="..." />
            </Link>
          </Col>
        </Row>
        <Row>
          <Col className="content-footer" lg={{ span: 16, offset: 4 }}>
            <div className="category-footer">
            </div>
            <Row justify={"space-between"}>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Footer;
