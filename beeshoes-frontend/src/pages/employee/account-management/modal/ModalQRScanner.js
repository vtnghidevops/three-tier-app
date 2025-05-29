import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "antd";
import { QrReader } from "react-qr-reader";

const ModalQRScanner = ({ visible, onCancel, onQRCodeScanned }) => {
  const [qrCode, setQRCode] = useState(null);
  const qrReaderRef = useRef(null);

  const handleScan = (data) => {
    if (data) {
      setQRCode(data.text);
      onQRCodeScanned(data.text);
    }
  };

  const handleCloseModal = () => {
    if (qrReaderRef.current) {
      qrReaderRef.current.closeImageDialog();
    }
    setQRCode(null);
    onCancel();
  };

  useEffect(() => {
    if (!visible) {
      if (qrReaderRef.current) {
        qrReaderRef.current.closeImageDialog();
      }
      setQRCode(null);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onCancel={handleCloseModal}
      footer={[
        <Button key="cancel" onClick={handleCloseModal}>
          Hủy
        </Button>,
      ]}
    >
      <QrReader
        delay={300}
        style={{ width: "100%" }}
        onResult={handleScan}
        ref={qrReaderRef}
      />
      {qrCode && <p>{qrCode}</p>}
    </Modal>
  );
};

export default ModalQRScanner;
