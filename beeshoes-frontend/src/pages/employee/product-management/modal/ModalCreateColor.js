import { Modal, Input, Select, Button, Form, Row, Col } from "antd";
import { useAppDispatch } from "../../../../app/hook";
import { ColorApi } from "../../../../api/employee/color/Color.api";
import { CreateColor } from "../../../../app/reducer/Color.reducer";
import { toast } from "react-toastify";
import convert from "color-convert";

const ModalCreateColor = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const initialValues = {
    code: "",
    name: "",
    status: "DANG_SU_DUNG",
  };

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
            dispatch(CreateColor(res.data.data));
            toast.success("Thêm thành công");
            form.resetFields();
            onCancel();
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
    form.resetFields();
    onCancel();
  };

  return (
    <>
      <Modal
        title="Thêm màu sắc"
        visible={visible}
        onCancel={() => handleCancel()}
        footer={[
          <Button key="cancel" onClick={() => handleCancel()}>
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
                    form.setFieldsValue({ name: tenMau });
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

export default ModalCreateColor;
