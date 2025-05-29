import React, { useEffect, useState } from "react";
import "./../style-voucher.css";
import { Form, Input, Button, Modal, InputNumber, DatePicker } from "antd";
import { VoucherApi } from "../../../../api/employee/voucher/Voucher.api";
import { UpdateVoucher } from "../../../../app/reducer/Voucher.reducer";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../../../../app/hook";
dayjs.extend(utc);
function UpdateVoucherManagement({ modalUpdate, setModalUpdate, id }) {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useAppDispatch();

  const inputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    console.log(id);
    if (id !== "") {
      detailVoucher(id);
    }
  }, [id]);
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const convertToLong = () => {
    const convertedFormData = { ...formData };
    if (formData.startDate) {
      convertedFormData.startDate = dayjs(formData.startDate).unix() * 1000;
    }
    if (formData.endDate) {
      convertedFormData.endDate = dayjs(formData.endDate).unix() * 1000;
    }
    return convertedFormData;
  };

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };
  const handleSubmit = () => {
    Modal.confirm({
      title: "Xác nhận cập nhập",
      content: "Bạn có chắc chắn muốn cập nhập phiếu giảm giá ?",
      okText: "Cập nhập",
      cancelText: "Hủy",
      onOk() {
        const isFormValid =
          formData.code &&
          formData.name &&
          formData.value &&
          formData.quantity &&
          formData.startDate &&
          formData.endDate &&
          formData.startDate < formData.endDate;

        if (!isFormValid) {
          const errors = {
            code: !formData.code ? "Vui lòng nhập mã khuyễn mãi" : "",
            name: !formData.name ? "Vui lòng nhập tên khuyễn mãi" : "",
            value: !formData.value ? "Vui lòng nhập giá giảm" : "",
            startDate: !formData.startDate ? "Vui lòng chọn ngày bắt đầu" : "",
            quantity: !formData.quantity ? "Vui lòng nhập số lượng" : "",
            endDate: !formData.endDate
              ? "Vui lòng chọn ngày kết thúc"
              : formData.startDate >= formData.endDate
              ? "Ngày kết thúc phải lớn hơn ngày bắt đầu"
              : "",
          };
          setFormErrors(errors);
          return;
        }

        VoucherApi.update(id, convertToLong()).then(
          (res) => {
            dispatch(UpdateVoucher(res.data.data));
            toast.success("Cập nhập thành công!", {
              autoClose: 5000,
            });
            closeModal();
          },
          (err) => {
            toast.success(err.data.response.message, {
              autoClose: 5000,
            });
            console.log(err);
          }
        );
      },
    });
  };

  const detailVoucher = (id) => {
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
    setModalUpdate(false);
    setFormErrors([]);
  };

  return (
    <div>
      <Modal
        title="Cập nhập phiếu giảm giá"
        visible={modalUpdate}
        onCancel={closeModal}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Form layout="vertical">
          <Form.Item
            label="Mã phiếu giảm giá"
            validateStatus={formErrors["code"] ? "error" : ""}
            help={formErrors["code"] || ""}
          >
            <Input
              name="code"
              className="input-create-voucher"
              placeholder="Tên phiếu giảm giá"
              value={formData["code"]}
              readOnly
            />
          </Form.Item>
          <Form.Item
            label="Tên phiếu giảm giá"
            validateStatus={formErrors["name"] ? "error" : ""}
            help={formErrors["name"] || ""}
          >
            <Input
              name="name"
              placeholder="Tên phiếu giảm giá"
              className="input-create-voucher"
              value={formData["name"]}
              onChange={(e) => {
                inputChange("name", e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Giá trị giảm"
            validateStatus={formErrors["value"] ? "error" : ""}
            help={formErrors["value"] || ""}
          >
            <InputNumber
              name="value"
              placeholder="Giá trị giảm"
              className="input-create-voucher"
              value={formData["value"]}
              onChange={(value) => {
                inputChange("value", value);
              }}
              min="1"
              formatter={(value) => formatCurrency(value)}
              parser={(value) => value.replace(/[^\d]/g, "")}
            />
          </Form.Item>
          <Form.Item label="Đơn tối thiểu">
            <InputNumber
              name="minimumBill"
              placeholder="Đơn tối thiểu"
              className="input-create-voucher"
              value={formData["minimumBill"]}
              onChange={(value) => {
                inputChange("minimumBill", value);
              }}
              min="10000"
              formatter={(value) => formatCurrency(value)}
              parser={(value) => value.replace(/[^\d]/g, "")}
            />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            validateStatus={formErrors["quantity"] ? "error" : ""}
            help={formErrors["quantity"] || ""}
          >
            <InputNumber
              name="quantity"
              placeholder="Số lượng"
              className="input-create-voucher"
              value={formData["quantity"]}
              onChange={(value) => {
                inputChange("quantity", value);
              }}
              min="1"
            />
          </Form.Item>
          <Form.Item
            label="Ngày bắt đầu"
            validateStatus={formErrors["startDate"] ? "error" : ""}
            help={formErrors["startDate"] || ""}
          >
            <DatePicker
              showTime
              name="startDate"
              placeholder="Ngày bắt đầu"
              className="input-create-voucher"
              value={formData["startDate"]}
              onChange={(value) => {
                inputChange("startDate", value);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Ngày kết thúc"
            validateStatus={formErrors["endDate"] ? "error" : ""}
            help={formErrors["endDate"] || ""}
          >
            <DatePicker
              showTime
              name="endDate"
              placeholder="Ngày kết thúc"
              className="input-create-voucher"
              value={formData["endDate"]}
              onChange={(value) => {
                inputChange("endDate", value);
              }}
            />
          </Form.Item>
          <Form.Item label="Trạng thái">
            <Input
              disable
              className="status"
              name="status"
              value={
                formData["status"] === "DANG_SU_DUNG"
                  ? "Đang kích hoạt"
                  : formData["status"] === "CHUA_KICH_HOAT"
                  ? " Chưa kích hoạt"
                  : "Không kích hoạt"
              }
            ></Input>
          </Form.Item>

          <Form.Item>
            <div style={{ float: "right" }}>
              <Button onClick={closeModal}>Hủy</Button>
              <Button
                className="button-add-promotion"
                key="submit"
                title="Cập nhập"
                onClick={handleSubmit}
                style={{ marginLeft: "20px" }}
              >
                Cập nhập
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UpdateVoucherManagement;
