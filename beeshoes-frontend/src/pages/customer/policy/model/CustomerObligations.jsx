import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CustomerObligations() {
  return (
    <>
      <h2>Nghĩa vụ của khách hàng</h2>
      <h3>
        {" "}
        <FontAwesomeIcon
          icon={faCircle}
          style={{ fontSize: "5px", marginRight: "5px" }}
        />
        Quyền và nghĩa vụ của Khách Hàng
      </h3>
      <p>
        – BeeSneaker.com sẽ không tính thêm bất kỳ phụ phí nào liên quan đến
        dịch vụ và cổng thanh toán ngoại trừ các khoản được nêu rõ tại trang chi
        tiết đơn hàng
      </p>
      <p>
        – Việc đặt hàng xem là đã xác nhận nếu trang xác nhận đặt hàng được hiển
        thị cho Khách Hàng, ngay cả khi Khách Hàng không nhận được tin nhắn SMS
        hoặc Email vì bất cứ lý do nào;
      </p>
      <p>
        – Nếu không nhận được tin nhắn SMS/Email xác nhận hoặc hủy hàng vì bất
        cứ lý do nào, Khách Hàng có thể liên hệ BeeSneaker.com để được hỗ trợ
        gửi lại. Thông tin gửi qua SMS / Email có thể không được gửi hoặc đến
        chậm vì nhiều lý do nằm ngoài kiểm soát của BeeSneaker.com
      </p>
      <p>
        – Thời gian giao hàng ghi trên đơn hàng chỉ là thời gian dự kiến, nghĩa
        là sẽ có thể xảy ra trường hợp các giao hàng bị trì hoãn vì sự kiện
        khách quan nằm ngoài kiểm soát của Dosiin.
      </p>
      <p>
        – Tại thời điểm đặt hàng, Khách Hàng sẽ được yêu cầu cung cấp các thông
        tin cơ bản sau đây:
      </p>
      <div style={{ marginLeft: "30px" }}>
        <p>+ Họ và tên Khách Hàng / Họ và tên người nhận hàng;</p>
        <p>+ Số điện thoại nhận hàng;</p>
        <p>+ Địa chỉ nhận hàng;</p>
        <p>+ Email.</p>
      </div>
      <p>
        – Khi đặt hàng tại BeeSneaker.com, hành khách đã đồng ý cho phép
        BeeSneaker.com gọi điện, Email, gửi tin SMS hoặc gửi thông báo để cung
        cấp thông tin hoặc lấy thông tin liên quan đến việc đặt hàng của Khách
        Hàng;
      </p>
      <p>
        – Trong trường hợp không có sản phẩm giao cho Khách Hàng mặc dù Khách
        Hàng đã được xác nhận đơn đặt hàng, vì bất cứ lý do nào (hết hàng, sự
        kiện bất khả kháng, vấn đề vận chuyển, …), Khách Hàng được quyền lựa
        chọn 1 trong các phương thức hỗ trợ sau:
      </p>
      <div style={{ marginLeft: "30px" }}>
        <p>
          + BeeSneaker.com hỏi ý kiến Khách Hàng về việc hỗ trợ đổi sang sản
          phẩm tương tự mà không thu thêm phí nào khác ngoài giá sản phẩm đã
          được niêm yết trên website;
        </p>
        <p>
          + Hoàn lại tiền mua hàng cho Khách Hàng đối với sản phẩm hết hàng và
          Khách Hàng không có nhu cầu mua sản phẩm cùng loại tương tự khác.
        </p>
      </div>
      <p>
        – Khách Hàng cần phải thường xuyên đọc và tuân theo các Chính sách và
        Quy định của Quy Chế Hoạt Động đang được đăng trên BeeSneaker.com để có
        thể hiểu và thực hiện được các Chính sách và Quy định tại thời điểm đó
      </p>
    </>
  );
}
