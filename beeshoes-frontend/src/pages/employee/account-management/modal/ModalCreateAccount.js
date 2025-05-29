import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Select,
  Button,
  Form,
  Row,
  Col,
  Upload,
  message,
  Radio,
} from "antd";
import { useAppDispatch } from "../../../../app/hook";
import { toast } from "react-toastify";
import { AccountApi } from "../../../../api/employee/account/account.api";
import { CreateAccount } from "../../../../app/reducer/Account.reducer";
import "../style-staff.css";
import moment from "moment";
import { AddressApi } from "../../../../api/customer/address/address.api";
import { useNavigate } from "react-router";
import { PlusOutlined, CameraOutlined } from "@ant-design/icons";
import ModalQRScanner from "./ModalQRScanner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
const { Option } = Select;

const ModalCreateAccount = () => {
  const [form] = Form.useForm();
  const [listProvince, setListProvince] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWard, setListWard] = useState([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [qrCodeData, setQRCodeData] = useState("");

  // ảnh
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleCancelImagel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ file }) => {
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast.error("Bạn chỉ có thể tải lên tệp JPG/PNG!");
      return;
    }
    setUploadedFile(file);
    if (file.status === "removed") {
      // Nếu tệp bị xóa, đặt giá trị uploadedFile về null
      setUploadedFile(null);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const handleScan = (qrData) => {
    setQRCodeData(qrData);
    const qrDataArray = qrData.split("|");
    const citizenIdentity = qrDataArray[0];
    const fullName = qrDataArray[2];
    const dateOfBirth = moment(qrDataArray[3], "DDMMYYYY").format("YYYY-MM-DD");
    const gender = qrDataArray[4];

    form.setFieldsValue({
      citizenIdentity: citizenIdentity,
      fullName: fullName,
      dateOfBirth: dateOfBirth,
      gender: gender === "Nữ" ? "false" : "true",
    });

    setQrScannerVisible(false);
  };
  const loadDataProvince = () => {
    AddressApi.fetchAllProvince().then(
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
    AddressApi.fetchAllProvinceDistricts(valueProvince.valueProvince).then(
      (res) => {
        setListDistricts(res.data.data);
      }
    );
  };

  const handleDistrictChange = (value, valueDistrict) => {
    form.setFieldsValue({ toDistrictId: valueDistrict.valueDistrict });
    AddressApi.fetchAllProvinceWard(valueDistrict.valueDistrict).then((res) => {
      console.log(res.data.data);
      setListWard(res.data.data);
    });
  };

  const handleWardChange = (value, valueWard) => {
    form.setFieldsValue({ wardCode: valueWard.valueWard });
  };
  useEffect(() => {
    loadDataProvince();
  }, []);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
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
        const formattedDate = moment(
          values.dateOfBirth,
          "YYYY-MM-DD"
        ).valueOf();
        const updatedValues = { ...values, dateOfBirth: formattedDate };
        if (uploadedFile == null) {
          toast.error("Bạn cần thêm ảnh đai diện ");
        } else {
          const formData = new FormData();
          formData.append(`multipartFile`, uploadedFile.originFileObj);
          formData.append(`request`, JSON.stringify(updatedValues));
          console.log(values);
          console.log(formData);
          AccountApi.create(formData)
            .then((res) => {
              dispatch(CreateAccount(res.data.data));
              toast.success("Thêm thành công");
              navigate("/staff-management");
            })
            .catch((error) => {
              console.log("Create failed:", error);
            });
        }
      })
      .catch(() => {
        // Xử lý khi người dùng từ chối xác nhận
      });
  };

  const handleCancel = () => {
    navigate("/staff-management");
  };
  const validateAge = (rule, value) => {
    if (value) {
      const currentDate = new Date();
      const selectedDate = new Date(value);
      const ageDifference =
        currentDate.getFullYear() - selectedDate.getFullYear();

      if (ageDifference < 18) {
        return Promise.reject("Phải đủ 18 tuổi trở lên");
      }
    }
    return Promise.resolve();
  };
  return (
    <div>
      <div
        className="content-wrapper"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "25px",
            fontWeight: "bold",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        >
          THÊM NHÂN VIÊN
        </span>
      </div>
      <Row gutter={[24, 8]}>
        <Col className="filter" span={6}>
          <div>
            <h1
              style={{
                marginTop: "50px",
                marginBottom: "50px",
                fontSize: "20px",
                marginLeft: "31%",
              }}
            >
              Ảnh đại diện
            </h1>
          </div>
          <Row>
            <Col span={1}></Col>
            <Col span={12}>
              <div className="image-preview" style={{ marginLeft: "20%" }}>
                <Upload
                  listType="picture-circle"
                  fileList={uploadedFile ? [uploadedFile] : []}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  customRequest={({ file, onSuccess }) => {
                    onSuccess(file);
                  }}
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                    showErrorTips: true,
                  }}
                >
                  {uploadedFile ? null : uploadButton}
                </Upload>
                <Modal
                  open={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancelImagel}
                >
                  <img
                    alt="example"
                    style={{
                      width: "100%",
                    }}
                    src={previewImage}
                  />
                </Modal>
              </div>
            </Col>
          </Row>
        </Col>

        <Col className="filter" span={17} style={{ marginLeft: "20px" }}>
          <h1
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "15px",
              fontSize: "20px",
            }}
          >
            Thông tin nhân viên
          </h1>
          <Form form={form} layout="vertical">
            <div className="title_add">
              <Row gutter={[24, 8]}>
                <Col span={10} style={{ marginLeft: "auto" }}>
                  <div>
                    <Button
                      className="btn_filter"
                      icon={<FontAwesomeIcon icon={faQrcode} />}
                      onClick={() => setQrScannerVisible(true)}
                      style={{ marginLeft: "160px" }}
                    >
                      Quét QR
                    </Button>
                    <ModalQRScanner
                      visible={qrScannerVisible}
                      onCancel={() => setQrScannerVisible(false)}
                      onQRCodeScanned={(qrData) => {
                        setQRCodeData(qrData);
                        handleScan(qrData);
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter={[24, 8]}>
                <Col span={10} style={{ marginLeft: "6%" }}>
                  <Form.Item
                    label="Tên nhân viên"
                    name="fullName"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên" },
                      {
                        validator: (_, value) => {
                          if (value && value[0] === " ") {
                            return Promise.reject(
                              "Tên không được nhập khoảng trắng"
                            );
                          }
                          if (value.length > 50) {
                            return Promise.reject(
                              "Tên nhân viên tối đa 50 ký tự"
                            );
                          }
                          if (/\d/.test(value)) {
                            return Promise.reject("Tên không được chứa số");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input className="input-item" placeholder="Tên nhân viên" />
                  </Form.Item>

                  <Form.Item
                    label="Căn cước công dân"
                    name="citizenIdentity"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số CCCD",
                      },
                      {
                        pattern: /^\d{12}$/,
                        message: "Số CCCD phải gồm 12 chữ số",
                      },
                    ]}
                  >
                    <Input className="input-item" placeholder="CCCD" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { max: 50, message: "Email tối đa 50 ký tự" },
                      {
                        pattern:
                          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                        message: "Email không đúng định dạng",
                      },
                    ]}
                  >
                    <Input className="input-item" placeholder="Email" />
                  </Form.Item>
                  <Form.Item
                    label="Tỉnh/Thành phố"
                    name="province"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn Tỉnh/Thành phố",
                      },
                    ]}
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
                    label="Xã/Phường"
                    name="ward"
                    rules={[
                      { required: true, message: "Vui lòng chọn Xã/Phường" },
                    ]}
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
                    label="Trạng thái"
                    name="status"
                    initialValue="DANG_SU_DUNG"
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái" },
                    ]}
                  >
                    <Select>
                      <Option value="DANG_SU_DUNG">
                        <span style={{ fontWeight: "bold" }}>Kích hoạt</span>
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={10} style={{ marginLeft: "40px" }}>
                  <Form.Item
                    label="Ngày sinh"
                    name="dateOfBirth"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày sinh" },
                      { validator: validateAge },
                    ]}
                  >
                    <Input className="input-item" type="date" />
                  </Form.Item>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tinh" },
                    ]}
                    initialValue="true"
                  >
                    <Radio.Group>
                      <Radio value="true" checked>
                        Nam
                      </Radio>
                      <Radio value="false">Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                      {
                        pattern: /^0\d{9}$/,
                        message:
                          "Số điện thoại phải bắt đầu từ số 0 và gồm 10 chữ số",
                      },
                    ]}
                  >
                    <Input className="input-item" placeholder="Số điện thoại" />
                  </Form.Item>
                  <Form.Item
                    label="Quận/Huyện"
                    name="district"
                    rules={[
                      { required: true, message: "Vui lòng chọn Quận/Huyện" },
                    ]}
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
                    label="Số nhà/Ngõ/Đường"
                    name="line"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số nhà/ngõ/đường",
                      },
                    ]}
                  >
                    <Input
                      className="input-item"
                      placeholder="Số nhà/Ngõ/Đường"
                    />
                  </Form.Item>

                  <Form.Item name="toDistrictId" hidden>
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="provinceId" hidden>
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="wardCode" hidden>
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "15px",
              marginRight: "8%",
              marginBottom: "20px",
            }}
          >
            <Button
              key="submit"
              type="primary"
              onClick={handleOk}
              style={{ marginRight: "10px", width: "100px", height: "40px" }}
            >
              Thêm
            </Button>
            <Button
              key="cancel"
              onClick={handleCancel}
              style={{ width: "100px", height: "40px" }}
            >
              Hủy
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default ModalCreateAccount;
