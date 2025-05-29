import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, InputNumber, Row, Select, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AddressApi } from "../../../api/employee/address/address.api";
import "./style-bill.css";


function DetailsInvoicesCounter({ detailBill }) {
  var vouchers = [];
  const city = [];
  const district = [];
  const ward = [];

  const onChangCity = (e) => {
    AddressApi.fetchDistrict(e.target.value).then((res) => {
      // console.log(res.data.districts);
      // dispatch(getDistrict(res.data.districts));
    });
  };

  const onChangDistrict = (e) => {
    // AddressApi.fetchWard(e.target.value).then((res) => {
    //   dispatch(getWard(res.data.wards));
    // });
  };

  useEffect(() => {
    // AddressApi.fetchCity().then((res) => {
    //   dispatch(getCity(res.data));
    // });
  }, []);

  // begin sreach khach hang
  const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"];
  const [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));
  //  end sreach khach hang

  const columns = [
    {
      title: <div className="title-product">STT</div>,
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: <div className="title-product">Mã sản phẩm</div>,
      dataIndex: "codeProduct",
      key: "codeProduct",
    },
    {
      title: <div className="title-product">Tên Sản Phẩm</div>,
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: <div className="title-product">Kích thước</div>,
      dataIndex: "nameSize",
      key: "nameSize",
    },
    {
      title: <div className="title-product">Màu</div>,
      dataIndex: "nameColor",
      key: "nameColor",
    },
    {
      title: <div className="title-product">Đế giày</div>,
      dataIndex: "nameSole",
      key: "nameSole",
    },
    {
      title: <div className="title-product">Chất liệu</div>,
      dataIndex: "nameMaterial",
      key: "nameMaterial",
    },
    {
      title: <div className="title-product">Giá</div>,
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span>
          {price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </span>
      ),
    },
    {
      title: <div className="title-product">Số lượng </div>,
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: <div className="title-product">Hành động</div>,
      render: <InputNumber addonBefore="+" addonAfter="-" defaultValue={100} />,
    },
  ];

  return (
    <div>
      <Row style={{ backgroundColor: "white" }}>
        <Col span={18}>
          <Row>
            <Table
              dataSource={detailBill.children}
              columns={columns}
              rowKey="id"
              style={{ height: " 349px" }}
              pagination={false} // Disable default pagination
              className="product-table"
            />
          </Row>
          <Row>
            <Col span={16}>
              <div class="mb-3">
                <label for="" class="form-label"></label>
                <textarea
                  class="form-control"
                  name=""
                  id=""
                  rows="10"
                  placeholder="ghi chú"
                ></textarea>
              </div>
            </Col>
            <Col span={8}>
              <Row>
                {" "}
                <Select
                  mode="tags"
                  style={{
                    width: "100%",
                  }}
                  //   onChange={handleChange}
                  placeholder={"Chọn mã giảm giá"}
                  tokenSeparators={[","]}
                  options={vouchers}
                />
              </Row>
              <Row>
                <Col span={12}>Tổng tiền hàng: </Col>
                <Col span={12}>0</Col>
              </Row>
              <Row>
                <Col span={12}>Giảm giá: </Col>
                <Col span={12}>0</Col>
              </Row>
              <hr />
              <Row>
                <Col span={12}>Khách cần trả: </Col>
                <Col
                  span={12}
                  style={{
                    color: "#237fcd",
                    fontSize: "1.8rem",
                    fontWeight: "700",
                  }}
                >
                  0
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Row style={{ margin: "5px 0 5px 5px" }}>
            <Col span={8}> Mã : {detailBill.father.code}</Col>
            <Col span={16}>
              {" "}
              Ngày tạo:{" "}
              {moment(detailBill.father.createdDate).format("DD-MM-YYYY")}
            </Col>
          </Row>
          <Row style={{ margin: "5px 0 5px 5px" }}>
            <Col span={22}>
              <Select
                mode="multiple"
                placeholder="Inserted are removed"
                value={selectedItems}
                onChange={setSelectedItems}
                style={{
                  width: "100%",
                }}
                options={filteredOptions.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            </Col>
            <Col span={2}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                //   loading={loadings[2]}
                //   onClick={() => enterLoading(2)}
              />
            </Col>
          </Row>
          <Row style={{ margin: "5px 0 5px 5px" }}>
            <Col span={12}> Khách thanh toán: </Col>
            <Col span={12}> 0 đ </Col>
          </Row>
          <Row style={{ margin: "5px 0 5px 5px" }}>
            <Col span={12}> Giao hàng: </Col>
            <Col span={12}>
              {" "}
              <label class="switch" for="checkbox">
                <input type="checkbox" id="checkbox" />
                <div class="slider round"></div>
              </label>{" "}
            </Col>
          </Row>
          <Row style={{ margin: "5px 0 5px 5px" }}>
            <input
              type="text"
              class="form-control"
              id="exampleFormControlInput1"
              placeholder="Tên người người nhận  "
            />
          </Row>
          <Row style={{ margin: "5px 0 5px 5px" }}>
            <input
              type="text"
              class="form-control"
              id="exampleFormControlInput1"
              placeholder="Số điện thoại"
            />
          </Row>
          <Row style={{ margin: "5px 0 5px 5px" }}>
            <input
              type="text"
              class="form-control"
              id="exampleFormControlInput1"
              placeholder="Nhập Số nhà, ngõ, đường "
            />
          </Row>
          <Row style={{ margin: "5px 0 5px 5px" }}>
            <select
              class="form-select"
              aria-label="Default select example"
              onChange={(e) => {
                onChangCity(e);
              }}
            >
              <option selected disabled className="selectOption">
                Chọn tỉnh
              </option>
              {city.map((item) => (
                <option value={item.code}>{item.name}</option>
              ))}
            </select>
          </Row>
          <Row style={{ margin: "5px 0 5px 5px" }}>
            <select
              class="form-select"
              aria-label="Default select example"
              onChange={(e) => {
                onChangDistrict(e);
              }}
            >
              <option selected disabled className="selectOption">
                Chọn Quận
              </option>
              {district.map((item) => (
                <option value={item.code}>{item.name}</option>
              ))}
            </select>
          </Row>
          <Row style={{ margin: "5px 0 5px 5px" }}>
            <select class="form-select" aria-label="Default select example">
              <option selected disabled className="selectOption">
                Chọn Phường xã
              </option>
              {ward.map((item) => (
                <option value={item.code}>{item.name}</option>
              ))}
            </select>
          </Row>
          <Row style={{ margin: "5px 0 5px 5px" }}>
            <Col span={12}>
              <Button block>Giao hàng</Button>
            </Col>
            <Col span={12}>
              <Button
                style={{ marginLeft: "10px", width: "83%" }}
                type="primary"
                block
              >
                Thanh toán
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default DetailsInvoicesCounter;
