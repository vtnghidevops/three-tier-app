import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button, Form, Popconfirm } from "antd";
import { useAppDispatch } from "../../../../app/hook";
import { toast } from "react-toastify";

import { CreateAddress } from "../../../../app/reducer/Address.reducer";
import { AddressClientApi } from "../../../../api/customer/address/addressClient.api";

const { Option } = Select;

const ModalCreateAddress = ({ visible, onCancel, id }) => {
  const [form] = Form.useForm();
  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);
  const dispatch = useAppDispatch();

  // Trong hàm handleOk, chúng ta gọi form.validateFields() để kiểm tra và lấy giá trị
  // hàm onCreate để xử lý dữ liệu
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.setFieldsValue({ userId: id });
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có đồng ý thêm không?",
            okText: "Đồng ý",
            cancelText: "Hủy",
            onOk: () => resolve(values),
            onCancel: () => reject(),
          });
        });
      })
      .then((values) => {
        AddressClientApi.create(values)
          .then((res) => {
            dispatch(CreateAddress(res.data.data));
            toast.success("Thêm thành công");
            onCancel();
            form.resetFields();
          })
          .catch((error) => {
            toast.error(error.response.data.message);
            console.log("Create failed:", error);
          });
      })
      .catch(() => { });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const loadDataProvince = () => {
    AddressClientApi.fetchAllProvince().then(
      (res) => {
        setListProvince(res.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const handleProvinceChange = (value, valueProvince) => {
    form.setFieldsValue({ provinceId: valueProvince.valueProvince });
    AddressClientApi.fetchAllProvinceDistricts(valueProvince.valueProvince).then(
      (res) => {
        setListDistricts(res.data.data);
      }
    );
  };

  const handleDistrictChange = (value, valueDistrict) => {
    form.setFieldsValue({ toDistrictId: valueDistrict.valueDistrict });
    AddressClientApi.fetchAllProvinceWard(valueDistrict.valueDistrict).then((res) => {
      setListWard(res.data.data);
    });
  };

  const handleWardChange = (value, valueWard) => {
    form.setFieldsValue({ wardCode: valueWard.valueWard });
  };

  useEffect(() => {
    loadDataProvince();
  }, []);

  return (
    <Modal
      key="add"
      title="Thêm địa chỉ"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Thêm
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          userId: id,
        }}
      >   <Form.Item
        label="Họ và tên"
        name="fullName"
        rules={[
          { required: true, message: "Vui lòng nhập họ tên" },
        ]}
      >
          <Input placeholder="Họ và tên" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
          ]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>
        <Form.Item
          label="Tỉnh/Thành phố"
          name="province"
          rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành phố" }]}
        >
          <Select defaultValue="" onChange={handleProvinceChange}>
            <Option value="">--Chọn Tỉnh/Thành phố--</Option>
            {listProvince?.map((item) => {
              return (
                <Option
                  key={item.ProvinceID}
                  value={item.ProvinceName}
                  valueProvince={item.ProvinceID}
                >
                  {item.ProvinceName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Quận/Huyện"
          name="district"
          rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện" }]}
        >
          <Select defaultValue=" " onChange={handleDistrictChange}>
            <Option value=" ">--Chọn Quận/Huyện--</Option>
            {listDistricts?.map((item) => {
              return (
                <Option
                  key={item.DistrictID}
                  value={item.DistrictName}
                  valueDistrict={item.DistrictID}
                >
                  {item.DistrictName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Xã/Phường"
          name="ward"
          rules={[{ required: true, message: "Vui lòng chọn Xã/Phường" }]}
        >
          <Select defaultValue="" onChange={handleWardChange}>
            <Option value="">--Chọn Xã/Phường--</Option>
            {listWard?.map((item) => {
              return (
                <Option
                  key={item.WardCode}
                  value={item.WardName}
                  valueWard={item.WardCode}
                >
                  {item.WardName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Số nhà/Ngõ/Đường"
          name="line"
          rules={[
            { required: true, message: "Vui lòng nhập số nhà/ngõ/đường" },
          ]}
        >
          <Input placeholder="Số nhà/Ngõ/Đường" />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status" hidden>
          <Select defaultValue="DANG_SU_DUNG">
            <Option value="DANG_SU_DUNG">Mặc định</Option>
            <Option value="KHONG_SU_DUNG">Không sử dụng</Option>
          </Select>
        </Form.Item>
        <Form.Item style={{ marginTop: "40px" }} name="userId" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item style={{ marginTop: "40px" }} name="toDistrictId" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item style={{ marginTop: "40px" }} name="provinceId" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item style={{ marginTop: "40px" }} name="wardCode" hidden>
          <Input disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateAddress;
