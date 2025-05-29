import { Modal, Input, Select, Button, Form, Row, Col } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../app/hook";
import tinycolor from "tinycolor2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ColorApi } from "../../../../api/employee/color/Color.api";
import {
  CreateColor,
  GetColor,
  SetColor,
} from "../../../../app/reducer/Color.reducer";
import { toast } from "react-toastify";
import convert from "color-convert";

const AddColorModal = ({ visible, onCancel, onSaveData }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  const initialValues = {
    code: "",
    name: "",
    status: "DANG_SU_DUNG",
  };

  const data = useAppSelector(GetColor);
  useEffect(() => {
    if (data != null) {
      setListColor(data);
    }
  }, [data]);

  const [listColor, setListColor] = useState([]);

  const getColorName = (colorCode) => {
    const hexCode = colorCode.replace("#", "").toUpperCase();
    const rgb = convert.hex.rgb(hexCode);
    const colorName = convert.rgb.keyword(rgb);

    if (colorName === null) {
      return "Unknown";
    } else {
      return colorName;
    }
  };

  const getList = () => {
    ColorApi.getAllCode().then((res) => {
      setListColor(res.data.data);
      dispatch(SetColor(res.data.data));
    });
  };

  const toggleSelection = (color) => {
    setSelected((prevSelected) =>
      prevSelected.includes(color)
        ? prevSelected.filter((selected) => selected !== color)
        : [...prevSelected, color]
    );
  };

  useEffect(() => {
    getList();
  }, []);

  const handleOk = () => {
    onSaveData(selected);
    setSelected([]);
    onCancel();
  };

  const handleOkAdd = () => {
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
        ColorApi.create(values)
          .then((res) => {
            console.log(res.data.data);
            dispatch(CreateColor(res.data.data));
            toast.success("Thêm thành công");
            form.resetFields();
            setAddModalVisible(false);
          })
          .catch((error) => {
            toast.error(error.response.data.message);
            console.log("Create failed:", error);
          });
      })
      .catch(() => {
        // Xử lý khi người dùng từ chối xác nhận
      });
  };

  const handleCancel = () => {
    setAddModalVisible(false);
    form.resetFields();
    onCancel();
  };

  return (
    <>
      <Modal
        title="Chọn màu sắc "
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Thêm"
        cancelText="Hủy"
        bodyStyle={{ maxHeight: "50vh", overflowY: "auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <Button
            onClick={() => setAddModalVisible(true)}
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            Thêm màu sắc
          </Button>
        </div>
        <Row gutter={[16, 16]}>
          {/* Hiển thị các nút button cho các kích thước */}
          {listColor.map((color) => (
            <Col key={color} span={6}>
              <Button
                block
                title={color.name}
                style={{ backgroundColor: color.code }}
                className={selected.includes(color.code) ? "selected" : ""}
                onClick={() => toggleSelection(color.code)}
              >
                <span style={{ fontWeight: "bold" }}>{color.code}</span>
              </Button>
            </Col>
          ))}
        </Row>
      </Modal>

      <Modal
        title="Thêm màu sắc"
        visible={isAddModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkAdd}>
            Thêm
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" initialValues={initialValues}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Bảng màu"
                name="code"
                rules={[
                  { required: true, message: "Vui lòng nhập tên thương hiệu" },
                  { max: 50, message: "Tên thương hiệu tối đa 50 ký tự" },
                ]}
              >
                <Input
                  type="color"
                  style={{ height: "250px" }}
                  onChange={(e) => {
                    const maMau = e.target.value;
                    const tenMau = getColorName(maMau);
                    form.setFieldsValue({ name: tenMau }); // Cập nhật giá trị cho trường "Tên màu sắc"
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mã màu sắc"
                name="code"
                rules={[
                  { required: true, message: "Vui lòng nhập mã màu" },
                  { max: 50, message: "Tên thương hiệu tối đa 50 ký tự" },
                ]}
              >
                <Input placeholder="Tên mã màu" style={{ height: "40px" }} />
              </Form.Item>
              <Form.Item
                label="Tên màu sắc"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên màu" },
                  { max: 50, message: "Tên thương hiệu tối đa 50 ký tự" },
                ]}
              >
                <Input placeholder="Tên màu sắc" style={{ height: "40px" }} />
              </Form.Item>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái" },
                ]}
              >
                <Select defaultValue="DANG_SU_DUNG">
                  <Select.Option value="DANG_SU_DUNG">
                    Đang sử dụng
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default AddColorModal;
