import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Table,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BillApi } from "../../../api/employee/bill/bill.api";
import {
  addPaymentsMethod,
  addStatusPresent,
  getBill,
  getBillHistory,
  getPaymentsMethod,
} from "../../../app/reducer/Bill.reducer";
import TimeLine from "./TimeLine";

import TextArea from "antd/es/input/TextArea";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AddressApi } from "../../../api/customer/address/address.api";
import { PaymentsMethodApi } from "../../../api/employee/paymentsmethod/PaymentsMethod.api";
import { addBillHistory } from "../../../app/reducer/Bill.reducer";
import "./detail.css";
import { PoinApi } from "../../../api/employee/poin/poin.api";
import ManagerBillDetail from "./tabBillDetail/ManagerBillDetail";
import ModalAccountEmployee from "./modal/ModalAccountEmployee";
import { useReactToPrint } from "react-to-print";
import ModalAddProductDetail from "./modal/ModalAddProductDetail";
import TabBillDetail from "./tabBillDetail/TabBillDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import NumberFormat from "react-number-format";

var listStatus = [
  { id: 0, name: "Tạo hóa đơn", status: "TAO_HOA_DON" },
  { id: 2, name: "Chờ xác nhận", status: "CHO_XAC_NHAN" },
  { id: 3, name: "Xác nhận", status: "XAC_NHAN" },
  { id: 4, name: "Chờ vận chuyển", status: "CHO_VAN_CHUYEN" },
  { id: 5, name: "Vận chuyển", status: "VAN_CHUYEN" },
  { id: 6, name: "Thanh toán", status: "DA_THANH_TOAN" },
  { id: 7, name: "Thành công", status: "THANH_CONG" },
];

function DetailBill() {
  const { id } = useParams();
  const billHistory = useSelector((state) => state.bill.bill.billHistory);
  const paymentsMethod = useSelector((state) => state.bill.bill.paymentsMethod);
  const bill = useSelector((state) => state.bill.bill.value);
  const statusPresent = useSelector((state) => state.bill.bill.status);
  const [statusBill, setStatusBill] = useState({
    actionDescription: "",
    method: "TIEN_MAT",
    transaction: "",
    status: "THANH_TOAN",
  });
  const dispatch = useDispatch();

  const formRef = React.useRef(null);

  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [payMentNo, setPayMentNo] = useState(false);
  const [paymentPostpaid, setPaymentPostPaid] = useState(0);
  const [dataPoin, setDataPoin] = useState(null);
  const { Option } = Select;
  const [shipFee, setShipFee] = useState(0);
  const [userId, setUserId] = useState(false);

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };

  useEffect(() => {
    BillApi.fetchDetailBill(id).then((res) => {
      dispatch(getBill(res.data.data));
      console.log(res.data.data);
      if (res.data.data.account != null) {
        setUserId(res.data.data.account.user.id);
      }
      setShipFeeCustomer(res.data.data.moneyShip);
      setBillRequest({
        name: res.data.data.userName,
        phoneNumber: res.data.data.phoneNumber,
        address: res.data.data.address,
        moneyShip: res.data.data.moneyShip,
        note: res.data.data.note,
      });
      setShipFee(res.data.data.moneyShip);
      var index = listStatus.findIndex(
        (item) => item.status == res.data.data.statusBill
      );
      if (res.data.data.statusBill == "TRA_HANG") {
        index = 7;
      }
      if (res.data.data.statusBill == "DA_HUY") {
        index = 8;
      }
      dispatch(addStatusPresent(index));
      setAddress({
        wards: res.data.data.address?.split(",")[1],
        district: res.data.data.address?.split(",")[2],
        city: res.data.data.address?.split(",")[3],
        detail: res.data.data.address?.split(",")[0],
      });
    });
    BillApi.fetchAllHistoryInBillByIdBill(id).then((res) => {
      dispatch(getBillHistory(res.data.data));
      console.log(res.data.data);
    });
    BillApi.fetchCountPayMentPostpaidByIdBill(id).then((res) => {
      setPaymentPostPaid(res.data.data);
    });
    PaymentsMethodApi.findByIdBill(id).then((res) => {
      setPayMentNo(res.data.data.some((item) => item.status === "TRA_SAU"));
      dispatch(getPaymentsMethod(res.data.data));
    });
    loadDataProvince();
    PoinApi.findPoin()
      .then((res) => {
        setDataPoin(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []);

  //load data tỉnh
  const loadDataProvince = () => {
    AddressApi.fetchAllProvince().then(
      (res) => {
        console.log();
        setListProvince(res.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  //load data quận/huyện khi chọn tỉnh
  const handleProvinceChange = (value, valueProvince) => {
    // form.setFieldsValue({ provinceId: valueProvince.valueProvince });
    console.log(valueProvince);
    setAddress({ ...address, city: valueProvince.value });
    AddressApi.fetchAllProvinceDistricts(valueProvince.valueProvince).then(
      (res) => {
        setListDistricts(res.data.data);
      }
    );
  };
  //load data xã/phường khi chọn quận/huyện
  const handleDistrictChange = (value, valueDistrict) => {
    setAddress({ ...address, district: valueDistrict.value });
    // form.setFieldsValue({ toDistrictId: valueDistrict.valueDistrict });
    AddressApi.fetchAllProvinceWard(valueDistrict.valueDistrict).then((res) => {
      setListWard(res.data.data);
    });
  };
  //load data phí ship và ngày ship
  const handleWardChange = (value, valueWard) => {
    const totalQuantity =
      products.length > 0
        ? products.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.quantity;
          }, 0)
        : 1;
    setAddress({ ...address, wards: valueWard.value });
    if (bill.totalMoney >= 2000000) {
      setShipFee(0);
    } else {
      AddressApi.fetchAllMoneyShip(
        valueWard.valueDistrict,
        valueWard.valueWard,
        totalQuantity
      ).then((res) => {
        setShipFee(res.data.data.total);
      });
    }
  };

  const [form] = Form.useForm();

  // begin cancelBill
  const [isModalCanCelOpen, setIsModalCanCelOpen] = useState(false);
  const showModalCanCel = () => {
    setIsModalCanCelOpen(true);
  };
  const handleCanCelOk = () => {
    setIsModalCanCelOpen(false);
    if (statusBill.actionDescription === "") {
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
              (item) => item.status === res.data.data.statusBill
            );
            if (res.data.data.statusBill === "TRA_HANG") {
              index = 7;
            }
            if (res.data.data.statusBill === "DA_HUY") {
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
          await PaymentsMethodApi.findByIdBill(id).then((res) => {
            setPayMentNo(
              res.data.data.some((item) => item.status === "TRA_SAU")
            );
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
  // end  cancelBill

  // begin modal thanh toán
  const [isModalPayMentOpen, setIsModalPayMentOpen] = useState(false);
  const XacNhanThanhToan = async (e) => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có đồng ý xác nhận không?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        var data = paymentsMethod.map((item) => item.id);
        await PaymentsMethodApi.updateStatus(id, data).then((res) => {
          console.log(res.data.data);
        });
        await PaymentsMethodApi.findByIdBill(id).then((res) => {
          setPayMentNo(res.data.data.some((item) => item.status === "TRA_SAU"));
          dispatch(getPaymentsMethod(res.data.data));
        });
        await BillApi.fetchDetailBill(id).then((res) => {
          console.log(res.data.data);
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
          dispatch(addStatusPresent(index));
        });
        await BillApi.fetchAllHistoryInBillByIdBill(id).then((res) => {
          dispatch(getBillHistory(res.data.data));
        });
        toast.success("Thanh toán thành công");
      },
      onCancel: () => {
        setIsModalOpenChangeStatus(false);
      },
    });
    form.resetFields();
  };

  const handleOkPayMent = () => {
    if (statusBill.actionDescription.trim().length > 0) {
      if (
        statusBill.method == "CHUYEN_KHOAN" &&
        statusBill.transaction.trim().length == 0
      ) {
        toast.warning("Vui lòng nhập mã giao dịch");
      }
      setIsModalPayMentOpen(false);
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có đồng ý thanh toán không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          await PaymentsMethodApi.refundPayment(id, statusBill).then((res) => {
            dispatch(addPaymentsMethod(res.data.data));
          });
          await PaymentsMethodApi.findByIdBill(id).then((res) => {
            setPayMentNo(
              res.data.data.some((item) => item.status === "TRA_SAU")
            );
            dispatch(getPaymentsMethod(res.data.data));
          });
          await BillApi.fetchDetailBill(id).then((res) => {
            console.log(res.data.data);
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
            dispatch(addStatusPresent(index));
            console.log(index);
          });
          await BillApi.fetchAllHistoryInBillByIdBill(id).then((res) => {
            dispatch(getBillHistory(res.data.data));
            console.log(res.data.data);
          });
          toast.success("Thanh toán thành công");
          setIsModalPayMentOpen(false);
          setStatusBill({
            actionDescription: "",
            method: "TIEN_MAT",
            totalMoney: 0,
            status: "THANH_TOAN",
            statusCancel: false,
          });
        },
        onCancel: () => {
          setIsModalPayMentOpen(false);
          setStatusBill({
            actionDescription: "",
            method: "TIEN_MAT",
            totalMoney: 0,
            status: "THANH_TOAN",
            statusCancel: false,
          });
        },
      });
      form.resetFields();
    }
    setStatusBill({
      actionDescription: "",
      method: "TIEN_MAT",
      totalMoney: 0,
      status: "THANH_TOAN",
      statusCancel: false,
    });
  };
  const handleCancelPayMent = () => {
    setIsModalPayMentOpen(false);
    setStatusBill({
      actionDescription: "",
      method: "TIEN_MAT",
      totalMoney: 0,
      status: "THANH_TOAN",
      statusCancel: false,
    });
  };
  // enad modal thanh toán

  // begin modal bill
  const [billRequest, setBillRequest] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    moneyShip: "0",
    note: "",
  });

  const [address, setAddress] = useState({
    city: "",
    district: "",
    wards: "",
    detail: "",
  });

  const onChangeBill = (fileName, value) => {
    setBillRequest({ ...billRequest, [fileName]: value });
  };

  const onChangeAddress = (fileName, value) => {
    setAddress({ ...address, [fileName]: value });
    var addressuser =
      address.detail +
      ", " +
      address.wards +
      ", " +
      address.district +
      ", " +
      address.city;
    setBillRequest({ ...billRequest, address: addressuser });
  };

  const [isModaBillOpen, setIsModalBillOpen] = useState(false);
  const showModalBill = (e) => {
    setIsModalBillOpen(true);
    setAddress({
      wards: bill.address?.split(",")[1],
      district: bill.address?.split(",")[2],
      city: bill.address?.split(",")[3],
      detail: bill.address?.split(",")[0],
    });
  };

  const checkNotEmptyBill = () => {
    return Object.keys(billRequest)
      .filter((key) => key !== "note" && key !== "address")
      .every((key) => billRequest[key] !== "");
  };

  const handleOkBill = () => {
    var addressuser = billRequest.address;
    if (
      address.detail != "" &&
      address.wards != "" &&
      address.district != "" &&
      address.city != ""
    ) {
      addressuser =
        address.detail +
        ", " +
        address.wards +
        ", " +
        address.district +
        ", " +
        address.city;
    }
    const data = {
      name: String(billRequest.name),
      phoneNumber: billRequest.phoneNumber,
      address: addressuser,
      moneyShip: totalProductDetailGiveBackAndSuccse() >= 2000000 ? 0 : shipFee,
      note: billRequest.note,
    };
    if (
      checkNotEmptyBill() &&
      address.detail != "" &&
      address.wards != "" &&
      address.district != "" &&
      address.city != ""
    ) {
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có xác nhận thay đổi không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          await BillApi.updateBill(id, data).then((res) => {
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
            dispatch(addStatusPresent(index));
            setShipFeeCustomer(res.data.data.moneyShip);
          });
          toast.success("Thay đổi hóa đơn thành công");
          setIsModalBillOpen(false);
        },
        onCancel: () => {
          setIsModalBillOpen(false);
        },
      });
      setBillRequest({
        name: "",
        phoneNumber: "",
        address: "",
        moneyShip: "0",
        note: "",
      });
      setAddress({
        city: "",
        district: "",
        wards: "",
        detail: "",
      });
      setIsModalBillOpen(false);
    }
  };
  const handleCancelBill = () => {
    setIsModalBillOpen(false);
  };
  // end modal bill

  const [products, setProducts] = useState([]);

  //  begin modal change status

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

  const generatePDF = useReactToPrint({
    content: () => document.getElementById("pdfContent"),
    documentTitle: "Userdata",
    onAfterPrint: () => {},
  });

  const [isModalOpenChangeStatus, setIsModalOpenChangeStatus] = useState(false);

  const showModalChangeStatus = () => {
    setIsModalOpenChangeStatus(true);
  };

  const handleOkChangeStatus = () => {
    if (statusBill.actionDescription == "") {
      toast.error("Vui lòng nhập mô tả");
    } else {
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có đồng ý xác nhận thanh toán không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          await BillApi.changeStatusBill(id, statusBill)
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
              if (res.data.data.statusBill == "XAC_NHAN") {
                var data = {
                  ids: [id],
                  status: "XAC_NHAN",
                };
                BillApi.fetchAllFilePdfByIdBill(data)
                  .then((response) => {
                    document.getElementById("pdfContent").innerHTML =
                      response.data.data;
                    generatePDF();
                  })
                  .catch((error) => {
                    toast.error(error.response.data.message);
                  });
              }
              dispatch(addStatusPresent(index));
            })
            .catch((error) => {
              toast.error(error.response.data.message);
            });
          await PaymentsMethodApi.findByIdBill(id).then((res) => {
            dispatch(getPaymentsMethod(res.data.data));
          });
          await BillApi.fetchAllHistoryInBillByIdBill(id).then((res) => {
            dispatch(getBillHistory(res.data.data));
          });
          toast.success("Xác nhận thành công");
          setIsModalOpenChangeStatus(false);
        },
        onCancel: () => {
          setIsModalOpenChangeStatus(false);
        },
      });
      setStatusBill({
        actionDescription: "",
        method: "TIEN_MAT",
        totalMoney: 0,
        status: "THANH_TOAN",
        statusCancel: false,
      });
      form.resetFields();

      setIsModalOpenChangeStatus(false);
    }

    setStatusBill({
      actionDescription: "",
      method: "TIEN_MAT",
      totalMoney: 0,
      status: "THANH_TOAN",
      statusCancel: false,
    });
  };

  const handleCancelChangeStatus = () => {
    setIsModalOpenChangeStatus(false);
    setStatusBill({
      actionDescription: "",
      method: "TIEN_MAT",
      totalMoney: 0,
      status: "THANH_TOAN",
      statusCancel: false,
    });
    form.resetFields();
  };

  const [isModalOpenRollBackStatus, setIsModalOpenRollBackStatus] =
    useState(false);

  const showModalRollBackStatus = () => {
    setIsModalOpenRollBackStatus(true);
  };

  const handleOkRollBackStatus = () => {
    if (
      statusBill.actionDescription.trim() == "" ||
      statusBill.actionDescription.trim().length < 50
    ) {
      toast.error("Vui lòng nhập mô tả");
    } else {
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có đồng ý xác nhận quay lại không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          await BillApi.rollBackStatusBill(id, statusBill)
            .then((res) => {
              toast.success("Chuyển lại trạng thái thành công");
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
              dispatch(addStatusPresent(index));
            })
            .catch((error) => {
              toast.error(error.response.data.message);
            });
          await PaymentsMethodApi.findByIdBill(id).then((res) => {
            dispatch(getPaymentsMethod(res.data.data));
          });
          await BillApi.fetchAllHistoryInBillByIdBill(id).then((res) => {
            dispatch(getBillHistory(res.data.data));
          });

          setIsModalOpenRollBackStatus(false);
        },
        onCancel: () => {
          setIsModalOpenRollBackStatus(false);
        },
      });
      setStatusBill({
        actionDescription: "",
        method: "TIEN_MAT",
        totalMoney: 0,
        status: "THANH_TOAN",
        statusCancel: false,
      });
      form.resetFields();

      setIsModalOpenRollBackStatus(false);
    }

    setStatusBill({
      actionDescription: "",
      method: "TIEN_MAT",
      totalMoney: 0,
      status: "THANH_TOAN",
      statusCancel: false,
    });
  };

  const handleCancelRollBackStatus = () => {
    setIsModalOpenRollBackStatus(false);
    setStatusBill({
      actionDescription: "",
      method: "TIEN_MAT",
      totalMoney: 0,
      status: "THANH_TOAN",
      statusCancel: false,
    });
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

  // end modal change statust

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

  // thay đổi nhân viên
  const [isModalOpenAccountEmployee, setIsModalOpenAccountEmployee] =
    useState(false);

  const showModalAccountEmployee = () => {
    setIsModalOpenAccountEmployee(true);
  };

  const handleOkAccountEmployee = () => {
    setIsModalOpenAccountEmployee(false);
  };

  const handleCancelAccountEmployee = () => {
    setIsModalOpenAccountEmployee(false);
    BillApi.fetchDetailBill(id).then((res) => {
      dispatch(getBill(res.data.data));
      var index = listStatus.findIndex(
        (item) => item.status == res.data.data.statusBill
      );
      if (res.data.data.statusBill == "TRA_HANG") {
        index = 6;
      }
      if (res.data.data.statusBill == "DA_HUY") {
        index = 7;
      }
      dispatch(addStatusPresent(index));
    });
  };

  // end thay đổi nhân viên

  // get sp mua theo bill
  const [productDetailToBillDetail, setProductDetailToBillDetail] = useState(
    []
  );
  const loadDataProductDetailToBillDetail = () => {
    BillApi.BillGiveBack(id).then((res) => {
      setProductDetailToBillDetail(res.data.data);
      console.log(res.data.data);
    });
  };
  const changeQuanTiTy = useSelector((state) => state.bill.bill.change);
  useEffect(() => {
    if (id !== null) {
      loadDataProductDetailToBillDetail();
    }
    PaymentsMethodApi.findByIdBill(id).then((res) => {
      dispatch(getPaymentsMethod(res.data.data));
    });
  }, [id, changeQuanTiTy]);

  // total product detail give back
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

  const [isModalProductOpen, setIsModalProductOpen] = useState(false);

  const showModalProduct = (e) => {
    setIsModalProductOpen(true);
  };
  const handleOkProduct = () => {
    setIsModalProductOpen(false);
  };
  const handleCancelProduct = () => {
    setIsModalProductOpen(false);
  };
  const typeAddProductBill = id;

  const [shipFeeCustomer, setShipFeeCustomer] = useState(null);
  useEffect(() => {
    if (totalProductDetailGiveBackAndSuccse() >= 2000000) {
      setShipFeeCustomer(0);
    } else {
      setShipFeeCustomer(bill.moneyShip);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDetailToBillDetail]);

  const updateShipBill = (idBill, ship) => {
    const data = {
      ship: ship,
      idBill: idBill,
    };
    BillApi.UpdateShipBill(data)
      .then((res) => {
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (shipFeeCustomer === 0) {
      updateShipBill(id, 0);
    } else {
      console.log(shipFee);
      updateShipBill(id, shipFee);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipFeeCustomer]);

  return (
    <div>
      <Row style={{ width: "100%" }}>
        <div
          className="row"
          style={{
            backgroundColor: "white",
            width: "100%",
            marginBottom: "30px",
          }}
        >
          <Row
            style={{
              backgroundColor: "white",
              padding: 0,
              overflowY: "auto",
            }}
          >
            <TimeLine
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
                <Row>
                  <Col
                    style={{ width: "100%" }}
                    span={statusPresent < 6 ? 6 : 0}
                  >
                    {statusPresent < 6 ? (
                      <Button
                        type="primary"
                        className="btn btn-primary"
                        onClick={() => showModalChangeStatus()}
                        style={{
                          fontSize: "medium",
                          fontWeight: "500",
                          marginLeft: "20px",
                        }}
                      >
                        {billHistory.some(
                          (item) => item.statusBill === "DA_THANH_TOAN"
                        ) && bill.statusBill === "VAN_CHUYEN"
                          ? "Thành công"
                          : listStatus[statusPresent + 1].name}
                      </Button>
                    ) : (
                      <div></div>
                    )}
                  </Col>
                  <Col
                    span={
                      statusPresent > 1 &&
                      bill.shippingTime != null &&
                      bill.statusBill !== "TRA_HANG"
                        ? 5
                        : 0
                    }
                  >
                    {" "}
                    {statusPresent > 1 &&
                    bill.shippingTime != null &&
                    bill.statusBill !== "TRA_HANG" ? (
                      <Button
                        type="danger"
                        className="btn btn-danger"
                        onClick={() => showModalRollBackStatus()}
                        style={{
                          fontSize: "medium",
                          fontWeight: "500",
                          marginLeft: "20px",
                          backgroundColor: "#FF9900",
                          color: "white",
                        }}
                      >
                        Quay lại
                      </Button>
                    ) : (
                      <div></div>
                    )}
                  </Col>
                  <Col
                    span={
                      statusPresent < 4 && bill.statusBill != "DA_THANH_TOAN"
                        ? 6
                        : 0
                    }
                  >
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
                </Row>
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
            <Modal
              title="Xác nhận Đơn hàng"
              open={isModalOpenChangeStatus}
              onOk={handleOkChangeStatus}
              onCancel={handleCancelChangeStatus}
              cancelText={"huỷ"}
              okText={"Xác nhận"}
            >
              <Form
                onFinish={onFinish}
                ref={formRef}
                form={form}
                initialValues={initialValues}
              >
                <Row style={{ width: "100%" }}>
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
                        rows={bill.statusBill === "VAN_CHUYEN" ? 3 : 4}
                        placeholder="Nhập mô tả"
                        style={{ width: "100%", position: "F" }}
                        onChange={(e) =>
                          onChangeDescStatusBill(
                            "actionDescription",
                            e.target.value.trim()
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
            <Modal
              title="Quay lại trạng thái Đơn hàng"
              open={isModalOpenRollBackStatus}
              onOk={handleOkRollBackStatus}
              onCancel={handleCancelRollBackStatus}
              cancelText={"huỷ"}
              okText={"Xác nhận"}
            >
              <Form
                onFinish={onFinish}
                ref={formRef}
                form={form}
                initialValues={initialValues}
              >
                <Row style={{ width: "100%" }}>
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
                        {
                          validator: (_, value) => {
                            if (value && value.length < 50) {
                              return Promise.reject("Ít nhất 50 ký tự");
                            }

                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <TextArea
                        rows={bill.statusBill === "VAN_CHUYEN" ? 3 : 4}
                        placeholder="Nhập mô tả"
                        style={{ width: "100%", position: "F" }}
                        onChange={(e) =>
                          onChangeDescStatusBill(
                            "actionDescription",
                            e.target.value.trim()
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
            <div className="col-2">
              <Modal
                title="Hủy đơn hàng"
                open={isModalCanCelOpen}
                onOk={handleCanCelOk}
                onCancel={handleCanCelClose}
                cancelText={"Huỷ"}
                okText={"Xác nhận"}
              >
                <Form
                  onFinish={onFinish}
                  ref={formRef}
                  form={form}
                  initialValues={initialValues}
                >
                  <Col span={24} style={{ marginTop: "20px" }}>
                    <label className="label-bill">Mô Tả</label>

                    <Form.Item
                      label=""
                      name="actionDescription"
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
            </div>
            <div className="offset-6 col-2">
              <Modal
                title="Lịch sử"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                className="widthModal"
                width={1400}
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
            <h1 style={{ fontSize: "25px", marginBottom: "10px" }}>
              {" "}
              Lịch sử thanh toán
            </h1>
          </Col>
          {payMentNo && statusPresent == 4 ? (
            <Col span={4}>
              <Button
                type="dashed"
                align={"end"}
                style={{ margin: "" }}
                onClick={(e) => XacNhanThanhToan(e)}
              >
                Xác nhận thanh toán
              </Button>
            </Col>
          ) : (
            <div></div>
          )}
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
            <Col span={18}>
              <h1 style={{ fontSize: "25px", marginBottom: "10px" }}>
                {" "}
                Thông tin đơn hàng: {bill.code}
              </h1>
            </Col>
            <Col span={1}></Col>
            <Col span={2}>
              {statusPresent < 5 ? (
                <Button
                  type="dashed"
                  align={"end"}
                  style={{ margin: "" }}
                  onClick={(e) => showModalBill(e)}
                >
                  Thay đổi
                </Button>
              ) : (
                <div></div>
              )}
            </Col>
            <Col span={3}>
              {statusPresent < 6 ? (
                <Button
                  type="dashed"
                  align={"end"}
                  style={{ margin: "" }}
                  onClick={(e) => showModalAccountEmployee()}
                >
                  Chuyển nhân viên
                </Button>
              ) : (
                <div></div>
              )}
            </Col>
          </Row>
          <Row style={{ width: "100%" }}>
            <Col span={12} className="text">
              <Row style={{ marginLeft: "20px" }}>
                <Col span={8} style={{ fontWeight: "bold", fontSize: "16px" }}>
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
                      : bill.statusBill == "CHO_VAN_CHUYEN"
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
              <Row style={{ marginLeft: "20px", marginTop: "8px" }}>
                <Col span={8} style={{ fontWeight: "bold", fontSize: "16px" }}>
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
                <Col span={8} style={{ fontWeight: "bold", fontSize: "16px" }}>
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
                <Col span={8} style={{ fontWeight: "bold", fontSize: "16px" }}>
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
                <Col span={8} style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Địa chỉ:
                </Col>
                <Col span={16}>
                  <span style={{ color: "black" }}>{bill.address}</span>
                </Col>
              </Row>
            </Col>

            {bill.shippingTime != null && bill.statusBill != "THANH_CONG" ? (
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
                <Col span={8} style={{ fontWeight: "bold", fontSize: "16px" }}>
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
      <Card style={{ marginTop: "30px" }}>
        <Row style={{ width: "100%" }}>
          <Col span={20}>
            <h1 style={{ fontSize: "25px", marginBottom: "10px" }}>
              {" "}
              Thông tin sản phẩm đã mua{" "}
            </h1>
          </Col>
          <Col span={4} align={"end"}>
            {" "}
            {statusPresent < 2 ? (
              <Row
                style={{ width: "100%", marginRight: "15px" }}
                justify={"end"}
              >
                <Button
                  type="primary"
                  style={{ margin: "10px 20px  ", height: "40px" }}
                  onClick={(e) => showModalProduct(e)}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ marginLeft: "3px" }}
                  />{" "}
                  Thêm sản phẩm
                </Button>
              </Row>
            ) : (
              <Row></Row>
            )}
          </Col>
        </Row>
        <Row>
          {statusPresent < 2 ? (
            <Col span={24}>
              <TabBillDetail
                style={{ width: "100%" }}
                dataBillDetail={{ idBill: id, status: "THANH_CONG" }}
              />
            </Col>
          ) : (
            <Col span={24}>
              <ManagerBillDetail
                id={id}
                status={bill.statusBill}
              ></ManagerBillDetail>
            </Col>
          )}

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
                      {formatCurrency(totalProductDetailGiveBackAndSuccse())}
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
                        {shipFeeCustomer !== null &&
                          formatCurrency(shipFeeCustomer)}
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
      </Card>

      {/* begin modal payment  */}
      <Modal
        title="Thanh toán"
        open={isModalPayMentOpen}
        onOk={handleOkPayMent}
        onCancel={handleCancelPayMent}
        cancelText={"huỷ"}
        okText={"Xác nhận"}
      >
        <Form form={form} ref={formRef}>
          <Row style={{ width: "100%" }}>
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
                onChange={(value) => onChangeDescStatusBill("method", value)}
                defaultValue={statusBill.method}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "TIEN_MAT",
                    label: "Tiền mặt",
                  },
                  {
                    value: "CHUYEN_KHOAN",
                    label: "Chuyển khoản (Khuyến nghị)",
                  },
                ]}
              />
            </Col>
          </Row>
          {statusBill.method == "CHUYEN_KHOAN" ? (
            <Row style={{ width: "100%" }}>
              <Col span={24} style={{ marginTop: "20px" }}>
                <label
                  className="label-bill"
                  style={{ marginTop: "3px", top: "-31%" }}
                >
                  Mã giao dịch
                </label>
                <Form.Item
                  label=""
                  name="name"
                  style={{ marginBottom: "20px" }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mã giao dịch",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) =>
                      onChangeDescStatusBill("transaction", e.target.value)
                    }
                    placeholder="Nhập mã giao dịch"
                    defaultValue={statusBill.transaction}
                    style={{
                      width: "98%",
                      position: "relative",
                      height: "40px",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <Row></Row>
          )}
          <Row style={{ width: "100%" }}>
            <Col span={24} style={{ marginTop: "20px" }}>
              <label className="label-bill">Mô Tả</label>
              <TextArea
                rows={bill.statusBill === "VAN_CHUYEN" ? 3 : 4}
                defaultValue={statusBill.actionDescription}
                style={{ width: "100%", position: "relative" }}
                placeholder="Nhập mô tả"
                onChange={(e) =>
                  onChangeDescStatusBill("actionDescription", e.target.value)
                }
              />
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* end modal payment  */}

      {/* begin modal bill  */}
      <Modal
        title="Thay đổi hóa đơn"
        open={isModaBillOpen}
        onOk={handleOkBill}
        onCancel={handleCancelBill}
        cancelText={"Huỷ"}
        okText={"Xác nhận"}
      >
        <Form initialValues={initialValues} form={form} ref={formRef}>
          <Row style={{ width: "100%" }}>
            <Col span={24} style={{ marginTop: "20px" }}>
              <label
                className="label-bill"
                style={{ marginTop: "3px", top: "-31%" }}
              >
                Tên khách hàng
              </label>
              <Form.Item
                label=""
                name="name"
                style={{ marginBottom: "20px" }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên khách hàng",
                  },
                  {
                    validator: (_, value) => {
                      if (value && value.trim() === "") {
                        return Promise.reject(
                          "Không được chỉ nhập khoảng trắng"
                        );
                      }
                      if (
                        !/^(?=.*[a-zA-Z]|[À-ỹ])[a-zA-Z\dÀ-ỹ\s\-_]*$/.test(value)
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
                <Input
                  onChange={(e) => onChangeBill("name", e.target.value)}
                  placeholder="Nhập tên khách hàng"
                  defaultValue={bill.userName}
                  style={{ width: "98%", position: "relative", height: "40px" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ width: "100%" }}>
            <Col span={24} style={{ marginTop: "20px" }}>
              <label
                className="label-bill"
                style={{ marginTop: "-4px", top: "-25%" }}
              >
                Số điện thoại
              </label>
              <Form.Item
                label=""
                name="phoneNumber"
                style={{ marginBottom: "20px" }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại",
                  },
                  {
                    pattern:
                      "(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}",
                    message: "Vui lòng nhập đúng số điện thoại",
                  },
                ]}
              >
                <Input
                  onChange={(e) => onChangeBill("phoneNumber", e.target.value)}
                  placeholder="Nhập số điện thoại"
                  defaultValue={bill.phoneNumber}
                  style={{ width: "98%", position: "relative", height: "40px" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{}}>
            <Col span={24}>
              <Row style={{ width: "100%", marginTop: "20px" }}>
                <Col span={8}>
                  <Row>
                    <Col span={24}>
                      <label
                        className="label-bill"
                        style={{ marginTop: "-4px", top: "-25%" }}
                      >
                        Tỉnh
                      </label>
                      <Form.Item
                        label=""
                        name="city"
                        style={{ marginBottom: "20px" }}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn tỉnh",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Chọn tỉnh"
                          optionFilterProp="children"
                          // onChange={(v) => onChangeAddress("city", v)}
                          onChange={handleProvinceChange}
                          defaultValue={address.city}
                          style={{ width: "90%", position: "relative" }}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          // options={[]}
                        >
                          {listProvince?.map((item) => {
                            return (
                              <Option
                                key={item.ProvinceID}
                                value={item.ProvinceName}
                                valueProvince={item.ProvinceID}
                              >
                                {item.ProvinceName}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col span={24}>
                      <label
                        className="label-bill"
                        style={{ marginTop: "-4px", top: "-25%" }}
                      >
                        Quận
                      </label>

                      <Form.Item
                        label=""
                        name="district"
                        style={{ marginBottom: "20px" }}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn Quận",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Chọn Quận"
                          optionFilterProp="children"
                          // onChange={(v) => onChangeAddress("district", v)}
                          onChange={handleDistrictChange}
                          defaultValue={address.wards}
                          style={{ width: "90%", position: "relative" }}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          // options={[]}
                        >
                          {listDistricts?.map((item) => {
                            return (
                              <Option
                                key={item.DistrictID}
                                value={item.DistrictName}
                                valueDistrict={item.DistrictID}
                              >
                                {item.DistrictName}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col span={24}>
                      <label
                        className="label-bill"
                        style={{ marginTop: "-4px", top: "-25%" }}
                      >
                        xã
                      </label>
                      <Form.Item
                        label=""
                        name="wards"
                        style={{ marginBottom: "20px" }}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn Quận",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Chọn Phường xã"
                          optionFilterProp="children"
                          // onChange={(v) => onChangeAddress("wards", v)}
                          onChange={handleWardChange}
                          defaultValue={address.district}
                          style={{ width: "94%", position: "relative" }}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          // options={[]}
                        >
                          {listWard?.map((item) => {
                            return (
                              <Option
                                key={item.WardCode}
                                value={item.WardName}
                                valueWard={item.WardCode}
                                valueDistrict={item.DistrictID}
                              >
                                {item.WardName}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ width: "100%" }}>
            <Col span={24} style={{ marginTop: "20px" }}>
              <label
                className="label-bill"
                style={{ marginTop: "-4px", top: "-25%" }}
              >
                Địa chỉ cụ thể
              </label>
              <Form.Item
                label=""
                name="detail"
                style={{ marginBottom: "20px" }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Quận",
                  },
                  {
                    validator: (_, value) => {
                      if (value && value.trim() === "") {
                        return Promise.reject(
                          "Không được chỉ nhập khoảng trắng"
                        );
                      }
                      if (
                        !/^(?=.*[a-zA-Z]|[À-ỹ])[a-zA-Z\dÀ-ỹ\s\-_]*$/.test(value)
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
                <Input
                  defaultValue={address.detail}
                  onChange={(e) => onChangeAddress("detail", e.target.value)}
                  placeholder="Nhập địa chỉ"
                  style={{ width: "98%", position: "relative", height: "40px" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ width: "100%" }}>
            <Col span={24} style={{ marginTop: "20px" }}>
              <label
                className="label-bill"
                style={{ marginTop: "-4px", top: "-25%" }}
              >
                Phí vận chuyển
              </label>
              <Form.Item label="" style={{ marginBottom: "20px" }}>
                <NumberFormat
                  thousandSeparator={true}
                  suffix=" VND"
                  placeholder={
                    "Vui lòng nhập phí ship ( " + formatCurrency(shipFee) + " )"
                  }
                  style={{
                    width: "100%",
                    position: "relative",
                    height: "37px",
                  }}
                  min={0}
                  customInput={Input}
                  value={shipFee}
                  onChange={(e) => {
                    var phiShip = parseFloat(
                      e.target.value.replace(/[^0-9.-]+/g, "")
                    );
                    if (
                      phiShip == null ||
                      isNaN(phiShip) ||
                      phiShip == undefined ||
                      phiShip < 0
                    ) {
                      toast.warning(
                        "Vui lòng nhập phí vân chuyển và lớn hơn hoặc bằng 0"
                      );
                    } else {
                      setShipFee(phiShip);
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ width: "100%" }}>
            <Col span={24} style={{ marginTop: "20px" }}>
              <label className="label-bill">Ghi chú</label>
              <TextArea
                rows={bill.statusBill === "VAN_CHUYEN" ? 3 : 4}
                defaultValue={billRequest.note}
                style={{ width: "100%", position: "relative" }}
                placeholder="Nhập mô tả"
                onChange={(e) => onChangeBill("note", e.target.value)}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* end modal bill  */}

      {/*  thay thay đổi nhân viên  */}
      <Modal
        title="Chuyển hóa đơn cho nhân viên"
        open={isModalOpenAccountEmployee}
        onOk={handleOkAccountEmployee}
        onCancel={handleCancelAccountEmployee}
        footer={null}
        width={1100}
      >
        <ModalAccountEmployee
          dataIdCheck={id}
          handleCancel={handleCancelAccountEmployee}
          status={false}
        />
      </Modal>
      {/* end thay đổi nhân viên  */}
      {/* Same as */}
      <Modal
        title="Danh sách sản phẩm"
        open={isModalProductOpen}
        onOk={handleOkProduct}
        onCancel={handleCancelProduct}
        width={1200}
      >
        <ModalAddProductDetail
          handleCancelProduct={handleCancelProduct}
          products={products}
          setProducts={setProducts}
          typeAddProductBill={typeAddProductBill}
          closeIcon={null}
          width={1600}
          footer={null}
        />
      </Modal>
      <div style={{ display: "none" }}>
        <div id="pdfContent" />
      </div>
    </div>
  );
}

export default DetailBill;
