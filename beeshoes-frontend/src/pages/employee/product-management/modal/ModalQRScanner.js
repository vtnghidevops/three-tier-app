import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "antd";
import { QrReader } from "react-qr-reader";

const QRScannerModal = ({ visible, onCancel, onQRCodeScanned }) => {
  const [qrCode, setQRCode] = useState(null);
  const qrReaderRef = useRef(null);

  const handleScan = (data) => {
    if (data) {
      setQRCode(data.text);
      onQRCodeScanned(data.text);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const handleCloseModal = () => {
    if (qrReaderRef.current) {
      qrReaderRef.current.closeImageDialog(); // Đóng camera khi đóng Modal
    }
    setQRCode(null); // Reset QR code when closing the modal
    onCancel();
  };

  useEffect(() => {
    // Mỗi khi Modal hiển thị hoặc ẩn đi, kiểm tra và đóng camera nếu cần
    if (!visible && qrReaderRef.current) {
      qrReaderRef.current.closeImageDialog();
    }
  }, [visible]);

  return (
    <Modal
      title="QR Code Scanner"
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
        onError={handleError}
        style={{ width: "100%" }}
        onResult={handleScan}
        ref={qrReaderRef} // Gán ref cho thư viện quét mã QR
      />
      {qrCode && <p>Scanned QR Code: {qrCode}</p>}
    </Modal>
  );
};

export default QRScannerModal;
