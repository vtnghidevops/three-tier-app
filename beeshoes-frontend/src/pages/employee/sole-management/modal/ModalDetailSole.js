import React, { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import moment from "moment";
import { SoleApi } from "../../../../api/employee/sole/sole.api";

const ModalDetailSole = ({ visible, id, onCancel }) => {
  const [sole, setSole] = useState({});

  const getOne = () => {
    SoleApi.getOne(id).then((res) => {
      setSole(res.data.data);
    });
  };
  const handleCancel = () => {
    onCancel();
  };

  useEffect(() => {
    console.log(id);
    if (id != null && id !== "") {
      getOne();
    }
    return () => {
      setSole(null);
      id = null;
    };
  }, [id, visible]);

  return (
    <Modal
      title="Chi tiết đế giày"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical">
        <Form.Item label="Tên đế giày">
          <Input value={sole != null ? sole.name : null} readOnly />
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Input
            value={
              sole != null
                ? sole.status == "DANG_SU_DUNG"
                  ? "Đang sử dụng"
                  : "Không sử dụng"
                : null
            }
            readOnly
          />
        </Form.Item>

        <Form.Item label="Ngày tạo">
          <Input
            value={
              sole != null
                ? moment(sole.createdDate).format("DD-MM-YYYY")
                : null
            }
            readOnly
          />
        </Form.Item>

        <Form.Item label="Ngày cập nhật">
          <Input
            value={
              sole != null
                ? moment(sole.lastModifiedDate).format("DD-MM-YYYY")
                : null
            }
            readOnly
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDetailSole;
