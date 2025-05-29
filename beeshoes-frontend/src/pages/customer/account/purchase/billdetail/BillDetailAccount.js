import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { AiFillCarryOut } from "react-icons/ai";
import { BiSolidTruck } from "react-icons/bi";
import {
  BsFileEarmarkExcelFill,
  BsFillFileEarmarkCheckFill,
} from "react-icons/bs";
import "./style-bill-detail-account.css";
import { FaFileSignature } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import dayjs from "dayjs";
import { BillHistoryClientApi } from "../../../../../api/customer/billhistory/billHistoryClient.api";
import { BillClientApi } from "../../../../../api/customer/bill/billClient.api";
import { PaymentMethodClientApi } from "../../../../../api/customer/paymentmethod/PaymentMethod.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
function BillDetailAccount() {
  const id = useParams();
  const nav = useNavigate();
  const [listBillHistory, setListBillHistory] = useState([]);
  const [statusPresent, setStatusPresent] = useState([]);
  const [bill, setBill] = useState({});
  const [paymentMethod, setPaymentMethod] = useState({});

  const showIcon = (statusBill) => {
    if (statusBill === "CHO_XAC_NHAN") {
      return FaFileSignature;
    } else if (statusBill === "XAC_NHAN") {
      return BsFillFileEarmarkCheckFill;
    } else if (statusBill === "VAN_CHUYEN") {
      return BiSolidTruck;
    } else if (statusBill === "DA_THANH_TOAN") {
      return MdPayment;
    } else if (statusBill === "THANH_CONG") {
      return AiFillCarryOut;
    } else if (statusBill === "DA_HUY") {
      return BsFileEarmarkExcelFill;
    }
  };
  useEffect(() => {
    console.log(listBillHistory);
  }, [listBillHistory]);
  useEffect(() => {
    console.log(paymentMethod);
  }, [paymentMethod]);
  useEffect(() => {
    PaymentMethodClientApi.getByBill(id.id).then((res) => {
      setPaymentMethod(res.data.data);
     
    console.log(res.data.data);
    BillHistoryClientApi.getByIdBill(id.id).then((res1) => {
      const data = res1.data.data;
      if (res.data.data.method === "TIEN_MAT") {
        setListBillHistory(
          data.filter(
            (item) =>
              item.statusBill !== "CHO_VAN_CHUYEN" &&
              item.statusBill !== "DA_THANH_TOAN"
          )
        );
        setStatusPresent(
          data.filter(
            (item) =>
              item.statusBill !== "CHO_VAN_CHUYEN" &&
              item.statusBill !== "DA_THANH_TOAN"
          ).statusBill
        );
      } else {
        setListBillHistory(
          data.filter((item) => item.statusBill !== "CHO_VAN_CHUYEN")
        );
        setStatusPresent(
          data.filter((item) => item.statusBill !== "CHO_VAN_CHUYEN").statusBill
        );
      }
    });
  });
    BillClientApi.getBillById(id.id).then((res) => {
      setBill(res.data.data);
    });
    
  }, []);
  const formatMoney = (price) => {
    return (
      parseInt(price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
    );
  };
  return (
    <React.Fragment>
      <div className="bill-detail-account-header">
        <div
          style={{ cursor: "pointer", color: "gray" }}
          onClick={() => nav("/purchase")}
        >
          {" "}
          <FontAwesomeIcon icon={faChevronLeft} /> TRỞ LẠI
        </div>
        <div className="box-code-bill-account">Mã đơn hàng: {bill.code}</div>
        <div>|</div>
        <div className="box-status-bill-account">  {bill.statusBill === "TAO_HOA_DON"
                    ? "Tạo Hóa đơn"
                    : bill.statusBill === "CHO_XAC_NHAN"
                    ? "Chờ xác nhận"
                    : bill.statusBill === "XAC_NHAN"
                    ? "Xác nhận"
                    : bill.statusBill === "CHO_VAN_CHUYEN"
                    ? "Chờ vận chuyển"
                    : bill.statusBill === "VAN_CHUYEN"
                    ? "Đang vận chuyển"
                    : bill.statusBill === "DA_THANH_TOAN"
                    ? "Đã thanh toán"
                    : bill.statusBill === "THANH_CONG"
                    ? "Thành công"
                    : bill.statusBill === "TRA_HANG"
                    ? "Trả hàng"
                    : "Đã hủy"}</div>
      </div>
      <div style={{ borderBottom: "1px solid rgb(224, 224, 224)",maxWidth:"890px" }}>
        <Timeline
          minEvents={statusPresent !== 5 ? 4 : 1}
          style={{ borderBottom: "1px solid rgb(224, 224, 224)" }}
          placeholder
        >
          {listBillHistory.map((item) => (
            <TimelineEvent
              style={{ width: "50px", height: "50px", fontSize: "12px" }}
              color={
                item.statusBill !== "DA_HUY" && item.statusBill !== "TRA_HANG"
                  ? "#0099FF"
                  : "#FF0000"
              }
              icon={showIcon(item.statusBill)}
              title={
                item.statusBill === "CHO_XAC_NHAN"
                  ? "Đơn hàng đã đặt"
                  : item.statusBill === "XAC_NHAN"
                  ? paymentMethod.method === "TIEN_MAT"
                    ? "Đã xác nhận thông tin thanh toán"
                    : `Đã thanh toán ${formatMoney(bill.totalMoney)}`
                  : item.statusBill === "VAN_CHUYEN"
                  ? "Đã giao cho ĐVVC"
                  : item.statusBill === "DA_THANH_TOAN"
                  ? paymentMethod.method === "TIEN_MAT"
                    ? "Đã nhận được hàng"
                    : "Đơn hàng đã đặt"
                  : item.statusBill === "THANH_CONG"
                  ? "Thành công"
                  : "Đã hủy"
              }
              subtitle={dayjs(item.createdDate).format("HH:mm:ss DD-MM-YYYY")}
            />
          ))}
        </Timeline>
      </div>
      <div className="box-address-bill-account">
        <h2 style={{ marginBottom: 10 }}>Địa chỉ nhận hàng</h2>
        <div style={{ marginBottom: 10 }}>{bill.userName}</div>
        <div className="phone-bill-account">{bill.phoneNumber}</div>
        <div className="phone-bill-account">{bill.address}</div>
      </div>
      <div className="box-payment-bill-account">
        <h2>Thanh toán</h2>
        <ul>
          <li className="line-payment-bill-account">
            <div className="text-payment-bill-account">Tổng tiền hàng:</div>{" "}
            <div className="value-payment-bill-account">
              {formatMoney(bill.totalMoney)}
            </div>
          </li>
          <li className="line-payment-bill-account">
            <div className="text-payment-bill-account">Phí vận chuyển:</div>{" "}
            <div className="value-payment-bill-account">
              {formatMoney(bill.moneyShip)}
            </div>
          </li>
          <li className="line-payment-bill-account">
            <div className="text-payment-bill-account">
              Voucher của cửa hàng:
            </div>{" "}
            <div className="value-payment-bill-account">
              - {formatMoney(bill.itemDiscount)}
            </div>
          </li>
          <li className="line-payment-bill-account">
            <div className="text-total-bill-account">Thành tiền:</div>{" "}
            <div className="value-total-bill-account">
              {formatMoney(
                bill.totalMoney + bill.moneyShip - bill.itemDiscount
              )}
            </div>
          </li>
        </ul>
      </div>
      <div className="payment-method-bill-account">
        {" "}
        <h3 style={{ marginRight: 20 }}>Phương thức thanh toán:</h3>{" "}
        <div>
          {" "}
          {paymentMethod.method === "TIEN_MAT"
            ? "Thanh toán khi nhận hàng"
            : "Chuyển khoản VNpay"}
        </div>{" "}
      </div>
    </React.Fragment>
  );
}

export default BillDetailAccount;
