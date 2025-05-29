import { Button, Card, Form, Input, Row } from "antd";
import "./style-give-back-management.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faTruckArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { BillApi } from "../../../api/employee/bill/bill.api";
import { useState } from "react";
import QRScannerModal from "../product-management/modal/ModalQRScanner";
export default function GiveBackManagement() {
  const nav = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = (data) => {
    BillApi.BillGiveBackInformation(data)
      .then(() => {
        nav(`/detail-give-back/${data}`);
        setIsModalOpen(false);
      })
      .catch((error) => {});
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    const bill = values.search;
    BillApi.BillGiveBackInformation(bill)
      .then(() => {
        nav(`/detail-give-back/${bill}`);
      })
      .catch((error) => {});
  };

  return (
    <>
      <Card className="contaier-give-back" style={{ height: "80vh" }}>
        <FontAwesomeIcon
          icon={faTruckArrowRight}
          style={{ fontSize: "30px" }}
        />
        <span style={{ fontSize: "23px" }}> Trả hàng</span>
        <div className="search-bill">
          <Row justify="center" align="middle">
            <Form
              name="customized_form_controls"
              layout="inline"
              onFinish={onFinish}
            >
              <Form.Item
                label="Mã hóa đơn "
                name="search"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã hóa đơn",
                  },
                ]}
                style={{ fontWeight: "bold", color: "blue" }}
              >
                <Input style={{ height: "35px", width: "400px" }} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ height: "35px" }}
                >
                  Tìm kiếm
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  style={{ height: "35px" }}
                  onClick={showModal}
                >
                  <FontAwesomeIcon icon={faQrcode} />
                  QRCode
                </Button>
              </Form.Item>
            </Form>
          </Row>
          <QRScannerModal
            visible={isModalOpen}
            onCancel={handleCancel}
            onQRCodeScanned={handleOk}
          />
        </div>
      </Card>
    </>
  );
}
