package com.example.shose.server.service.impl;

import com.example.shose.server.dto.request.bill.billcustomer.BillDetailOnline;
import com.example.shose.server.dto.request.payMentMethod.CreatePayMentMethodTransferRequest;
import com.example.shose.server.dto.request.paymentsmethod.CreatePaymentsMethodRequest;
import com.example.shose.server.dto.request.paymentsmethod.QuantityProductPaymentRequest;
import com.example.shose.server.dto.response.bill.InvoiceResponse;
import com.example.shose.server.dto.response.payment.PayMentVnpayResponse;
import com.example.shose.server.entity.Account;
import com.example.shose.server.entity.Bill;
import com.example.shose.server.entity.BillHistory;
import com.example.shose.server.entity.HistoryPoin;
import com.example.shose.server.entity.PaymentsMethod;
import com.example.shose.server.entity.ProductDetail;
import com.example.shose.server.entity.ScoringFormula;
import com.example.shose.server.entity.User;
import com.example.shose.server.infrastructure.constant.Message;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.constant.StatusBill;
import com.example.shose.server.infrastructure.constant.StatusMethod;
import com.example.shose.server.infrastructure.constant.StatusPayMents;
import com.example.shose.server.infrastructure.constant.TypePoin;
import com.example.shose.server.infrastructure.constant.VnPayConstant;
import com.example.shose.server.infrastructure.email.SendEmailService;
import com.example.shose.server.infrastructure.exception.rest.RestApiException;
import com.example.shose.server.infrastructure.exportPdf.ExportFilePdfFormHtml;
import com.example.shose.server.repository.AccountRepository;
import com.example.shose.server.repository.BillHistoryRepository;
import com.example.shose.server.repository.BillRepository;
import com.example.shose.server.repository.HistoryPoinRepository;
import com.example.shose.server.repository.PaymentsMethodRepository;
import com.example.shose.server.repository.ProductDetailRepository;
import com.example.shose.server.repository.ScoringFormulaRepository;
import com.example.shose.server.repository.UserReposiory;
import com.example.shose.server.service.PaymentsMethodService;
import com.example.shose.server.util.FormUtils;
import com.example.shose.server.util.payMent.Config;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

/**
 * @author thangdt
 */
@Service
@Transactional
public class PaymentsMethodServiceImpl implements PaymentsMethodService {

    @Autowired
    private PaymentsMethodRepository paymentsMethodRepository;

    @Autowired
    private BillHistoryRepository billHistoryRepository;

    @Autowired
    private SpringTemplateEngine springTemplateEngine;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private HistoryPoinRepository historyPoinRepository;

    @Autowired
    private ExportFilePdfFormHtml exportFilePdfFormHtml;

    @Autowired
    private SendEmailService sendEmailService;

    @Autowired
    private ScoringFormulaRepository scoringFormulaRepository;


    @Autowired
    private UserReposiory userReposiory;


    private FormUtils formUtils = new FormUtils();

    @Override
    public List<PaymentsMethod> findByAllIdBill(String idBill) {
        Optional<Bill> bill = billRepository.findById(idBill);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        return paymentsMethodRepository.findAllByBill(bill.get());
    }

    @Override
    public PaymentsMethod create(String idBill, String idEmployees, CreatePaymentsMethodRequest request) {
        Optional<Bill> bill = billRepository.findById(idBill);
        Optional<Account> account = accountRepository.findById(idEmployees);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        if (!account.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        if (bill.get().getStatusBill() == StatusBill.DA_HUY) {
            throw new RestApiException(Message.NOT_PAYMENT);
        }
        BigDecimal payment = paymentsMethodRepository.sumTotalMoneyByIdBill(idBill);
        if ((bill.get().getStatusBill() != StatusBill.DA_THANH_TOAN || bill.get().getStatusBill() != StatusBill.THANH_CONG || bill.get().getStatusBill() != StatusBill.TRA_HANG) && bill.get().getTotalMoney().compareTo(payment) >= 0) {
            bill.get().setStatusBill(StatusBill.DA_THANH_TOAN);
            BillHistory billHistory = new BillHistory();
            billHistory.setBill(bill.get());
            billHistory.setStatusBill(StatusBill.DA_THANH_TOAN);
            billHistory.setActionDescription("Thanh toán hóa đơn");
            billHistory.setEmployees(account.get());
            billHistoryRepository.save(billHistory);
            billRepository.save(bill.get());
        }
        PaymentsMethod paymentsMethod = formUtils.convertToObject(PaymentsMethod.class, request);
        paymentsMethod.setBill(bill.get());
        paymentsMethod.setDescription(request.getActionDescription());
        paymentsMethod.setEmployees(account.get());
        return paymentsMethodRepository.save(paymentsMethod);
    }

    @Override
    public BigDecimal sumTotalMoneyByIdBill(String idBill) {
        return paymentsMethodRepository.sumTotalMoneyByIdBill(idBill);
    }

    @Override
    public String payWithVNPAY(CreatePayMentMethodTransferRequest payModel, HttpServletRequest request) throws UnsupportedEncodingException {

        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        LocalDateTime expireTime = now.plusMinutes(15);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String vnp_CreateDate = now.format(formatter);
        String vnp_ExpireDate = expireTime.format(formatter);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VnPayConstant.vnp_Version);
        vnp_Params.put("vnp_Command", VnPayConstant.vnp_Command);
        vnp_Params.put("vnp_TmnCode", VnPayConstant.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", payModel.vnp_Ammount + "00");
        vnp_Params.put("vnp_BankCode", VnPayConstant.vnp_BankCode);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_CurrCode", VnPayConstant.vnp_CurrCode);
        vnp_Params.put("vnp_IpAddr", Config.getIpAddress(request));
        vnp_Params.put("vnp_Locale", VnPayConstant.vnp_Locale);
        vnp_Params.put("vnp_OrderInfo", payModel.vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", payModel.vnp_OrderType);
        vnp_Params.put("vnp_ReturnUrl", VnPayConstant.vnp_ReturnUrl);
        vnp_Params.put("vnp_TxnRef", String.valueOf(payModel.vnp_TxnRef));
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldList = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldList);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator itr = fieldList.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append("=");
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append("=");
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                if (itr.hasNext()) {
                    query.append("&");
                    hashData.append("&");
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = Config.hmacSHA512(VnPayConstant.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnPayConstant.vnp_Url + "?" + queryUrl;
        return paymentUrl;
    }

    @Override
    public boolean refundVnpay(String idUser, boolean status, String codeBill, HttpServletRequest request) {
        Optional<Bill> bill = billRepository.findByCode(codeBill);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        Optional<Account> account = accountRepository.findById(idUser);
        List<PaymentsMethod> paymentsMethods = paymentsMethodRepository.findAllByBill(bill.get()).stream().filter(paymentMethod -> paymentMethod.getMethod().equals(StatusMethod.CHUYEN_KHOAN)).collect(Collectors.toList());
        if (paymentsMethods.size() != 0 && status) {
            PaymentsMethod paymentsMethod = paymentsMethods.get(0);
            String vnp_TxnRef = paymentsMethod.getBill().getCode() + "-"+ paymentsMethod.getCreateAt();
            String vnp_RequestId = RandomStringUtils.randomNumeric(8);
            String vnp_Version = "2.1.0";
            String vnp_Command = "refund";
            String vnp_TmnCode = VnPayConstant.vnp_TmnCode;
            String vnp_TransactionType = "02";
            String vnp_Amount = String.valueOf(paymentsMethod.getTotalMoney()).replace(".", "");
            String vnp_OrderInfo = "Hoan tien GD";
            String vnp_TransactionNo = paymentsMethod.getVnp_TransactionNo();
            String vnp_TransactionDate = String.valueOf(paymentsMethod.getTransactionDate());
            String vnp_CreateBy = Config.removeDiacritics(account.get().getUser().getFullName());

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());

            String vnp_IpAddr = Config.getIpAddress(request);

            JsonObject vnp_Params = new JsonObject ();

            //63562614
            //20230616094041

            vnp_Params.addProperty("vnp_RequestId", vnp_RequestId);
            vnp_Params.addProperty("vnp_Version", vnp_Version);
            vnp_Params.addProperty("vnp_Command", vnp_Command);
            vnp_Params.addProperty("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.addProperty("vnp_TransactionType", vnp_TransactionType);
            vnp_Params.addProperty("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.addProperty("vnp_Amount", vnp_Amount);
            vnp_Params.addProperty("vnp_TransactionNo", vnp_TransactionNo);
            vnp_Params.addProperty("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.addProperty("vnp_TransactionDate", vnp_TransactionDate);
            vnp_Params.addProperty("vnp_CreateBy", vnp_CreateBy);
            vnp_Params.addProperty("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.addProperty("vnp_IpAddr", vnp_IpAddr);

            String hash_Data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" +
                    vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|"
                    + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;

            String vnp_SecureHash = Config.hmacSHA512(VnPayConstant.vnp_HashSecret, hash_Data.toString());

            vnp_Params.addProperty("vnp_SecureHash", vnp_SecureHash);

            System.out.println(vnp_Params.toString());
            try {
                URL url = new URL("https://sandbox.vnpayment.vn/merchant_webapi/api/transaction");
                HttpURLConnection con = (HttpURLConnection) url.openConnection();
                con.setRequestMethod("POST");
                con.setRequestProperty("Content-Type", "application/json");
                con.setDoOutput(true);
                DataOutputStream wr = new DataOutputStream(con.getOutputStream());
                wr.writeBytes(vnp_Params.toString());
                wr.flush();
                wr.close();
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(con.getInputStream()));
                String output;
                StringBuffer response = new StringBuffer();
                while ((output = in.readLine()) != null) {
                    response.append(output);
                }
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(response.toString());

                PaymentsMethod paymentsMethodRefound = new PaymentsMethod();
                paymentsMethodRefound.setBill(bill.get());
                paymentsMethodRefound.setDescription("Hoàn tiền");
                paymentsMethodRefound.setTotalMoney(new BigDecimal(jsonNode.get("vnp_Amount").asText().substring(0, jsonNode.get("vnp_Amount").asText().length() - 2)));
                paymentsMethodRefound.setStatus(StatusPayMents.HOAN_TIEN);
                paymentsMethodRefound.setMethod(StatusMethod.CHUYEN_KHOAN);
                paymentsMethodRefound.setEmployees(account.get());
                paymentsMethodRefound.setVnp_TransactionNo(jsonNode.get("vnp_TransactionNo").asText());
                paymentsMethodRefound.setCreatedDate(paymentsMethod.getCreateAt());
                paymentsMethodRefound.setTransactionDate(Long.parseLong(jsonNode.get("vnp_PayDate").asText()));
                paymentsMethodRepository.save(paymentsMethodRefound);
                in.close();
            } catch (Exception e) {
                throw new RestApiException(Message.ERROR_CANCEL_BILL);
            }
        }
        return true;

    }

    @Override
    public boolean refundPayment(String idUser, String codeBill, CreatePaymentsMethodRequest request) {
        Optional<Bill> bill = billRepository.findById(codeBill);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        Optional<Account> account = accountRepository.findById(idUser);
        if (!account.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        // if(bill.get().getEmployees().getRoles() == Roles.ROLE_USER || billHistoryRepository.checkBillVanChuyen(codeBill) > 0){
            BigDecimal payment = paymentsMethodRepository.sumTotalMoneyByIdBill(bill.get().getId());
            PaymentsMethod paymentsMethod = new PaymentsMethod();
            paymentsMethod.setBill(bill.get());
            paymentsMethod.setMethod(request.getMethod());
            paymentsMethod.setStatus(StatusPayMents.HOAN_TIEN);
            paymentsMethod.setTotalMoney(payment);
            paymentsMethod.setDescription(request.getActionDescription());
            paymentsMethod.setEmployees(account.get());
            paymentsMethod.setVnp_TransactionNo(request.getTransaction());
            paymentsMethodRepository.save(paymentsMethod);
        // }
        return true;
    }

    @Override
    public boolean paymentSuccess(String idEmployees, PayMentVnpayResponse response) {
        Optional<Account> account = accountRepository.findById(idEmployees);
        if (!account.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        if (Config.decodeHmacSha512(response.toParamsString(), response.getVnp_SecureHash(), VnPayConstant.vnp_HashSecret)) {
           if(response.getVnp_TransactionStatus().equals("00")){
               List<String> findAllByVnpTransactionNo = paymentsMethodRepository.findAllByVnpTransactionNo(response.getVnp_TransactionNo());
               if (findAllByVnpTransactionNo.size() > 0) {
                   throw new RestApiException(Message.PAYMENT_TRANSACTION);
               }
               Optional<Bill> bill = billRepository.findByCode(response.getVnp_TxnRef().split("-")[0]);
               bill.get().setLastModifiedDate(Calendar.getInstance().getTimeInMillis());
               PaymentsMethod paymentsMethod = new PaymentsMethod();
               paymentsMethod.setBill(bill.get());
               paymentsMethod.setDescription("Thanh toán thành công");
               paymentsMethod.setTotalMoney(new BigDecimal(response.getVnp_Amount().substring(0, response.getVnp_Amount().length() - 2)));
               paymentsMethod.setStatus(StatusPayMents.THANH_TOAN);
               paymentsMethod.setMethod(StatusMethod.CHUYEN_KHOAN);
               paymentsMethod.setEmployees(account.get());
               paymentsMethod.setVnp_TransactionNo(response.getVnp_TransactionNo());
               paymentsMethod.setCreateAt(Long.parseLong(response.getVnp_TxnRef().split("-")[1]));
               paymentsMethod.setTransactionDate(Long.parseLong(response.getVnp_PayDate()));
               paymentsMethodRepository.save(paymentsMethod);

               List<BillHistory> findAllByBill = billHistoryRepository.findAllByBill(bill.get());
               boolean checkBill = findAllByBill.stream().anyMatch(billHistory -> billHistory.getStatusBill() == StatusBill.THANH_CONG);
               List<ScoringFormula> scoringFormulas = scoringFormulaRepository.findAllByOrderByCreatedDateDesc();
               if (checkBill) {
                   bill.get().setStatusBill(StatusBill.THANH_CONG);
                   bill.get().setCompletionDate(Calendar.getInstance().getTimeInMillis());
                   if(bill.get().getAccount() != null && !scoringFormulas.isEmpty()){
                       User user = bill.get().getAccount().getUser();
                       ScoringFormula scoringFormula = scoringFormulas.get(0);
                       if(bill.get().getPoinUse() > 0){
                           int Pointotal = user.getPoints() - bill.get().getPoinUse() +  scoringFormula.ConvertMoneyToPoints(bill.get().getTotalMoney());
                           user.setPoints(Pointotal);
                           bill.get().setValuePoin(scoringFormula.ConvertPoinToMoney(bill.get().getPoinUse()));
                           historyPoinRepository.save(HistoryPoin.builder().bill(bill.get()).user(user).value(bill.get().getPoinUse()).typePoin(TypePoin.DIEM_SU_DUNG).scoringFormula(scoringFormula).build());
                       }else{
                           user.setPoints(user.getPoints() + scoringFormula.ConvertMoneyToPoints(bill.get().getTotalMoney()));
                       }
                       historyPoinRepository.save(HistoryPoin.builder().bill(bill.get()).user(user).value(scoringFormula.ConvertMoneyToPoints(bill.get().getTotalMoney())).typePoin(TypePoin.DIEM_THUONG).scoringFormula(scoringFormula).build());
                       userReposiory.save(user);
                   }
                   billRepository.save(bill.get());
               } else {
                   if(bill.get().getAccount() != null && !scoringFormulas.isEmpty()){
                       User user = bill.get().getAccount().getUser();
                       if(bill.get().getPoinUse() > 0){
                           ScoringFormula scoringFormula = scoringFormulas.get(0);
                           int Pointotal = user.getPoints() - bill.get().getPoinUse();
                           user.setPoints(Pointotal);
                           historyPoinRepository.save(HistoryPoin.builder().bill(bill.get()).typePoin(TypePoin.DIEM_SU_DUNG).value(bill.get().getPoinUse()).user(user).scoringFormula(scoringFormula).build());
                       }
                       userReposiory.save(user);
                   }
                   bill.get().setStatusBill(StatusBill.CHO_XAC_NHAN);
                   billRepository.save(bill.get());
                   billHistoryRepository.save(BillHistory.builder().statusBill(StatusBill.DA_THANH_TOAN).bill(bill.get()).employees(bill.get().getEmployees()).build());
               }
               CompletableFuture.runAsync(() -> createFilePdfAtCounter(bill.get().getId()), Executors.newCachedThreadPool());
               return true;
           }else{
               throw new RestApiException(Message.PAYMENT_ERROR);
           }
        }else{
            throw new RestApiException(Message.ERROR_HASHSECRET);
        }
    }

    @Override
    public boolean changeQuantityProduct(QuantityProductPaymentRequest request) {
        for (BillDetailOnline x : request.getBillDetail()) {
            ProductDetail productDetail = productDetailRepository.findById(x.getIdProductDetail()).get();
            productDetail.setQuantity(productDetail.getQuantity() + x.getQuantity());
            if (productDetail.getStatus() == Status.HET_SAN_PHAM) {
                productDetail.setStatus(Status.DANG_SU_DUNG);
            }
            productDetailRepository.save(productDetail);
        }
        return true;
    }

    @Override
    public boolean updatepayMent(String idBill, String idEmployees, List<String> ids) {
        Optional<Bill> bill = billRepository.findById(idBill);
        Optional<Account> account = accountRepository.findById(idEmployees);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        if (!account.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        ids.forEach(id -> {
            Optional<PaymentsMethod> paymentsMethod = paymentsMethodRepository.findById(id);
            paymentsMethod.get().setStatus(StatusPayMents.THANH_TOAN);
            paymentsMethodRepository.save(paymentsMethod.get());
        });
        bill.get().setStatusBill(StatusBill.DA_THANH_TOAN);
        billRepository.save(bill.get());
        BillHistory billHistoryPayMent = new BillHistory();
        billHistoryPayMent.setBill(bill.get());
        billHistoryPayMent.setStatusBill(StatusBill.DA_THANH_TOAN);
//        billHistoryPayMent.setActionDescription(request.getActionDescription());
        billHistoryPayMent.setEmployees(account.get());
        billHistoryRepository.save(billHistoryPayMent);
        return true;
    }

    @Override
    public String payWithVNPAYOnline(CreatePayMentMethodTransferRequest payModel, HttpServletRequest request) throws UnsupportedEncodingException {


            for (BillDetailOnline x : payModel.getBillDetail()){
                Optional<ProductDetail> optional = productDetailRepository.findById(x.getIdProductDetail());
                if(!optional.isPresent()){
                    throw new RestApiException("Sản phẩm không tồn tại");
                }

                ProductDetail productDetail = optional.get();
                if (productDetail.getStatus() != Status.DANG_SU_DUNG) {
                    throw new RestApiException(Message.NOT_PAYMENT_PRODUCT);
                }
                if(productDetail.getQuantity()<x.getQuantity()){
                    throw new RestApiException(Message.ERROR_QUANTITY);
                }

                productDetail.setQuantity(productDetail.getQuantity() - x.getQuantity());
                if (productDetail.getQuantity() == 0) {
                    productDetail.setStatus(Status.HET_SAN_PHAM);
                }
                productDetailRepository.save(productDetail);
            }


        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        LocalDateTime expireTime = now.plusMinutes(15);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String vnp_CreateDate = now.format(formatter);
        String vnp_ExpireDate = expireTime.format(formatter);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VnPayConstant.vnp_Version);
        vnp_Params.put("vnp_Command", VnPayConstant.vnp_Command);
        vnp_Params.put("vnp_TmnCode", VnPayConstant.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(payModel.vnp_Ammount + "00"));
        vnp_Params.put("vnp_BankCode", VnPayConstant.vnp_BankCode);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_CurrCode", VnPayConstant.vnp_CurrCode);
        vnp_Params.put("vnp_IpAddr", Config.getIpAddress(request));
        vnp_Params.put("vnp_Locale", VnPayConstant.vnp_Locale);
        vnp_Params.put("vnp_OrderInfo", payModel.vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", payModel.vnp_OrderType);
        vnp_Params.put("vnp_ReturnUrl", VnPayConstant.vnp_ReturnUrlBuyOnline);
        vnp_Params.put("vnp_TxnRef", "HD" + RandomStringUtils.randomNumeric(6) + "-"+ vnp_CreateDate);
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldList = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldList);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator itr = fieldList.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append("=");
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append("=");
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                if (itr.hasNext()) {
                    query.append("&");
                    hashData.append("&");
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = Config.hmacSHA512(VnPayConstant.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnPayConstant.vnp_Url + "?" + queryUrl;
        return paymentUrl;
    }

    @Override
    public boolean minusQuantityProductDetail(List<BillDetailOnline> listProductDetail) {

        for (BillDetailOnline x : listProductDetail){
         Optional<ProductDetail> optional = productDetailRepository.findById(x.getIdProductDetail());
         if(!optional.isPresent()){
             throw new RestApiException("Sản phẩm không tồn tại");
         }

         ProductDetail productDetail = optional.get();
            if(productDetail.getQuantity()<x.getQuantity()){
                throw new RestApiException(Message.ERROR_QUANTITY);
            }
            if (productDetail.getStatus() != Status.DANG_SU_DUNG) {
                throw new RestApiException(Message.NOT_PAYMENT_PRODUCT);
            }
         productDetail.setQuantity(productDetail.getQuantity() - x.getQuantity());
            if (productDetail.getQuantity() == 0) {
                productDetail.setStatus(Status.HET_SAN_PHAM);
            }
         productDetailRepository.save(productDetail);
        }
        return true;
    }

    @Override
    public boolean refundQuantityProductDetail(List<BillDetailOnline> listProductDetail) {
        for (BillDetailOnline x : listProductDetail){
            Optional<ProductDetail> optional = productDetailRepository.findById(x.getIdProductDetail());
            if(!optional.isPresent()){
                throw new RestApiException("Sản phẩm không tồn tại");
            }
            System.out.println(x.getIdProductDetail());
            ProductDetail productDetail = optional.get();
            productDetail.setQuantity(productDetail.getQuantity() + x.getQuantity());
            if (productDetail.getStatus().equals(Status.HET_SAN_PHAM)) {
                productDetail.setStatus(Status.DANG_SU_DUNG);
            }
            productDetailRepository.save(productDetail);
        }
        return true;
    }

    @Override
    public PaymentsMethod findByBill(String idBill) {
        return paymentsMethodRepository.findByBill(idBill);
    }


    public boolean createFilePdfAtCounter(String idBill) {
        //     begin   create file pdf
        String finalHtml = null;
        Optional<Bill> optional = billRepository.findById(idBill);
        InvoiceResponse invoice = exportFilePdfFormHtml.getInvoiceResponse(optional.get(), new BigDecimal(0));
        Bill bill = optional.get();
        String email = bill.getEmail();
        if(email == null){
            Context dataContext = exportFilePdfFormHtml.setData(invoice);
            finalHtml = springTemplateEngine.process("templateBill", dataContext);
            exportFilePdfFormHtml.htmlToPdf(finalHtml,  bill.getCode());
            return true;
        }
        if (bill.getStatusBill() != StatusBill.THANH_CONG &&  !email.isEmpty()) {
            invoice.setCheckShip(true);
            String clientDomain = System.getenv("CLIENT_DOMAIN");
            sendMail(invoice, clientDomain + "/bill/" + bill.getCode() + "/" + bill.getPhoneNumber(), bill.getEmail());
        }
        Context dataContext = exportFilePdfFormHtml.setData(invoice);
        finalHtml = springTemplateEngine.process("templateBill", dataContext);
        exportFilePdfFormHtml.htmlToPdf(finalHtml, bill.getCode());
//     end   create file pdf
        return true;
    }

    public void sendMail(InvoiceResponse invoice, String url, String email) {
        if (email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            String finalHtmlSendMail = null;
            Context dataContextSendMail = exportFilePdfFormHtml.setDataSendMail(invoice, url);
            finalHtmlSendMail = springTemplateEngine.process("templateBillSendMail", dataContextSendMail);
            String subject = "Biên lai thanh toán ";
            sendEmailService.sendBill(email, subject, finalHtmlSendMail);
        }

    }
}
