package com.example.shose.server.service.impl;

import com.example.shose.server.dto.request.statistical.FindBillDateRequest;
import com.example.shose.server.dto.response.statistical.StatisticalBestSellingProductResponse;
import com.example.shose.server.dto.response.statistical.StatisticalBillDateResponse;
import com.example.shose.server.dto.response.statistical.StatisticalDayResponse;
import com.example.shose.server.dto.response.statistical.StatisticalMonthlyResponse;
import com.example.shose.server.dto.response.statistical.StatisticalProductDateResponse;
import com.example.shose.server.dto.response.statistical.StatisticalStatusBillResponse;
import com.example.shose.server.repository.BillRepository;
import com.example.shose.server.service.StatisticalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

/**
 * @author Hào Ngô
 */
@Service
public class StatisticalServiceImpl implements StatisticalService {
    private long currentTimeMillis = System.currentTimeMillis();
    private Date currentDate = new Date(currentTimeMillis);

    @Autowired
    private BillRepository billRepository;
    @Override
    public List<StatisticalDayResponse> getAllStatisticalDay() {
        return billRepository.getAllStatisticalDay(getStartOfToday(), getEndOfToday());
    }

    @Override
    public List<StatisticalMonthlyResponse> getAllStatisticalMonth() {
        return billRepository.getAllStatisticalMonthly(getStartMonth(), getEndMonth());
    }

    @Override
    public List<StatisticalMonthlyResponse> getAllStatisticalYear() {
        return billRepository.getAllStatisticalMonthly(getStartOfYear(), getEndOfYear());
    }

    @Override
    public List<StatisticalDayResponse> getAllStatisticalDayPrevious() {
        return billRepository.getAllStatisticalDay(getStartOfYesterday(), getEndOfYesterday());
    }

    @Override
    public List<StatisticalMonthlyResponse> getAllStatisticalMonthPrevious() {
        return billRepository.getAllStatisticalMonthly(getStartPreviousMonth(), getEndPreviousMonth());
    }

    @Override
    public List<StatisticalMonthlyResponse> getAllStatisticalYearPrevious() {
        return billRepository.getAllStatisticalMonthly(getStartOfPreviousYear(), getEndOfPreviousYear());
    }
    @Override
    public List<StatisticalStatusBillResponse> getAllStatisticalStatusBill(FindBillDateRequest req) {
        if (req.getStartDate() == null && req.getEndDate() == null) {
            req.setStartDate(getStartMonth());
            req.setEndDate(getEndMonth());
            return billRepository.getAllStatisticalStatusBill(req);
        } else if (req.getStartDate() == null && req.getEndDate() != null) {
            req.setStartDate(getStartMonth());
            return billRepository.getAllStatisticalStatusBill(req);
        } else if (req.getStartDate() != null && req.getEndDate() == null) {
            req.setEndDate(getEndMonth());
            return billRepository.getAllStatisticalStatusBill(req);
        } else {
            return billRepository.getAllStatisticalStatusBill(req);
        }
    }

    @Override
    public List<StatisticalBestSellingProductResponse> getAllStatisticalBestSellingProduct(FindBillDateRequest req) {
//        return billRepository.getAllStatisticalBestSellingProduct(getStartMonth(), getEndMonth());
        if (req.getStartDate() == null && req.getEndDate() == null) {
            req.setStartDate(getStartMonth());
            req.setEndDate(getEndMonth());
            return billRepository.getAllStatisticalBestSellingProduct(req);
        } else if (req.getStartDate() == null && req.getEndDate() != null) {
            req.setStartDate(getStartMonth());
            return billRepository.getAllStatisticalBestSellingProduct(req);
        } else if (req.getStartDate() != null && req.getEndDate() == null) {
            req.setEndDate(getEndMonth());
            return billRepository.getAllStatisticalBestSellingProduct(req);
        } else {
            return billRepository.getAllStatisticalBestSellingProduct(req);
        }
    }

    @Override
    public List<StatisticalBillDateResponse> getAllStatisticalBillDate(FindBillDateRequest req) {
        if (req.getStartDate() == null && req.getEndDate() == null) {
            req.setStartDate(getStartMonth());
            req.setEndDate(getEndMonth());
            return billRepository.getAllStatisticalBillDate(req);
        } else if (req.getStartDate() == null && req.getEndDate() != null) {
            req.setStartDate(getStartMonth());
            return billRepository.getAllStatisticalBillDate(req);
        } else if (req.getStartDate() != null && req.getEndDate() == null) {
            req.setEndDate(getEndMonth());
            return billRepository.getAllStatisticalBillDate(req);
        } else {
            return billRepository.getAllStatisticalBillDate(req);
        }
    }

    @Override
    public List<StatisticalProductDateResponse> getAllStatisticalProductDate(FindBillDateRequest req) {
        if (req.getStartDate() == null && req.getEndDate() == null) {
            req.setStartDate(getStartMonth());
            req.setEndDate(getEndMonth());
            return billRepository.getAllStatisticalProductDate(req);
        } else if (req.getStartDate() == null && req.getEndDate() != null) {
            req.setStartDate(getStartMonth());
            return billRepository.getAllStatisticalProductDate(req);
        } else if (req.getStartDate() != null && req.getEndDate() == null) {
            req.setEndDate(getEndMonth());
            return billRepository.getAllStatisticalProductDate(req);
        } else {
            return billRepository.getAllStatisticalProductDate(req);
        }
    }

    @Override
    public List<StatisticalBestSellingProductResponse> getAllStatisticalProductStock() {
        return billRepository.getAllStatisticalProductStock();
    }

    public Long getStartOfToday() {
        // Tạo đối tượng Calendar và đặt ngày là hôm nay
        Calendar calendarStart = Calendar.getInstance();
        calendarStart.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh")); // Để tránh ảnh hưởng của múi giờ
        calendarStart.setTime(currentDate);
        calendarStart.set(Calendar.HOUR_OF_DAY, 0);
        calendarStart.set(Calendar.MINUTE, 0);
        calendarStart.set(Calendar.SECOND, 0);
        calendarStart.set(Calendar.MILLISECOND, 0);

        // Lấy thời điểm đầu hôm nay dưới dạng currentTimeMillis
        return calendarStart.getTimeInMillis();
    }

    public Long getEndOfToday() {
        // Tạo đối tượng Calendar và đặt ngày là hôm nay
        Calendar calendarEnd = Calendar.getInstance();
        calendarEnd.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh")); // Để tránh ảnh hưởng của múi giờ
        calendarEnd.setTime(currentDate);
        calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
        calendarEnd.set(Calendar.MINUTE, 59);
        calendarEnd.set(Calendar.SECOND, 59);
        calendarEnd.set(Calendar.MILLISECOND, 999);

        // Lấy thời điểm cuối hôm nay dưới dạng currentTimeMillis
        return calendarEnd.getTimeInMillis();
    }

    public Long getStartMonth() {
        // Tạo đối tượng Calendar và đặt ngày trong tháng thành 1
        Calendar calendarStart = Calendar.getInstance();
        calendarStart.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh")); // Để tránh ảnh hưởng của múi giờ
        calendarStart.setTime(currentDate);
        calendarStart.set(Calendar.DAY_OF_MONTH, 1);
        calendarStart.set(Calendar.HOUR_OF_DAY, 0);
        calendarStart.set(Calendar.MINUTE, 0);
        calendarStart.set(Calendar.SECOND, 0);
        calendarStart.set(Calendar.MILLISECOND, 0);

        // Lấy thời điểm đầu tháng dưới dạng currentTimeMillis
        return calendarStart.getTimeInMillis();
    }

    public Long getEndMonth() {
        // Tạo đối tượng Calendar và đặt ngày trong tháng thành ngày cuối cùng
        Calendar calendarEnd = Calendar.getInstance();
        calendarEnd.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh")); // Để tránh ảnh hưởng của múi giờ
        calendarEnd.setTime(currentDate);
        calendarEnd.set(Calendar.DAY_OF_MONTH, calendarEnd.getActualMaximum(Calendar.DAY_OF_MONTH));
        calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
        calendarEnd.set(Calendar.MINUTE, 59);
        calendarEnd.set(Calendar.SECOND, 59);
        calendarEnd.set(Calendar.MILLISECOND, 999);

        // Lấy thời điểm cuối tháng dưới dạng currentTimeMillis
        return calendarEnd.getTimeInMillis();
    }

    public Long getStartOfYear() {
        Calendar calendarStart = Calendar.getInstance();
        calendarStart.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        calendarStart.setTime(currentDate);
        calendarStart.set(Calendar.MONTH, Calendar.JANUARY);
        calendarStart.set(Calendar.DAY_OF_MONTH, 1);
        calendarStart.set(Calendar.HOUR_OF_DAY, 0);
        calendarStart.set(Calendar.MINUTE, 0);
        calendarStart.set(Calendar.SECOND, 0);
        calendarStart.set(Calendar.MILLISECOND, 0);

        return calendarStart.getTimeInMillis();
    }

    public Long getEndOfYear() {
        Calendar calendarEnd = Calendar.getInstance();
        calendarEnd.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        calendarEnd.setTime(currentDate);
        calendarEnd.set(Calendar.MONTH, Calendar.DECEMBER);
        calendarEnd.set(Calendar.DAY_OF_MONTH, 31);
        calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
        calendarEnd.set(Calendar.MINUTE, 59);
        calendarEnd.set(Calendar.SECOND, 59);
        calendarEnd.set(Calendar.MILLISECOND, 999);

        return calendarEnd.getTimeInMillis();
    }

    public Long getStartOfYesterday() {
        Calendar calendarStart = Calendar.getInstance();
        calendarStart.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        calendarStart.setTime(currentDate);
        calendarStart.add(Calendar.DAY_OF_MONTH, -1);
        calendarStart.set(Calendar.HOUR_OF_DAY, 0);
        calendarStart.set(Calendar.MINUTE, 0);
        calendarStart.set(Calendar.SECOND, 0);
        calendarStart.set(Calendar.MILLISECOND, 0);

        return calendarStart.getTimeInMillis();
    }

    public Long getEndOfYesterday() {
        Calendar calendarEnd = Calendar.getInstance();
        calendarEnd.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        calendarEnd.setTime(currentDate);
        calendarEnd.add(Calendar.DAY_OF_MONTH, -1);
        calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
        calendarEnd.set(Calendar.MINUTE, 59);
        calendarEnd.set(Calendar.SECOND, 59);
        calendarEnd.set(Calendar.MILLISECOND, 999);

        return calendarEnd.getTimeInMillis();
    }
    public Long getStartPreviousMonth() {
        Calendar calendarStart = Calendar.getInstance();
        calendarStart.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        calendarStart.setTime(currentDate);
        calendarStart.add(Calendar.MONTH, -1);
        calendarStart.set(Calendar.DAY_OF_MONTH, 1);
        calendarStart.set(Calendar.HOUR_OF_DAY, 0);
        calendarStart.set(Calendar.MINUTE, 0);
        calendarStart.set(Calendar.SECOND, 0);
        calendarStart.set(Calendar.MILLISECOND, 0);

        return calendarStart.getTimeInMillis();
    }
    public Long getEndPreviousMonth() {
        Calendar calendarEnd = Calendar.getInstance();
        calendarEnd.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        calendarEnd.setTime(currentDate);
        calendarEnd.add(Calendar.MONTH, -1);
        calendarEnd.set(Calendar.DAY_OF_MONTH, calendarEnd.getActualMaximum(Calendar.DAY_OF_MONTH));
        calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
        calendarEnd.set(Calendar.MINUTE, 59);
        calendarEnd.set(Calendar.SECOND, 59);
        calendarEnd.set(Calendar.MILLISECOND, 999);

        return calendarEnd.getTimeInMillis();
    }

    public Long getStartOfPreviousYear() {
        Calendar calendarStart = Calendar.getInstance();
        calendarStart.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        calendarStart.setTime(currentDate);
        calendarStart.add(Calendar.YEAR, -1);
        calendarStart.set(Calendar.MONTH, Calendar.JANUARY);
        calendarStart.set(Calendar.DAY_OF_MONTH, 1);
        calendarStart.set(Calendar.HOUR_OF_DAY, 0);
        calendarStart.set(Calendar.MINUTE, 0);
        calendarStart.set(Calendar.SECOND, 0);
        calendarStart.set(Calendar.MILLISECOND, 0);

        return calendarStart.getTimeInMillis();
    }

    public Long getEndOfPreviousYear() {
        Calendar calendarEnd = Calendar.getInstance();
        calendarEnd.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        calendarEnd.setTime(currentDate);
        calendarEnd.add(Calendar.YEAR, -1);
        calendarEnd.set(Calendar.MONTH, Calendar.DECEMBER);
        calendarEnd.set(Calendar.DAY_OF_MONTH, 31);
        calendarEnd.set(Calendar.HOUR_OF_DAY, 23);
        calendarEnd.set(Calendar.MINUTE, 59);
        calendarEnd.set(Calendar.SECOND, 59);
        calendarEnd.set(Calendar.MILLISECOND, 999);

        return calendarEnd.getTimeInMillis();
    }
}
