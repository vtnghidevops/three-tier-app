import { Checkbox, Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import "./style-modal-update-address.css"
import { AddressClientApi } from "../../../../../api/customer/address/addressClient.api";
import { UpdateAddressAccountClient, UpdateAddressDefaultAccountClient } from "../../../../../app/reducer/AddressAccountClient.reducer";
import { dispatch } from "../../../../../app/store";
import { toast } from "react-toastify";

function ModalUpdateAddress({ modalUpdate, setModalUpdate, id }) {

    const [formUpdate, setFormUpdate] = useState({
        idAccount: sessionStorage.getItem('idAccount'),
        status: "KHONG_SU_DUNG"
    })
    const [formErrors, setFormErrors] = useState({})
    const [listCity, setListCity] = useState([])
    const [listDistrict, setListDistrict] = useState([])
    const [listWard, setListWard] = useState([])
    const [isChecked, setIsChecked] = useState(false)
    useEffect(() => {
        console.log(id);
        if (id !== "") {
            detailAddress(id)
        }
    }, [id]);


    useEffect(() => {
        getCities()
        provinceChange(formUpdate.provinceId)
        districtChange("district",formUpdate.toDistrictId)
    }, [formUpdate])

    
    const detailAddress = (idAddress) => {
        AddressClientApi.detailAddressClient(idAddress).then((res) => {
            setFormUpdate(res.data.data)
        })
    }
    const closeModalUpdate = () => {
        setFormUpdate({
            idAccount: sessionStorage.getItem('idAccount'),
            status: "KHONG_SU_DUNG"
        })
        setFormErrors({})
        setModalUpdate(false)
        setIsChecked(false)
    }
    const formAddChange = (name, value) => {
        setFormUpdate((prevFormBill) => ({
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
            formAddChange("toDistrictId", "");
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
    const handleUpdateAddressClient = (form) => {
        const phoneNumberPattern =
            /^(03[2-9]|05[6-9]|07[0-9]|08[1-9]|09[0-9])[0-9]{7}$/;
        const isFormValid =
            formUpdate.fullName &&
            formUpdate.phoneNumber &&
            phoneNumberPattern.test(formUpdate.phoneNumber) &&
            formUpdate.line &&
            formUpdate.province &&
            formUpdate.district &&
            formUpdate.ward

        if (!isFormValid) {
            const errors = {
                fullName: !formUpdate.fullName ? "Nhập họ tên" : "",
                phoneNumber: !formUpdate.phoneNumber
                    ? "Nhập số điện thoại"
                    : !phoneNumberPattern.test(formUpdate.phoneNumber)
                        ? "Nhập đúng định dạng"
                        : "",
                province:
                    formUpdate.province === undefined || !formUpdate.province
                        ? "Chọn tỉnh/thành phố"
                        : "",
                district:
                    formUpdate.district === undefined || !formUpdate.district
                        ? "Chọn quận/huyện"
                        : "",
                ward:
                    formUpdate.ward === undefined || !formUpdate.ward
                        ? "Chọn phường/xã"
                        : "",
                line: !formUpdate.line ? "Nhập địa chỉ cụ thể" : "",
            };
            setFormErrors(errors);
            return;
        }


        AddressClientApi.updateAddressClient(form).then((res) => {
            dispatch(UpdateAddressAccountClient(res.data.data))
            toast.success("Cập nhập địa chỉ thành công");
            closeModalUpdate()
        })

    };
    return (<React.Fragment>
        <Modal
            open={modalUpdate}
            onCancel={closeModalUpdate}
            okButtonProps={{ style: { display: "none" } }}
            cancelButtonProps={{ style: { display: "none" } }}
            style={{ textAlign: "center", }}
            width={600}
        >
 <h2>Cập nhập địa chỉ</h2>
            <Form
                layout="vertical"
                style={{ marginTop: 30, textAlign: "center" }}
            >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Form.Item
                        style={{ textAlign: "left" }}
                        validateStatus={formErrors["fullName"] ? "error" : ""}
                        help={formErrors["fullName"] || ""}
                    >
                        <input
                            placeholder="Họ và tên"
                            value={formUpdate["fullName"] || ""}
                            className="input-create-address-account" onChange={(e) => formAddChange("fullName", e.target.value)} />

                    </Form.Item>

                    <Form.Item style={{ marginLeft: "auto", textAlign: "left" }}
                        validateStatus={formErrors["phoneNumber"] ? "error" : ""}
                        help={formErrors["phoneNumber"] || ""}
                    >
                        <input placeholder="Số điện thoại"
                            value={formUpdate["phoneNumber"] || ""}
                            className="input-create-address-account"
                            onChange={(e) => formAddChange("phoneNumber", e.target.value)}
                        />
                    </Form.Item>
                </div>

                <div
                    style={{ display: "flex", justifyContent: "center", textAlign: "left" }}
                >
                    <Form.Item
                        style={{ marginRight: 10 }}
                        validateStatus={formErrors["province"] ? "error" : ""}
                        help={formErrors["province"] || ""}
                    >
                        <select
                            className="select-create-address-address"
                            value={`${formUpdate["provinceId"]}|${formUpdate["province"]}`}
                            onChange={(e) => {
                                const selectedValue = e.target.value; // Lấy giá trị đã chọn (bao gồm cả ProvinceID và ProvinceName)
                                const [provinceID, provinceName] =
                                    selectedValue.split("|"); // Tách giá trị thành ProvinceID và ProvinceName
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
                            value={`${formUpdate["toDistrictId"]}|${formUpdate["district"]}`}
                            onChange={(e) => {
                                console.log();
                                const selectedValue = e.target.value; // Lấy giá trị đã chọn (bao gồm cả ProvinceID và ProvinceName)
                                const [districtID, districtName] =
                                    selectedValue.split("|"); // Tách giá trị thành ProvinceID và ProvinceName
                                // Bây giờ bạn có thể sử dụng provinceID và provinceName theo nhu cầu
                                districtChange("district", districtID); // Gọi hàm provinceChange với ProvinceID
                                formAddChange("district", districtName);
                                formAddChange("toDistrictId", districtID);
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
                            value={`${formUpdate["wardCode"]}|${formUpdate["ward"]}`}
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
                    <input placeholder="Địa chỉ cụ thế"
                        className="input-line-create-address-account"
                        value={formUpdate["line"] || ''}
                        onChange={(e) => formAddChange("line", e.target.value)}
                    />
                </Form.Item>
                <div className="box-action-create-address-account">
                    <div className="buuton-cancel-create-address-account" onClick={closeModalUpdate}>Huỷ</div>
                    <div className="buuton-create-address-account" onClick={() => handleUpdateAddressClient(formUpdate)}>Cập nhập</div>
                </div>
            </Form>
        </Modal>
    </React.Fragment>);
}

export default ModalUpdateAddress;