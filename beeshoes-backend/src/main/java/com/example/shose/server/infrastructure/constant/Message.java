package com.example.shose.server.infrastructure.constant;

/**
 * @author Nguyễn Vinh
 */
public enum Message {

    SUCCESS("Success"),
    ERROR_UNKNOWN("Error Unknown"),
    NOT_EXISTS("Không tồn tại"),

    NAME_EXISTS("Tên đã tồn tại"),

    COLOR_NAME_EXISTS("Màu sắc đã tồn tại"),
    CODE_EXISTS("Mã đã tồn tại"),
    CHANGED_STATUS_ERROR("không thể xác nhận hóa đơn"),

    BILL_NOT_EXIT("Hóa đơn không tồn tại "),
    ACCOUNT_NOT_EXIT("Tài khoản không tồn tại"),
    ACCOUNT_NOT_PERMISSION("Tài khoản không có quyền tạo hóa đơn"),
    BILL_NOT_REFUND("Hóa đơn không thể trả hàng"),
    ERROR_QUANTITY("Số lượng sản phẩm không đủ để mua"),
    ERROR_TOTALMONEY("Tiền trả phải lớn hơn hoặc bằng phải trả"),

    PHONENUMBER_USER_EXIST("Số điện thoại người dùng đã tồn tại "),
    VOUCHER_NOT_USE("không thể sử dụng voucher"),
    STATUS_ADDRESS_EXIST("Trạng thái đang sử dụng đã được dùng cho địa chỉ khác"),
    ACCOUNT_NOT_ROLE_CANCEL_BILL("Bạn không có quyền huỷ hoá đơn"),
    ACCOUNT_NOT_ROLE(" Bạn không đủ quyền hạn "),
    ACCOUNT_IS_EXIT("Vui lòng đăng nhập"),
    EMAIL_USER_EXIST("Email người dùng đã tồn tại"),
    PASSWORD_NOT_EXISTS("Password không đúng"),
    NOT_PAYMENT_PRODUCT("Sản phẩm đã dừng bán"),
    ERROR_HASHSECRET("Lỗi chữ ký"),
    ERROR_SQL("Thao tác quá nhiều lần"),
    ERROR_CANCEL_BILL("Lỗi khi hủy đơn hàng"),
    PAYMENT_TRANSACTION("Mã giao dịch đã tồn tại"),
    PAYMENT_ERROR("Thanh toán thất bại"),
    NOT_PAYMENT("Đơn hàng không thể tiếp tục thanh toán"),
    ERROR_ROLLBACK("Hóa đơn đã quá hạn không thể quay  lại"),
    VALIDATE_PASSWORD("Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 số");





    private String message;

    Message(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
