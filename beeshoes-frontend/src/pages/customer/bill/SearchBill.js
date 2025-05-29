import { Button, Col, Form, Input, Row } from "antd";
import React from "react";
import logo from "./logo.jpg";

function SearchBill() {
  const [form] = Form.useForm();
  const initialValues = {
    code: "",
    phoneNumber: "",
  };
  const handleOk = () => {
    console.log(form);
    form
      .validateFields()
      .then((values) => {
        const trimmedValues = Object.keys(values).reduce((acc, key) => {
          acc[key] =
            typeof values[key] === "string" ? values[key].trim() : values[key];
          return acc;
        }, {});
        console.log(trimmedValues);
        window.open(
          "http://103.56.161.210:3000/bill/" +
            trimmedValues.code +
            "/" +
            trimmedValues.phoneNumber,
          "_self"
        );
      })

      .catch(() => {
        // Xử lý khi người dùng từ chối xác nhận
      });
  };
  return (
    <div>
      <Row
        style={{
          margin: "50px",
          padding: "50px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Col span={12}>
          <img src={logo} alt="Logo" style={{ width: "100%" }} />
        </Col>
        <Col span={12}>
          <Form form={form} layout="vertical" initialValues={initialValues}>
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Vui lòng nhập Số điện thoại" },
                { max: 13, message: "Tên đế giày tối đa 50 ký tự" },
                {
                  pattern:
                    "(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}",
                  message: "Vui lòng nhập đúng số điện thoại",
                },
              ]}
            >
              <Input
                placeholder="Số điện thoại"
                onKeyDown={(e) => {
                  if (e.target.value === "" && e.key === " ") {
                    e.preventDefault();
                    e.target.value.replace(/\s/g, "");
                  }
                }}
                style={{ width: "310px" }}
              />
            </Form.Item>
            <Form.Item
              label="Mã hóa đơn"
              name="code"
              rules={[
                { required: true, message: "Vui lòng nhập tên mã hóa đơn" },
                { max: 50, message: "Tên đế giày tối đa 50 ký tự" },
                {
                  validator: (_, value) => {
                    if (value && value.trim() === "") {
                      return Promise.reject("Không được chỉ nhập khoảng trắng");
                    }
                    if (
                      !/^(?=.*[a-zA-Z]|[À-ỹ])[a-zA-Z\dÀ-ỹ\s\-_]*$/.test(value)
                    ) {
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
                placeholder="Mã đơn hàng"
                onKeyDown={(e) => {
                  if (e.target.value === "" && e.key === " ") {
                    e.preventDefault();
                    e.target.value.replace(/\s/g, "");
                  }
                }}
                style={{ width: "310px" }}
              />
            </Form.Item>
            <Row justify={"space-between"}>
              <Col span={8}>
                <Button
                  key="submit"
                  style={{ width: "40%", backgroundColor: "#f05623" }}
                  type="primary"
                  onClick={handleOk}
                >
                  Tìm kiếm
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default SearchBill;
