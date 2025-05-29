import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { BillClientApi } from "../../../../api/customer/bill/billClient.api";

function TabBillDetail({ id, dataBillDetail }) {
  const getPromotionStyle = (promotion) => {
    return promotion >= 50 ? { color: "white" } : { color: "#000000" };
  };
  const getPromotionColor = (promotion) => {
    return promotion >= 50 ? { color: "#FF0000" } : { color: "#FFCC00" };
  };
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };
  const totalMoneyProduct = (product) => {
    return product.promotion === null
      ? product.price * product.quantity
      : (product.price * (100 - product.promotion) * product.quantity) / 100;
  };
  useEffect(() => {
    console.log("id bill ");
    console.log(id);
    BillClientApi.fetchAllBillDetailInBill(dataBillDetail).then((res) => {
      setBillDetail(res.data.data);
    });
  }, [id]);
  const [billDetail, setBillDetail] = useState([]);
  const columnProductBill = [
    {
      title: <div className="title-product">STT</div>,
      key: "stt",
      align: "center",
      width: "5%",
      dataIndex: "stt",
    },
    {
      title: <div className="title-product">Ảnh Sản Phẩm</div>,
      dataIndex: "image",
      align: "center",
      key: "image",
      render: (text, record) => (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={text}
            alt="Ảnh sản phẩm"
            style={{ width: "80px", borderRadius: "10%", height: "80px" }}
          />
          {record.promotion !== null && (
            <div
              style={{
                position: "absolute",
                top: "0px",
                right: "0px",
                padding: "0px",
                cursor: "pointer",
                borderRadius: "50%",
              }}
            >
              <FontAwesomeIcon
                icon={faBookmark}
                style={{
                  ...getPromotionColor(record.promotion),
                  fontSize: "3em",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "calc(50% - 10px)", // Đặt "50%" lên trên biểu tượng (từ 50% trừ 10px)
                  left: "50%", // Để "50%" nằm chính giữa biểu tượng
                  transform: "translate(-50%, -50%)", // Dịch chuyển "50%" đến vị trí chính giữa
                  fontSize: "0.8em",
                  fontWeight: "bold",
                  ...getPromotionStyle(record.promotion),
                }}
              >
                {`${record.promotion}%`}
              </span>
              <span
                style={{
                  position: "absolute",
                  top: "60%", // Để "Giảm" nằm chính giữa biểu tượng
                  left: "50%", // Để "Giảm" nằm chính giữa biểu tượng
                  transform: "translate(-50%, -50%)", // Dịch chuyển "Giảm" đến vị trí chính giữa
                  fontSize: "0.8em",
                  fontWeight: "bold",
                  ...getPromotionStyle(record.promotion),
                }}
              >
                Giảm
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center", fontSize: "18px" }}>
          Thông tin sản phẩm
        </div>
      ),
      key: "productName",
      dataIndex: "productName",
      render: (_, record) => (
        <>
          <h3> {record.productName}</h3>
          <h4 style={{ color: "red" }}>
            {record.promotion === null
              ? formatCurrency(record.price)
              : formatCurrency((record.price * (100 - record.promotion)) / 100)}
          </h4>
          <h5 style={{ textDecoration: " line-through" }}>
            {record.promotion !== null && formatCurrency(record.price)}
          </h5>
          <h4>Kích cỡ : {record.nameSize}</h4>
        </>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center", fontSize: "18px" }}>Màu sắc</div>
      ),
      dataIndex: "codeColor",
      key: "codeColor",
      width: "8px",
      align: "center",
      render: (color) => (
        <span
          style={{
            backgroundColor: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            borderRadius: "6px",
            width: "60px",
            height: "25px",
          }}
        />
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center", fontSize: "18px" }}>Số lượng</div>
      ),
      key: "quantity",
      align: "center",
      dataIndex: "quantity",
    },
    {
      title: (
        <div style={{ textAlign: "center", fontSize: "18px" }}>Tổng tiền</div>
      ),
      key: "totalPrice",
      align: "center",
      dataIndex: "totalPrice",
      render: (_, record) => (
        <span>{formatCurrency(totalMoneyProduct(record))}</span>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center", fontSize: "18px" }}>Trạng Thái</div>
      ),
      key: "status",
      align: "center",
      dataIndex: "status",
      render: (text) => {
        const genderClass =
          text === "THANH_CONG" ? "trangthai-sd" : "trangthai-ksd";
        return (
          <button className={`gender ${genderClass}`}>
            {text === "THANH_CONG" ? "Thành công " : "Hoàn hàng"}
          </button>
        );
      },
    },
  ];
  return (
    <Row style={{ width: "100%" }}>
      <Row
        style={{
          width: "100%",
          marginTop: "20px",
          borderBottom: "1px solid #ccc",
          padding: "12px",
        }}
      >
        <Table
          className="table-bill-detail"
          columns={columnProductBill}
          dataSource={billDetail}
          rowKey={"id"}
          style={{ width: "100%" }}
        />
      </Row>
    </Row>
  );
}

export default TabBillDetail;
