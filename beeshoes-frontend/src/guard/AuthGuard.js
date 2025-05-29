const AuthGuard = ({ children }) => {
  // Kiểm tra token có hay ko => có thì tiếp tục => về login
  // Xác thực token
  // Call api xác thực => token trả ra => có thông tin user => có quyền
  // phân quyền , k có quyền => 403
  // để check những màn hình bắt buộc phải đăng nhập thì mới được vào

  return children;
};

export default AuthGuard;
