import React from "react";
import { Content } from "antd/es/layout/layout";
import PolicyProduct from "./model/PolicyProduct";
import PolicySecurity from "./model/PolicySecurity";
import PolicyVNPay from "./model/PolicyVNPay";
import PolicyCustomer from "./model/PolicyCustomer";
import PoinCustomer from "./model/PoinCustomer";
import PaymentPolicy from "./model/PaymentPolicy";
import CustomerObligations from "./model/CustomerObligations";
import EmployeeObligations from "./model/EmployeeObligations";
import Giveback from "./model/GiveBack";

function ContentDisplay({ selectedItem }) {
  let content = 5;

  switch (selectedItem) {
    case "4":
      content = <Giveback />;
      break;
    case "5":
      content = <PolicyProduct />;
      break;
    case "6":
      content = <PolicySecurity />;
      break;
    case "7":
      content = <PolicyVNPay />;
      break;
    case "8":
      content = <PolicyCustomer />;
      break;
    case "9":
      content = <PaymentPolicy />;
      break;
    case "10":
      content = "Content for Điều khoản dịch vụ";
      break;
    case "11":
      content = "Content for Chính sách vận chuyển";
      break;
    case "12":
      content = "Content for Các điều khoản khác";
      break;
    case "13":
      content = "Content for Hạn chế về thời gian và pháp lý";
      break;
    case "14":
      content = <CustomerObligations />;
      break;
    case "15":
      content = <EmployeeObligations />;
      break;
    case "16":
      content = <PoinCustomer />;
      break;
    default:
      content = "Select an item from the menu";
  }

  return <Content>{content}</Content>;
}

export default ContentDisplay;
