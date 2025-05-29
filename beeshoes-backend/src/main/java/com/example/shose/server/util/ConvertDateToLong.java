package com.example.shose.server.util;


import com.example.shose.server.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import java.text.DateFormat;
import java.text.ParseException;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.TimeZone;

/**
 * @author Nguyễn Vinh
 */
@Component
public class ConvertDateToLong {

    public Long dateToLong(String date) {
        long milliseconds = -1;
        SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
        format.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        try {
            Date d = format.parse(date);
            milliseconds = d.getTime();
        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
        return milliseconds;
    }

    public String longToDate(Long milliseconds) {
        Date date = new Date(milliseconds);
        SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
        format.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        return format.format(date);
    }

    public Long getLongDateNow() {
        return LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant(ZoneOffset.UTC).toEpochMilli();
    }

    public static void main(String[] args) {
        System.out.println(new ConvertDateToLong().dateToLong("03/11/2023"));
        System.out.println(new ConvertDateToLong().longToDate(1702303013592L));

    }
}
