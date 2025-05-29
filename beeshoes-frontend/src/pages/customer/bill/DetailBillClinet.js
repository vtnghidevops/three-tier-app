import {
  Button,
  Col,
  Form,
  Modal,
  Select,
  Result,
  Row,
  Table,
  Tabs,
} from "antd";
import TimeLine from "./TimeLine";
import {
  addBillHistory,
  addStatusPresent,
  getBill,
  getBillHistory,
  getPaymentsMethod,
  getProductInBillDetail,
} from "../../../app/reducer/Bill.reducer";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useParams } from "react-router";
import "./detail.css";
import "react-toastify/dist/ReactToastify.css";
import { BillClientApi } from "../../../api/customer/bill/billClient.api";
import { Link } from "react-router-dom";
import { BillApi } from "../../../api/employee/bill/bill.api";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import TabBillDetail from "./tabBillDetail/TabBillDetail";
import { PoinApi } from "../../../api/employee/poin/poin.api";

var listStatus = [
  { id: 0, name: "Tạo hóa đơn", status: "TAO_HOA_DON" },
  { id: 2, name: "Chờ xác nhận", status: "CHO_XAC_NHAN" },
  { id: 3, name: "Xác nhận", status: "XAC_NHAN" },
  { id: 4, name: "Chờ vận chuyển", status: "CHO_VAN_CHUYEN" },
  { id: 5, name: "Vận chuyển", status: "VAN_CHUYEN" },
  { id: 6, name: "Thanh toán", status: "DA_THANH_TOAN" },
  { id: 7, name: "Thành công", status: "THANH_CONG" },
];

function DetailBillClinet() {
  const { code } = useParams("code");
  const { phoneNumber } = useParams("phoneNumber");
  const detailProductInBill = useSelector(
    (state) => state.bill.bill.billDetail
  );
  const billHistory = useSelector((state) => state.bill.bill.billHistory);
  const paymentsMethod = useSelector((state) => state.bill.bill.paymentsMethod);
  const bill = useSelector((state) => state.bill.bill.value);
  const statusPresent = useSelector((state) => state.bill.bill.status);
  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const [checkBillExit, setCheckBillExit] = useState(true);

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };

  useEffect(() => {
    BillClientApi.fetchDetailBill(code, phoneNumber)
      .then((res) => {
        dispatch(getBill(res.data.data));
        var index = listStatus.findIndex(
          (item) => item.status == res.data.data.statusBill
        );
        if (res.data.data.statusBill == "TRA_HANG") {
          index = 7;
        }
        if (res.data.data.statusBill == "DA_HUY") {
          index = 8;
        }
        setId(res.data.data.id);
        dispatch(addStatusPresent(index));
        BillClientApi.fetchAllBillHistoryInBill(res.data.data.id).then(
          (res) => {
            dispatch(getBillHistory(res.data.data));
            console.log(res.data.data);
          }
        );
        BillClientApi.fetchAllPayMentlInBill(res.data.data.id).then((res) => {
          dispatch(getPaymentsMethod(res.data.data));
        });
        BillClientApi.fetchAllBillDetailInBill({
          idBill: res.data.data.id,
          status: "THANH_CONG",
        }).then((res) => {
          dispatch(getProductInBillDetail(res.data.data));
        });
      })
      .catch((e) => {
        setCheckBillExit(false);
      });
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const listtab = ["THANH_CONG", "DA_HUY"];
  const convertString = (key) => {
    return key === "THANH_CONG" ? "Hoàn thành" : "Hoàn hàng";
  };
  const columnsHistory = [
    {
      title: <div className="title-product">STT</div>,
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: <div className="title-product">Trạng thái</div>,
      dataIndex: "statusBill",
      key: "statusBill",
      render: (statusBill) => (
        <span>
          {statusBill === "TAO_HOA_DON"
            ? "Hóa đơn chờ"
            : statusBill === "CHO_XAC_NHAN"
            ? " Chờ xác nhận"
            : statusBill === "XAC_NHAN"
            ? "Đã xác nhận"
            : statusBill === "CHO_VAN_CHUYEN"
            ? "Chờ vận chuyển"
            : statusBill === "VAN_CHUYEN"
            ? "Đang vận chuyển"
            : statusBill === "DA_THANH_TOAN"
            ? "Đã thanh toán"
            : statusBill === "TRA_HANG"
            ? "Trả hàng"
            : statusBill === "THANH_CONG"
            ? "Thành công"
            : statusBill === "DA_HUY"
            ? "Đã hủy"
            : ""}
        </span>
      ),
    },
    {
      title: <div className="title-product">Ngày</div>,
      dataIndex: "createDate",
      key: "createDate",
      render: (text) => {
        const formattedDate = moment(text).format(" HH:mm:ss DD-MM-YYYY"); // Định dạng ngày
        return formattedDate;
      },
    },
    {
      title: <div className="title-product">Người xác nhận</div>,
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: <div className="title-product">Ghi chú</div>,
      dataIndex: "actionDesc",
      key: "actionDesc",
    },
  ];

  const columnsPayments = [
    {
      title: <div className="title-product">STT</div>,
      key: "index",
      render: (value, item, index) => index + 1,
    },
    {
      title: <div className="title-product">Mã giao dịch</div>,
      dataIndex: "vnp_TransactionNo",
      key: "vnp_TransactionNo",
      render: (vnp_TransactionNo) => <span>{vnp_TransactionNo}</span>,
    },
    {
      title: <div className="title-product">Số tiền</div>,
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (totalMoney) => <span>{formatCurrency(totalMoney)}</span>,
    },
    {
      title: <div className="title-product">Trạng thái</div>,
      dataIndex: "method",
      key: "method",
      render: (method) => (
        <span>
          {method == "TIEN_MAT"
            ? "Tiền mặt"
            : method == "CHUYEN_KHOAN"
            ? "Chuyển khoản"
            : "Tiền mặt và chuyển khoản"}
        </span>
      ),
    },
    {
      title: <div className="title-product">Thời gian</div>,
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => {
        const formattedDate = moment(text).format("DD-MM-YYYY"); // Định dạng ngày
        return formattedDate;
      },
    },
    {
      title: <div className="title-product">Loại giao dịch</div>,
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Button
          style={{ width: "130px", pointerEvents: "none" }}
          className={status}
        >
          {status == "THANH_TOAN"
            ? "Thanh toán"
            : status == "TRA_SAU"
            ? "Trả sau"
            : "Hoàn tiền"}
        </Button>
      ),
    },
    {
      title: <div className="title-product">Phương thức thanh toán</div>,
      dataIndex: "method",
      key: "method",
      render: (method) => (
        <Button
          style={{ width: "130px", pointerEvents: "none" }}
          className={method}
        >
          {method == "TIEN_MAT"
            ? "Tiền mặt"
            : method == "CHUYEN_KHOAN"
            ? "Chuyển khoản"
            : "Thẻ"}
        </Button>
      ),
    },
    {
      title: <div className="title-product">Ghi chú</div>,
      dataIndex: "description",
      key: "description",
    },
    {
      title: <div className="title-product">Người xác nhận</div>,
      dataIndex: "employees",
      key: "employees",
      render: (employees) => {
        return employees?.user.fullName;
      },
    },
  ];

  const getPromotionStyle = (promotion) => {
    return promotion >= 50 ? { color: "white" } : { color: "#000000" };
  };
  const getPromotionColor = (promotion) => {
    return promotion >= 50 ? { color: "#FF0000" } : { color: "#FFCC00" };
  };
  // begin cancelBill
  const [statusBill, setStatusBill] = useState({
    actionDescription: "",
    method: "TIEN_MAT",
    totalMoney: 0,
    status: "THANH_TOAN",
    statusCancel: false,
  });
  const formRef = React.useRef(null);
  const onFinish = (values) => {
    const priceValue = values.price;
    console.log(priceValue);
    const numericPrice = parseFloat(priceValue.replace(/[^0-9.-]+/g, ""));
    values.price = numericPrice + "";
    var data = statusBill;
    data.totalMoney = values;
    setStatusBill(data);
    // setProductDetail(values);
    console.log(statusBill);
  };
  const initialValues = {
    status: "DANG_SU_DUNG",
  };
  const [form] = Form.useForm();
  const [isModalCanCelOpen, setIsModalCanCelOpen] = useState(false);
  const showModalCanCel = () => {
    setIsModalCanCelOpen(true);
  };
  const handleCanCelOk = () => {
    setIsModalCanCelOpen(false);
    if (statusBill.actionDescription == "") {
      toast.error("Vui lòng nhập mô tả");
    } else {
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có đồng ý hủy không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          await BillApi.changeCancelStatusBill(id, statusBill).then((res) => {
            dispatch(getBill(res.data.data));
            var index = listStatus.findIndex(
              (item) => item.status == res.data.data.statusBill
            );
            if (res.data.data.statusBill == "TRA_HANG") {
              index = 7;
            }
            if (res.data.data.statusBill == "DA_HUY") {
              index = 8;
            }
            var history = {
              stt: billHistory.length + 1,
              statusBill: res.data.data.statusBill,
              actionDesc: statusBill.actionDescription,
              id: "",
              createDate: new Date().getTime(),
            };
            dispatch(addStatusPresent(index));
            dispatch(addBillHistory(history));
          });
          await BillClientApi.fetchAllPayMentlInBill(id).then((res) => {
            dispatch(getPaymentsMethod(res.data.data));
          });
          setIsModalCanCelOpen(false);
          toast.success("Hủy hóa đơn thành công");
        },
        onCancel: () => {
          setIsModalCanCelOpen(false);
        },
      });
    }

    setStatusBill({
      actionDescription: "",
      method: "TIEN_MAT",
      totalMoney: 0,
      status: "THANH_TOAN",
      statusCancel: false,
    });
    form.resetFields();
  };
  const handleCanCelClose = () => {
    setIsModalCanCelOpen(false);
    form.resetFields();
  };
  const onChangeDescStatusBill = (fileName, value) => {
    if (fileName === "totalMoney") {
      setStatusBill({
        ...statusBill,
        [fileName]: parseFloat(value.replace(/[^0-9.-]+/g, "")),
      });
    } else {
      setStatusBill({ ...statusBill, [fileName]: value });
    }
  };
  // end  cancelBill
  const totalMoneyProduct = (product) => {
    return product.promotion === null
      ? product.price * product.quantity
      : (product.price * (100 - product.promotion) * product.quantity) / 100;
  };
  const totalProductDetailGiveBack = () => {
    let total = 0;
    productDetailToBillDetail.map((data) => {
      if (data.statusBillDetail === "TRA_HANG") {
        const money = totalMoneyProduct(data);
        total += money;
      }
    });
    console.log(total);
    return total;
  };
  const totalProductDetailGiveBackAndSuccse = () => {
    let total = 0;
    productDetailToBillDetail.map((data) => {
      const money = totalMoneyProduct(data);
      total += money;
    });
    console.log(total);
    return total;
  };
  const [productDetailToBillDetail, setProductDetailToBillDetail] = useState(
    []
  );
  const loadDataProductDetailToBillDetail = () => {
    // BillApi.BillGiveBack(id).then((res) => {
    //   setProductDetailToBillDetail(res.data.data);
    //   console.log(res.data.data);
    // });
  };
  const changeQuanTiTy = useSelector((state) => state.bill.bill.change);
  useEffect(() => {
    if (id !== null) {
      loadDataProductDetailToBillDetail();
    }
    PoinApi.findPoin()
      .then((res) => {
        setDataPoin(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, [id, changeQuanTiTy]);
  const [dataPoin, setDataPoin] = useState(null);
  return (
    <div>
      {checkBillExit ? (
        <>
          <Row style={{ width: "100%" }}>
            <div
              className="row"
              style={{
                backgroundColor: "white",
                width: "100%",
                marginBottom: "30px",
              }}
            >
              <Row style={{ backgroundColor: "white", width: "100%" }}>
                <TimeLine
                  style={{ width: "100%" }}
                  listStatus={listStatus}
                  data={billHistory}
                  statusPresent={statusPresent}
                />
              </Row>
              <Row
                style={{ width: "100%", marginBottom: "20px" }}
                justify={"space-around"}
              >
                <Row style={{ width: "100%" }}>
                  <Col span={12}>
                    <Col span={statusPresent < 4 ? 6 : 0}>
                      {statusPresent < 4 ? (
                        <Button
                          type="danger"
                          onClick={() => showModalCanCel()}
                          style={{
                            fontSize: "medium",
                            fontWeight: "500",
                            marginLeft: "20px",
                            backgroundColor: "red",
                            color: "white",
                          }}
                        >
                          Hủy
                        </Button>
                      ) : (
                        <div></div>
                      )}
                    </Col>
                  </Col>
                  <Col span={12} align={"end"}>
                    <Button
                      type="primary"
                      onClick={showModal}
                      style={{
                        fontSize: "medium",
                        fontWeight: "500",
                        marginRight: "20px",
                        // backgroundColor: ",
                      }}
                    >
                      Lịch sử
                    </Button>
                  </Col>
                </Row>
                <div className="offset-6 col-2">
                  <Modal
                    title="Lịch sử"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    className="widthModal"
                    width={800}
                    cancelText={"huỷ"}
                    okText={"Xác nhận"}
                  >
                    <Table
                      dataSource={billHistory}
                      columns={columnsHistory}
                      rowKey="id"
                      pagination={false} // Disable default pagination
                      className="product-table"
                    />
                  </Modal>
                </div>
              </Row>
            </div>
          </Row>

          <Row
            style={{
              width: "100%",
              marginBottom: "20px",
              backgroundColor: "white",
            }}
          >
            <Row
              style={{
                width: "100%",
                borderBottom: "2px solid #ccc",
                padding: "12px",
                margin: "0px 20px",
              }}
            >
              <Col span={20}>
                <h2
                  className="text-center"
                  style={{
                    width: "100%",
                    fontSize: "x-large",
                    fontWeight: "500",
                    // margin: "10px 20px 20px 20px",
                  }}
                >
                  Lịch sử thanh toán
                </h2>
              </Col>
            </Row>
            <Row style={{ width: "100%" }}>
              <Table
                dataSource={paymentsMethod}
                columns={columnsPayments}
                rowKey="id"
                pagination={false} // Disable default pagination
                className="product-table"
              />
            </Row>
          </Row>
          <Row style={{ width: "100%" }}>
            <div style={{ backgroundColor: "white", width: "100%" }}>
              <Row
                style={{
                  width: "96%",
                  margin: "10px 20px 20px 20px",
                  borderBottom: "2px solid #ccc",
                  padding: "12px",
                }}
              >
                <Col span={22}>
                  <h2
                    className="text-center"
                    style={{
                      fontSize: "x-large",
                      fontWeight: "500",
                    }}
                  >
                    Thông tin đơn hàng
                  </h2>
                </Col>
                <Col span={2}></Col>
              </Row>
              <Row style={{ width: "100%" }}>
                <Col span={12} className="text">
                  <Row style={{ marginLeft: "20px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Trạng thái :
                    </Col>
                    <Col span={16}>
                      <Button
                        className={`trangThai ${" status_" + bill.statusBill} `}
                      >
                        {bill.statusBill == "TAO_HOA_DON"
                          ? "Tạo Hóa đơn"
                          : bill.statusBill == "CHO_XAC_NHAN"
                          ? "Chờ xác nhận"
                          : bill.statusBill == "XAC_NHAN"
                          ? "Đã xác nhận"
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
                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col
                      span={8}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Tên khách hàng:
                    </Col>
                    <Col span={16}>
                      {bill.userName == "" ? (
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
                        <span style={{ color: "black" }}>{bill.userName}</span>
                      )}
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

                {/* <Col span={12} className="text">
              <div style={{ marginLeft: "20px" }}>Gmail: {bill.account != null ? bill.account.email : bill.account.customer }</div>
            </Col> */}
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
                {bill.shippingTime != null &&
                bill.statusBill != "THANH_CONG" ? (
                  <Col span={12} className="text">
                    <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                      <Col
                        span={8}
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        Thời gian dự kiến nhận:
                      </Col>
                      <Col span={16}>
                        <span style={{ color: "black" }}>
                          {moment(bill.shippingTime).format("DD-MM-YYYY")}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                ) : (
                  <Row></Row>
                )}
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
              </Row>
            </div>
          </Row>
          <Row
            style={{
              width: "100%",
              backgroundColor: "white",
              marginTop: "20px",
            }}
          >
            <Row
              style={{
                width: "100%",
                marginTop: "20px",
                borderBottom: "1px solid #ccc",
                padding: "12px",
              }}
            >
              <Row style={{ width: "100%" }}>
                {bill.statusBill != "TRA_HANG" ? (
                  <TabBillDetail
                    style={{ width: "100%" }}
                    id={id}
                    dataBillDetail={{ idBill: id, status: "THANH_CONG" }}
                  />
                ) : (
                  <Tabs
                    type="card"
                    style={{ width: "100%" }}
                    items={listtab.map((item) => {
                      return {
                        label: <span>{convertString(item)}</span>,
                        key: item,
                        children: (
                          <TabBillDetail
                            id={id}
                            style={{ width: "100%" }}
                            dataBillDetail={{ idBill: id, status: item }}
                          />
                        ),
                      };
                    })}
                  />
                )}
              </Row>
            </Row>
            <Col span={24}>
              <Row style={{ width: "100%", marginTop: "20px" }} justify={"end"}>
                <Col span={10}>
                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col span={5}></Col>
                    <Col
                      span={9}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Tổng tiền hàng :
                    </Col>
                    <Col span={10} align={"end"}>
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "blue",
                        }}
                      >
                        {formatCurrency(bill.totalMoney)}
                      </span>
                    </Col>
                  </Row>
                  {bill.moneyShip != undefined || bill.moneyShip != "" ? (
                    <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                      <Col span={5}></Col>
                      <Col
                        span={9}
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        Phí vận chuyển :
                      </Col>
                      <Col span={10} align={"end"}>
                        <span style={{ fontSize: "16px" }}>
                          {bill.moneyShip !== null &&
                            formatCurrency(bill.moneyShip)}
                        </span>
                      </Col>
                    </Row>
                  ) : (
                    <Row></Row>
                  )}
                  {bill.poinUse > 0 ? (
                    <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                      <Col span={5}></Col>
                      <Col
                        span={9}
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        Điểm sử dụng {bill.poinUse} :
                      </Col>
                      <Col span={10} align={"end"}>
                        <span style={{ fontSize: "16px" }}>
                          {formatCurrency(
                            bill?.poinUse * dataPoin?.exchangeRateMoney
                          )}
                        </span>
                      </Col>
                    </Row>
                  ) : (
                    <Row></Row>
                  )}

                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col span={5}></Col>
                    <Col
                      span={9}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Voucher giảm giá :{" "}
                    </Col>
                    <Col span={10} align={"end"}>
                      <span style={{ fontSize: "16px" }}>
                        {formatCurrency(bill.itemDiscount - bill.valuePoin)}
                      </span>
                    </Col>
                  </Row>

                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col span={5}></Col>
                    <Col
                      span={9}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      Tổng tiền giảm :{" "}
                    </Col>
                    <Col span={10} align={"end"}>
                      <span style={{ fontSize: "16px" }}>
                        {formatCurrency(bill.itemDiscount)}
                      </span>
                    </Col>
                  </Row>
                  {totalProductDetailGiveBack() > 0 && (
                    <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                      <Col span={5}></Col>
                      <Col
                        span={9}
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        Tổng tiền hàng trả :
                      </Col>
                      <Col span={10} align={"end"}>
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "red",
                          }}
                        >
                          {formatCurrency(totalProductDetailGiveBack())}
                        </span>
                      </Col>
                    </Row>
                  )}

                  <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <Col span={5}></Col>
                    <Col span={19}>
                      <hr />
                    </Col>
                    <Col span={5}></Col>
                    <Col
                      span={9}
                      style={{
                        marginBottom: "40px",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      Tổng tiền thanh toán:{" "}
                    </Col>
                    <Col span={10} align={"end"}>
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "blue",
                        }}
                      >
                        {formatCurrency(
                          Math.max(
                            0,
                            bill.totalMoney + bill.moneyShip - bill.itemDiscount
                          )
                        )}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Modal
            title="Hủy đơn hàng"
            open={isModalCanCelOpen}
            onOk={handleCanCelOk}
            onCancel={handleCanCelClose}
            cancelText={"huỷ"}
            okText={"Xác nhận"}
          >
            <Form
              onFinish={onFinish}
              ref={formRef}
              form={form}
              initialValues={initialValues}
            >
              {/* {
                  paymentsMethod.some(
                    (payment) => payment.status == "THANH_TOAN"
                  ) ? (  <Row style={{ width: "100%" }}>
                  <Col span={24} style={{ marginTop: "10px" }}>
                    <label className="label-bill" style={{ marginTop: "2px" }}>
                      Hình thức
                    </label>
                    <Select
                      showSearch
                      style={{
                        width: "100%",
                        margin: "10px 0",
                        position: "relative",
                      }}
                      placeholder="Chọn hình thức"
                      optionFilterProp="children"
                      onChange={(value) => onChangeDescStatusBill("statusCancel", value)}
                      defaultValue={statusBill.statusCancel}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        {
                          value: "false",
                          label: "Liên hệ nhân viên",
                         
                        },
                        {
                          value: "true",
                          label: "Chuyển khoản vnpay( Hoàn sau 30 ngày)",
                          disabled: paymentsMethod.some(
                            (payment) => payment.method == "TIEN_MAT"
                          ) || paymentsMethod.length > 1 
                        },
                      ]}
                    />
                  </Col>
                </Row>) : (<Row></Row>)
                 }       */}
              <Col span={24} style={{ marginTop: "20px" }}>
                <label className="label-bill">Mô Tả</label>

                <Form.Item
                  label=""
                  name="actionDescription"
                  // style={{ fontWeight: "bold" }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mô tả",
                    },
                    {
                      validator: (_, value) => {
                        if (value && value.trim() === "") {
                          return Promise.reject(
                            "Không được chỉ nhập khoảng trắng"
                          );
                        }
                        if (
                          !/^(?=.*[a-zA-Z]|[À-ỹ])[a-zA-Z\dÀ-ỹ\s\-_]*$/.test(
                            value
                          )
                        ) {
                          return Promise.reject(
                            "Phải chứa ít nhất một chữ cái và không có ký tự đặc biệt"
                          );
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Nhập mô tả"
                    onChange={(e) =>
                      onChangeDescStatusBill(
                        "actionDescription",
                        e.target.value.trim()
                      )
                    }
                  />
                </Form.Item>
              </Col>
            </Form>
          </Modal>
        </>
      ) : (
        <Result
          status="404"
          title="404"
          subTitle="Xin lỗi, hóa đơn không tồn tại."
          extra={
            <Button type="primary">
              <Link to="/">Về trang chủ</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}

export default DetailBillClinet;
