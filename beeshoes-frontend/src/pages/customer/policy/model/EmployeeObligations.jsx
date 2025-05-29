import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EmployeeObligations() {
  return (
    <>
      <h2>Nghĩa vụ của người bán</h2>
      <br />
      <h3>
        {" "}
        <FontAwesomeIcon
          icon={faCircle}
          style={{ fontSize: "5px", marginRight: "5px" }}
        />
        Quyền và nghĩa vụ của Nhà Bán Hàng:
      </h3>
      <p>
        – Nhằm bảo vệ quyền lợi Nhà Bán Hàng, Ban quản lý BeeSneaker.com cung
        cấp cho các Nhà Bán Hàng những thông tin quan trọng cần biết trước khi
        BeeSneaker.com tiến hành bán sản phẩm của Nhà Bán Hàng;
      </p>
      <p>
        – Được biết những thông tin phản hồi của Khách Hàng về chất lượng sản
        phẩm mà Nhà Bán Hàng cung cấp cho Khách Hàng khi có sự đồng ý của Ban
        quản lý BeeSneaker.com;
      </p>
      <p>
        – Nhà Bán Hàng phải hoàn toàn chịu trách nhiệm về chất lượng sản phẩm
        được đăng tải trên BeeSneaker.com. Trong mọi trường hợp, Nhà Bán Hàng
        phải có trách nhiệm giải quyết mọi khiếu nại của khách hàng liên quan
        tới chất lượng của dịch vụ cung cấp.
      </p>
      <p>
        – Nhà Bán Hàng bắt buộc phải có trách nhiệm cung cấp các sản phẩm của
        mình đã được đăng lên trên BeeSneaker.com khi Khách Hàng đã đặt mua trực
        tuyến. Trong trường hợp Nhà Bán Hàng không cung cấp dịch vụ hoặc không
        cung cấp dịch vụ được như nội dung đăng tải trên website cho Khách Hàng
        mà không kịp thời thông báo lý do cho Ban quản lý BeeSneaker.com thì Ban
        quản lý BeeSneaker.com có trách nhiệm liên hệ với Nhà Bán Hàng để giải
        quyết đồng thời yêu cầu Nhà Bán Hàng bồi thường cho Khách Hàng và
        BeeSneaker.com nếu có thiệt hại do Nhà Bán Hàng gây ra.
      </p>
      <p>
        – Mọi thông tin giao dịch được bảo mật và không được chuyển giao cho bên
        thứ 3 nào khác, trừ trường hợp buộc phải cung cấp khi Cơ quan pháp luật
        yêu cầu.
      </p>
      <p>
        – Các quyền và trách nhiệm khác được quy định cụ thể tại Hợp đồng dịch
        vụ thương mại điện tử
      </p>
    </>
  );
}
