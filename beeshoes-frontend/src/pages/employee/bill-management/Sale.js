import { PlusOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Modal, Row, Tabs } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { BillApi } from "../../../api/employee/bill/bill.api";
import { useAppDispatch } from "../../../app/hook";
import {
  addBillAtCounTer,
  addBillWait,
  getAllBillWait,
  updateKeyBillAtCounter,
} from "../../../app/reducer/Bill.reducer";
import CreateBill from "./CreateBill";
import "./sale.css";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

function Sale() {
  const [invoiceNumber, setInvoiceNumber] = useState(0);

  const [activeKey, setActiveKey] = useState(0);
  const [changeTab, setChangTab] = useState();
  const [dataKey, setDataKey] = useState([]);
  const items = useSelector((state) => state.bill.billWaits.value);
  // console.log(items);
  const newTabIndex = useRef(1);
  const dispatch = useAppDispatch();

  const onChange = (key) => {
    setActiveKey(key);
    setChangTab(key);
    dispatch(updateKeyBillAtCounter(key));
  };
  var [quantityNotify, setQuantityNotify] = useState([]);
  const addNotify = (notify) => {
    var index = quantityNotify.findIndex((item) => item.code === notify.code);
    if (index != -1) {
      var data = quantityNotify;
      data.splice(index, 1, notify);
      setQuantityNotify(data);
    }
  };
  useEffect(() => {
    BillApi.fetchAllBillAtCounter().then((res) => {
      if (res.data.data.length == 0) {
        BillApi.getCodeBill().then((res) => {
          const newActiveKey = `${newTabIndex.current}`;
          setActiveKey(newActiveKey);
          setInvoiceNumber(1);
          dispatch(
            getAllBillWait([
              ...items,
              {
                label: newTabIndex.current++,
                id: res.data.data.id,
                code: res.data.data.code,
                invoiceNumber: 1,
                key: newActiveKey,
              },
            ])
          );
          dispatch(addBillAtCounTer(`Hóa đơn ${newTabIndex.current}`));
          setInvoiceNumber(invoiceNumber + 1);
          setDataKey([...dataKey, res.data.data.code]);
        });
      } else {
        setInvoiceNumber(res.data.data.length);
        const defaultPanes = res.data.data.map((item, index) => {
          const id = String(index + 1);
          setDataKey([...dataKey, item.code]);
          const newActiveKey = `${newTabIndex.current}`;
          return {
            label: newTabIndex.current++,
            id: item.id,
            code: item.code,
            invoiceNumber: 1,
            key: newActiveKey,
          };
        });
        const dataNotify = res.data.data.map((item, index) => {
          return {
            code: item.code,
            quantity: 0,
          };
        });
        setQuantityNotify(dataNotify);
        dispatch(getAllBillWait(defaultPanes));
        setActiveKey("1");
      }
      const code = localStorage.getItem("code");
      if (code == null || code == " " || code == undefined) {
        localStorage.setItem("code", " ");
      } else {
        const targetIndex = items.findIndex((pane) => pane.code === code);
        if (targetIndex != -1) {
          const newPanes = items.filter((pane) => pane.code !== code);
          if (newPanes.length > 0 && targetIndex >= 0) {
            const { key } =
              newPanes[
                targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
              ];
            setActiveKey(key);
            setChangTab(key);
            dispatch(updateKeyBillAtCounter(key));
            dispatch(getAllBillWait(newPanes));
          }
        } else {
          localStorage.setItem("code", " ");
        }
      }
    });
  }, []);

  const add = (e) => {
    if (items.length >= 10) {
      toast.warning(`Không thể tạo thêm hóa đơn`);
    } else {
      BillApi.getCodeBill().then((res) => {
        setDataKey([...dataKey, res.data.data.code]);
        const newActiveKey = `${newTabIndex.current}`;
        dispatch(
          addBillWait({
            label: newTabIndex.current++,
            id: res.data.data.id,
            code: res.data.data.code,
            invoiceNumber: 1,
            key: newActiveKey,
          })
        );
        const dataNotify = quantityNotify;
        quantityNotify.push({
          code: res.data.data.code,
          quantity: 0,
        });
        setQuantityNotify(dataNotify);
        dispatch(addBillAtCounTer(`Hóa đơn ${newTabIndex.current}`));
        setActiveKey(newActiveKey);
        setChangTab(newActiveKey);
        setInvoiceNumber(invoiceNumber + 1);
        dispatch(updateKeyBillAtCounter(newActiveKey));
      });
    }
  };

  const remove = (targetKey, invoiceNumbers, items) => {
    if (items.length > 1) {
      const targetIndex = items.findIndex((pane) => pane.key === targetKey);
      const newPanes = items.filter((pane) => pane.key !== targetKey);
      console.log(newPanes);
      if (newPanes.length > 0 && targetIndex >= 0) {
        const { key } =
          newPanes[
            targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
          ];
        setActiveKey(key);
        setChangTab(key);
        dispatch(updateKeyBillAtCounter(key));
        dispatch(getAllBillWait(newPanes));
      }
      // dispatch(deleteBillWait(targetIndex));
      console.log();
      setInvoiceNumber(invoiceNumber - 1);
    } else {
      dispatch(getAllBillWait([]));

      BillApi.getCodeBill().then((res) => {
        const newActiveKey = `${newTabIndex.current}`;
        dispatch(
          addBillWait({
            label: newTabIndex.current++,
            id: res.data.data.id,
            code: res.data.data.code,
            invoiceNumber: 1,
            key: newActiveKey,
            code: res.data.data.code,
          })
        );
        dispatch(addBillAtCounTer(`Hóa đơn ${newTabIndex.current}`));
        setActiveKey(newActiveKey);
        const dataNotify = quantityNotify;
        quantityNotify.push({
          code: res.data.data.code,
          quantity: 0,
        });
        setQuantityNotify(dataNotify);
        setChangTab(newActiveKey);
        setInvoiceNumber(invoiceNumber + 1);
        dispatch(updateKeyBillAtCounter(newActiveKey));
      });
    }
  };
  const onEdit = (targetKey, action) => {
    if (action === "add") {
      add();
    } else {
      remove(activeKey, invoiceNumber, items);
    }
  };
  console.log(items);
  return (
    <div>
      <Row style={{ background: "white", width: "100%" }}>
        <Row style={{ width: "100%", marginTop: "10px" }}>
          <Col span={12}></Col>
          <Col span={12} align={"end"}>
            <Button
              type="primary"
              onClick={(e) => add(e)}
              icon={<PlusOutlined />}
              size={"large"}
              style={{ marginRight: "5%", marginTop: "30px" }}
            >
              Tạo hóa đơn
            </Button>
          </Col>
        </Row>
        <Row style={{ width: "100%", marginTop: "20px" }}>
          <Tabs
            hideAdd
            onChange={onChange}
            activeKey={activeKey}
            style={{ width: "100%", marginLeft: "10px" }}
            type="editable-card"
            onEdit={onEdit}
            items={items.map((item) => {
              var index = quantityNotify.findIndex(
                (notify) => notify.code == item.code
              );
              console.log(index);
              return {
                label: (
                  <Badge
                    count={index != -1 ? quantityNotify[index]?.quantity : null}
                  >
                    <span> {"Hóa đơn " + item?.label}</span>
                  </Badge>
                ),
                key: item.key,
                children: (
                  <CreateBill
                    code={item.code}
                    key={item.label}
                    id={item.id}
                    style={{ width: "100%" }}
                    invoiceNumber={1}
                    removePane={remove}
                    targetKey={item.key}
                    addNotify={addNotify}
                  />
                ),
                code: item.code,
              };
            })}
          />
        </Row>
      </Row>
    </div>
  );
}

export default Sale;
