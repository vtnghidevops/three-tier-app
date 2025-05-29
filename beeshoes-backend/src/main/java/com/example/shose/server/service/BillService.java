package com.example.shose.server.service;


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
import com.example.shose.server.dto.request.bill.billcustomer.CreateBillCustomerOnlineRequest;

import com.example.shose.server.dto.request.billgiveback.UpdateBillDetailGiveBack;
import com.example.shose.server.dto.request.billgiveback.UpdateBillGiveBack;
import com.example.shose.server.dto.response.bill.BillAccountResponse;
import com.example.shose.server.dto.response.bill.BillGiveBack;
import com.example.shose.server.dto.response.bill.BillGiveBackInformation;
import com.example.shose.server.dto.response.bill.BillResponseAtCounter;
import com.example.shose.server.dto.response.bill.ListStatusRespone;
import com.example.shose.server.entity.Bill;
import com.example.shose.server.dto.response.bill.BillResponse;
import com.example.shose.server.dto.response.bill.UserBillResponse;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author thangdt
 */
public interface BillService {

    List<BillResponse> getAll(String id, BillRequest request);

    List<BillAccountResponse> getAllBillAccount(StatusRequest request);

    List<UserBillResponse> getAllUserInBill();

    List<BillResponseAtCounter> findAllBillAtCounterAndStatusNewBill(String id,FindNewBillCreateAtCounterRequest request);

    Bill  saveOnline(CreateBillRequest request);

    Bill CreateCodeBill(String idEmployees);

    boolean updateBillWait(CreateBillOfflineRequest request);

    Bill  save(String id, CreateBillOfflineRequest request);

    Bill updateBillOffline(String id, UpdateBillRequest bill);

    Bill detail(String id);

    List<ListStatusRespone> getAllSatusBill();

    Bill changedStatusbill(String id, String idEmployees, ChangStatusBillRequest request);

    Bill rollBackBill(String id, String idEmployees, ChangStatusBillRequest request);

    int countPayMentPostpaidByIdBill(String id);

    boolean changeStatusAllBillByIds(ChangAllStatusBillByIdsRequest request, String idEmployees);

    Bill cancelBill(String id,  String idEmployees,ChangStatusBillRequest request);

    Bill createBillCustomerOnlineRequest( CreateBillCustomerOnlineRequest request) ;

    Bill createBillAccountOnlineRequest( CreateBillAccountOnlineRequest request) ;

    Bill changeStatusBill(CancelBillClientRequest request);

    String createFilePdfAtCounter(String idBill, BigDecimal totalExcessMoney);

    String createAllFilePdf(ChangAllStatusBillByIdsRequest request);

    Bill findByCode(String code, String phoneNumber);

    boolean ChangeAllEmployee(String id, ChangeAllEmployeeRequest request);

    boolean ChangeEmployee(String id, ChangeEmployeeRequest request);

    BillGiveBackInformation getBillGiveBackInformation(String codeBill);
    List<BillGiveBack> getBillGiveBack(String idBill);

    Bill updateBillGiveBack(UpdateBillGiveBack updateBillGiveBack , List<UpdateBillDetailGiveBack> updateBillDetailGiveBacks);

    List<BillResponse> getBillCanceled();

    String getShipBill (BillShipRequest request);

    boolean sendMailGiveBack(String id);
}
