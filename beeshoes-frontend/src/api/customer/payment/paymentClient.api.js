import { requestCustomer } from "../../../helper/request";
export class PaymentClientApi {
  
  
    static paymentVnpay = ( data) => {
      return requestCustomer({
        method: "POST",
        url: `/client/payment/payment-vnpay` ,
        data: data
      });
    };

    static changeQuantityProductAfterPayment = ( data) => {
      return requestCustomer({
        method: "POST",
        url: `/client/payment/change-quantity-payment` ,
        data: data
      });
    };
    static minusQuantityProductDetail = (data) => {
      return requestCustomer({
        method: "POST",
        url: `/client/payment/minusQuantityProductDetail` ,
        data: data
      });
    };
    static refundQuantityProductDetail = (data) => {
      return requestCustomer({
        method: "POST",
        url: `/client/payment/refundQuantityProductDetail` ,
        data: data
      });
    };
  }