import React, { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import moment from "moment";
import { MaterialApi } from "../../../../api/employee/material/Material.api";

const ModalDetailMaterial = ({ visible, id, onCancel }) => {
  const [matreial, setMaterial] = useState({});

  const getOne = () => {
    MaterialApi.getOne(id).then((res) => {
      setMaterial(res.data.data);
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
      setMaterial(null);
      id = null;
    };
  }, [id, visible]);

  return (
    <Modal
      title="Chi tiết chất liệu"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical">
        <Form.Item label="Tên chất liệu">
          <Input value={matreial != null ? matreial.name : null} readOnly />
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Input
            value={
              matreial != null
                ? matreial.status == "DANG_SU_DUNG"
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
              matreial != null
                ? moment(matreial.createdDate).format("DD-MM-YYYY")
                : null
            }
            readOnly
          />
        </Form.Item>

        <Form.Item label="Ngày cập nhật">
          <Input
            value={
              matreial != null
                ? moment(matreial.lastModifiedDate).format("DD-MM-YYYY")
                : null
            }
            readOnly
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDetailMaterial;
