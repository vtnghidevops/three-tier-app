import React, { useEffect, useState } from "react";
import "./style-address.css";
import { AddressClientApi } from "../../../../api/customer/address/addressClient.api";
import {
  GetAddressAccountClient,
  SetAddressAccountClient,
  UpdateAddressDefaultAccountClient,
  DeleteAddressAccountClient,
} from "../../../../app/reducer/AddressAccountClient.reducer";
import { useAppDispatch, useAppSelector } from "../../../../app/hook";
import ModalCreateAddress from "./modal/ModalCreateAddress";
import ModalUpdateAddress from "./modal/ModalUpdateAddress";
import { Modal, Tooltip } from "antd";
function Address() {
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [idAddress, setIdAddress] = useState("");
  const dispatch = useAppDispatch();
  const data = useAppSelector(GetAddressAccountClient);
  useEffect(() => {
    if (data != null) {
      setList(data);
      console.log(data);
    }
  }, [data]);
  const [list, setList] = useState([]);
  const id = sessionStorage.getItem("idAccount");
  useEffect(() => {
    AddressClientApi.getListByAccount(id).then((res) => {
      dispatch(SetAddressAccountClient(res.data.data));
      console.log(res.data.data);
    });
  }, []);
  const setDefault = (id, idAccount) => {
    Modal.confirm({
      title: "Xác nhận đặt mặc định",
      content: "Bạn có chắc chắn muốn đặt mặc định không?",
      okText: "Đặt",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        AddressClientApi.setDefault({ "idAddress":id, "idAccount":idAccount }).then((res) => {
          dispatch(UpdateAddressDefaultAccountClient(res.data.data));
        });
      },
    });
  };
  const deleteAddressClient = (id) => {
    AddressClientApi.deleteAddressClient(id).then((res) => {
      dispatch(DeleteAddressAccountClient(res.data.data));
    });
  };
  const openModalCreate = () => {
    setModalCreate(true);
  };
  const openModalUpdate = (id) => {
    setIdAddress(id);
    setModalUpdate(true);
  };
  return (
    <React.Fragment>
      <div className="address-account-profile">
        <div className="header-new-add">
          <h5 style={{ fontSize: 18 }}>Danh sách địa chỉ</h5>
          <div
            className="button-add-address-account"
            onClick={() => openModalCreate()}
          >
            Thêm mới
          </div>
        </div>
        <div className="list-address-account">
          {list.map((item, index) => (
            <div
              key={index}
              className={
                index < list.length - 1
                  ? "item-address-account"
                  : "item-address-account-last"
              }
            >
              <div>
                <div>
                  <span>{item.fullName}</span>
                  {" | "}
                  <span style={{ color: "gray", fontSize: 15 }}>
                    {" "}
                    {item.phoneNumber}
                  </span>
                </div>
                <div style={{ color: "gray", fontSize: 14, marginTop: 5 }}>
                  <p>{item.line}</p>
                  <p>
                    {item.ward}, {item.district}, {item.province}
                  </p>
                </div>

                {item.status === "DANG_SU_DUNG" ? (
                  <div className="status-default-address-account">Mặc định</div>
                ) : null}
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div
                  style={{
                    color: "#ff4400",
                    display: "flex",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{ marginLeft: "auto", cursor: "pointer" }}
                    onClick={() => openModalUpdate(item.id)}
                  >
                    Cập nhập
                  </div>
                  {item.status !== "DANG_SU_DUNG" ? (
                    <div
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      onClick={() => deleteAddressClient(item.id)}
                    >
                      Xoá
                    </div>
                  ) : null}
                </div>
                {item.status !== "DANG_SU_DUNG" ? (
                  <Tooltip title="Thiết lập mặc định">
                    <div
                      className="add-default-address-account"
                      onClick={() => setDefault(item.id, id)}
                    >
                      Thiết lập mặc định
                    </div>
                  </Tooltip>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ModalCreateAddress
        modalCreate={modalCreate}
        setModalCreate={setModalCreate}
      />
      <ModalUpdateAddress
        modalUpdate={modalUpdate}
        setModalUpdate={setModalUpdate}
        id={idAddress}
      />
    </React.Fragment>
  );
}

export default Address;
