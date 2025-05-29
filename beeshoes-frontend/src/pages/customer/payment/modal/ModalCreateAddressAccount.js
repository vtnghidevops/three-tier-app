import { Checkbox, Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import "./style-modal-create-address.css";
import { AddressClientApi } from "../../../../api/customer/address/addressClient.api";
import { dispatch } from "../../../../app/store";
import { CreateAddressAccountClient } from "../../../../app/reducer/AddressAccountClient.reducer";
import { toast } from "react-toastify";
function ModalCreateAddressAccount({
  modalAddressAccount,
  setModalAddressAccount,
  getAddressDefault,
}) {
  const [formAdd, setFormAdd] = useState({
    idAccount: sessionStorage.getItem("idAccount"),
    status: "DANG_SU_DUNG"
  });
  const [formErrors, setFormErrors] = useState({});
  const [listCity, setListCity] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    console.log(formAdd);
  }, [formAdd]);
  useEffect(() => {
    getCities();
  }, []);
  const closeModalCreate = () => {
    setFormAdd({
      idAccount: sessionStorage.getItem("idAccount"),
      status: "DANG_SU_DUNG",
    });
    setFormErrors({});
    setModalAddressAccount(false);
    setIsChecked(false);
    getAddressDefault(sessionStorage.getItem("idAccount"));
  };
  const formAddChange = (name, value) => {
    setFormAdd((prevFormBill) => ({
      ...prevFormBill,
      [name]: value,
    }));
    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: "",
    }));
  };

  const getCities = () => {
    AddressClientApi.getAllProvince().then(
      (res) => {
        setListCity(res.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const provinceChange = (value) => {
    if (value === "") {
      setListDistrict([]);
      setListWard([]);
      formAddChange("district", undefined);
      formAddChange("districtId", "");
      formAddChange("ward", undefined);
      formAddChange("wardCode", "");
    } else {
      AddressClientApi.getAlldistrict(value).then(
        (res) => {
          setListDistrict(res.data.data);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };

  const districtChange = (name, value) => {
    if (value === "") {
      formAddChange("ward", undefined);
      formAddChange("wardCode", "");
      setListWard([]);
    } else {
      AddressClientApi.getAllWard(value).then(
        (res) => {
          setListWard(res.data.data);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
  const handleCreateAddressClient = (form) => {
    const phoneNumberPattern =
      /^(03[2-9]|05[6-9]|07[0-9]|08[1-9]|09[0-9])[0-9]{7}$/;
    const isFormValid =
      formAdd.fullName &&
      formAdd.phoneNumber &&
      phoneNumberPattern.test(formAdd.phoneNumber) &&
      formAdd.line &&
      formAdd.province &&
      formAdd.district &&
      formAdd.ward;

    if (!isFormValid) {
      const errors = {
        fullName: !formAdd.fullName ? "Nhập họ tên" : "",
        phoneNumber: !formAdd.phoneNumber
          ? "Nhập số điện thoại"
          : !phoneNumberPattern.test(formAdd.phoneNumber)
            ? "Nhập đúng định dạng"
            : "",
        province:
          formAdd.province === undefined || !formAdd.province
            ? "Chọn tỉnh/thành phố"
            : "",
        district:
          formAdd.district === undefined || !formAdd.district
            ? "Chọn quận/huyện"
            : "",
        ward:
          formAdd.ward === undefined || !formAdd.ward ? "Chọn phường/xã" : "",
        line: !formAdd.line ? "Nhập địa chỉ cụ thể" : "",
      };
      setFormErrors(errors);
      return;
    }
    const add = { ...form, status: "DANG_SU_DUNG" };
    AddressClientApi.createAddressClient(add).then((res) => {
      dispatch(CreateAddressAccountClient(res.data.data));
      toast.success("Thêm mới địa chỉ thành công");
      closeModalCreate();
    });
  };

  return (
    <React.Fragment>
      <Modal
        open={modalAddressAccount}
        onCancel={closeModalCreate}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        style={{ textAlign: "center" }}
        width={600}
      >
        <h2>Thêm mới địa chỉ</h2>
        <Form layout="vertical" style={{ marginTop: 30, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Form.Item
              style={{ textAlign: "left" }}
              validateStatus={formErrors["fullName"] ? "error" : ""}
              help={formErrors["fullName"] || ""}
            >
              <input
                placeholder="Họ và tên"
                value={formAdd["fullName"] || ""}
                className="input-create-address-account"
                onChange={(e) => formAddChange("fullName", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              style={{ marginLeft: "auto", textAlign: "left" }}
              validateStatus={formErrors["phoneNumber"] ? "error" : ""}
              help={formErrors["phoneNumber"] || ""}
            >
              <input
                placeholder="Số điện thoại"
                value={formAdd["phoneNumber"] || ""}
                className="input-create-address-account"
                onChange={(e) => formAddChange("phoneNumber", e.target.value)}
              />
            </Form.Item>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "left",
            }}
          >
            <Form.Item
              style={{ marginRight: 10 }}
              validateStatus={formErrors["province"] ? "error" : ""}
              help={formErrors["province"] || ""}
            >
              <select
                className="select-create-address-address"
                value={`${formAdd["provinceId"]}|${formAdd["province"]}`}
                onChange={(e) => {
                  const selectedValue = e.target.value; // Lấy giá trị đã chọn (bao gồm cả ProvinceID và ProvinceName)
                  const [provinceID, provinceName] = selectedValue.split("|"); // Tách giá trị thành ProvinceID và ProvinceName
                  // Bây giờ bạn có thể sử dụng provinceID và provinceName theo nhu cầu
                  provinceChange(provinceID); // Gọi hàm provinceChange với ProvinceID
                  formAddChange("province", provinceName);
                  formAddChange("provinceId", provinceID);
                }}
              >
                <option value="">Tỉnh/Thành phố</option>
                {listCity.map((item, index) => (
                  <option
                    key={index}
                    value={`${item.ProvinceID}|${item.ProvinceName}`}
                  >
                    {item.ProvinceName}
                  </option>
                ))}
              </select>
            </Form.Item>
            <Form.Item
              style={{ marginRight: 10 }}
              validateStatus={formErrors["district"] ? "error" : ""}
              help={formErrors["district"] || ""}
            >
              <select
                className="select-create-address-address"
                value={`${formAdd["districtId"]}|${formAdd["district"]}`}
                onChange={(e) => {
                  const selectedValue = e.target.value; // Lấy giá trị đã chọn (bao gồm cả ProvinceID và ProvinceName)
                  const [districtID, districtName] = selectedValue.split("|"); // Tách giá trị thành ProvinceID và ProvinceName
                  // Bây giờ bạn có thể sử dụng provinceID và provinceName theo nhu cầu
                  districtChange("district", districtID); // Gọi hàm provinceChange với ProvinceID
                  formAddChange("district", districtName);
                  formAddChange("districtId", districtID);
                }}
              >
                <option value="">Quận/Huyện</option>
                {listDistrict.map((item, index) => (
                  <option
                    key={index}
                    value={`${item.DistrictID}|${item.DistrictName}`}
                  >
                    {item.DistrictName}
                  </option>
                ))}
              </select>
            </Form.Item>
            <Form.Item
              validateStatus={formErrors["ward"] ? "error" : ""}
              help={formErrors["ward"] || ""}
            >
              <select
                value={`${formAdd["wardCode"]}|${formAdd["ward"]}`}
                className="select-create-address-address"
                onChange={(e) => {
                  const selectedValue = e.target.value; // Lấy giá trị đã chọn (bao gồm cả ProvinceID và ProvinceName)
                  const [WardCode, WardName] = selectedValue.split("|"); // Tách giá trị thành ProvinceID và ProvinceName
                  // Bây giờ bạn có thể sử dụng provinceID và provinceName theo nhu cầu
                  formAddChange("ward", WardName);
                  formAddChange("wardCode", WardCode);
                }}
              >
                <option value="">Phường/Xã</option>
                {listWard.map((item, index) => (
                  <option
                    key={index}
                    value={`${item.WardCode}|${item.WardName}`}
                  >
                    {item.WardName}
                  </option>
                ))}
              </select>
            </Form.Item>
          </div>

          <Form.Item
            style={{ textAlign: "left" }}
            validateStatus={formErrors["line"] ? "error" : ""}
            help={formErrors["line"] || ""}
          >
            <input
              placeholder="Địa chỉ cụ thế"
              className="input-line-create-address-account"
              value={formAdd["line"] || ""}
              onChange={(e) => formAddChange("line", e.target.value)}
            />
          </Form.Item>

          <div className="box-action-create-address-account">
            <div
              className="buuton-cancel-create-address-account"
              onClick={closeModalCreate}
            >
              Huỷ
            </div>
            <div
              className="buuton-create-address-account"
              onClick={() => handleCreateAddressClient(formAdd)}
            >
              Thêm
            </div>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
}

export default ModalCreateAddressAccount;
