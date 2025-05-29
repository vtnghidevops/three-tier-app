import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import TabAllBill from "./tabscontent/TabAllBill";

import { BillClientApi } from "../../../../api/customer/bill/billClient.api";

export default function Purchase() {
  const [listBill, setListBill] = useState([]);
  const id = sessionStorage.getItem("idAccount");
  const [key, setKey] = useState("1");
  const keyToStatusMapping = {
    1: "",
    2: "CHO_XAC_NHAN",
    3: "CHO_VAN_CHUYEN",
    4: "VAN_CHUYEN",
    5: "THANH_CONG",
    6: "DA_HUY",
  };

  useEffect(() => {
    console.log(key);
    const status = keyToStatusMapping[key] || "";
    BillClientApi.getBillAccount({ id: id, status }).then((res) => {
      const data = res.data.data;
      const promises = data.map((item) => {
        return BillClientApi.fetchAllBillDetailByIdBill(item.id).then(
          (res) => ({
            id: item.id,
            totalMoney: item.totalMoney,
            statusBill: item.statusBill,
            billDetail: res.data.data,
          })
        );
      });

      Promise.all(promises).then((results) => {
        setListBill(results);
      });
    });
  }, [key]);
  useEffect(() => {
    console.log(listBill);
  }, [listBill]);
  const onChange = (key) => {
    setKey(key);
    console.log(key);
  };
  return (
    <>
      <div style={{ padding: 20 }}>
        <Tabs onChange={onChange} type="card">
          <Tabs.TabPane tab="Tất cả" key="1">
            <TabAllBill listBill={listBill} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Chờ xác nhận" key="2">
            <TabAllBill listBill={listBill} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Chờ vận chuyển" key="3">
            <TabAllBill listBill={listBill} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Vận chuyển" key="4">
            <TabAllBill listBill={listBill} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Hoàn thành" key="5">
            <TabAllBill listBill={listBill} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đã hủy" key="6">
            <TabAllBill listBill={listBill} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
}
