import React, {useEffect, useState} from "react";

import "./style.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { BillClientApi } from "../../../../../api/customer/bill/billClient.api";
import {Button, Form, Modal} from "antd";

export default function TabAllBill({ listBill }) {
  const nav = useNavigate();
  const [modalReason,setModalReason] = useState(false);
  const [reason,setReason] = useState('');
  const [errror,setError] = useState('');
  const [id,setId] = useState('');
  useEffect(() => {
    console.log(reason);
  }, [reason]);
  const formatMoney = (price) => {
    return (
      parseInt(price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
    );
  };

  const cancelBill = ()=>{
    const data={
      "id":id,
      "description":reason
    }
    console.log(data)
    if(reason === ''){
      setError("Vui lòng nhập lý do hủy đơn");
      return;
    }
    BillClientApi.cancelBill(data).then((res)=>{
      toast.success("Hủy đơn thành công")
      window.location.href = "/purchase"
    });
  }
  const openModal = (id)=>{
    setModalReason(true);
    setId(id)
  }
  const closeModal = ()=>{
    setModalReason(false);
    setReason('')
  }

  return (
    <React.Fragment>
      <div>
        {listBill.map((item, index) => (
          <div key={index} className="box-bill-account">
            <div className="header-bill-account">
              <span style={{ marginLeft: "auto", marginBottom: "10px" }}>
                <span
                  className={`trangThai ${" status_" + item.statusBill} `}
                  style={{ borderRadius: "5px" }}
                >
                  {item.statusBill === "TAO_HOA_DON"
                    ? "Tạo Hóa đơn"
                    : item.statusBill === "CHO_XAC_NHAN"
                    ? "Chờ xác nhận"
                    : item.statusBill === "XAC_NHAN"
                    ? "Xác nhận"
                    : item.statusBill === "CHO_VAN_CHUYEN"
                    ? "Chờ vận chuyển"
                    : item.statusBill === "VAN_CHUYEN"
                    ? "Đang vận chuyển"
                    : item.statusBill === "DA_THANH_TOAN"
                    ? "Đã thanh toán"
                    : item.statusBill === "THANH_CONG"
                    ? "Thành công"
                    : item.statusBill === "TRA_HANG"
                    ? "Trả hàng"
                    : "Đã hủy"}
                </span>
              </span>
            </div>

            <div>
              {item.billDetail.map((item, index) => (
                <div key={index} className="content-bill-account">
                  <div className="box-image-bill-account">
                    <img style={{ width: 120 }} src={item.image} alt="..." />
                  </div>
                  <div className="box-detail-product-bill-account">
                    <div className="name-product-bill-account">
                      {item.productName}
                    </div>
                    <div className="size-product-bill-account">
                      {item.nameSize} - {item.nameColor}
                    </div>
                    <div className="quantity">x{item.quantity}</div>
                  </div>
                  <div className="box-total-bill-account">
                    {item.promotion !== null ? (
                      <>
                        <span
                          style={{
                            marginLeft: 10,
                            color: "#ff4400",
                            fontSize: 17,
                          }}
                        >
                          {" "}
                          {formatMoney(
                            item.price - item.price * (item.promotion / 100)
                          )}
                        </span>{" "}
                        <br />
                        <del
                          style={{
                            color: "black",
                            fontSize: 16,
                            marginLeft: 12,
                          }}
                        >
                          {formatMoney(item.price)}
                        </del>
                      </>
                    ) : (
                      formatMoney(item.price)
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="box-total-money-bill-account">
              {" "}
              Thành tiền:{" "}
              <span
                style={{
                  fontSize: 20,
                  color: "#ff4400",
                  marginLeft: 10,
                }}
              >
                {formatMoney(item.totalMoney)}
              </span>
            </div>
            <div className="box-repurchase">
              {item.statusBill === "CHO_XAC_NHAN"  ? (
                <>
                  <div className="repurchase" onClick={()=>openModal(item.id)}>Hủy đơn</div>
                </>
              ) : null}
              {item.statusBill !== "DA_HUY" ? (
                <div
                  className="see-purchase"
                  onClick={() => nav(`/purchase/${item.id}`)}
                >
                  Xem đơn hàng{" "}
                </div>
              ) : (
                <div
                  className="see-purchase"
                  onClick={() => nav(`/purchase/${item.id}`)}
                >
                  Xem chi tiết hủy đơn
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
      open={modalReason}
      // onCancel={closeModal}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      >
        <Form>
          <Form.Item
          label={"Lý do hủy đơn"}
          validateStatus={errror ? "error" : ""}
          help={errror || ""}
          >

            <textarea style={{height:130,width:300,padding:10,fontSize:17}} value={reason} onChange={(e)=>setReason(e.target.value)}/>
          </Form.Item>
          <Form.Item>
            <div style={{ float: "right" }}>
              <Button onClick={closeModal}>Hủy</Button>
              <Button
                  className="button-add-promotion"
                  key="submit"
                  title="Xác nhận hủy đơn"
                  onClick={cancelBill}
                  style={{ marginLeft: "20px" }}
              >
                Xác nhận
              </Button>
            </div>
          </Form.Item>
        </Form>



      </Modal>
    </React.Fragment>
  );
}
