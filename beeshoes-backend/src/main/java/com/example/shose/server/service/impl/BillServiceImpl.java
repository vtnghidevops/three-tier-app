package com.example.shose.server.service.impl;

import com.example.shose.server.dto.request.bill.BillRequest;
import com.example.shose.server.dto.request.bill.BillShipRequest;
import com.example.shose.server.dto.request.bill.CancelBillClientRequest;
import com.example.shose.server.dto.request.bill.ChangAllStatusBillByIdsRequest;
import com.example.shose.server.dto.request.bill.ChangStatusBillRequest;
import com.example.shose.server.dto.request.bill.ChangeAllEmployeeRequest;
import com.example.shose.server.dto.request.bill.ChangeEmployeeRequest;
import com.example.shose.server.dto.request.bill.CreateBillOfflineRequest;
import com.example.shose.server.dto.request.bill.CreateBillRequest;
import com.example.shose.server.dto.request.bill.FindNewBillCreateAtCounterRequest;
import com.example.shose.server.dto.request.bill.StatusRequest;
import com.example.shose.server.dto.request.bill.UpdateBillRequest;
import com.example.shose.server.dto.request.bill.billaccount.CreateBillAccountOnlineRequest;
import com.example.shose.server.dto.request.bill.billcustomer.BillDetailOnline;
import com.example.shose.server.dto.request.bill.billcustomer.CreateBillCustomerOnlineRequest;
import com.example.shose.server.dto.response.bill.BillAccountResponse;
import com.example.shose.server.dto.request.billdetail.BillDetailRequest;
import com.example.shose.server.dto.request.billgiveback.UpdateBillDetailGiveBack;
import com.example.shose.server.dto.request.billgiveback.UpdateBillGiveBack;
import com.example.shose.server.dto.response.bill.BillGiveBack;
import com.example.shose.server.dto.response.bill.BillGiveBackInformation;
import com.example.shose.server.dto.response.bill.BillResponse;
import com.example.shose.server.dto.response.bill.BillResponseAtCounter;
import com.example.shose.server.dto.response.bill.InvoiceResponse;
import com.example.shose.server.dto.response.bill.ListStatusRespone;
import com.example.shose.server.dto.response.bill.UserBillResponse;
import com.example.shose.server.dto.response.billdetail.BillDetailResponse;
import com.example.shose.server.entity.HistoryPoin;
import com.example.shose.server.entity.Notification;
import com.example.shose.server.entity.Account;
import com.example.shose.server.entity.Bill;
import com.example.shose.server.entity.BillDetail;
import com.example.shose.server.entity.BillHistory;
import com.example.shose.server.entity.Cart;
import com.example.shose.server.entity.CartDetail;
import com.example.shose.server.entity.PaymentsMethod;
import com.example.shose.server.entity.ProductDetail;
import com.example.shose.server.entity.ProductDetailGiveBack;
import com.example.shose.server.entity.ScoringFormula;
import com.example.shose.server.entity.User;
import com.example.shose.server.entity.Voucher;
import com.example.shose.server.entity.VoucherDetail;
import com.example.shose.server.infrastructure.constant.Message;
import com.example.shose.server.infrastructure.constant.Roles;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.constant.StatusBill;
import com.example.shose.server.infrastructure.constant.StatusMethod;
import com.example.shose.server.infrastructure.constant.StatusPayMents;
import com.example.shose.server.infrastructure.constant.TypeBill;
import com.example.shose.server.infrastructure.constant.TypePoin;
import com.example.shose.server.infrastructure.email.SendEmailService;
import com.example.shose.server.infrastructure.exception.rest.RestApiException;
import com.example.shose.server.infrastructure.exportPdf.ExportFilePdfFormHtml;
import com.example.shose.server.infrastructure.session.ShoseSession;
import com.example.shose.server.repository.AccountRepository;
import com.example.shose.server.repository.BillDetailRepository;
import com.example.shose.server.repository.BillHistoryRepository;
import com.example.shose.server.repository.BillRepository;
import com.example.shose.server.repository.CartDetailRepository;
import com.example.shose.server.repository.CartRepository;
import com.example.shose.server.repository.HistoryPoinRepository;
import com.example.shose.server.repository.NotificationRepository;
import com.example.shose.server.repository.PaymentsMethodRepository;
import com.example.shose.server.repository.ProductDetailGiveBackRepository;
import com.example.shose.server.repository.ProductDetailRepository;
import com.example.shose.server.repository.ScoringFormulaRepository;
import com.example.shose.server.repository.UserReposiory;
import com.example.shose.server.repository.VoucherDetailRepository;
import com.example.shose.server.repository.VoucherRepository;
import com.example.shose.server.service.BillService;
import com.example.shose.server.util.ConvertDateToLong;
import com.example.shose.server.util.ResponseObject;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

/**
 * @author thangdt
 */

@Service
@Transactional
public class BillServiceImpl implements BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private SendEmailService sendEmailService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BillHistoryRepository billHistoryRepository;

    @Autowired
    private BillDetailRepository billDetailRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private PaymentsMethodRepository paymentsMethodRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherDetailRepository voucherDetailRepository;

    @Autowired
    private UserReposiory userReposiory;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartDetailRepository cartDetailRepository;

    @Autowired
    private SpringTemplateEngine springTemplateEngine;

    @Autowired
    private ExportFilePdfFormHtml exportFilePdfFormHtml;

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private ShoseSession shoseSession;

    @Autowired
    private ScoringFormulaRepository scoringFormulaRepository;

    @Autowired
    private ProductDetailGiveBackRepository productDetailGiveBackRepository;

    @Value("${domain.client}")
    private String domainClient;

    @Autowired
    private HistoryPoinRepository historyPoinRepository;

    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public BillServiceImpl(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public List<BillResponse> getAll(String id, BillRequest request) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        request.setConverStatus(Arrays.toString(request.getStatus()));
        try {
            if (!request.getStartTimeString().isEmpty()) {
                request.setStartTime(simpleDateFormat.parse(request.getStartTimeString()).getTime());
            }
            if (!request.getEndTimeString().isEmpty()) {
                request.setEndTime(simpleDateFormat.parse(request.getEndTimeString()).getTime());
            }
            if (!request.getStartDeliveryDateString().isEmpty()) {
                request.setStartDeliveryDate(simpleDateFormat.parse(request.getStartDeliveryDateString()).getTime());
            }
            if (!request.getEndDeliveryDateString().isEmpty()) {
                request.setEndDeliveryDate(simpleDateFormat.parse(request.getEndDeliveryDateString()).getTime());
            }
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        Optional<Account> user = accountRepository.findById(id);
        return billRepository.getAll(id, user.get().getRoles().name(), request);
    }

    @Override
    public List<BillAccountResponse> getAllBillAccount(StatusRequest request) {
        return billRepository.getBillAccount(request);

    }

    @Override
    public List<UserBillResponse> getAllUserInBill() {

        Map<String, UserBillResponse> list = new HashMap<>();
        billRepository.getAllUserInBill().forEach(item -> {
            list.put(item.getUserName(), item);
        });
        List<UserBillResponse> users = new ArrayList<>(list.values());
        return users;
    }

    @Override
    public List<BillResponseAtCounter> findAllBillAtCounterAndStatusNewBill(String id,
            FindNewBillCreateAtCounterRequest request) {
        return billRepository.findAllBillAtCounterAndStatusNewBill(id, request);
    }

    @Override
    public Bill save(String id, CreateBillOfflineRequest request) {
        Optional<Bill> optional = billRepository.findByCode(request.getCode());
        if (!optional.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        optional.get().setNote(request.getNote());
        optional.get().setUserName(request.getUserName());
        optional.get().setAddress(request.getAddress());
        optional.get().setPhoneNumber(request.getPhoneNumber());
        optional.get().setEmail(request.getEmail());
        optional.get().setItemDiscount(new BigDecimal(request.getItemDiscount()));
        optional.get().setTotalMoney(new BigDecimal(request.getTotalMoney()));
        optional.get().setMoneyShip(new BigDecimal(request.getMoneyShip()));
        optional.get().setLastModifiedDate(Calendar.getInstance().getTimeInMillis());
        optional.get().setPoinUse(request.getPoin());

        List<BillDetailResponse> billDetailResponse = billDetailRepository
                .findAllByIdBill(new BillDetailRequest(optional.get().getId(), "THANH_CONG"));
        billDetailResponse.forEach(item -> {
            Optional<ProductDetail> productDetail = productDetailRepository.findById(item.getIdProduct());
            if (!productDetail.isPresent()) {
                throw new RestApiException(Message.NOT_EXISTS);
            }

            productDetail.get().setQuantity(item.getQuantity() + productDetail.get().getQuantity());
            if (productDetail.get().getStatus() == Status.HET_SAN_PHAM) {
                productDetail.get().setStatus(Status.DANG_SU_DUNG);
            }
            productDetailRepository.save(productDetail.get());
        });
        voucherDetailRepository.findAllByBill(optional.get()).forEach(item -> {
            Optional<Voucher> voucher = voucherRepository.findById(item.getVoucher().getId());
            voucher.get().setQuantity(voucher.get().getQuantity() + 1);
            voucherRepository.save(voucher.get());
        });
        billHistoryRepository.deleteAllByIdBill(optional.get().getId());
        billDetailRepository.deleteAllByIdBill(optional.get().getId());
        paymentsMethodRepository.deleteAllByIdBill(optional.get().getId());
        voucherDetailRepository.deleteAllByIdBill(optional.get().getId());

        if (!request.getDeliveryDate().isEmpty()) {
            optional.get().setShippingTime(new ConvertDateToLong().dateToLong(request.getDeliveryDate()));
        }
        List<ScoringFormula> scoringFormulas = scoringFormulaRepository.findAllByOrderByCreatedDateDesc();
        if (TypeBill.valueOf(request.getTypeBill()) != TypeBill.OFFLINE || !request.isOpenDelivery()) {
            if (request.getIdUser() != null) {
                Optional<Account> account = accountRepository.findById(request.getIdUser());
                if (account.isPresent() && !scoringFormulas.isEmpty()) {
                    ScoringFormula scoringFormula = scoringFormulas.get(0);
                    optional.get().setAccount(account.get());
                    User user = account.get().getUser();
                    if (request.getPoin() > 0) {
                        int Pointotal = user.getPoints() - request.getPoin()
                                + scoringFormula.ConvertMoneyToPoints(new BigDecimal(request.getTotalMoney()));
                        user.setPoints(Pointotal);
                        optional.get().setValuePoin(scoringFormula.ConvertPoinToMoney(request.getPoin()));
                        historyPoinRepository
                                .save(HistoryPoin.builder().bill(optional.get()).user(user).value(request.getPoin())
                                        .typePoin(TypePoin.DIEM_SU_DUNG).scoringFormula(scoringFormula).build());
                    } else {
                        user.setPoints(
                                user.getPoints()
                                        + scoringFormula.ConvertMoneyToPoints(new BigDecimal(request.getTotalMoney())));
                    }
                    historyPoinRepository.save(HistoryPoin.builder().bill(optional.get()).user(user)
                            .value(scoringFormula.ConvertMoneyToPoints(new BigDecimal(request.getTotalMoney())))
                            .typePoin(TypePoin.DIEM_THUONG).scoringFormula(scoringFormula).build());
                    userReposiory.save(user);
                }
            }
            optional.get().setStatusBill(StatusBill.THANH_CONG);
            optional.get().setCompletionDate(getCurrentTimestampInVietnam());
            billRepository.save(optional.get());
            billHistoryRepository.save(BillHistory.builder().statusBill(optional.get().getStatusBill())
                    .bill(optional.get()).employees(optional.get().getEmployees()).build());
        } else {
            if (request.getIdUser() != null) {
                Optional<Account> account = accountRepository.findById(request.getIdUser());
                if (account.isPresent() && !scoringFormulas.isEmpty()) {
                    ScoringFormula scoringFormula = scoringFormulas.get(0);
                    optional.get().setAccount(account.get());
                    User user = account.get().getUser();
                    if (request.getPoin() > 0) {
                        int Pointotal = user.getPoints() - request.getPoin();
                        user.setPoints(Pointotal);
                        optional.get().setValuePoin(scoringFormula.ConvertPoinToMoney(request.getPoin()));
                        historyPoinRepository
                                .save(HistoryPoin.builder().bill(optional.get()).typePoin(TypePoin.DIEM_SU_DUNG)
                                        .value(request.getPoin()).user(user).scoringFormula(scoringFormula).build());
                    }
                    userReposiory.save(user);
                }
            }
            optional.get().setStatusBill(StatusBill.CHO_XAC_NHAN);
            optional.get().setCompletionDate(getCurrentTimestampInVietnam());
            billRepository.save(optional.get());
            billHistoryRepository.save(BillHistory.builder().statusBill(StatusBill.CHO_XAC_NHAN).bill(optional.get())
                    .employees(optional.get().getEmployees()).build());

            if (!request.getPaymentsMethodRequests().stream()
                    .anyMatch(paymentMethod -> paymentMethod.getStatus() == StatusPayMents.TRA_SAU)) {
                billHistoryRepository.save(BillHistory.builder().statusBill(StatusBill.DA_THANH_TOAN)
                        .bill(optional.get()).employees(optional.get().getEmployees()).build());
            }
        }

        request.getPaymentsMethodRequests().forEach(item -> {
            if (item.getMethod() != StatusMethod.CHUYEN_KHOAN && item.getTotalMoney() != null) {

                if (item.getStatus() == StatusPayMents.TRA_SAU) {
                    BigDecimal totalPaymentTraSau = request.getBillDetailRequests().stream()
                            .map(billDetailRequest -> {
                                return (billDetailRequest.getPromotion() == null)
                                        ? new BigDecimal(billDetailRequest.getPrice())
                                                .multiply(new BigDecimal(billDetailRequest.getQuantity()))
                                        : new BigDecimal(billDetailRequest.getQuantity())
                                                .multiply(new BigDecimal(100 - billDetailRequest.getPromotion())
                                                        .multiply(new BigDecimal(billDetailRequest.getPrice()))
                                                        .divide(new BigDecimal(100)));
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).add(new BigDecimal(request.getMoneyShip()))
                            .subtract(new BigDecimal(request.getItemDiscount()));
                    if (totalPaymentTraSau.compareTo(BigDecimal.ZERO) > 0) {
                        PaymentsMethod paymentsMethod = PaymentsMethod.builder()
                                .method(item.getMethod())
                                .status(StatusPayMents.TRA_SAU)
                                .employees(optional.get().getEmployees())
                                .totalMoney(totalPaymentTraSau)
                                .description(item.getActionDescription())
                                .bill(optional.get())
                                .build();
                        paymentsMethodRepository.save(paymentsMethod);
                    }
                } else if (item.getTotalMoney().compareTo(BigDecimal.ZERO) > 0) {
                    PaymentsMethod paymentsMethod = PaymentsMethod.builder()
                            .method(item.getMethod())
                            .status(StatusPayMents.valueOf(request.getStatusPayMents()))
                            .employees(optional.get().getEmployees())
                            .totalMoney(item.getTotalMoney())
                            .description(item.getActionDescription())
                            .bill(optional.get())
                            .build();
                    paymentsMethodRepository.save(paymentsMethod);
                }
            }
        });

        request.getBillDetailRequests().forEach(billDetailRequest -> {
            Optional<ProductDetail> productDetail = productDetailRepository.findById(billDetailRequest.getIdProduct());
            if (!productDetail.isPresent()) {
                throw new RestApiException(Message.NOT_EXISTS);
            }
            if (productDetail.get().getQuantity() < billDetailRequest.getQuantity()) {
                throw new RestApiException(Message.ERROR_QUANTITY);
            }
            if (productDetail.get().getStatus() != Status.DANG_SU_DUNG) {
                throw new RestApiException(Message.NOT_PAYMENT_PRODUCT);
            }
            BillDetail billDetail = BillDetail.builder().statusBill(StatusBill.THANH_CONG).bill(optional.get())
                    .productDetail(productDetail.get()).price(productDetail.get().getPrice())
                    .quantity(billDetailRequest.getQuantity()).build();
            if (billDetailRequest.getPromotion() != null) {
                billDetail.setPromotion(new BigDecimal(billDetailRequest.getPromotion()));
            }
            billDetailRepository.save(billDetail);
            productDetail.get().setQuantity(productDetail.get().getQuantity() - billDetailRequest.getQuantity());
            if (productDetail.get().getQuantity() == 0) {
                productDetail.get().setStatus(Status.HET_SAN_PHAM);
            }
            productDetailRepository.save(productDetail.get());
        });
        request.getVouchers().forEach(voucher -> {
            Optional<Voucher> Voucher = voucherRepository.findById(voucher.getIdVoucher());
            if (!Voucher.isPresent()) {
                throw new RestApiException(Message.NOT_EXISTS);
            }
            if (Voucher.get().getQuantity() <= 0
                    && Voucher.get().getEndDate() < Calendar.getInstance().getTimeInMillis()) {
                throw new RestApiException(Message.VOUCHER_NOT_USE);
            }
            Voucher.get().setQuantity(Voucher.get().getQuantity() - 1);
            voucherRepository.save(Voucher.get());

            VoucherDetail voucherDetail = VoucherDetail.builder().voucher(Voucher.get()).bill(optional.get())
                    .afterPrice(new BigDecimal(voucher.getAfterPrice()))
                    .beforPrice(new BigDecimal(voucher.getBeforPrice()))
                    .discountPrice(new BigDecimal(voucher.getDiscountPrice())).build();
            voucherDetailRepository.save(voucherDetail);
        });
        createTemplateSendMail(optional.get().getId(), request.getTotalExcessMoney());
        return optional.get();
    }

    @Override
    public Bill saveOnline(CreateBillRequest request) {
        Optional<Account> account = accountRepository.findById(request.getIdUser());
        if (!account.isPresent()) {
            throw new RestApiException(Message.ACCOUNT_NOT_EXIT);
        }
        Bill bill = billRepository.save(Bill.builder().account(account.get()).userName(request.getName())
                .address(request.getAddress()).phoneNumber(request.getPhoneNumber()).statusBill(StatusBill.TAO_HOA_DON)
                .typeBill(TypeBill.OFFLINE).code("HD" + RandomStringUtils.randomNumeric(6)).build());
        billHistoryRepository.save(BillHistory.builder().statusBill(bill.getStatusBill()).bill(bill).build());
        return bill;
    }

    @Override
    public Bill CreateCodeBill(String idEmployees) {
        Optional<Account> account = accountRepository.findById(idEmployees);
        String codeBill = "HD" + RandomStringUtils.randomNumeric(6);
        Bill bill = Bill.builder()
                .employees(account.get())
                .typeBill(TypeBill.OFFLINE)
                .statusBill(StatusBill.TAO_HOA_DON)
                .userName("")
                .note("")
                .address("")
                .phoneNumber("")
                .email("")
                .code(codeBill)
                .itemDiscount(new BigDecimal("0"))
                .totalMoney(new BigDecimal("0"))
                .moneyShip(new BigDecimal("0")).build();
        billRepository.save(bill);
        billHistoryRepository.save(BillHistory.builder().statusBill(bill.getStatusBill()).bill(bill)
                .employees(bill.getEmployees()).build());
        return bill;
    }

    @Override
    public boolean updateBillWait(CreateBillOfflineRequest request) {
        try {
            Optional<Bill> optional = billRepository.findByCode(request.getCode());
            if (!optional.isPresent()) {
                throw new RestApiException(Message.NOT_EXISTS);
            }
            optional.get().setNote(request.getNote());
            optional.get().setUserName(request.getUserName());
            optional.get().setAddress(request.getAddress());
            optional.get().setPhoneNumber(request.getPhoneNumber());
            optional.get().setEmail(request.getEmail());
            optional.get().setItemDiscount(new BigDecimal(request.getItemDiscount()));
            optional.get().setTotalMoney(new BigDecimal(request.getTotalMoney()));
            optional.get().setMoneyShip(new BigDecimal(request.getMoneyShip()));
            optional.get().setLastModifiedDate(Calendar.getInstance().getTimeInMillis());
            optional.get().setPoinUse(request.getPoin());
            billRepository.save(optional.get());

            List<BillDetailResponse> billDetailResponse = billDetailRepository
                    .findAllByIdBill(new BillDetailRequest(optional.get().getId(), "THANH_CONG"));
            billDetailResponse.forEach(item -> {
                Optional<ProductDetail> productDetail = productDetailRepository.findById(item.getIdProduct());
                if (!productDetail.isPresent()) {
                    throw new RestApiException(Message.NOT_EXISTS);
                }
                productDetail.get().setQuantity(item.getQuantity() + productDetail.get().getQuantity());
                if (productDetail.get().getStatus() == Status.HET_SAN_PHAM) {
                    productDetail.get().setStatus(Status.DANG_SU_DUNG);
                }
                productDetailRepository.save(productDetail.get());
            });
            voucherDetailRepository.findAllByBill(optional.get()).forEach(item -> {
                Optional<Voucher> voucher = voucherRepository.findById(item.getVoucher().getId());
                voucher.get().setQuantity(voucher.get().getQuantity() + 1);
                voucherRepository.save(voucher.get());
            });
            billHistoryRepository.deleteAllByIdBill(optional.get().getId());
            billDetailRepository.deleteAllByIdBill(optional.get().getId());
            paymentsMethodRepository.deleteAllByIdBill(optional.get().getId());
            voucherDetailRepository.deleteAllByIdBill(optional.get().getId());

            if (request.getIdUser() != null) {
                Optional<Account> user = accountRepository.findById(request.getIdUser());

                if (user.isPresent()) {
                    optional.get().setAccount(user.get());
                }
            }
            if (!request.getDeliveryDate().isEmpty()) {
                optional.get().setShippingTime(new ConvertDateToLong().dateToLong(request.getDeliveryDate()));
            }
            if (TypeBill.valueOf(request.getTypeBill()) != TypeBill.OFFLINE || !request.isOpenDelivery()) {
                billHistoryRepository.save(BillHistory.builder().statusBill(StatusBill.THANH_CONG).bill(optional.get())
                        .employees(optional.get().getEmployees()).build());
            } else {
                billHistoryRepository.save(BillHistory.builder().statusBill(StatusBill.CHO_XAC_NHAN).bill(optional.get())
                        .employees(optional.get().getEmployees()).build());
            }
            optional.get().setStatusBill(StatusBill.TAO_HOA_DON);
            billRepository.save(optional.get());

            request.getBillDetailRequests().forEach(billDetailRequest -> {
                Optional<ProductDetail> productDetail = productDetailRepository
                        .findById(billDetailRequest.getIdProduct());
                if (!productDetail.isPresent()) {
                    throw new RestApiException(Message.NOT_EXISTS);
                }
                if (productDetail.get().getQuantity() < billDetailRequest.getQuantity()) {
                    throw new RestApiException(Message.ERROR_QUANTITY);
                }
                if (productDetail.get().getStatus() != Status.DANG_SU_DUNG) {
                    throw new RestApiException(Message.NOT_PAYMENT_PRODUCT);
                }
                BillDetail billDetail = BillDetail.builder().statusBill(StatusBill.THANH_CONG).bill(optional.get())
                        .productDetail(productDetail.get()).price(productDetail.get().getPrice())
                        .quantity(billDetailRequest.getQuantity()).build();
                if (billDetailRequest.getPromotion() != null) {
                    billDetail.setPromotion(new BigDecimal(billDetailRequest.getPromotion()));
                }
                billDetailRepository.save(billDetail);
                productDetail.get().setQuantity(productDetail.get().getQuantity() - billDetailRequest.getQuantity());
                if (productDetail.get().getQuantity() == 0) {
                    productDetail.get().setStatus(Status.HET_SAN_PHAM);
                }
                productDetailRepository.save(productDetail.get());
            });
            request.getVouchers().forEach(voucher -> {
                Optional<Voucher> Voucher = voucherRepository.findById(voucher.getIdVoucher());
                if (!Voucher.isPresent()) {
                    throw new RestApiException(Message.NOT_EXISTS);
                }
                if (Voucher.get().getQuantity() <= 0
                        && Voucher.get().getEndDate() < Calendar.getInstance().getTimeInMillis()) {
                    throw new RestApiException(Message.VOUCHER_NOT_USE);
                }
                Voucher.get().setQuantity(Voucher.get().getQuantity() - 1);
                voucherRepository.save(Voucher.get());

                VoucherDetail voucherDetail = VoucherDetail.builder().voucher(Voucher.get()).bill(optional.get())
                        .afterPrice(new BigDecimal(voucher.getAfterPrice()))
                        .beforPrice(new BigDecimal(voucher.getBeforPrice()))
                        .discountPrice(new BigDecimal(voucher.getDiscountPrice())).build();
                voucherDetailRepository.save(voucherDetail);
            });

            request.getPaymentsMethodRequests().forEach(item -> {
                if (item.getMethod() != StatusMethod.CHUYEN_KHOAN && item.getTotalMoney() != null) {
                    if (item.getTotalMoney().compareTo(BigDecimal.ZERO) > 0) {
                        PaymentsMethod paymentsMethod = PaymentsMethod.builder()
                                .method(item.getMethod())
                                .status(StatusPayMents.valueOf(request.getStatusPayMents()))
                                .employees(optional.get().getEmployees())
                                .totalMoney(item.getTotalMoney())
                                .description(item.getActionDescription())
                                .bill(optional.get())
                                .build();
                        paymentsMethodRepository.save(paymentsMethod);
                    }
                }
            });
        } catch (Exception e) {
            throw new RestApiException(Message.ERROR_SQL);
        }

        return true;
    }

    @Override
    public Bill updateBillOffline(String id, UpdateBillRequest request) {
        Optional<Bill> updateBill = billRepository.findById(id);
        if (!updateBill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        updateBill.get().setMoneyShip(new BigDecimal(request.getMoneyShip()));
        updateBill.get().setAddress(request.getAddress());
        updateBill.get().setUserName(request.getName());
        updateBill.get().setPhoneNumber(request.getPhoneNumber());
        updateBill.get().setNote(request.getNote());
        updateBill.get().setLastModifiedDate(Calendar.getInstance().getTimeInMillis());
        return billRepository.save(updateBill.get());
    }

    @Override
    public Bill detail(String id) {
        Optional<Bill> bill = billRepository.findById(id);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        return bill.get();
    }

    @Override
    public List<ListStatusRespone> getAllSatusBill() {
        return billRepository.getAllSatusBill();
    }

    @Override
    public Bill changedStatusbill(String id, String idEmployees, ChangStatusBillRequest request) {
        Optional<Bill> bill = billRepository.findById(id);
        Optional<Account> account = accountRepository.findById(idEmployees);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        if (!account.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        List<ScoringFormula> scoringFormulas = scoringFormulaRepository.findAllByOrderByCreatedDateDesc();
        boolean checkDaThanhToan = billHistoryRepository.findAllByBill(bill.get()).stream()
                .anyMatch(invoice -> invoice.getStatusBill() == StatusBill.DA_THANH_TOAN);
        StatusBill statusBill[] = StatusBill.values();
        int nextIndex = (bill.get().getStatusBill().ordinal() + 1) % statusBill.length;
        bill.get().setStatusBill(StatusBill.valueOf(statusBill[nextIndex].name()));
        if (nextIndex > 6) {
            throw new RestApiException(Message.CHANGED_STATUS_ERROR);
        }
        if (bill.get().getStatusBill() == StatusBill.XAC_NHAN) {
            bill.get().setConfirmationDate(Calendar.getInstance().getTimeInMillis());
            CompletableFuture.runAsync(() -> createTemplateSendMail(bill.get().getId(), new BigDecimal(0)),
                    Executors.newCachedThreadPool());

        } else if (bill.get().getStatusBill() == StatusBill.VAN_CHUYEN) {
            bill.get().setDeliveryDate(Calendar.getInstance().getTimeInMillis());
        } else if (bill.get().getStatusBill() == StatusBill.DA_THANH_TOAN) {
            bill.get().setReceiveDate(Calendar.getInstance().getTimeInMillis());
            if (checkDaThanhToan) {
                bill.get().setStatusBill(StatusBill.THANH_CONG);
                bill.get().setCompletionDate(getCurrentTimestampInVietnam());
                if (bill.get().getAccount() != null && !scoringFormulas.isEmpty()) {
                    User user = bill.get().getAccount().getUser();
                    ScoringFormula scoringFormula = scoringFormulas.get(0);
                    user.setPoints(user.getPoints() + scoringFormula.ConvertMoneyToPoints(bill.get().getTotalMoney()));
                    userReposiory.save(user);
                    historyPoinRepository.save(HistoryPoin.builder().typePoin(TypePoin.DIEM_THUONG)
                            .value(scoringFormula.ConvertMoneyToPoints(bill.get().getTotalMoney())).bill(bill.get())
                            .user(user).scoringFormula(scoringFormula).build());
                }
            }
        } else if (bill.get().getStatusBill() == StatusBill.THANH_CONG) {
            paymentsMethodRepository.updateAllByIdBill(id);
            bill.get().setCompletionDate(getCurrentTimestampInVietnam());
            if (bill.get().getAccount() != null && !scoringFormulas.isEmpty()) {
                User user = bill.get().getAccount().getUser();
                ScoringFormula scoringFormula = scoringFormulas.get(0);
                user.setPoints(user.getPoints() + scoringFormula.ConvertMoneyToPoints(bill.get().getTotalMoney()));
                userReposiory.save(user);
                historyPoinRepository.save(HistoryPoin.builder().typePoin(TypePoin.DIEM_THUONG)
                        .value(scoringFormula.ConvertMoneyToPoints(bill.get().getTotalMoney())).bill(bill.get())
                        .user(user).scoringFormula(scoringFormula).build());
            }
        }
        bill.get().setLastModifiedDate(Calendar.getInstance().getTimeInMillis());
        bill.get().setEmployees(account.get());
        BillHistory billHistory = new BillHistory();
        billHistory.setBill(bill.get());
        billHistory.setStatusBill(bill.get().getStatusBill());
        billHistory.setActionDescription(request.getActionDescription());
        billHistory.setEmployees(account.get());
        billHistoryRepository.save(billHistory);
        Bill billResponse = billRepository.save(bill.get());
        messagingTemplate.convertAndSend("/app/admin-notifications", new ResponseObject(true));
        return billResponse;
    }

    @Override
    public Bill rollBackBill(String id, String idEmployees, ChangStatusBillRequest request) {
        Optional<Bill> bill = billRepository.findById(id);
        Optional<Account> account = accountRepository.findById(idEmployees);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        if (!account.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        StatusBill statusBill[] = StatusBill.values();
        int nextIndex = (bill.get().getStatusBill().ordinal() - 1) % statusBill.length;
        List<BillHistory> billHistories = billHistoryRepository.findAllByBill(bill.get()).stream()
                .sorted(Comparator.comparing(BillHistory::getCreatedDate))
                .collect(Collectors.toList());
        boolean checkDaThanhToan = billHistories.stream()
                .anyMatch(invoice -> invoice.getStatusBill() == StatusBill.DA_THANH_TOAN);
        if (nextIndex < 1) {
            throw new RestApiException(Message.CHANGED_STATUS_ERROR);
        }
        if (bill.get().getStatusBill() == StatusBill.THANH_CONG) {
            // CompletableFuture.runAsync(() ->
            // sendEmailService.sendEmailRollBackBill("vinhnvph23845@fpt.edu.vn",
            // request.getActionDescription(), id), Executors.newCachedThreadPool());
            long confirmedTimestamp = bill.get().getCompletionDate();
            Instant confirmedInstant = Instant.ofEpochMilli(confirmedTimestamp);
            LocalDateTime confirmedDateTime = LocalDateTime.ofInstant(confirmedInstant, ZoneId.systemDefault());
            LocalDate currentDate = LocalDate.now();
            if (currentDate.isAfter(confirmedDateTime.toLocalDate().plusDays(1))) {
                throw new RestApiException(Message.ERROR_ROLLBACK);
            }
        }
        if (checkDaThanhToan && bill.get().getStatusBill() == StatusBill.THANH_CONG) {
            bill.get().setStatusBill(StatusBill.VAN_CHUYEN);
        } else if (billHistories.size() > 3 && bill.get().getStatusBill() == StatusBill.DA_HUY) {
            bill.get().setStatusBill(billHistories.get(billHistories.size() - 2).getStatusBill());
        } else if (billHistories.size() <= 3 && bill.get().getStatusBill() == StatusBill.DA_HUY) {
            if (billHistories.stream()
                    .anyMatch(invoice -> invoice.getStatusBill() == StatusBill.XAC_NHAN)
                    || billHistories.stream()
                            .anyMatch(invoice -> invoice.getStatusBill() == StatusBill.DA_THANH_TOAN)) {
                bill.get().setStatusBill(StatusBill.CHO_XAC_NHAN);
            } else {
                throw new RestApiException(Message.CHANGED_STATUS_ERROR);
            }
        } else {
            bill.get().setStatusBill(StatusBill.valueOf(statusBill[nextIndex].name()));
        }
        bill.get().setLastModifiedDate(Calendar.getInstance().getTimeInMillis());
        bill.get().setEmployees(account.get());
        BillHistory billHistory = new BillHistory();
        billHistory.setBill(bill.get());
        billHistory.setStatusBill(bill.get().getStatusBill());
        billHistory.setActionDescription(request.getActionDescription());
        billHistory.setEmployees(account.get());
        billHistoryRepository.save(billHistory);
        return billRepository.save(bill.get());
    }

    @Override
    public int countPayMentPostpaidByIdBill(String id) {
        return paymentsMethodRepository.countPayMentPostpaidByIdBill(id);
    }

    @Override
    public boolean changeStatusAllBillByIds(ChangAllStatusBillByIdsRequest request, String idEmployees) {
        request.getIds().forEach(id -> {
            Optional<Bill> bill = billRepository.findById(id);
            Optional<Account> account = accountRepository.findById(idEmployees);
            if (!bill.isPresent()) {
                throw new RestApiException(Message.BILL_NOT_EXIT);
            }
            if (!account.isPresent()) {
                throw new RestApiException(Message.NOT_EXISTS);
            }
            List<ScoringFormula> scoringFormulas = scoringFormulaRepository.findAllByOrderByCreatedDateDesc();
            boolean checkDaThanhToan = billHistoryRepository.findAllByBill(bill.get()).stream()
                    .anyMatch(invoice -> invoice.getStatusBill() == StatusBill.DA_THANH_TOAN);
            bill.get().setStatusBill(StatusBill.valueOf(request.getStatus()));
            if (bill.get().getStatusBill() == StatusBill.XAC_NHAN) {
                bill.get().setConfirmationDate(Calendar.getInstance().getTimeInMillis());
                CompletableFuture.runAsync(() -> createTemplateSendMail(bill.get().getId(), new BigDecimal(0)),
                        Executors.newCachedThreadPool());
            } else if (bill.get().getStatusBill() == StatusBill.VAN_CHUYEN) {
                bill.get().setDeliveryDate(Calendar.getInstance().getTimeInMillis());
            } else if (bill.get().getStatusBill() == StatusBill.DA_THANH_TOAN) {
                bill.get().setReceiveDate(Calendar.getInstance().getTimeInMillis());
                if (checkDaThanhToan) {
                    bill.get().setStatusBill(StatusBill.THANH_CONG);
                    bill.get().setCompletionDate(getCurrentTimestampInVietnam());
                    if (bill.get().getAccount() != null && !scoringFormulas.isEmpty()) {
                        User user = bill.get().getAccount().getUser();
                        ScoringFormula scoringFormula = scoringFormulas.get(0);
                        user.setPoints(
                                user.getPoints() + scoringFormula.ConvertMoneyToPoints(bill.get().getTotalMoney()));
                        userReposiory.save(user);
                        historyPoinRepository.save(HistoryPoin.builder().typePoin(TypePoin.DIEM_THUONG)
                                .value(scoringFormula.ConvertMoneyToPoints(bill.get().getTotalMoney())).bill(bill.get())
                                .user(user).scoringFormula(scoringFormula).build());
                    }
                }
            } else if (bill.get().getStatusBill() == StatusBill.THANH_CONG) {
                paymentsMethodRepository.updateAllByIdBill(id);
                bill.get().setCompletionDate(getCurrentTimestampInVietnam());
                if (bill.get().getAccount() != null && !scoringFormulas.isEmpty()) {
                    User user = bill.get().getAccount().getUser();
                    ScoringFormula scoringFormula = scoringFormulas.get(0);
                    user.setPoints(user.getPoints() + scoringFormula.ConvertMoneyToPoints(bill.get().getTotalMoney()));
                    userReposiory.save(user);
                    historyPoinRepository.save(HistoryPoin.builder().typePoin(TypePoin.DIEM_THUONG)
                            .value(scoringFormula.ConvertMoneyToPoints(bill.get().getTotalMoney())).bill(bill.get())
                            .user(user).scoringFormula(scoringFormula).build());
                }
            }
            bill.get().setLastModifiedDate(Calendar.getInstance().getTimeInMillis());
            bill.get().setEmployees(account.get());
            BillHistory billHistory = new BillHistory();
            billHistory.setBill(bill.get());
            billHistory.setStatusBill(bill.get().getStatusBill());
            billHistory.setEmployees(account.get());
            billHistory.setActionDescription(request.getNote());
            billHistoryRepository.save(billHistory);
            billRepository.save(bill.get());
        });
        return true;
    }

    @Override
    public Bill cancelBill(String id, String idEmployees, ChangStatusBillRequest request) {
        Optional<Bill> bill = billRepository.findById(id);
        Optional<Account> account = accountRepository.findById(idEmployees);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        if (!account.isPresent()) {
            throw new RestApiException(Message.ACCOUNT_IS_EXIT);
        }
        if (account.get().getRoles() != Roles.ROLE_ADMIN && !bill.get().getEmployees().getId().equals(idEmployees)) {
            throw new RestApiException(Message.ACCOUNT_NOT_ROLE_CANCEL_BILL);
        }
        if (bill.get().getStatusBill() == StatusBill.VAN_CHUYEN && account.get().getRoles() != Roles.ROLE_ADMIN) {
            throw new RestApiException(Message.ACCOUNT_NOT_ROLE_CANCEL_BILL);
        }
        bill.get().setLastModifiedDate(Calendar.getInstance().getTimeInMillis());
        bill.get().setStatusBill(StatusBill.DA_HUY);
        bill.get().setEmployees(account.get());
        BillHistory billHistory = new BillHistory();
        billHistory.setBill(bill.get());
        billHistory.setStatusBill(bill.get().getStatusBill());
        billHistory.setActionDescription(request.getActionDescription());
        billHistory.setEmployees(account.get());
        billHistoryRepository.save(billHistory);
        List<BillDetailResponse> billDetailResponse = billDetailRepository
                .findAllByIdBill(new BillDetailRequest(bill.get().getId(), "THANH_CONG"));
        billDetailResponse.forEach(item -> {
            Optional<ProductDetail> productDetail = productDetailRepository.findById(item.getIdProduct());
            if (!productDetail.isPresent()) {
                throw new RestApiException(Message.NOT_EXISTS);
            }
            productDetail.get().setQuantity(item.getQuantity() + productDetail.get().getQuantity());
            if (productDetail.get().getStatus() == Status.HET_SAN_PHAM) {
                productDetail.get().setStatus(Status.DANG_SU_DUNG);
            }
            productDetailRepository.save(productDetail.get());
        });
        Account checkAccount = bill.get().getAccount();
        List<ScoringFormula> scoringFormulas = scoringFormulaRepository.findAllByOrderByCreatedDateDesc();
        if (checkAccount != null && !scoringFormulas.isEmpty()) {
            if (bill.get().getPoinUse() > 0) {
                User user = checkAccount.getUser();
                ScoringFormula scoringFormula = scoringFormulas.get(0);
                user.setPoints(user.getPoints() + bill.get().getPoinUse());
                userReposiory.save(user);
                historyPoinRepository.save(HistoryPoin.builder().bill(bill.get()).typePoin(TypePoin.DIEM_HOAN)
                        .value(bill.get().getPoinUse()).user(user).scoringFormula(scoringFormula).build());
            }
        }

        return billRepository.save(bill.get());
    }

    @Override
    public Bill createBillCustomerOnlineRequest(CreateBillCustomerOnlineRequest request) {
        if (request.getPaymentMethod().equals("paymentReceive")) {
            for (BillDetailOnline x : request.getBillDetail()) {
                Optional<ProductDetail> optional = productDetailRepository.findById(x.getIdProductDetail());
                if (!optional.isPresent()) {
                    throw new RestApiException("Sản phẩm không tồn tại");
                }

                ProductDetail productDetail = optional.get();
                if (productDetail.getQuantity() < x.getQuantity()) {
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
        }
        String codeBill = "HD" + RandomStringUtils.randomNumeric(6);
        Bill bill = Bill.builder()
                .code(codeBill)
                .shippingTime(new ConvertDateToLong().dateToLong(request.getShippingTime()))
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress() + ',' + request.getWard() + ',' + request.getDistrict() + ','
                        + request.getProvince())
                .userName(request.getUserName())
                .moneyShip(request.getMoneyShip())
                .itemDiscount(request.getItemDiscount())
                .totalMoney(request.getTotalMoney())
                .typeBill(TypeBill.ONLINE)
                .email(request.getEmail())
                .statusBill(StatusBill.CHO_XAC_NHAN).build();
        if (!request.getPaymentMethod().equals("paymentReceive")) {
            bill.setCode(request.getResponsePayment().getVnp_TxnRef().split("-")[0]);
        }
        billRepository.save(bill);
        BillHistory billHistory = BillHistory.builder()
                .bill(bill)
                .statusBill(request.getPaymentMethod().equals("paymentReceive") ? StatusBill.CHO_XAC_NHAN
                        : StatusBill.DA_THANH_TOAN)
                .actionDescription(
                        request.getPaymentMethod().equals("paymentReceive") ? "Chưa thanh toán" : "Đã thanh toán")
                .build();
        billHistoryRepository.save(billHistory);
        for (BillDetailOnline x : request.getBillDetail()) {
            Optional<ProductDetail> optional = productDetailRepository.findById(x.getIdProductDetail());
            if (!optional.isPresent()) {
                throw new RestApiException("Sản phẩm không tồn tại");
            }

            ProductDetail productDetail = optional.get();
            BillDetail billDetail = BillDetail.builder()
                    .statusBill(StatusBill.THANH_CONG)
                    .productDetail(productDetail)
                    .price(x.getPrice())
                    .quantity(x.getQuantity())
                    .promotion(x.getValuePromotion())
                    .bill(bill).build();
            billDetailRepository.save(billDetail);

        }
        PaymentsMethod paymentsMethod = PaymentsMethod.builder()
                .method(request.getPaymentMethod().equals("paymentReceive") ? StatusMethod.TIEN_MAT
                        : StatusMethod.CHUYEN_KHOAN)
                .bill(bill)
                .totalMoney(request.getTotalMoney().add(request.getMoneyShip()).subtract(request.getItemDiscount()))
                .status(request.getPaymentMethod().equals("paymentReceive") ? StatusPayMents.TRA_SAU
                        : StatusPayMents.DA_THANH_TOAN)
                .build();

        if (!request.getPaymentMethod().equals("paymentReceive")) {
            paymentsMethod.setVnp_TransactionNo(request.getResponsePayment().getVnp_TransactionNo());
            paymentsMethod.setCreateAt(Long.parseLong(request.getResponsePayment().getVnp_TxnRef().split("-")[1]));
            paymentsMethod.setTransactionDate(Long.parseLong(request.getResponsePayment().getVnp_PayDate()));
            paymentsMethod.setStatus(StatusPayMents.THANH_TOAN);
        }
        paymentsMethodRepository.save(paymentsMethod);

        if (!request.getIdVoucher().isEmpty()) {
            Optional<Voucher> optional = voucherRepository.findById(request.getIdVoucher());
            if (!optional.isPresent()) {
                throw new RestApiException("Khuyến mãi không tồn tại");
            }
            Voucher voucher = optional.get();
            VoucherDetail voucherDetail = VoucherDetail.builder()
                    .voucher(voucher)
                    .bill(bill)
                    .beforPrice(request.getTotalMoney())
                    .afterPrice(request.getAfterPrice())
                    .discountPrice(request.getItemDiscount())
                    .build();
            voucherDetailRepository.save(voucherDetail);

            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepository.save(voucher);
        }

        CompletableFuture.runAsync(() -> sendMailOnline(bill.getId()), Executors.newCachedThreadPool());

        Notification notification = Notification.builder()
                .receiver("admin")
                .notifyContent("Vừa mua đơn hàng")
                .status(Status.CHUA_DOC)
                .bill(bill).build();
        notificationRepository.save(notification);
        messagingTemplate.convertAndSend("/app/admin-notifications", new ResponseObject(true));
        return bill;
    }

    @Override
    public Bill createBillAccountOnlineRequest(CreateBillAccountOnlineRequest request) {
        if (request.getPaymentMethod().equals("paymentReceive")) {
            for (BillDetailOnline x : request.getBillDetail()) {
                Optional<ProductDetail> optional = productDetailRepository.findById(x.getIdProductDetail());
                if (!optional.isPresent()) {
                    throw new RestApiException("Sản phẩm không tồn tại");
                }

                ProductDetail productDetail = optional.get();
                if (productDetail.getStatus() != Status.DANG_SU_DUNG) {
                    throw new RestApiException(Message.NOT_PAYMENT_PRODUCT);
                }
                if (productDetail.getQuantity() < x.getQuantity()) {
                    throw new RestApiException(Message.ERROR_QUANTITY);
                }
                productDetail.setQuantity(productDetail.getQuantity() - x.getQuantity());
                if (productDetail.getQuantity() == 0) {
                    productDetail.setStatus(Status.HET_SAN_PHAM);
                }
                productDetailRepository.save(productDetail);

            }
        }

        Account account = accountRepository.findById(request.getIdAccount()).get();

        String codeBill = "HD" + RandomStringUtils.randomNumeric(6);
        Bill bill = Bill.builder()
                .code(codeBill)
                .phoneNumber(request.getPhoneNumber())
                .shippingTime(new ConvertDateToLong().dateToLong(request.getShippingTime()))
                .address(request.getAddress())
                .userName(request.getUserName())
                .moneyShip(request.getMoneyShip())
                .itemDiscount(request.getItemDiscount())
                .totalMoney(request.getTotalMoney())
                .typeBill(TypeBill.ONLINE)
                .email(account.getEmail())
                .statusBill(StatusBill.CHO_XAC_NHAN)
                .poinUse(request.getPoin())
                .account(account).build();
        if (!request.getPaymentMethod().equals("paymentReceive")) {
            bill.setCode(request.getResponsePayment().getVnp_TxnRef().split("-")[0]);
        }
        List<ScoringFormula> scoringFormulas = scoringFormulaRepository.findAllByOrderByCreatedDateDesc();
        if (request.getPoin() > 0 && !scoringFormulas.isEmpty()) {
            ScoringFormula scoringFormula = scoringFormulas.get(0);
            User user = account.getUser();
            user.setPoints(user.getPoints() - request.getPoin());
            userReposiory.save(user);
            bill.setValuePoin(scoringFormula.ConvertPoinToMoney(request.getPoin()));
            historyPoinRepository.save(HistoryPoin.builder().typePoin(TypePoin.DIEM_SU_DUNG).value(request.getPoin())
                    .bill(bill).user(user).scoringFormula(scoringFormula).build());
        }
        billRepository.save(bill);
        BillHistory billHistory = BillHistory.builder()
                .bill(bill)
                .statusBill(request.getPaymentMethod().equals("paymentReceive") ? StatusBill.CHO_XAC_NHAN
                        : StatusBill.DA_THANH_TOAN)
                .actionDescription(
                        request.getPaymentMethod().equals("paymentReceive") ? "Chưa thanh toán" : "Đã thanh toán")
                .build();
        billHistoryRepository.save(billHistory);

        for (BillDetailOnline x : request.getBillDetail()) {
            Optional<ProductDetail> optional = productDetailRepository.findById(x.getIdProductDetail());
            if (!optional.isPresent()) {
                throw new RestApiException("Sản phẩm không tồn tại");
            }

            ProductDetail productDetail = optional.get();
            BillDetail billDetail = BillDetail.builder()
                    .statusBill(StatusBill.THANH_CONG)
                    .productDetail(productDetail)
                    .price(x.getPrice())
                    .quantity(x.getQuantity())
                    .promotion(x.getValuePromotion())
                    .bill(bill).build();
            billDetailRepository.save(billDetail);

        }
        PaymentsMethod paymentsMethod = PaymentsMethod.builder()
                .method(request.getPaymentMethod().equals("paymentReceive") ? StatusMethod.TIEN_MAT
                        : StatusMethod.CHUYEN_KHOAN)
                .bill(bill)
                .totalMoney(request.getTotalMoney().add(request.getMoneyShip()).subtract(request.getItemDiscount()))
                .status(request.getPaymentMethod().equals("paymentReceive") ? StatusPayMents.TRA_SAU
                        : StatusPayMents.DA_THANH_TOAN)
                .build();
        if (!request.getPaymentMethod().equals("paymentReceive")) {
            paymentsMethod.setVnp_TransactionNo(request.getResponsePayment().getVnp_TransactionNo());
            paymentsMethod.setCreateAt(Long.parseLong(request.getResponsePayment().getVnp_TxnRef().split("-")[1]));
            paymentsMethod.setTransactionDate(Long.parseLong(request.getResponsePayment().getVnp_PayDate()));
            paymentsMethod.setStatus(StatusPayMents.THANH_TOAN);
        }
        paymentsMethodRepository.save(paymentsMethod);

        if (!request.getIdVoucher().isEmpty()) {
            Optional<Voucher> optional = voucherRepository.findById(request.getIdVoucher());
            if (!optional.isPresent()) {
                throw new RestApiException("Khuyến mãi không tồn tại");
            }
            Voucher voucher = optional.get();

            VoucherDetail voucherDetail = VoucherDetail.builder()
                    .voucher(voucher)
                    .bill(bill)
                    .beforPrice(request.getTotalMoney())
                    .afterPrice(request.getAfterPrice())
                    .discountPrice(request.getItemDiscount())
                    .build();
            voucherDetailRepository.save(voucherDetail);
            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepository.save(voucher);
        }

        Cart cart = cartRepository.getCartByAccount_Id(request.getIdAccount());
        for (BillDetailOnline x : request.getBillDetail()) {
            List<CartDetail> cartDetail = cartDetailRepository.getCartDetailByCart_IdAndProductDetail_Id(cart.getId(),
                    x.getIdProductDetail());
            cartDetail.forEach(detail -> cartDetailRepository.deleteById(detail.getId()));
        }
        CompletableFuture.runAsync(() -> sendMailOnline(bill.getId()), Executors.newCachedThreadPool());

        Notification notification = Notification.builder()
                .receiver("admin")
                .notifyContent("Vừa mua đơn hàng")
                .status(Status.CHUA_DOC)
                .account(account)
                .bill(bill).build();
        notificationRepository.save(notification);
        messagingTemplate.convertAndSend("/app/admin-notifications", new ResponseObject(true));
        return bill;
    }

    @Override
    public Bill changeStatusBill(CancelBillClientRequest request) {
        Optional<Bill> optional = billRepository.findById(request.getId());
        Optional<BillHistory> optionalBillHistory = billHistoryRepository.findByBill_Id(request.getId());

        if (optional.isEmpty()) {
            throw new RestApiException("Hóa đơn không tồn tại");
        }
        if (optionalBillHistory.isEmpty()) {
            throw new RestApiException("Lịch sử hóa đơn không tồn tại");
        }

        Bill bill = optional.get();
        BillHistory billHistory = optionalBillHistory.get();
        if (bill.getStatusBill().equals(StatusBill.CHO_XAC_NHAN)) {
            billHistory.setStatusBill(StatusBill.DA_HUY);
            billHistory.setActionDescription(request.getDescription());
            bill.setStatusBill(StatusBill.DA_HUY);
            billHistoryRepository.save(billHistory);
        } else {
            throw new RestApiException("Chỉ được hủy hóa đơn chờ xác nhận");
        }

        return billRepository.save(bill);
    }

    @Override
    public Bill findByCode(String code, String phoneNumber) {
        Optional<Bill> bill = billRepository.findByCodeAndPhoneNumber(code, phoneNumber);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        return bill.get();
    }

    @Override
    public boolean ChangeAllEmployee(String id, ChangeAllEmployeeRequest request) {
        Optional<Account> checkAccount = accountRepository.findById(id);
        if (checkAccount.get().getRoles() != Roles.ROLE_ADMIN) {
            throw new RestApiException(Message.ACCOUNT_NOT_ROLE);
        }
        request.getIds().forEach(idBill -> {
            Optional<Bill> bill = billRepository.findById(idBill);
            Optional<User> user = userReposiory.findById(request.getIdEmployee());
            Optional<Account> account = accountRepository.findByUser(user.get());
            if (!bill.isPresent()) {
                throw new RestApiException(Message.BILL_NOT_EXIT);
            }
            if (!account.isPresent()) {
                throw new RestApiException(Message.NOT_EXISTS);
            }
            bill.get().setEmployees(account.get());
            billRepository.save(bill.get());
        });
        return true;
    }

    @Override
    public boolean ChangeEmployee(String id, ChangeEmployeeRequest request) {
        Optional<Account> checkAccount = accountRepository.findById(id);
        if (checkAccount.get().getRoles() != Roles.ROLE_ADMIN) {
            throw new RestApiException(Message.ACCOUNT_NOT_ROLE);
        }
        Optional<Bill> bill = billRepository.findById(request.getId());
        Optional<User> user = userReposiory.findById(request.getIdEmployee());
        Optional<Account> account = accountRepository.findByUser(user.get());
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        if (!account.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        bill.get().setEmployees(account.get());
        billRepository.save(bill.get());
        return true;
    }

    public boolean createTemplateSendMail(String idBill, BigDecimal totalExcessMoney) {
        // begin create file pdf
        Optional<Bill> optional = billRepository.findById(idBill);
        InvoiceResponse invoice = exportFilePdfFormHtml.getInvoiceResponse(optional.get(), totalExcessMoney);
        Bill bill = optional.get();
        String email = bill.getEmail();
        if (email == null) {
            return true;
        }
        if ((bill.getStatusBill() == StatusBill.TRA_HANG || bill.getStatusBill() != StatusBill.THANH_CONG ) && !email.isEmpty()) {
            invoice.setCheckShip(true);
            sendMail(invoice,
                    domainClient + "/bill/" + bill.getCode() + "/" + bill.getPhoneNumber(), bill.getEmail());
        }
        return true;
    }

    @Override
    public String createFilePdfAtCounter(String code, BigDecimal totalExcessMoney) {
        Optional<Bill> optional = billRepository.findByCode(code);
        InvoiceResponse invoice = exportFilePdfFormHtml.getInvoiceResponse(optional.get(), totalExcessMoney);
        Context dataContext = exportFilePdfFormHtml.setData(invoice);
        return springTemplateEngine.process("templateBill", dataContext);
    }

    @Override
    public String createAllFilePdf(ChangAllStatusBillByIdsRequest request) {
        StringBuilder stringBuilder = new StringBuilder();
        request.getIds().parallelStream().forEach(item -> {
            Optional<Bill> optional = billRepository.findById(item);
            InvoiceResponse invoice = exportFilePdfFormHtml.getInvoiceResponse(optional.get(), new BigDecimal(0));
            if (optional.get().getStatusBill() != StatusBill.THANH_CONG) {
                invoice.setTypeBill(true);
                invoice.setCheckShip(true);
            }
            Context dataContext = exportFilePdfFormHtml.setData(invoice);
            stringBuilder.append(springTemplateEngine.process("templateBill", dataContext));
        });
        return stringBuilder.toString();
    }

    public void sendMailOnline(String idBill) {
        Optional<Bill> optional = billRepository.findById(idBill);
        InvoiceResponse invoice = exportFilePdfFormHtml.getInvoiceResponse(optional.get(), new BigDecimal(0));
        invoice.setCheckShip(true);
        if ((optional.get().getEmail() != null)) {
            sendMail(invoice,
                    domainClient + "/bill/" + optional.get().getCode() + "/" + optional.get().getPhoneNumber(),
                    optional.get().getEmail());
        }
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

    @Override
    public BillGiveBackInformation getBillGiveBackInformation(String codeBill) {
        Optional<Bill> optional = billRepository.findByCode(codeBill);
        if (!optional.isPresent()) {
            throw new RestApiException("Không tìm thấy mã  hóa đơn " + codeBill);
        }

        if (optional.get().getStatusBill().equals(StatusBill.DA_HUY)) {
            throw new RestApiException("Hóa đơn " + codeBill + " đã bị hủy.");
        }

        if (optional.get().getStatusBill().equals(StatusBill.THANH_CONG)) {
            long currentSeconds = System.currentTimeMillis();
            long givenBackCheck = optional.get().getCompletionDate() + 2 * 24 * 60 * 60 * 1000;
            if (currentSeconds > givenBackCheck) {
                throw new RestApiException("Đơn hàng đã hết hạn hoàn đổi.");
            }
        }

        return billRepository.getBillGiveBackInformation(codeBill);
    }

    @Override
    public List<BillGiveBack> getBillGiveBack(String idBill) {
        return billRepository.getBillGiveBack(idBill);
    }

    @Override
    public Bill updateBillGiveBack(UpdateBillGiveBack updateBillGiveBack,
            List<UpdateBillDetailGiveBack> updateBillDetailGiveBacks) {
        Account account = accountRepository.findById(shoseSession.getEmployee().getId()).get();
        Bill bill = billRepository.findById(updateBillGiveBack.getIdBill()).get();
        if (bill == null) {
            throw new RestApiException("Không tìm thấy mã hóa đơn.");
        }

        // todo: update points user by totalBillGiveBack
        BigDecimal totalBill = bill.getTotalMoney();
        String idAccount = updateBillGiveBack.getIdAccount();
        BigDecimal totalBillGive = updateBillGiveBack.getTotalBillGiveBack();
        int checkTotal = totalBill.compareTo(totalBillGive);
        List<ScoringFormula> scoringFormulas = scoringFormulaRepository.findAllByOrderByCreatedDateDesc();
        if (!scoringFormulas.isEmpty()) {
            ScoringFormula scoringFormula = scoringFormulas.get(0);
            int pointGiveBack = scoringFormula.ConvertMoneyToPoints(bill.getTotalMoney().subtract(totalBillGive));
            if (idAccount != null) {
                User customer = accountRepository.findById(idAccount).get().getUser();
                if (checkTotal == 0) {
                    customer.setPoints(customer.getPoints() + bill.getPoinUse() - pointGiveBack);
                    historyPoinRepository.save(
                            HistoryPoin.builder().typePoin(TypePoin.DIEM_HOAN).value(bill.getPoinUse())
                                    .bill(bill).user(customer).scoringFormula(scoringFormula).build());
                } else {
                    customer.setPoints(customer.getPoints() - pointGiveBack);
                    historyPoinRepository.save(
                            HistoryPoin.builder().typePoin(TypePoin.DIEM_HOAN).value(bill.getPoinUse()- pointGiveBack)
                                    .bill(bill).user(customer).scoringFormula(scoringFormula).build());
                }
                userReposiory.save(customer);
            }
        }

        // todo update voucher detail new to bill
        Voucher voucher = new Voucher();
        if (updateBillGiveBack.getIdVoucher() != null) {
            voucher = voucherRepository.findById(updateBillGiveBack.getIdVoucher()).get();
            VoucherDetail billDetailVoucher = voucherDetailRepository.findVoucherDetailByIdBill(bill.getId());
            if (billDetailVoucher != null && voucher != null) {
                billDetailVoucher.setBill(bill);
                billDetailVoucher.setVoucher(voucher);
                billDetailVoucher.setUpdatedBy(shoseSession.getEmployee().getEmail());
                billDetailVoucher.setBeforPrice(totalBill.subtract(totalBillGive).add(bill.getItemDiscount()));
                billDetailVoucher.setAfterPrice(
                        totalBill.subtract(totalBillGive).add(bill.getItemDiscount()).subtract(voucher.getValue()));
                billDetailVoucher.setDiscountPrice(voucher.getValue());
                voucherDetailRepository.save(billDetailVoucher);
            } else if (voucher != null) {
                VoucherDetail voucherDetail = new VoucherDetail();
                voucherDetail.setBill(bill);
                voucherDetail.setVoucher(voucher);
                voucherDetail.setUpdatedBy(shoseSession.getEmployee().getEmail());
                voucherDetail.setBeforPrice(totalBill.subtract(totalBillGive).add(bill.getItemDiscount()));
                voucherDetail.setAfterPrice(
                        totalBill.subtract(totalBillGive).add(bill.getItemDiscount()).subtract(voucher.getValue()));
                voucherDetail.setDiscountPrice(voucher.getValue());
                voucherDetailRepository.save(voucherDetail);
            }
        }

        // todo update stattus bill
        bill.setStatusBill(StatusBill.TRA_HANG);
        bill.setTotalMoney(totalBill.subtract(totalBillGive));
        bill.setMoneyShip(checkTotal == 0 ? new BigDecimal(0) : bill.getMoneyShip());
        bill.setPoinUse(checkTotal == 0 ? 0 : bill.getPoinUse());
        bill.setValuePoin(checkTotal == 0 ? new BigDecimal(0) : bill.getValuePoin());
        bill.setItemDiscount(voucher.getValue() == null ? bill.getValuePoin()
                : voucher.getValue().add(bill.getValuePoin() == null ? new BigDecimal(0) : bill.getValuePoin()));
        billRepository.save(bill);

        BillHistory billHistory = BillHistory.builder()
                .bill(bill).actionDescription(updateBillGiveBack.getNote())
                .employees(account)
                .statusBill(StatusBill.TRA_HANG)
                .build();
        billHistoryRepository.save(billHistory);

        List<BillDetail> listUpdateBillDetail = updateBillDetailGiveBacks.stream().map((data) -> {
            BillDetail billDetail = billDetailRepository.findById(data.getIdBillDetail())
                    .orElseThrow(() -> new RuntimeException("Chi tiết hóa đơn không tồn tại."));
            billDetail.setStatusBill(StatusBill.THANH_CONG);
            billDetail.setQuantity(billDetail.getQuantity() - data.getQuantity());
            return billDetail;
        }).collect(Collectors.toList());

        List<ProductDetailGiveBack> productDetailGiveBackList = new ArrayList<>();
        List<BillDetail> listUpdateBillDetailGiveBack = updateBillDetailGiveBacks.stream().map((data) -> {
            ProductDetail productDetail = productDetailRepository.findById(data.getIdProduct()).get();
            BillDetail billDetail = new BillDetail();
            billDetail.setStatusBill(StatusBill.TRA_HANG);
            billDetail.setQuantity(data.getQuantity());
            billDetail.setBill(bill);
            billDetail.setProductDetail(productDetail);
            billDetail.setPrice(new BigDecimal(data.getPrice()));
            billDetail.setPromotion(data.getPromotion() == null ? null : new BigDecimal(data.getPromotion()));

            // todo: create product detail give back
            ProductDetailGiveBack giveBack = new ProductDetailGiveBack();
            giveBack.setIdProductDetail(productDetail.getId());
            giveBack.setStatusBill(StatusBill.TRA_HANG);
            giveBack.setQuantity(data.getQuantity());
            productDetailGiveBackList.add(giveBack);
            return billDetail;
        }).collect(Collectors.toList());

        // todo: create product detail give back
        List<ProductDetailGiveBack> addProductDetailGiveBacks = productDetailGiveBackList.stream().map(data -> {
            ProductDetailGiveBack productDetailGiveBack = productDetailGiveBackRepository
                    .getOneByIdProductDetail(data.getIdProductDetail());
            if (productDetailGiveBack != null) {
                productDetailGiveBack.setQuantity(productDetailGiveBack.getQuantity() + data.getQuantity());
                return productDetailGiveBack;
            }
            return data;
        }).collect(Collectors.toList());

        billDetailRepository.saveAll(listUpdateBillDetail);
        billDetailRepository.saveAll(listUpdateBillDetailGiveBack);
        productDetailGiveBackRepository.saveAll(addProductDetailGiveBacks);
        return bill;
    }

    @Override
    public List<BillResponse> getBillCanceled() {
        return billRepository.getBillCanceled();
    }

    @Override
    public String getShipBill(BillShipRequest request) {
        Optional<Bill> optional = billRepository.findById(request.getIdBill());
        optional.get().setMoneyShip(request.getShip());
        billRepository.save(optional.get());
        return "Thành công";
    }

    @Override
    public boolean sendMailGiveBack(String id) {
        sendMailOnline(id);
        return true;
    }

    private Long getCurrentTimestampInVietnam() {
        Instant instant = Instant.now();
        ZoneId zoneId = ZoneId.of("Asia/Ho_Chi_Minh");
        return instant.atZone(zoneId).toEpochSecond() * 1000;
    }

}
