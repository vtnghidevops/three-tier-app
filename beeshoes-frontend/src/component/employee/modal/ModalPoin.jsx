import { Button, Col, Form, Input, Modal, Row } from "antd";
import { ScoringFormu } from "../../../api/employee/scoring-formu/ScoringFormu.api";
import { toast } from "react-toastify";

export default function ModalPoin({ visible, onCancel }) {
  const [form] = Form.useForm();
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };
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
        const rawExchangeRate = {
          exchangeRatePoin: values.exchangeRatePoin.replace(/\D/g, ""),
          exchangeRateMoney: values.exchangeRateMoney.replace(/\D/g, ""),
        };
        ScoringFormu.addOrUpdate(rawExchangeRate).then((values) => {
          toast.success("Thêm thành công");
          onCancel();
        });
        form.resetFields();
      })
      .catch(() => {});
  };
  return (
    <>
      <Modal
        title="Thiết lập tính đểm "
        open={visible}
        onCancel={onCancel}
        width={600}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Thêm
          </Button>,
        ]}
      >
        <Form
          form={form}
          labelCol={{
            span: 13,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Row>
            <Col span={15}>
              <Form.Item
                label="Tỉ lệ tích điểm"
                name="exchangeRatePoin"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số tiền quy đổi",
                  },
                ]}
              >
                <Input
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({
                      exchangeRatePoin: formatCurrency(inputValue),
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <label style={{ margin: "3px 5px" }}>=</label>
            <label style={{ margin: "3px 0px", fontWeight: "bold" }}>
              1 điểm thưởng
            </label>
          </Row>
          <Row>
            <Col span={15}>
              <Form.Item
                label="Thanh toán bằng điểm"
                name="exchangeRateMoney"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá tiền số tiền để dùng 1 điểm.",
                  },
                ]}
              >
                <Input
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({
                      exchangeRateMoney: formatCurrency(inputValue),
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <label style={{ margin: "3px 5px" }}>=</label>
            <label style={{ margin: "3px 0px", fontWeight: "bold" }}>
              1 điểm thưởng
            </label>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
