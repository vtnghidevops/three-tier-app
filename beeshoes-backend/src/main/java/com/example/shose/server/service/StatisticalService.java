package com.example.shose.server.service;

import com.example.shose.server.dto.request.statistical.FindBillDateRequest;
import com.example.shose.server.dto.response.statistical.StatisticalBestSellingProductResponse;
import com.example.shose.server.dto.response.statistical.StatisticalBillDateResponse;
import com.example.shose.server.dto.response.statistical.StatisticalDayResponse;
import com.example.shose.server.dto.response.statistical.StatisticalMonthlyResponse;
import com.example.shose.server.dto.response.statistical.StatisticalProductDateResponse;
import com.example.shose.server.dto.response.statistical.StatisticalStatusBillResponse;

import java.util.List;

/**
 * @author Hào Ngô
 */
public interface StatisticalService {
    List<StatisticalDayResponse> getAllStatisticalDay();
    List<StatisticalMonthlyResponse> getAllStatisticalMonth();
    List<StatisticalMonthlyResponse> getAllStatisticalYear();
    List<StatisticalDayResponse> getAllStatisticalDayPrevious();
    List<StatisticalMonthlyResponse> getAllStatisticalMonthPrevious();
    List<StatisticalMonthlyResponse> getAllStatisticalYearPrevious();
    List<StatisticalStatusBillResponse> getAllStatisticalStatusBill(final FindBillDateRequest findBillDateRequest);
    List<StatisticalBestSellingProductResponse> getAllStatisticalBestSellingProduct(final FindBillDateRequest findBillDateRequest);
    List<StatisticalBillDateResponse> getAllStatisticalBillDate(final FindBillDateRequest findBillDateRequest);
    List<StatisticalProductDateResponse> getAllStatisticalProductDate(final FindBillDateRequest findBillDateRequest);
    List<StatisticalBestSellingProductResponse> getAllStatisticalProductStock();

}
