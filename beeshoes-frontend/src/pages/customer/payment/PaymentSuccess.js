import "./style-payment-success.css";
import { useState, useEffect } from "react";
import logo from "./../../../assets/images/logo_client.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BillClientApi } from "./../../../api/customer/bill/billClient.api";
import {
  faSquareCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { PaymentClientApi } from "../../../api/customer/payment/paymentClient.api";
import { CartClientApi } from "../../../api/customer/cart/cartClient.api";
function PayMentSuccess() {
  const idAccount = sessionStorage.getItem("idAccount");
  const urlObject = new URL(window.location.href);
  const vnp_ResponseCode = urlObject.searchParams.get("vnp_ResponseCode");
  const vnp_Amount = urlObject.searchParams.get("vnp_Amount");
  const formBill = JSON.parse(sessionStorage.getItem("formBill"));
  const { updateTotalQuantity } = useCart();
  useEffect(() => {
    if (vnp_ResponseCode === "00") {
      if (formBill !== null) {
        console.log(formBill);
        const params = new URLSearchParams(window.location.search);
        const paramsObj = {};

        // Lặp qua các tham số và gán chúng vào đối tượng JSON.
        params.forEach((value, key) => {
          paramsObj[key] = value;
        });
        formBill.responsePayment = paramsObj;
        onPayment(formBill);
      }
    } else {
      console.log(formBill.billDetail);
      PaymentClientApi.refundQuantityProductDetail(formBill.billDetail);
    }
  }, []);
  const formatMoney = (price) => {
    return (
      parseInt(price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
    );
  };
  const onPayment = (formBill) => {
    if (idAccount !== null) {
      BillClientApi.createBillAccountOnline(formBill).then(
        (res) => {
          CartClientApi.quantityInCart(idAccount).then(
            (res) => {
              updateTotalQuantity(res.data.data);
            },
            (err) => {
              console.log(err);
            }
          );
        },
        (err) => {
          console.log(err);
        }
      );
      sessionStorage.removeItem("formBill");
    } else {
      BillClientApi.createBillOnline(formBill).then(
        (res) => {
          console.log("thanh toán khi nhận hàng!");
          const cartLocal = JSON.parse(localStorage.getItem("cartLocal"));
          const updatelist = cartLocal.filter((item) => {
            // Kiểm tra xem item.idProductDetail có tồn tại trong formBill.billDetail hay không
            return !formBill.billDetail.some(
              (itemBill) => item.idProductDetail === itemBill.idProductDetail
            );
          });
          const total = updatelist.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          updateTotalQuantity(total);
          localStorage.setItem("cartLocal", JSON.stringify(updatelist));
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
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
        {vnp_ResponseCode === "00" ? (
          <div className="content-payment-success">
            <FontAwesomeIcon
              className="icon-payment-success"
              icon={faSquareCheck}
            />
            <h1>Thanh toán thành công</h1>
            <div style={{ marginTop: "5%" }}>
              Tổng thanh toán: {formatMoney(vnp_Amount / 100)}
            </div>
            <Link to="/home">Tiếp tục mua</Link>
          </div>
        ) : (
          <div className="content-payment-success">
            <FontAwesomeIcon
              className="icon-payment-fail"
              icon={faTriangleExclamation}
            />
            <h1>Thanh toán thất bại</h1>
            <div>
              <Link to={idAccount === null ? "/payment" : "/payment-acc"}>
                Thử lại
              </Link>
              <Link style={{ marginLeft: "10px" }} to="/home">
                Tiếp tục mua
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PayMentSuccess;
