/* eslint-disable jsx-a11y/alt-text */
import { faBookmark, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, InputNumber, Modal, Row, Table, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BillApi } from "../../../../api/employee/bill/bill.api";
import "./tabBillDetail.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { dispatch } from "../../../../app/store";
import {
  ChangeProductInBill,
  getBill,
  updateTotalBill,
} from "../../../../app/reducer/Bill.reducer";
import TextArea from "antd/es/input/TextArea";

function TabBillDetail({ dataBillDetail }) {
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
  const bill = useSelector((state) => state.bill.bill.value);
  const handleQuantityChange = (value, record) => {
    var max = record.quantity;
    var quantityCustom = parseInt(value);
    if (record.promotion == null) {
      max = record.maxQuantity;
    }
    if (!Number.isInteger(quantityCustom)) {
    } else if (quantityCustom > max) {
    } else {
      const updatedProducts = billDetai.map((product) =>
        product.id === record.idProduct ? record : product
      );
      const data = {
        idBill: bill.id,
        idProduct: record.idProduct,
        quantity: quantityCustom,
        totalMoney: updatedProducts.reduce((accumulator, currentValue) => {
          return (
            accumulator +
            (currentValue.promotion === null
              ? formatCurrency(currentValue.price)
              : formatCurrency(
                  (currentValue.price * (100 - currentValue.promotion)) / 100
                )) *
              currentValue.quantity
          );
        }, 0),
        price: record.price,
        promotion: record.promotion,
      };
      Modal.confirm({
        title: "Xác nhận",
        content: (
          <div>
            <p>{"Bạn có đồng ý sửa thành " + data.quantity + " không?"}</p>
            <TextArea id="myTextArea" rows={4} placeholder="Nhập ghi chú..." />
          </div>
        ),
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          var note = document.getElementById("myTextArea").value;
          if (note.trim() !== "" && note.trim().length > 10) {
            data.note = note;
            await BillApi.updateProductInBill(record.id, data)
              .then((res) => {
                toast.success("Sửa sản phẩm thành công");
                dispatch(updateTotalBill(data.totalMoney));
                let sum = 0;
                billDetai.forEach((product) => {
                  sum += product.quantity || 0;
                });
                dispatch(ChangeProductInBill(changeQuanTiTy + 1));
              })
              .catch((error) => {
                toast.error(error.response.data.message);
              });
            await BillApi.fetchAllProductsInBillByIdBill(dataBillDetail).then(
              (res) => {
                setBillDetail(res.data.data);
              }
            );
            await BillApi.fetchDetailBill(bill.id).then((res) => {
              dispatch(getBill(res.data.data));
            });
          } else {
            toast.warning("Vui lòng nhập mô tả và tối thiểu 10 ký tự");
          }
        },
        onCancel: () => {},
      });
    }
  };

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
  const columneEditProductBill = [
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
      render: (_, record) => {
        return (
          <Col span={4} align={"center"} style={{ alignItems: "center" }}>
            <Row>
              <Col span={24}>
                <InputNumber
                  min={1}
                  max={
                    record.promotion == null
                      ? record.maxQuantity + record.quantity
                      : record.quantity
                  }
                  style={{ margin: "0 5px" }}
                  value={record.quantity}
                  onPressEnter={(e) => {
                    handleQuantityChange(e.target.value, record);
                  }}
                />
              </Col>
            </Row>
          </Col>
        );
      },
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
    {
      title: <div className="title-product">Hành Động</div>,
      key: "delete",
      align: "center",
      render: (_, record) => {
        return (
          <Tooltip title="Xóa sản phẩm">
            <Button
              type="danger"
              style={{ color: "red" }}
              onClick={() => handleDelete(record)}
            >
              <FontAwesomeIcon icon={faTrashCan} size="lg" />
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  const handleDelete = (record) => {
    if (billDetai.length == 1) {
      toast.warning("Phải có tối thiểu 1 sản phẩm trong giỏ hàng ");
    } else {
      Modal.confirm({
        title: "Xác nhận",
        content: (
          <div>
            <p>
              {"Bạn có đồng ý xóa sản phẩm " + record.productName + " không?"}
            </p>
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú..."
              id="myTextAreaDeteleProduct"
            />
          </div>
        ),
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          var note = document.getElementById("myTextAreaDeteleProduct").value;
          if (note.trim() != "" && note.trim().length > 10) {
            const updatedProducts = billDetai.filter(
              (product) => product.id !== record.idProduct
            );
            await BillApi.removeProductInBill(record.id, record.idProduct, note)
              .then((res) => {
                toast.success("Xóa sản phẩm thành công");
                dispatch(
                  updateTotalBill(
                    updatedProducts.reduce((accumulator, currentValue) => {
                      return (
                        accumulator +
                        (currentValue.promotion === null
                          ? formatCurrency(currentValue.price)
                          : formatCurrency(
                              (currentValue.price *
                                (100 - currentValue.promotion)) /
                                100
                            )) *
                          currentValue.quantity
                      );
                    }, 0)
                  )
                );
                let sum = 0;
                billDetai.forEach((product) => {
                  sum += product.quantity || 0;
                });
                 dispatch(ChangeProductInBill(changeQuanTiTy + 1));
              })
              .catch((error) => {
                toast.error(error.response.data.message);
              });
            await BillApi.fetchAllProductsInBillByIdBill(dataBillDetail).then(
              (res) => {}
            );
            await BillApi.fetchDetailBill(bill.id).then((res) => {
              dispatch(getBill(res.data.data));
            });
          } else {
            toast.warning("Vui lòng nhập mô tả và tối thiểu 10 ký tự ");
          }
        },
        onCancel: () => {},
      });
    }
  };
  useEffect(() => {
    BillApi.fetchAllProductsInBillByIdBill(dataBillDetail).then((res) => {
      setBillDetail(res.data.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const changeQuanTiTy = useSelector((state) => state.bill.bill.change);
  useEffect(() => {
    BillApi.fetchAllProductsInBillByIdBill(dataBillDetail).then((res) => {
      setBillDetail(res.data.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeQuanTiTy]);
  const [billDetai, setBillDetail] = useState([]);
  const statusPresent = useSelector((state) => state.bill.bill.status);

  console.log(bill.statusBill == "CHO_XAC_NHAN");
  return (
    <>
      {billDetai.length > 0 ? (
        <Table
          className="table-bill-detail"
          columns={
            bill.statusBill == "CHO_XAC_NHAN"
              ? columneEditProductBill
              : columnProductBill
          }
          dataSource={billDetai}
          rowKey={"id"}
          style={{ width: "100%" }}
        />
      ) : (
        <Row style={{ width: "100%" }}>
          <Row
            justify={"center"}
            style={{
              width: "100%",
              position: "relative",
              marginTop: "8%",
            }}
          >
            <Col align="center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiSWIoLaZSLHBPWAeO0RZFEiqaDNA0pyOboAdbGJqtUBkYAf65Z7rPVukqwmxTiJY87WQ&usqp=CAU"
                style={{ marginTop: "20px", width: "100%" }}
              />
            </Col>
          </Row>
          <Row justify={"center"} style={{ width: "100%" }}>
            <Col>
              <span style={{ fontSize: "15px" }}> Không có sản phẩm nào</span>
            </Col>
          </Row>
        </Row>
      )}
    </>
  );
}

export default TabBillDetail;
