import { Button, Col, Modal, Row, Tabs } from "antd";
import React, { useState } from "react";
import TabBillDetail from "./TabBillDetail";
import "./tabBillDetail.css";

function ManagerBillDetail({ id, status }) {
  const listtab = [null, "THANH_CONG", "TRA_HANG"];
  const convertString = (key) => {
    return key === null
      ? "Tất cả sản phẩm"
      : key === "THANH_CONG"
      ? "Sản phẩm mua thành công"
      : "Sản phẩm trả hàng";
  };

  return (
    <Row style={{ width: "100%" }}>
      {status !== "TRA_HANG" ? (
            <TabBillDetail
              style={{ width: "100%" }}
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
                  style={{ width: "100%" }}
                  dataBillDetail={{ idBill: id, status: item }}
                />
              ),
            };
          })}
        />
      )}
     
    </Row>
  );
}

export default ManagerBillDetail;
