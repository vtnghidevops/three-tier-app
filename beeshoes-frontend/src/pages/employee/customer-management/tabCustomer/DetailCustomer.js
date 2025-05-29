import { Button, Col, Form, Input, Radio, Row, Select } from 'antd'
import { Option } from 'antd/es/mentions'
import React from 'react'

function DetailCustomer({form,customer, handleCancel}) {
  return (
    <Col className="filter" span={24} style={{ marginLeft: "20px" }}>
          {/* <div className="filter"> */}
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
            Thông tin khách hàng
          </h1>
          <Form form={form} layout="vertical">
            <Row gutter={[24, 8]}>
              <Col span={10} style={{ marginLeft: "6%" }}>
                <div className="title_add">
                  <Form.Item label="Tên khách hàng" name="fullName">
                    <Input
                      className="input-item"
                      placeholder="Tên khách hàng"
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
                  <Form.Item
                    label="Trạng thái"
                    name="status"
                    // initialValue="DANG_SU_DUNG"
                  >
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
                </div>
              </Col>

              <Col span={10} style={{ marginLeft: "40px", marginTop: "16px" }}>
                <Form.Item label="Số điện thoại" name="phoneNumber">
                  <Input
                    className="input-item"
                    placeholder="Số điện thoại"
                    readOnly
                  />
                </Form.Item>
                <Form.Item label="Ngày sinh" name="dateOfBirth">
                  <Input className="input-item" type="date" readOnly />
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
                <Form.Item
                  label="Giới tính"
                  name="gender"
                  initialValue={customer.gender === true ? "Nam" : "Nữ"}
                >
                  <Radio.Group>
                    <Radio value={true}>Nam</Radio>
                    <Radio value={false}>Nữ</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="toDistrictId" hidden>
                  <Input disabled />
                </Form.Item>
                {/* <div>
                  <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: "100%" }}
                  />
                  <p>Scanned Data: {qrData}</p>
                </div> */}
              </Col>
            </Row>
          </Form>
          {/* </div> */}

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
              Quay lại
            </Button>
          </div>
        </Col>
  )
}

export default DetailCustomer