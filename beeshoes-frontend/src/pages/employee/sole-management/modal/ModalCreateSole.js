import React from "react";
import { Modal, Input, Select, Button, Form } from "antd";
import { useAppDispatch } from "../../../../app/hook";
import { toast } from "react-toastify";
import { SoleApi } from "../../../../api/employee/sole/sole.api";
import { CreateSole } from "../../../../app/reducer/Sole.reducer";

const { Option } = Select;

const ModalCreateSole = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const initialValues = {
    name: "",
    status: "DANG_SU_DUNG",
  };

  // Trong hàm handleOk, chúng ta gọi form.validateFields() để kiểm tra và lấy giá trị
  // hàm onCreate để xử lý dữ liệu
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const trimmedValues = Object.keys(values).reduce((acc, key) => {
          acc[key] =
            typeof values[key] === "string" ? values[key].trim() : values[key];
          return acc;
        }, {});
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có đồng ý thêm không?",
            okText: "Đồng ý",
            cancelText: "Hủy",
            onOk: () => resolve(trimmedValues),
            onCancel: () => reject(),
          });
        });
      })
      .then((trimmedValues) => {
        SoleApi.create(trimmedValues)
          .then((res) => {
            dispatch(CreateSole(res.data.data));
            toast.success("Thêm thành công");
            form.resetFields();
            onCancel();
          })
          .catch((error) => {
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
    <Modal
      title="Thêm đế giày"
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
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          label="Tên đế giày"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên đế giày" },
            { max: 50, message: "Tên đế giày tối đa 50 ký tự" },
            {
              validator: (_, value) => {
                if (value && value.trim() === "") {
                  return Promise.reject("Không được chỉ nhập khoảng trắng");
                }
                if (!/^(?=.*[a-zA-Z]|[À-ỹ])[a-zA-Z\dÀ-ỹ\s\-_]*$/.test(value)) {
                  return Promise.reject(
                    "Phải chứa ít nhất một chữ cái và không có ký tự đặc biệt"
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="Tên đế giày"
            onKeyDown={(e) => {
              if (e.target.value === "" && e.key === " ") {
                e.preventDefault();
                e.target.value.replace(/\s/g, "");
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select defaultValue="DANG_SU_DUNG">
            <Option value="DANG_SU_DUNG">Đang sử dụng</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateSole;
