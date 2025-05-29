import React, { useState } from "react";
import { Modal, Button, Row, Col, Input } from "antd";
import "./style-addSize.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { SizeApi } from "../../../../api/employee/size/Size.api";
import { useAppDispatch } from "../../../../app/hook";
import { SetSize } from "../../../../app/reducer/Size.reducer";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ModalAddListSizeProduct = ({ visible, onCancel, onSaveData }) => {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const dispatch = useAppDispatch();
  const [listSize, setListSize] = useState([]);
  const [isAddSizeModalVisible, setAddSizeModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const getList = () => {
    SizeApi.getAll().then((res) => {
      setListSize(res.data.data);
      dispatch(SetSize(res.data.data));
    });
  };

  useEffect(() => {
    getList();
  }, []);

  const handleOkAddSize = async () => {
    if (inputValue.trim() !== "") {
      try {
        const response = await SizeApi.getOneByName(inputValue);
        if (response && response.data && response.data.data !== null) {
          toast.error("Kích cỡ đã tồn tại");
        } else {
          setListSize([...listSize, { name: inputValue.trim() }]);
          setInputValue("");

          SizeApi.create({
            name: inputValue.trim(),
            status: "DANG_SU_DUNG",
          });
          toast.success("Thêm thành công");
        }
      } catch (error) {
        console.error(error);
      }
    }
    setAddSizeModalVisible(false);
  };

  const handleChange = (e) => {
    if (e.target.value > 100) {
      toast.warning("Vui lòng nhập kích cỡ không quá 100");
      return;
    }
    setInputValue(e.target.value);
  };

  const handleOk = () => {
    if (selectedSizes.length > 0) {
      const selectedSizeData = selectedSizes.map((size) => ({
        id: size.id,
        size: size.name,
      }));

      onSaveData(selectedSizeData);
      setSelectedSizes([]);
      onCancel();
    }
  };

  const toggleSizeSelection = (size) => {
    setSelectedSizes((prevSelected) =>
      prevSelected.includes(size)
        ? prevSelected.filter((selected) => selected !== size)
        : [...prevSelected, size]
    );
  };

  const handleCancel = () => {
    setInputValue("");
    onCancel();
  };

  return (
    <>
      <Modal
        title="Chọn kích cỡ "
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Thêm"
        cancelText="Hủy"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <Button
            onClick={() => setAddSizeModalVisible(true)}
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            Thêm kích thước
          </Button>
        </div>
        <Row gutter={[16, 16]}>
          {/* Hiển thị các nút button cho các kích thước */}
          {listSize.map((size) => (
            <Col key={size.id} span={6}>
              <Button
                block
                className={selectedSizes.includes(size) ? "selected" : ""}
                onClick={() => toggleSizeSelection(size)}
              >
                {size.name}
              </Button>
            </Col>
          ))}
        </Row>
      </Modal>
      <Modal
        title="Nhập kích cỡ"
        visible={isAddSizeModalVisible}
        onOk={handleOkAddSize}
        onCancel={() => setAddSizeModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input value={inputValue} onChange={handleChange} />
        </div>
      </Modal>
    </>
  );
};

export default ModalAddListSizeProduct;
