import "./App.css";
import { useState, useEffect } from "react";
import { AppConfig } from "./AppConfig";
import { ToastContainer } from "react-toastify";
import AuthGuard from "./guard/AuthGuard";
import GuestGuard from "./guard/GuestGuard";
import DashBoardCustomer from "./component/customer/DashBoardCustomer";
import Home from "./pages/customer/home/Home";
import Products from "./pages/customer/products/Products";
import Cart from "./pages/customer/cart/Cart";
import Payment from "./pages/customer/payment/Payment";
import PaymentAccount from "./pages/customer/payment/PaymentAccount";
import { CartProvider } from "./pages/customer/cart/CartContext";
import DashBoardEmployee from "./component/employee/DashBoardEmployee";
import ProductManagement from "./pages/employee/product-management/ProductManagement";
import CreatePromotionManagement from "./pages/employee/promotion-management/CreatePromotionManagement";
import UpdatePromotionManagement from "./pages/employee/promotion-management/UpdatePromotionManagement";
import Dashboard from "./pages/employee/dashboard/DashBoard";
import CategoryManagement from "./pages/employee/category-management/CategoryManagement";
import BrandManagement from "./pages/employee/brand-management/BrandManagement";
import MaterialManagement from "./pages/employee/material-management/MaterialManagement";
import SoleManagement from "./pages/employee/sole-management/SoleManagement";
import AccountManagement from "./pages/employee/account-management/AccountManagement";
import CreateProductManagment from "./pages/employee/product-management/CreateProductManagment";
import PromotionManagement from "./pages/employee/promotion-management/PromotionManagement";
import VoucherManagement from "./pages/employee/voucher-management/VoucherManagement";
import BillManagement from "./pages/employee/bill-management/BillManagement";
import DetailBill from "./pages/employee/bill-management/DetailBill";
import CreateBill from "./pages/employee/bill-management/CreateBill";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CustomerManagement from "./pages/employee/customer-management/CustomerManagement";
import ModalCreateAccount from "./pages/employee/account-management/modal/ModalCreateAccount";
import ModalUpdateAccount from "./pages/employee/account-management/modal/ModalUpdateAccount";
import ModalDetailAccount from "./pages/employee/account-management/modal/ModalDetailAccount";
import ModalCreateCustomer from "./pages/employee/customer-management/modal/ModalCreateCustomer";
import ModalUpdateCustomer from "./pages/employee/customer-management/modal/ModalUpdateCustomer";
import ModalDetailCustomer from "./pages/employee/customer-management/modal/ModalDetailCustomer";
import Sale from "./pages/employee/bill-management/Sale";
import UpdateProductDetailManagment from "./pages/employee/product-management/UpdateProductDetailManagment";
import loading from "./../src/assets/images/s_discount_icon.png";
import PayMentSuccessful from "./pages/employee/bill-management/PayMentSuccessful";
import PayMentSuccess from "./pages/customer/payment/PaymentSuccess";
import LoginManagement from "./pages/employee/login-management/LoginManagement";
import DetailProduct from "./pages/customer/detailProduct/DetailProduct";
import { useAppDispatch, useAppSelector } from "../src/app/hook";
import { VoucherApi } from "../src/api/employee/voucher/Voucher.api";
import {
  UpdateVoucher,
  GetVoucher,
  SetVoucher,
} from "../src/app/reducer/Voucher.reducer";
import { PromotionApi } from "../src/api/employee/promotion/Promotion.api";
import Login from "./pages/customer/login/Login";
import {
  UpdatePromotion,
  GetPromotion,
  SetPromotion,
} from "../src/app/reducer/Promotion.reducer";
import dayjs from "dayjs";
import { GetLoading } from "./app/reducer/Loading.reducer";
import DetailBillClinet from "./pages/customer/bill/DetailBillClinet";
import SearchBill from "./pages/customer/bill/SearchBill";
import Profile from "./pages/customer/account/profile/Profile";
import LayoutAccount from "./pages/customer/account/layout/LayoutAccount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Address from "./pages/customer/account/address/Address";
import Password from "./pages/customer/account/password/Password";
import Purchase from "./pages/customer/account/purchase/Purchase";
import Notification from "./pages/customer/account/notification/Notification";
import RepoVoucher from "./pages/customer/account/voucher/Voucher";
import Policy from "./pages/customer/policy/Policy";
import SignUp from "./pages/customer/signup/SignUp";
import GiveBackManagement from "./pages/employee/give-back-management/GiveBackManagement";
import NotFound from "./pages/404";
import NotAuthorized from "./pages/403";
import DetailBillGiveBack from "./pages/employee/give-back-management/DetailBill";
import BillDetailAccount from "./pages/customer/account/purchase/billdetail/BillDetailAccount";
function App() {
  const pathname = window.location.pathname;
  useEffect(() => {
    console.log(pathname);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);
  const [showOnTop, setShowOnTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowOnTop(true);
      } else {
        setShowOnTop(false);
      }
    };

    // Gắn sự kiện cuộn vào cửa sổ
    window.addEventListener("scroll", handleScroll);
    // Gỡ bỏ sự kiện cuộn khi component bị hủy
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 20);
    }
  };
  const dispatch = useAppDispatch();
  const dataVoucher = useAppSelector(GetVoucher);
  const dataPromotion = useAppSelector(GetPromotion);
  const updateItemList = (items, api, updateFunction) => {
    const now = dayjs();
    items.forEach((item) => {
      const endDate = dayjs.unix(item.endDate / 1000);
      const startDate = dayjs.unix(item.startDate / 1000);
      if (endDate.isSame(now, "second") || startDate.isSame(now, "second")) {
        api(item.id)
          .then((res) => {
            dispatch(updateFunction(res.data.data));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  const updateItemListQuantity = (items, api, updateFunction) => {
    items.forEach((item) => {
      if (item.quantity < 1 && item.status==='DANG_SU_DUNg') {
        api(item.id)
          .then((res) => {
            dispatch(updateFunction(res.data.data));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  useEffect(() => {
    VoucherApi.fetchAll("").then(
      (res) => {
        dispatch(SetVoucher(res.data.data));
      },
      (err) => {
        console.log(err);
      }
    );

    PromotionApi.fetchAll("").then(
      (res) => {
        dispatch(SetPromotion(res.data.data));
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  useEffect(() => {
    const intervalVoucher = setInterval(() => {
      updateItemList(dataVoucher, VoucherApi.updateStatus, UpdateVoucher);
      updateItemListQuantity(
        dataVoucher,
        VoucherApi.updateStatusQuantity,
        UpdateVoucher
      );
    }, 1000);

    return () => clearInterval(intervalVoucher);
  }, [dataVoucher]);

  useEffect(() => {
    const intervalPromotion = setInterval(() => {
      updateItemList(dataPromotion, PromotionApi.updateStatus, UpdatePromotion);
    }, 1000);

    return () => clearInterval(intervalPromotion);
  }, [dataPromotion]);

  const isLoading = useAppSelector(GetLoading);

  return (
    <div className="App">
      {showOnTop ? (
        <div
          className="button-on-top"
          onClick={() => {
            // Khi nút lên đầu trang được nhấn, cuộn trang lên đầu
            scrollToTop(); // Cuộn mượt lên đầu trang
          }}
        >
          <FontAwesomeIcon
            style={{ color: "white", fontSize: 20 }}
            icon={faArrowUp}
          />
        </div>
      ) : null}

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-logo">
            <img src={loading} alt="Logo" />
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter basename={AppConfig.routerBase}>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/not-authorization" element={<NotAuthorized />} />
          <Route
            path="/login"
            element={
              <GuestGuard>
                <Login />
              </GuestGuard>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestGuard>
                <SignUp />
              </GuestGuard>
            }
          />
          <Route
            path="/home"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <Home />
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/bill/:code/:phoneNumber"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <DetailBillClinet />
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/products"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <Products />
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/detail-product/:id"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <DetailProduct />
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <LayoutAccount>
                      <Profile />
                    </LayoutAccount>
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/policy"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <Policy />
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/account-address"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <LayoutAccount>
                      <Address />
                    </LayoutAccount>
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/account-password"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <LayoutAccount>
                      <Password />
                    </LayoutAccount>
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/purchase"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <LayoutAccount>
                      <Purchase />
                    </LayoutAccount>
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/notification"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <LayoutAccount>
                      <Notification />
                    </LayoutAccount>
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/purchase/:id"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <LayoutAccount>
                      <BillDetailAccount />
                    </LayoutAccount>
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/repository-voucher"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <LayoutAccount>
                      <RepoVoucher />
                    </LayoutAccount>
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/cart"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <Cart />
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/payment"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <Payment />
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/payment-acc"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <PaymentAccount />
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/client/payment/payment-success"
            element={
              <GuestGuard>
                <CartProvider>
                  <PayMentSuccess />
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/login-management"
            element={
              <AuthGuard>
                <LoginManagement />
              </AuthGuard>
            }
          />
          <Route
            path="/detail-give-back/:id"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <DetailBillGiveBack />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/bill-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <BillManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/give-back-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <GiveBackManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/payment/payment-success"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <PayMentSuccessful />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/bill-management/detail-bill/:id"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <DetailBill />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/sale-counter"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <Sale />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/create-bill"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <CreateBill />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/product-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <ProductManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/create-product-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <CreateProductManagment />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/product-detail-management/:id"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <UpdateProductDetailManagment />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <Dashboard />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/category-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <CategoryManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/material-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <MaterialManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/brand-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <BrandManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/sole-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <SoleManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/staff-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <AccountManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/create-staff-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <ModalCreateAccount />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/update-staff-management/:id"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <ModalUpdateAccount />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/detail-staff-management/:id"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <ModalDetailAccount />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/customer-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <CustomerManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/sreach-bill"
            element={
              <GuestGuard>
                <CartProvider>
                  <DashBoardCustomer>
                    <SearchBill />
                  </DashBoardCustomer>
                </CartProvider>
              </GuestGuard>
            }
          />
          <Route
            path="/create-customer-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <ModalCreateCustomer />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/update-customer-management/:id"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <ModalUpdateCustomer />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/detail-customer-management/:id"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <ModalDetailCustomer />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/promotion-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <PromotionManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/create-promotion-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <CreatePromotionManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/update-promotion-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <UpdatePromotionManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
          <Route
            path="/voucher-management"
            element={
              <AuthGuard>
                <DashBoardEmployee>
                  <VoucherManagement />
                </DashBoardEmployee>
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
