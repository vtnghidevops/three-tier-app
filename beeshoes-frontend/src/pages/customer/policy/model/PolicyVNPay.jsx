export default function PolicyVNPay() {
  return (
    <>
      <h2>Chính sách bảo mật thông tin thanh toán</h2>
      <br />
      <h3>1. Cam kết bảo mật</h3>
      <p>
        Hệ thống thanh toán thẻ được cung cấp bởi các đối tác cổng thanh toán
        (“Đối Tác Cổng Thanh Toán”) đã được cấp phép hoạt động hợp pháp tại Việt
        Nam. Theo đó, các tiêu chuẩn bảo mật thanh toán thẻ tại BeeSneaker.com
        đảm bảo tuân thủ theo các tiêu chuẩn bảo mật ngành.
      </p>
      <h3>2. Quy định bảo mật</h3>
      <p>
        Chính sách giao dịch thanh toán bằng thẻ quốc tế và thẻ nội địa
        (internet banking) đảm bảo tuân thủ các tiêu chuẩn bảo mật của các Đối
        Tác Cổng Thanh Toán gồm:
      </p>
      <div style={{ marginLeft: "30px" }}>
        <p>
          - Chứng nhận tiêu chuẩn bảo mật dữ liệu thông tin thanh toán (PCI DSS)
          do Trustwave cung cấp. Mật khẩu sử dụng một lần (OTP) được gửi qua SMS
          để đảm bảo việc truy cập tài khoản được xác thực.
        </p>
        <p>- Tiêu chuẩn mã hóa MD5 128 bit.</p>
        <p>
          - Các nguyên tắc và quy định bảo mật thông tin trong ngành tài chính
          ngân hàng theo quy định của Ngân hàng nhà nước Việt Nam.
        </p>
        <p>
          - Chính sách bảo mật giao dịch trong thanh toán của BeeSneaker.com áp
          dụng với Khách hàng: BEE Sneaker cung cấp tiện ích lưu giữ token chỉ
          lưu chuỗi đã được mã hóa bởi Đối Tác Cổng Thanh Toán cung cấp cho
          BeeSneaker. BeeSneaker không trực tiếp lưu trữ thông tin thẻ khách
          hàng. Việc bảo mật thông tin thẻ thanh toán Khách hàng được thực hiện
          bởi Đối Tác Cổng Thanh Toán đã được cấp phép.
        </p>
        <p>
          - Đối với thẻ quốc tế: thông tin thẻ thanh toán của Khách hàng mà có
          khả năng sử dụng để xác lập giao dịch không được lưu trên hệ thống của
          BeeSneaker.com. Đối Tác Cổng Thanh Toán sẽ lưu trữ và bảo mật.
        </p>
        <p>
          - Đối với thẻ nội địa (internet banking), dosi-in chỉ lưu trữ mã đơn
          hàng, mã giao dịch và tên ngân hàng.
        </p>
      </div>
      <br />
      <p>
        BEE Sneaker cam kết đảm bảo thực hiện nghiêm túc các biện pháp bảo mật
        cần thiết cho mọi hoạt động thanh toán thực hiện trên sàn giao dịch
        thương mại điện tử BeeSneaker.com
      </p>
    </>
  );
}
