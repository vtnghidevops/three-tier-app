package com.example.shose.server.infrastructure.email;


import com.example.shose.server.dto.response.bill.RollBackBillResponse;
import com.example.shose.server.entity.Bill;
import com.example.shose.server.infrastructure.excel.ExportExcelStatistical;
import com.example.shose.server.repository.BillRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;


@Service
public class SendEmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private BillRepository billRepository;

    @Value("${spring.mail.username}")
    private String sender;

    @Autowired
    private ExportExcelStatistical exportExcelStatisticall;

    @Async
    public void sendEmailPasword(String to, String subject, String password) {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");

        String htmlBody = "<html>"
                + "<head>"
                + "<style>"
                + "body { font-family: Arial, sans-serif; background-color: #007bff; color: #ffffff; padding: 20px; }"
                + ".container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 4px; }"
                + "h1 { text-align: center; color: #007bff; }"
                + "img.logo { display: block; margin: 0 auto; }"
                + ".form-group { text-align: center; }"
                + "label { display: block; font-weight: bold; margin-bottom: 5px; }"
                + "input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }"
                + "button { background-color: #0056b3; color: #fff; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }"
                + "button:hover { background-color: #003d80; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='container'>"
                + "<h1> BEE SNEAKER</h1>"
                + "<form>"
                + "<div class='form-group'>"
                + "<label for='username'>Tài khoản :&nbsp;" + to + " </label>"
                + "</div>"
                + "<div class='form-group'>"
                + "<label for='password'>Mật khẩu :&nbsp;" + password + "</label>"
                + "</div>"
                + "</form>"
                + "</div>"
                + "</body>"
                + "</html>";
        try {
            helper.setFrom(sender);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
    @Async
    public void sendBill(String to, String subject, String htmlBody) {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
        try {
            helper.setFrom(sender);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
    @Async
    public void sendEmailRollBackBill(String to, String note,  String idBill) {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
        Optional<Bill> optional = billRepository.findById(idBill);
        String clientDomain = System.getenv("CLIENT_DOMAIN");
        RollBackBillResponse response = RollBackBillResponse.builder().code(optional.get().getCode()).fullName(optional.get().getEmployees().getUser().getFullName()).note(note).url(clientDomain + "/bill-management/detail-bill/"+ optional.get().getId()).build();
        String htmlBody = "<html>"
                + "<head>"
                + "<style>"
                + "body { font-family: Arial, sans-serif; background-color: #007bff; color: #ffffff; padding: 20px; }"
                + ".container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 4px; }"
                + "h1 { text-align: center; color: #007bff; }"
                + "img.logo { display: block; margin: 0 auto; }"
                + ".form-group { text-align: center; }"
                + "label { display: block; font-weight: bold; margin-bottom: 5px; }"
                + "input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }"
                + "button { background-color: #e4641a; color: #fff; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; }"
                + "button:hover { background-color: #c95617; }"  // Adjusted hover color
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='container'>"
                + "<h1> Chuyển lại trạng thái hóa đơn</h1>"
                + "<form>"
                + "<div class='form-group'>"
                + "<label for='username'>Mã hóa đơn :&nbsp;" + response.getCode() + " </label>"
                + "</div>"
                + "<div class='form-group'>"
                + "<label for='password'>Họ và tên nhân viên :&nbsp;" + response.getFullName() + "</label>"
                + "</div>"
                + "<div class='form-group'>"
                + "<label for='password'>Lý do :&nbsp;" + response.getNote() + "</label>"
                + "</div>"
                + "<div class=\"\" style=\"text-align: center; width: 100%\">Xem thông tin chi tiết đơn hàng </div></br>\n" +
                "<div class=\"\" style=\"text-align: center; width: 100%\">\n" +
                "<button><a th:href=\"" + response.getUrl() + "\" style=\"text-decoration: none; color: white; font-size: 16px; font-weight: 700;\">Tại đây</a></button>\n" +
                "</div>"
                + "</form>"
                + "</div>"
                + "</body>"
                + "</html>";
        try {
            helper.setFrom(sender);
            helper.setTo(to);
            helper.setSubject("Chuyển đổi lại trạng thái hóa đơn");
            helper.setText(htmlBody, true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private void sendEmailWithAttachment(String to, String subject, String body, byte[] attachment, String attachmentName) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);

        helper.addAttachment(attachmentName, new ByteArrayDataSource(attachment, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));

        javaMailSender.send(message);
    }
    @Scheduled(cron = "0 0 20 * * ?")
    public void sendAutomaticEmailToYourself() {
        String to = "vinhnvph23845@fpt.edu.vn";
        String subject = "Báo cáo hàng ngày";
        String body = "Báo cáo hàng ngày";

        try {
            ByteArrayOutputStream excelData = exportExcelStatisticall.downloadExcel("api_data.xlsx");
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
            String currentDate = dateFormat.format(new Date());

            // Tên file với thêm ngày
            String fileNameWithDate = "BaoCaoThongKeDoanhThuHoaDonSanPham_" + currentDate + ".xlsx";
            sendEmailWithAttachment(to, subject, body, excelData.toByteArray(), fileNameWithDate);
        } catch (IOException | MessagingException e) {
            e.printStackTrace();
        }
    }


}
