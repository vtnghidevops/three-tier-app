import { Button, Col, Input, Row, Select } from "antd";
import React from "react";

function FormSearch({
  fillter,
  changFillter,
  handleSubmitSearch,
  clearFillter,
}) {
  const { Option } = Select;

  return (
    <div>
      <Row style={{ marginTop: "15px" }}>
        {/* Cột đầu tiên */}
        <Col span={12}>
          <Row>
            <Col span={6} className="text">
              Tìm kiếm:
            </Col>
            <Col span={18}>
              <Input
                value={fillter.key}
                onChange={(value) => changFillter(value.target.value, "key")}
                placeholder="Nhập"
                 style={{ width: "90%" }}
              />
            </Col>
          </Row>
        </Col>

        {/* Cột thứ hai */}
        <Col span={12}>
          <Row style={{ marginLeft: "15px" }}>
            <Col span={6} className="text">
              Loại đơn:
            </Col>
            <Col span={18}>
              <Select
                 style={{ width: "90%" }}
                value={fillter.type}
                onChange={(value) => {
                  changFillter(value, "type");
                }}
                defaultValue={-1}
              >
                <Option value={""} disabled>
                  Loại đơn
                </Option>
                <Option value={"OFFLINE"}>Tại quầy</Option>
                <Option value={"ONLINE"}>Online</Option>
              </Select>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row style={{ marginTop: "15px" }}>
        {/* Cột đầu tiên */}
        <Col span={12}>
          <Row>
            <Col span={6} className="text">
              Ngày bắt đầu:
            </Col>
            <Col span={18}>
              <Input
                type="date"
                style={{ width: "90%" }}
                value={fillter.startTimeString}
                placeholder="Từ ngày"
                onChange={(value) =>
                  changFillter(value.target.value, "startTimeString")
                }
              />
            </Col>
          </Row>
        </Col>

        {/* Cột thứ hai */}
        <Col span={12}>
          <Row style={{ marginLeft: "15px" }}>
            <Col span={6} className="text">
              Ngày kết thúc:
            </Col>
            <Col span={18}>
              <Input
                type="date"
                style={{ width: "90%" }}
                value={fillter.endTimeString}
                onChange={(value) =>
                  changFillter(value.target.value, "endTimeString")
                }
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row style={{  marginTop: "20px" }} justify="center">
        <Col span={4}>
          <Button
            className="btn_filter"
            type="submit"
            onClick={(e) => handleSubmitSearch(e)}
          >
            Tìm kiếm
          </Button>
        </Col>
        <Col span={2}>
          {" "}
          <Button className="btn_clear" onClick={(e) => clearFillter(e)}>
            Làm mới
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default FormSearch;
