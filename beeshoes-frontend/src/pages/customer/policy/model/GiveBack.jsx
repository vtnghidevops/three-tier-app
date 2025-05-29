import { Col, Row } from "antd";

export default function Giveback() {
  return (
    <>
      <div>
        <h2>Chính sách trả hàng</h2>
        <br />
        <h3>CHÍNH SÁCH TRẢ DÀNH CHO KHÁCH HÀNG TẠI BEE Sneaker</h3>
        <Row justify={"center"}>
          <Col span={5} style={{ fontWeight: "bold" }}>
            THỜI GIAN
          </Col>
          <Col span={13} style={{ fontWeight: "bold" }}>
            SẢN PHẨM LỖI (TỪ PHÍA NHÀ CUNG CẤP)
          </Col>
          <Col span={6} style={{ fontWeight: "bold" }}>
            SẢN PHẨM KHÔNG LỖI
          </Col>
        </Row>
        <Row justify={"center"}>
          <Col span={5}>02 ngày kể từ ngày nhận hàng</Col>
          <Col span={14}>Hỗ trợ trả Bee Sneaker trả phí vận chuyển</Col>
          <Col span={5}>Hỗ trợ trả Khách hàng trả phí vận</Col>
        </Row>
        <Row justify={"center"}>
          <Col span={5}>Quá 02 ngày</Col>
          <Col span={14}>Không hỗ trợ đổi trả</Col>
          <Col span={5}></Col>
        </Row>
        <br />
        <h3>CÁC TRƯỜNG HỢP CHẤP NHẬN TRẢ</h3>
        <p>- Sản phẩm bị lỗi do phía nhà cung cấp (sản phẩm hỏng, rách, dơ)</p>
        <p>- Mỗi hóa đơn được đổi trả duy nhất 1 lần.</p>
        <p>- Sản phẩm bị hư hại trong quá trình vận chuyển</p>
        <p>- Sản phẩm không áp dụng đợt giảm giá.</p>
        <p>
          - Sản phẩm không đúng với thông tin đơn hàng đã đặt (sai màu, sai mẫu,
          sai size,...)
        </p>
        <p>- Sản phẩm vẫn còn nguyên nhãn, tag, box</p>
        <p>
          - Sản phẩm chấp nhận trả phải thỏa các điều kiện trả trong vòng 02
          ngày kể từ ngày nhận hàng
        </p>
        <p>- Các trường hợp trả phải liên hệ trực tiếp với Bee Sneaker</p>
        <br />
        <h3>THỜI GIAN HOÀN TRẢ SẢN PHẨM; HOÀN TIỀN</h3>
        <h3>THỜI GIAN HOÀN TRẢ SẢN PHẨM:</h3>
        <p>
          - Bee Sneaker sẽ cho đơn vị vận chuyển thu hồi sản phẩm (đối với các
          đơn lỗi từ Nhà cung cấp) hoặc khách hàng tự gửi sản phẩm về (đối với
          các đơn không lỗi) trong vòng 03 ngày kể từ ngày yêu cầu được xác nhận
        </p>
        <p>- Sản phẩm phải trở về kho Bee Sneaker trong vòng 07 ngày</p>
        <p>- Sau khi kiểm tra và xác nhận thông tin sản phẩm:</p>
        <h3>THỜI GIAN HOÀN TIỀN:</h3>
        <p>Kể từ ngày các thông tin về sản phẩm đã được xác nhận</p>
        <p>
          - Hoàn tiền: Trong vòng 3-5 ngày hoàn trực tiếp vào tài khoản ngân
          hàng của khách hàng
        </p>
      </div>
      <div>
        <span style={{ fontWeight: "bold", color: "red" }}>* Note</span> : Khi
        trả hàng sẽ không được áp dụng voucher trước đó khi đã áp dụng vào hóa
        đơn.
      </div>
    </>
  );
}
