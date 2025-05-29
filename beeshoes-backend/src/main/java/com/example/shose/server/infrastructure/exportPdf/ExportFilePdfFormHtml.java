package com.example.shose.server.infrastructure.exportPdf;

import com.example.shose.server.dto.request.billdetail.BillDetailRequest;
import com.example.shose.server.dto.response.bill.InvoiceItemResponse;
import com.example.shose.server.dto.response.bill.InvoicePaymentResponse;
import com.example.shose.server.dto.response.bill.InvoiceResponse;
import com.example.shose.server.dto.response.billdetail.BillDetailResponse;
import com.example.shose.server.entity.Bill;
import com.example.shose.server.entity.PaymentsMethod;
import com.example.shose.server.infrastructure.cloudinary.QRCodeAndCloudinary;
import com.example.shose.server.infrastructure.constant.StatusBill;
import com.example.shose.server.infrastructure.constant.StatusMethod;
import com.example.shose.server.infrastructure.constant.StatusPayMents;
import com.example.shose.server.repository.BillDetailRepository;
import com.example.shose.server.repository.PaymentsMethodRepository;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.html2pdf.resolver.font.DefaultFontProvider;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfWriter;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Currency;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * @author thangdt
 */
@Component
public class ExportFilePdfFormHtml {

    @Autowired
    private BillDetailRepository billDetailRepository;

    @Autowired
    private PaymentsMethodRepository paymentsMethodRepository;

    @Autowired
    private QRCodeAndCloudinary qrCodeAndCloudinary;

    @Autowired
    private ServletContext servletContext;

    public Context setData(InvoiceResponse invoice) {

        Context context = new Context();

        Map<String, Object> data = new HashMap<>();

        data.put("invoice", invoice);

        context.setVariables(data);

        return context;
    }

    public Context setDataSendMail(InvoiceResponse invoice, String url) {

        Context context = new Context();

        Map<String, Object> data = new HashMap<>();

        data.put("invoice", invoice);
        data.put("url", url);
        context.setVariables(data);

        return context;
    }

    public String htmlToPdf(String processedHtml, String code) {

        String downloadPath = System.getProperty("user.home") + "/Downloads";
        
        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
             PdfWriter pdfwriter = new PdfWriter(byteArrayOutputStream)) {

            DefaultFontProvider defaultFont = new DefaultFontProvider(false, true, false);
            ConverterProperties converterProperties = new ConverterProperties();
            converterProperties.setFontProvider(defaultFont);

            HtmlConverter.convertToPdf(processedHtml, pdfwriter, converterProperties);

            byte[] pdfBytes = byteArrayOutputStream.toByteArray();
            Files.copy(new ByteArrayInputStream(pdfBytes), Paths.get(downloadPath, code + ".pdf"), StandardCopyOption.REPLACE_EXISTING);

        } catch (IOException ex) {
            // Xử lý ngoại lệ khi có lỗi I/O
            ex.printStackTrace();
        }
        return null;
    }

    public NumberFormat formatCurrency() {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("vi-VN"));
        formatter.setCurrency(Currency.getInstance("VND"));
        return formatter;
    }


    public InvoiceResponse getInvoiceResponse(Bill bill, BigDecimal totalExcessMoney) {
        CompletableFuture<String> qrFuture = CompletableFuture.supplyAsync(() -> qrCodeAndCloudinary.generateAndUploadQRCode(bill.getCode()));

        List<BillDetailResponse> billDetailResponses = billDetailRepository.findAllByIdBill(new BillDetailRequest(bill.getId(), ""));
        List<PaymentsMethod> paymentsMethods = paymentsMethodRepository.findAllByBill(bill);
        List<String> findAllPaymentByIdBillAndMethod = paymentsMethodRepository.findAllPayMentByIdBillAndMethod(bill.getId());

        BigDecimal totalPaymentTraSau = paymentsMethods.stream()
                .filter(payment -> payment.getStatus() == StatusPayMents.TRA_SAU)
                .map(PaymentsMethod::getTotalMoney)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        NumberFormat formatter = formatCurrency();
        BigDecimal totalMoney = bill.getTotalMoney().add(bill.getMoneyShip()).subtract(bill.getItemDiscount());
        InvoiceResponse invoice = InvoiceResponse.builder()
                .phoneNumber(bill.getPhoneNumber())
                .address(bill.getAddress())
                .userName(bill.getUserName())
                .code(bill.getCode())
                .ship(formatter.format(bill.getMoneyShip()))
                .itemDiscount(formatter.format(bill.getItemDiscount()))
                .totalMoney(formatter.format(bill.getTotalMoney()))
                .note(bill.getNote())
                .checkShip(true)
                .totalTraSau(formatter.format(totalPaymentTraSau))
                .moneyShip(formatter.format(bill.getMoneyShip()))
                .checkBillTra(bill.getStatusBill() == StatusBill.TRA_HANG ? true : false)
                .build();

        invoice.setTotalBill(totalMoney.compareTo(BigDecimal.ZERO) > 0 ? formatter.format(totalMoney) : "0 đ");
        invoice.setQuantity(billDetailResponses.stream()
                .mapToInt(BillDetailResponse::getQuantity)
                .sum());
        List<InvoiceItemResponse> items = billDetailResponses.stream()
                .map(billDetailRequest -> {
                    BigDecimal sum = billDetailRequest.getPromotion() == null ?
                            billDetailRequest.getPrice().multiply(new BigDecimal(billDetailRequest.getQuantity()))
                            : new BigDecimal(billDetailRequest.getQuantity())
                            .multiply(new BigDecimal(100 - billDetailRequest.getPromotion())
                                    .multiply(billDetailRequest.getPrice()).divide(new BigDecimal(100)));
                    InvoiceItemResponse invoiceItemResponse = InvoiceItemResponse.builder()
                            .sum(formatter.format(sum))
                            .name(billDetailRequest.getProductName())
                            .priceVn(formatter.format(billDetailRequest.getPromotion() == null ?
                                    billDetailRequest.getPrice()
                                    : billDetailRequest.getPrice().multiply(BigDecimal.valueOf(100 - billDetailRequest.getPromotion())).divide(BigDecimal.valueOf(100))))
                            .quantity(billDetailRequest.getQuantity())
                            .promotion(billDetailRequest.getPromotion())
                            .status(billDetailRequest.getStatus().equals("TRA_HANG")  ? "Trả hàng ": "Thành công")
                            .build();

                    if (billDetailRequest.getPromotion() != null) {
                        BigDecimal priceBeforePromotion = billDetailRequest.getPrice().multiply(BigDecimal.ONE.subtract(new BigDecimal(billDetailRequest.getPromotion()).divide(BigDecimal.valueOf(100))));
                        invoiceItemResponse.setPriceBeforePromotion(formatter.format(priceBeforePromotion));
                    }

                    return invoiceItemResponse;
                })
                .collect(Collectors.toList());

        List<InvoicePaymentResponse> paymentsMethodRequests = paymentsMethods.stream()
                .map(item -> InvoicePaymentResponse.builder()
                        .total(formatter.format(item.getMethod() == StatusMethod.TIEN_MAT  ? item.getTotalMoney().add(totalExcessMoney) : item.getTotalMoney()))
                        .method(getPaymentMethod(item.getMethod()))
                        .status(getPaymentStatus(item.getStatus()))
                        .vnp_TransactionNo(item.getVnp_TransactionNo())
                        .build())
                .collect(Collectors.toList());

        BigDecimal totalPayment = totalMoney.add(totalExcessMoney);
        invoice.setTotalPayment(formatter.format(totalPayment));

        BigDecimal change = totalExcessMoney;
        invoice.setChange(formatter.format(change));

        invoice.setPaymentsMethodRequests(paymentsMethodRequests);
        invoice.setItems(items);

        invoice.setMethod(!findAllPaymentByIdBillAndMethod.isEmpty());
        invoice.setTypeBill(false);

        Date date = new Date(bill.getLastModifiedDate());
        SimpleDateFormat formatterDate = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        invoice.setDate(formatterDate.format(date));

        try {
            invoice.setQr(qrFuture.join());
            return CompletableFuture.completedFuture(invoice).get();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    private String getPaymentMethod(StatusMethod method) {
        return method == StatusMethod.TIEN_MAT ? "Tiền mặt" : method == StatusMethod.CHUYEN_KHOAN ? "Chuyển khoản" : "Thẻ";
    }

    private String getPaymentStatus(StatusPayMents status) {
        return status == StatusPayMents.THANH_TOAN ? "Thanh toán" : status == StatusPayMents.TRA_SAU ? "Trả sau" : "Hoàn tiền";
    }


}
