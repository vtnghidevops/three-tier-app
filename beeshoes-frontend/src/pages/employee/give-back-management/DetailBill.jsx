/* eslint-disable array-callback-return */
/* eslint-disable no-const-assign */
/* eslint-disable jsx-a11y/alt-text */
import {
  faBookmark,
  faList12,
  faRectangleList,
  faRotateBack,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import "./style-give-back-management.css";
import { toast } from "react-toastify";
import { BillApi } from "../../../api/employee/bill/bill.api";
import { useNavigate, useParams } from "react-router";
import moment from "moment";
import ModalQuantityGiveBack from "./modal/ModalQuantityGiveBack";
import { VoucherApi } from "../../../api/employee/voucher/Voucher.api";
import { useReactToPrint } from "react-to-print";

export default function DetailBillGiveBack() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const nav = useNavigate();
  const [bill, setBill] = useState(null);

  const loadDatabillInformation = () => {
    BillApi.BillGiveBackInformation(id)
      .then((bill) => {
        setBill(bill.data.data);
        console.log(bill.data.data);
      })
      .catch((error) => {});
  };

  const loadDatabill = () => {
    BillApi.BillGiveBack(bill.idBill).then((res) => {
      setDataProductBill(res.data.data);
    });
  };

  useEffect(() => {
    loadDatabillInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (bill != null) {
      loadDatabill();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bill]);

  const [dataProductBill, setDataProductBill] = useState([]);

  const [dataProductGiveBack, setDataProductGiveBack] = useState([]);

  const columnProductBill = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      width: "5%",
      dataIndex: "stt",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      align: "center",
      width: "10%",
      key: "image",
      render: (text, record) => (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={text}
            alt="Ảnh sản phẩm"
            style={{ width: "70px", borderRadius: "10%", height: "70px" }}
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
      title: <div style={{ textAlign: "center" }}>Thông tin sản phẩm</div>,
      key: "nameProduct",
      dataIndex: "nameProduct",
      render: (_, record) => (
        <>
          <h3> {record.nameProduct}</h3>
          <h4 style={{ color: "red" }}>
            {record.promotion === null
              ? formatCurrency(record.price)
              : formatCurrency((record.price * (100 - record.promotion)) / 100)}
          </h4>
          <h5 style={{ textDecoration: " line-through" }}>
            {record.promotion !== null && formatCurrency(record.price)}
          </h5>
        </>
      ),
    },
    {
      title: "Màu Sắc",
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
      title: "Số lượng",
      key: "quantity",
      align: "center",
      dataIndex: "quantity",
    },
    {
      title: "Tổng tiền",
      key: "totalPrice",
      align: "center",
      dataIndex: "totalPrice",
      render: (_, record) => (
        <span>{formatCurrency(totalMoneyProduct(record))}</span>
      ),
    },
    {
      title: "Trạng thái",
      key: "statusBillDetail",
      align: "center",
      dataIndex: "statusBillDetail",
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
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      width: "8%",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Tooltip title="Hoàn trả hàng">
            <Button
              type="primary"
              style={{ backgroundColor: "#20B2AA" }}
              onClick={() => handleModalQuantityGiveBack(record)}
              disabled={
                bill.statusBill !== "THANH_CONG" || record.promotion !== null
              }
            >
              <FontAwesomeIcon icon={faRotateBack} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const columnProductGiveBack = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      dataIndex: "stt",
      width: "8%",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      align: "center",
      width: "8%",
      key: "image",
      render: (text, record) => (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={text}
            alt="Ảnh sản phẩm"
            style={{ width: "100px", borderRadius: "10%", height: "100px" }}
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
      title: "Tên sản phẩm",
      key: "nameProduct",
      align: "center",
      dataIndex: "nameProduct",
      width: "8%",
    },
    {
      title: "Màu Sắc",
      dataIndex: "codeColor",
      key: "codeColor",
      width: "8%",
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
      title: "Số lượng",
      key: "quantity",
      align: "center",
      width: "8%",
      dataIndex: "quantity",
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(value, record.idProduct)}
        />
      ),
    },
    {
      title: "Giá tiền",
      key: "price",
      align: "center",
      width: "8%",
      dataIndex: "price",
      render: (_, record) => <span>{formatCurrency(record.price)}</span>,
    },
    {
      title: "Tổng tiền",
      key: "totalPrice",
      align: "center",
      width: "8%",
      dataIndex: "totalPrice",
      render: (_, record) => (
        <span>{formatCurrency(totalMoneyProduct(record))}</span>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      width: "8%",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Tooltip title="Xóa sản phẩm">
            <Button
              type="primary"
              style={{ backgroundColor: "red" }}
              onClick={() => handleDeleteGiveBack(record)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const getPromotionStyle = (promotion) => {
    return promotion >= 50 ? { color: "white" } : { color: "#000000" };
  };
  const getPromotionColor = (promotion) => {
    return promotion >= 50 ? { color: "#FF0000" } : { color: "#FFCC00" };
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleModalQuantityGiveBack = (record) => {
    showModal();
    setSelectedProduct(record);
  };

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };

  // cập nhập số lượng
  const handleQuantityChange = (value, id) => {
    const productInBill = dataProductBill.find(
      (product) => product.idProduct === id
    );
    if (productInBill) {
      if (value > productInBill.quantity) {
        toast.warning("Số lượng đổi trả vượt quá số lượng mua hàng.");
        return;
      }
      setDataProductGiveBack((prevTableData) =>
        prevTableData.map((item) =>
          item.idProduct === id
            ? {
                ...item,
                quantity: value,
                totalPrice: item.quantity * item.price,
              }
            : item
        )
      );
    }
  };

  // modal nhập số lượng đổi trả
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (values) => {
    const quantityCustom = values;
    if (selectedProduct) {
      // Kiểm tra xem sản phẩm đã tồn tại trong dataProductGiveBack hay chưa
      const productExists = dataProductGiveBack.some(
        (item) => item.idProduct === selectedProduct.idProduct
      );
      if (quantityCustom > selectedProduct.quantity) {
        toast.warning("Đã quá số lượng mua hàng.");
        return;
      }
      // Nếu sản phẩm đã tồn tại, cập nhật lại số lượng
      if (productExists) {
        setDataProductGiveBack((prevData) =>
          prevData.map((item) =>
            item.idProduct === selectedProduct.idProduct
              ? {
                  ...item,
                  quantity: quantityCustom,
                  totalPrice: quantityCustom * selectedProduct.price,
                }
              : item
          )
        );
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới vào danh sách
        const updatedProduct = {
          ...selectedProduct,
          quantity: quantityCustom,
          totalPrice: quantityCustom * selectedProduct.price,
          stt: dataProductGiveBack.length + 1,
        };

        setDataProductGiveBack((prevData) => [...prevData, updatedProduct]);
      }
      form.resetFields();
      setSelectedProduct(null);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const totalMoneyProduct = (product) => {
    return product.promotion === null
      ? product.price * product.quantity
      : (product.price * (100 - product.promotion) * product.quantity) / 100;
  };

  const totalMoneyBill = () => {
    let total = 0;
    dataProductBill.forEach((data) => {
      if (data.statusBillDetail === "THANH_CONG") {
        const money = totalMoneyProduct(data);
        total += money;
      }
    });
    return total;
  };

  const totalMoneyBillGiveBack = () => {
    let total = 0;
    dataProductGiveBack.map((data) => {
      const money = totalMoneyProduct(data);
      total += money;
    });
    return total;
  };

  // xóa sản phẩm đổi trả
  const handleDeleteGiveBack = (record) => {
    const newDataProductGiveBack = dataProductGiveBack
      .filter((product) => product.idProduct !== record.idProduct)
      .map((product, index) => ({ ...product, stt: index + 1 }));
    setDataProductGiveBack(newDataProductGiveBack);
  };

  // hoàn trả tất cả sản phẩm
  const handleAllGiveBackToBill = () => {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có đồng ý hoàn trả tất cả không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: () => {
          const newDataProductGiveBack = dataProductBill.filter(
            (item) => item.promotion === null
          );
          setDataProductGiveBack(newDataProductGiveBack);
          resolve();
        },
      });
    });
  };

  // success hoàn trả
  const handleSuccessGiveBack = () => {
    form
      .validateFields()
      .then((values) => {
        return new Promise((resolve) => {
          Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có đồng ý trả hàng không?",
            okText: "Đồng ý",
            cancelText: "Hủy",
            onOk: () => resolve(values),
          });
        });
      })
      .then((values) => {
        const updateBill = {
          note: values.note,
          idBill: bill.idBill,
          idAccount: bill.idAccount,
          totalBillGiveBack: totalMoneyBillGiveBack(),
          idVoucher: voucher === null ? null : voucher.id,
        };
        const formData = new FormData();
        formData.append("data", JSON.stringify(dataProductGiveBack));
        formData.append("updateBill", JSON.stringify(updateBill));
        BillApi.UpdateBillGiveBack(formData)
          .then((res) => {
            getHtmlByIdBill2(res.data.data.code, totalMoneyBillGiveBack());
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((err) => console.log({ err }));
  };

  const generatePDF = useReactToPrint({
    content: () => document.getElementById("pdfContent"),
    documentTitle: "Userdata",
    onAfterPrint: () => {
      nav("/give-back-management");
      toast.success("Hoàn trả thành công.");
    },
  });
  const getHtmlByIdBill2 = (id, totalExcessMoney) => {
    BillApi.fetchHtmlIdBill(id, totalExcessMoney).then((res) => {
      document.getElementById("pdfContent").innerHTML = res.data.data;
      generatePDF();
    });
  };
  const [voucher, setVoucher] = useState(null);
  const total = totalMoneyBill() - totalMoneyBillGiveBack();
  useEffect(() => {
    VoucherApi.getVoucherByMinimum(total).then((voucher) => {
      setVoucher(voucher.data.data);
      console.log(voucher.data.data);
    });
  }, [total]);

  return (
    <>
      <Form
        form={form}
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: "25px", marginBottom: "5px" }}>
            <FontAwesomeIcon icon={faRectangleList} size="xl" /> Quản lý trả
            hàng
          </h1>
          <Card style={{ marginRight: "20px" }}>
            <h1 style={{ fontSize: "22px" }}>Thông tin khách hàng</h1>
            {bill != null && (
              <Row style={{ width: "100%", marginTop: "30px" }}>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Tên khách hàng:
                    </Col>
                    <Col span={16}>
                      {bill.userName === "" ? (
                        <span
                          style={{
                            backgroundColor: " #ccc",
                            color: "white",
                            width: "180px",
                            borderRadius: "15px",
                            padding: " 5px 19px",
                            marginLeft: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          Khách lẻ
                        </span>
                      ) : (
                        <span style={{ color: "black" }}>
                          {bill.nameCustomer}
                        </span>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      {" "}
                      Ngày giao hàng:
                    </Col>
                    <Col span={16}>
                      <span style={{ color: "black" }}>
                        {bill.deliveryDate !== null &&
                          moment(bill.deliveryDate).format("DD-MM-YYYY")}
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      {" "}
                      Số điện thoại:
                    </Col>
                    <Col span={16}>
                      <span style={{ color: "black" }}>{bill.phoneNumber}</span>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      {" "}
                      Ngày nhận hàng:
                    </Col>
                    <Col span={16}>
                      <span style={{ color: "black" }}>
                        {bill.completionDate !== null &&
                          moment(bill.completionDate).format("DD-MM-YYYY")}
                      </span>
                    </Col>
                  </Row>
                </Col>

                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Địa chỉ:
                    </Col>
                    <Col span={16}>
                      <span style={{ color: "black" }}>{bill.address}</span>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px" }}>
                    <Col
                      span={8}
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginTop: "8px",
                      }}
                    >
                      Trạng thái :
                    </Col>
                    <Col span={16}>
                      <Button
                        className={`trangThai ${" status_" + bill.statusBill} `}
                      >
                        {bill.statusBill === "TAO_HOA_DON"
                          ? "Tạo Hóa đơn"
                          : bill.statusBill === "CHO_XAC_NHAN"
                          ? "Chờ xác nhận"
                          : bill.statusBill === "XAC_NHAN"
                          ? "Xác nhận"
                          : bill.statusBill === "CHO_VAN_CHUYEN"
                          ? "Chờ chờ vận chuyển"
                          : bill.statusBill === "VAN_CHUYEN"
                          ? "Đang vận chuyển"
                          : bill.statusBill === "DA_THANH_TOAN"
                          ? "Đã thanh toán"
                          : bill.statusBill === "THANH_CONG"
                          ? "Thành công"
                          : bill.statusBill === "TRA_HANG"
                          ? "Trả hàng"
                          : "Đã hủy"}
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text">
                  <Row
                    style={{
                      marginLeft: "20px",
                      marginTop: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Ghi chú:
                    </Col>
                    <Col span={16}>
                      <span>{bill.note}</span>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Loại:
                    </Col>
                    <Col span={16}>
                      <Button
                        style={{
                          backgroundColor: "#6633FF",
                          color: "white",
                          width: "180px",
                          borderRadius: "15px",
                          padding: " 5px 38px",
                          pointerEvents: "none",
                        }}
                      >
                        {bill.typeBill}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </Card>
          <Card style={{ marginTop: "10px", marginRight: "10px" }}>
            <h1 style={{ fontSize: "22px", marginBottom: "10px" }}>
              Thông tin đơn hàng
            </h1>
            <Row justify={"end"}>
              <Tooltip title="Trả hàng hòa toàn">
                <Button
                  type="primary"
                  style={{
                    height: "40px",
                    fontWeight: "bold",
                    margin: "5px 10px 10px 0px ",
                  }}
                  onClick={() => handleAllGiveBackToBill()}
                  disabled={bill !== null && bill.statusBill !== "THANH_CONG"}
                >
                  <FontAwesomeIcon icon={faRotateBack} />{" "}
                  <span style={{ marginLeft: "5px" }}>Trả hàng tất cả</span>
                </Button>
              </Tooltip>
            </Row>
            <Table
              columns={columnProductBill}
              dataSource={dataProductBill}
              pagination={{ pageSize: 3 }}
              rowKey={"id"}
            />
            <br />
          </Card>
          <Row justify={"space-between"}>
            <Col span={16}>
              <Card
                style={{
                  marginTop: "10px",
                  marginRight: "10px",
                  height: "100%",
                }}
              >
                <h1 style={{ fontSize: "22px", marginBottom: "10px" }}>
                  Thông tin đơn hàng trả
                </h1>
                {dataProductGiveBack.length > 0 ? (
                  <div className="table-bill-give-back">
                    <Table
                      columns={columnProductGiveBack}
                      dataSource={dataProductGiveBack}
                      pagination={{ pageSize: 5 }}
                      rowKey={"id"}
                    />
                  </div>
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
                      <Col span={9} align="center">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiSWIoLaZSLHBPWAeO0RZFEiqaDNA0pyOboAdbGJqtUBkYAf65Z7rPVukqwmxTiJY87WQ&usqp=CAU"
                          style={{ marginTop: "20px", width: "100%" }}
                        />
                      </Col>
                    </Row>
                    <Row justify={"center"} style={{ width: "100%" }}>
                      <Col>
                        <span style={{ fontSize: "15px" }}>
                          {" "}
                          Không có sản phẩm nào đổi trả
                        </span>
                      </Col>
                    </Row>
                  </Row>
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                style={{
                  marginTop: "10px",
                  marginRight: "10px",
                  height: "100%",
                }}
              >
                <h1 style={{ fontSize: "22px", marginBottom: "10px" }}>
                  Thông tin thanh toán{" "}
                </h1>
                <Row style={{ marginTop: "40px" }}>
                  <Col span={12}>
                    <h3>Tổng giá hàng gốc : </h3>
                  </Col>
                  <Col span={12}>
                    <h3 style={{ color: "blue" }}>
                      {" "}
                      {formatCurrency(totalMoneyBill())}
                    </h3>
                  </Col>
                </Row>
                {bill !== null && bill.voucherValue !== null && (
                  <Row style={{ marginTop: "30px" }}>
                    <Col span={12}>
                      <h3>Voucher đã sử dụng : </h3>
                    </Col>
                    <Col span={12}>
                      <h3 style={{ color: "blue" }}>
                        {" "}
                        {formatCurrency(bill.voucherValue)}
                      </h3>
                    </Col>
                  </Row>
                )}
                {bill !== null && bill.moneyShip !== null && (
                  <Row style={{ marginTop: "30px" }}>
                    <Col span={12}>
                      <h3>Tiền ship : </h3>
                    </Col>
                    <Col span={12}>
                      <h3 style={{ color: "blue" }}>
                        {" "}
                        {formatCurrency(bill.moneyShip)}
                      </h3>
                    </Col>
                  </Row>
                )}
                {bill !== null && bill.poin !== null && (
                  <Row style={{ marginTop: "30px" }}>
                    <Col span={12}>
                      <h3>Điểm sử dụng ({bill.poin}) : </h3>
                    </Col>
                    <Col span={12}>
                      <h3 style={{ color: "blue" }}>
                        {" "}
                        {formatCurrency(bill.poin * 1000)}
                      </h3>
                    </Col>
                  </Row>
                )}
                <Row style={{ marginTop: "30px" }}>
                  <Col span={12}>
                    <h3>Tổng tiền thanh toán : </h3>
                  </Col>
                  <Col span={12}>
                    <h3 style={{ color: "blue" }}>
                      {" "}
                      {formatCurrency(
                        totalMoneyBill() -
                          (bill !== null
                            ? bill.voucherValue !== null
                              ? bill.voucherValue
                              : 0
                            : 0) -
                          (bill !== null
                            ? bill.poin !== null
                              ? bill.poin * 1000
                              : 0
                            : 0) +
                          (bill !== null
                            ? bill.moneyShip !== null
                              ? bill.moneyShip
                              : 0
                            : 0)
                      )}
                    </h3>
                  </Col>
                </Row>
                <Row style={{ marginTop: "30px" }}>
                  <Col span={12}>
                    <h3>Tổng giá hàng trả: </h3>
                  </Col>
                  <Col span={12}>
                    <h3 style={{ color: "blue" }}>
                      {" "}
                      {formatCurrency(totalMoneyBillGiveBack())}
                    </h3>
                  </Col>
                </Row>
                <Row style={{ marginTop: "30px" }}>
                  <Col span={12}>
                    <h3>Voucher mới: </h3>
                  </Col>
                  <Col span={12}>
                    <h3 style={{ color: "blue" }}>
                      {" "}
                      {voucher === null
                        ? formatCurrency(0)
                        : formatCurrency(voucher.value)}
                    </h3>
                  </Col>
                </Row>
                <br />
                <hr />
                <Tooltip title="Tổng tiền trả khách  = Tổng giá hàng trả - Voucher đã sử dụng - số điểm sử dụng + Voucher mới ">
                  <Row style={{ marginTop: "30px" }}>
                    <Col span={12}>
                      <h3>Tổng tiền trả khách : </h3>
                    </Col>
                    <Col span={12}>
                      {totalMoneyBillGiveBack() === totalMoneyBill() ? (
                        <h3 style={{ color: "blue" }}>
                          {formatCurrency(
                            totalMoneyBill() -
                              (bill !== null
                                ? bill.voucherValue !== null
                                  ? bill.voucherValue
                                  : 0
                                : 0) -
                              (bill !== null
                                ? bill.poin !== null
                                  ? bill.poin * 1000
                                  : 0
                                : 0) +
                              (bill !== null
                                ? bill.moneyShip !== null
                                  ? bill.moneyShip
                                  : 0
                                : 0)
                          )}
                        </h3>
                      ) : (
                        bill !== null && (
                          <h3 style={{ color: "blue" }}>
                            {totalMoneyBillGiveBack() > 0
                              ? bill.voucherValue !== null
                                ? formatCurrency(
                                    totalMoneyBillGiveBack() -
                                      bill.voucherValue +
                                      (voucher !== null ? voucher.value : 0)
                                  )
                                : bill.voucherValue !== null
                                ? formatCurrency(
                                    totalMoneyBillGiveBack() -
                                      bill.voucherValue +
                                      (voucher !== null ? voucher.value : 0)
                                  )
                                : bill.voucherValue === null
                                ? formatCurrency(
                                    totalMoneyBillGiveBack() +
                                      (voucher !== null ? voucher.value : 0)
                                  )
                                : formatCurrency(totalMoneyBillGiveBack())
                              : formatCurrency(totalMoneyBillGiveBack())}
                          </h3>
                        )
                      )}
                    </Col>
                  </Row>
                </Tooltip>
                <Row style={{ marginTop: "30px" }}>
                  <Col>
                    <Form.Item
                      label="Mô tả : "
                      name="note"
                      style={{ fontWeight: "bold" }}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mô tả khi trả hàng.",
                        },
                        {
                          validator: (_, value) => {
                            if (value && value.trim() === "") {
                              return Promise.reject(
                                "Không được chỉ nhập khoảng trắng"
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input.TextArea
                        rows={5}
                        placeholder="Nhập mô tả "
                        style={{ width: "300px" }}
                        onKeyDown={(e) => {
                          if (e.key === " " && e.target.value === "") {
                            e.preventDefault();
                            e.target.value.replace(/\s/g, "");
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Tooltip title="Trả hàng">
                  <Button
                    style={{
                      width: "100%",
                      height: "50px",
                      marginTop: "10px",
                      backgroundColor: "#00CD00",
                      color: "white",
                    }}
                    onClick={handleSuccessGiveBack}
                  >
                    <h2>Trả hàng</h2>
                  </Button>
                </Tooltip>
              </Card>
            </Col>
          </Row>
        </div>
      </Form>
      <ModalQuantityGiveBack
        visible={isModalOpen}
        onCancel={handleCancel}
        handleSusses={(values) => handleOk(values)}
      />
      <div style={{ display: "none" }}>
        <div id="pdfContent" />
      </div>
    </>
  );
}
