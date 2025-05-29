import React, { useEffect, useState } from "react";
import { HistoryPoinApi } from "../../../../api/employee/historyPoin/historyPoin.api";
import moment from "moment";
import { Button, Col, Row, Table } from "antd";

function HistoryPoin({ id, customer }) {
  const [historyPoin, setHistoryPoin] = useState([]);
  useEffect(() => {
    HistoryPoinApi.fetchAllByUser(id).then((res) => {
      setHistoryPoin(res.data.data);
    });
  }, [id]);
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };
  const formatTyePoin = (value) => {
    return value == "DIEM_THUONG"
      ? "Điểm Thưởng"
      : value == "DIEM_SU_DUNG"
      ? "Sử dụng điểm"
      : "Điểm hoàn";
  };
  const columnHistoryPoin = [
    {
      title: <div className="title-product">STT</div>,
      key: "index",
      render: (value, item, index) => index + 1,
    },
    {
      title: <div className="title-product">Mã Hóa đơn</div>,
      dataIndex: "code",
      key: "code",
      render: (code) => <span>{code}</span>,
    },
    {
      title: <div className="title-product">Thời gian giao dịch</div>,
      dataIndex: "createDate",
      key: "createDate",
      render: (text) => {
        const formattedDate = moment(text).format(" HH:mm:ss DD-MM-YYYY"); // Định dạng ngày
        return formattedDate;
      },
    },
    {
      title: <div className="title-product">Giá trị đơn hàng</div>,
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (totalMoney) => {
        return formatCurrency(totalMoney);
      },
    },
    {
      title: <div className="title-product">Loại</div>,
      dataIndex: "tyePoin",
      key: "tyePoin",
      render: (tyePoin) => {
        return (
          <Button
            style={{ width: "130px", pointerEvents: "none" }}
            className={tyePoin}
          >
            {formatTyePoin(tyePoin)}
          </Button>
        );
      },
    },
    {
      title: <div className="title-product">Điểm giao dịch</div>,
      dataIndex: "value",
      key: "value",
      render: (value) => {
        return value;
      },
    },
  ];
  return (
    <Row style={{ width: "100%" }}>
      <Row style={{ width: "100%" }}>
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
          Lịch sử điểm
        </h1>
      </Row>
      <Row
        style={{
          margin: "10px 0",
          width: "100%",
          fontSize: "31px",
          fontWeight: "600",
        }}
        justify={"end"}
      >
        <Row style={{ width: "100%" }}>
          <Col span={12}>
            <Row>
              <Col span={6}>Điểm hiện tại</Col>
              <Col span={4}>{customer.points}</Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row justify={"end"}>
              <Col span={8}>Tổng điểm đã sử dụng</Col>
              <Col span={4}>
                {historyPoin
                  .filter((item) => item.tyePoin === "DIEM_SU_DUNG")
                  .reduce((total, item) => total + item.value, 0)}
              </Col>
              <Col span={1}></Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>
          <Col span={12}>
            <Row>
              {console.log(historyPoin)}
              <Col span={6}>Tổng Tiền đơn hàng</Col>
              <Col span={4}>
                {formatCurrency(
                  historyPoin.reduce(
                    (total, item) => total + item.totalMoney,
                    0
                  )
                )}
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row justify={"end"}>
              <Col span={8}>Tổng Tiền sử dụng từ điểm</Col>
              <Col span={4}>
                {formatCurrency(
                  historyPoin
                    .filter((item) => item.tyePoin === "DIEM_SU_DUNG")
                    .reduce(
                      (total, item) =>
                        total + item.value * item.exchangeRateMoney,
                      0
                    )
                )}
              </Col>
              <Col span={1}></Col>
            </Row>
          </Col>
        </Row>
      </Row>
      <Row style={{ width: "100%" }}>
        <Table
          style={{ width: "100%" }}
          dataSource={historyPoin}
          columns={columnHistoryPoin}
          pagination={{ pageSize: 10 }}
          rowKey="id"
          className="history-poin-table"
        />
      </Row>
    </Row>
  );
}

export default HistoryPoin;
