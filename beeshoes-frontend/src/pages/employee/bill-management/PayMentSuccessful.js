import {
  faSquareCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PaymentsMethodApi } from "../../../api/employee/paymentsmethod/PaymentsMethod.api";
import logo from "./../../../assets/images/logo_client.png";
import "./style-payment-success.css";
import { Button } from "antd";
import { toast } from "react-toastify";
import { BillApi } from "../../../api/employee/bill/bill.api";
import { useReactToPrint } from "react-to-print";

const getUrlVars = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const parameters = {};
  for (const [key, value] of urlParams.entries()) {
    if (key === "vnp_TxnRef" || key === "vnp_TransactionStatus") {
      parameters[key] = value;
    }
  }
  return parameters;
};

const saveToLocalStorage = (parameters) => {
  localStorage.setItem("parameters", JSON.stringify(parameters));
};

const fetchData = () => {
  const parameters = getUrlVars();
  saveToLocalStorage(parameters);
};

const getTransactionStatus = () => {
  const urlParams = new URLSearchParams(window.location.search);
  var parameters = "";
  for (const [key, value] of urlParams.entries()) {
    if (key === "vnp_TransactionStatus") {
      parameters = value;
    }
  }
  return parameters;
};

const getAmount = () => {
  const urlParams = new URLSearchParams(window.location.search);
  var parameters = "";
  for (const [key, value] of urlParams.entries()) {
    if (key === "vnp_Amount") {
      parameters = value;
    }
  }
  return parameters;
};

function PayMentSuccessful() {
  getUrlVars();
  console.log(new URLSearchParams(window.location.search));
  const [status, setStatus] = useState();
  const [amount, setAmount] = useState();
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };

  const generatePDF = useReactToPrint({
    content: () => document.getElementById("pdfContent"),
    documentTitle: "Userdata",
    onAfterPrint: () => {},
  });
  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    fetchData();
    setStatus(getTransactionStatus());
    setAmount(getAmount());
    PaymentsMethodApi.checkPaymentVnPay(param)
      .then((res) => {
        setLoadLink(false);
        BillApi.fetchHtmlIdBill(param.get("vnp_TxnRef").split("-")[0], 0).then(
          (res) => {
            document.getElementById("pdfContent").innerHTML = res.data.data;
            generatePDF();
          }
        );
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []);

  const [loadLink, setLoadLink] = useState(true);

  return (
    <>
      <div className="header-payment-success">
        <img className="logo-payment-success" src={logo} alt="logo" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {status == "00" ? (
          <div className="content-payment-success">
            <FontAwesomeIcon
              className="icon-payment-success"
              icon={faSquareCheck}
            />
            <h1>Thanh toán thành công</h1>
            <div style={{ marginTop: "5%" }}>
              Tổng thanh toán: {formatCurrency(amount / 100)}
            </div>
            <Button
              disabled={loadLink}
              style={{
                border: "none",
                backgroundColor: "#f5f5dc00",
                color: loadLink ? "#ccc" : "#1677ff",
              }}
            >
              <Link to="/sale-counter">Tiếp tục bán hàng</Link>
            </Button>
          </div>
        ) : (
          <div className="content-payment-success">
            <FontAwesomeIcon
              className="icon-payment-fail"
              icon={faTriangleExclamation}
            />
            <h1>Thanh toán thất bại</h1>
            <div>
              <Button
                disabled={loadLink}
                style={{
                  border: "none",
                  backgroundColor: "#f5f5dc00",
                  color: loadLink ? "#ccc" : "#1677ff",
                }}
              >
                <Link to="/sale-counter">Tiếp tục bán hàng</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: "none" }}>
        <div id="pdfContent" />
      </div>
    </>
  );
}

export default PayMentSuccessful;
