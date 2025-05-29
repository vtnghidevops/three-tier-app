import React, { useEffect, useState } from "react";
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
import moment from "moment";
import { useAppDispatch } from "../../../../app/hook";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AccountApi } from "../../../../api/employee/account/account.api";
import { UpdateAccount } from "../../../../app/reducer/Account.reducer";
import { useParams, useNavigate } from "react-router-dom";
import "../style-staff.css";
import { PlusOutlined } from "@ant-design/icons";
import { AddressApi } from "../../../../api/customer/address/address.api";
const { Option } = Select;

const ModalDetailAccount = ({ visible }) => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const [account, setAccount] = useState({});
  const [address, setAddress] = useState({});
  const [listWard, setListWard] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
  const [fileList, setFileList] = useState([]);
  const handleChange = ({ file, fileList }) => {
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast.error("Bạn chỉ có thể tải lên tệp JPG/PNG!");
      return;
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

  const getOne = () => {
    if (id != null && id !== "") {
      console.log(address);
      AccountApi.getOne(id).then((res) => {
        AddressApi.getAddressByUserIdAndStatus(id).then((resAddress) => {
          setAccount(res.data.data);
          form.setFieldsValue({
            ...res.data.data,
            dateOfBirth: moment(res.data.data.dateOfBirth).format("YYYY-MM-DD"),
            province: resAddress.data.data.province,
            district: resAddress.data.data.district,
            ward: resAddress.data.data.ward,
            line: resAddress.data.data.line,
          });
          AddressApi.fetchAllProvinceWard(
            resAddress.data.data.toDistrictId
          ).then((resWard) => {
            setListWard(resWard.data.data);
          });
          AddressApi.fetchAllProvinceDistricts(
            resAddress.data.data.provinceId
          ).then((resDistrict) => {
            setListDistricts(resDistrict.data.data);
          });
        });

        if (res.data.data?.avata) {
          setUploadedFile({
            url: res.data.data.avata,
          });
        }
      });
    }
  };

  useEffect(() => {
    if (id != null && id !== "") {
      getOne();
    }
    form.resetFields();
    return () => {
      setAccount({});
    };
  }, [id, visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có đồng ý cập nhật không?",
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
          console.log(updatedValues);
          console.log(uploadedFile.originFileObj);
          AccountApi.update(id, formData)
            .then((res) => {
              dispatch(UpdateAccount(res.data.data));
              toast.success("Cập nhật thành công");
              navigate("/staff-management");
            })
            .catch((error) => {
              toast.error(error.response.data.message);
              console.log("Update failed:", error);
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
          CHI TIẾT NHÂN VIÊN
        </span>
      </div>
      <Row gutter={[24, 8]}>
        <Col
          className="filter"
          span={6}
          style={
            {
              // display: "flex",
              // flexDirection: "column",
              // alignItems: "center",
            }
          }
        >
          <div>
            <h1
              style={{
                // display: "flex",
                // alignItems: "center",
                // justifyContent: "center",
                marginTop: "50px",
                marginBottom: "50px",
                fontSize: "20px",
                marginLeft: "31%",
              }}
            >
              Ảnh đại diện
            </h1>
            <Row>
              <Col span={1}></Col>
              <Col span={12}>
                <div style={{ marginLeft: "20%" }}>
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-circle"
                    fileList={uploadedFile ? [uploadedFile] : []}
                    onPreview={handlePreview}
                    onChange={handleChange}
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
          </div>
        </Col>

        <Col className="filter" span={17} style={{ marginLeft: "20px" }}>
          <h1
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "15px",
              marginBottom: "30px",
              fontSize: "20px",
            }}
          >
            Thông tin nhân viên
          </h1>
          <Form form={form} layout="vertical">
            <div className="title_add">
              <Row gutter={[24, 8]}>
                <Col span={10} style={{ marginLeft: "6%" }}>
                  <Form.Item label="Tên nhân viên" name="fullName">
                    <Input
                      className="input-item"
                      placeholder="Tên nhân viên"
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item
                    label="Căn cước công dân"
                    name="citizenIdentity"
                    readOnly
                  >
                    <Input
                      className="input-item"
                      placeholder="Căn cước công dân"
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item label="Email" name="email">
                    <Input
                      className="input-item"
                      placeholder="Email"
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item label="Tỉnh/Thành phố" name="province">
                    <Input className="input-item" readOnly />
                  </Form.Item>

                  <Form.Item label="Xã/Phường" name="ward">
                    <Input className="input-item" readOnly />
                  </Form.Item>

                  <Form.Item label="Trạng thái" name="status">
                    <Select>
                      <Option value="DANG_SU_DUNG">
                        <span style={{ fontWeight: "bold" }}>Kích hoạt</span>
                      </Option>
                      <Option value="KHONG_SU_DUNG">
                        <span style={{ fontWeight: "bold" }}>
                          Ngừng kích hoạt
                        </span>
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={10} style={{ marginLeft: "40px" }}>
                  <Form.Item label="Ngày sinh" name="dateOfBirth">
                    <Input className="input-item" type="date" readOnly />
                  </Form.Item>
                  <Form.Item label="Số điện thoại" name="phoneNumber">
                    <Input
                      className="input-item"
                      placeholder="Số điện thoại"
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item label="Giới tính">
                    <Radio.Group value={account.gender}>
                      <Radio value={true}>Nam</Radio>
                      <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="Quận/Huyện" name="district">
                    <Input className="input-item" readOnly />
                  </Form.Item>

                  <Form.Item label="Số nhà/Ngõ/Đường" name="line" readOnly>
                    <Input
                      className="input-item"
                      placeholder="Số nhà/Ngõ/Đường"
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item label="Mật khẩu">
                    <Input
                      value={account != null ? account.password : null}
                      readOnly
                    />
                  </Form.Item>

                  <Form.Item name="toDistrictId" hidden>
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
export default ModalDetailAccount;
