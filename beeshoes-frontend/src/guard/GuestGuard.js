const GuestGuard = ({ children }) => {
  // để check những màn hình k cần đăng nhập
  // Token có hay ko => Nếu ko thì cho phép vào trang
  //  Token có , 2 TH: hết hạn, còn hạn. Nếu còn hạn thì về trang chủ k cho đăng nhập
  // Nếu hết hạn thì cho phép ở lại children

  return children;
};

export default GuestGuard;