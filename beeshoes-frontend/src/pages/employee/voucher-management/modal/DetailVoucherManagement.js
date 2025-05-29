import React, { useEffect, useState } from "react";
import "./../style-voucher.css";
import {
  Form,
  Input,
  Button,
  Select,
  Table,
  Modal,
  InputNumber,
  Popconfirm,
  DatePicker,
} from "antd";
import { VoucherApi } from "../../../../api/employee/voucher/Voucher.api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useAppDispatch, useAppSelector } from "../../../../app/hook";
dayjs.extend(utc);
function UpdateVoucherManagement({ modalDetail, setModalDetail, id }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (id !== "") {
      detailVoucher();
    }
  }, [id]);
  useEffect(() => {}, [formData]);

  const detailVoucher = () => {
    VoucherApi.getOne(id).then(
      (res) => {
        const voucherData = res.data.data;
        setFormData({
          code: voucherData.code,
          name: voucherData.name,
          value: voucherData.value,
          quantity: voucherData.quantity,
          startDate: dayjs(voucherData.startDate),
          endDate: dayjs(voucherData.endDate),
          status: voucherData.status,
          createdDate: dayjs(voucherData.createdDate),
          minimumBill: voucherData.minimumBill,
        });
      },
      (err) => console.log(err)
    );
  };
  const closeModal = () => {
    setModalDetail(false);
  };

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };

  return (
    <div>
      <Modal
        title="Chi tiết phiếu giảm giá"
        visible={modalDetail}
        onCancel={closeModal}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Form layout="vertical">
          <Form.Item label="Mã phiếu giảm giá">
            <Input
              name="code"
              className="input-create-voucher"
              value={formData["code"]}
            />
          </Form.Item>
          <Form.Item label="Tên phiếu giảm giá">
            <Input
              name="name"
              placeholder="Tên phiếu giảm giá"
              className="input-create-voucher"
              value={formData["name"]}
            />
          </Form.Item>
          <Form.Item label="Giá trị giảm">
            <InputNumber
              name="value"
              placeholder="Giá trị giảm"
              className="input-create-voucher"
              value={formData["value"]}
              formatter={(value) => formatCurrency(value)}
            />
          </Form.Item>
          <Form.Item label="Đơn tối thiểu">
            <InputNumber
              name="minimumBill"
              placeholder="Đơn tối thiểu"
              className="input-create-voucher"
              value={formData["minimumBill"]}
              formatter={(value) => formatCurrency(value)}
            />
          </Form.Item>
          <Form.Item label="Số lượng">
            <InputNumber
              name="quantity"
              placeholder="Số lượng"
              className="input-create-voucher"
              value={formData["quantity"]}
            />
          </Form.Item>
          <Form.Item label="Ngày bắt đầu">
            <DatePicker
              showTime
              name="startDate"
              placeholder="Ngày bắt đầu"
              className="input-create-voucher"
              value={formData["startDate"]}
            />
          </Form.Item>
          <Form.Item label="Ngày kết thúc">
            <DatePicker
              showTime
              name="endDate"
              placeholder="Ngày kết thúc"
              className="input-create-voucher"
              value={formData["endDate"]}
            />
          </Form.Item>
          <Form.Item label="Trạng thái">
            <Input
              className="input-create-voucher"
              name="status"
              value={
                formData["status"] === "DANG_SU_DUNG" ? "Còn hạn" : "Hết hạn"
              }
            />
          </Form.Item>
          <Form.Item label="Ngày tạo">
            <DatePicker
              showTime
              className="input-create-voucher"
              name="createdDate"
              value={formData["createdDate"]}
            />
          </Form.Item>

          <Form.Item>
            <Button onClick={closeModal}>Hủy</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UpdateVoucherManagement;
