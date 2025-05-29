package com.example.shose.server.service.impl;

import com.example.shose.server.dto.request.address.*;
import com.example.shose.server.dto.response.address.AddressAccountResponse;
import com.example.shose.server.dto.response.address.AddressResponse;
import com.example.shose.server.dto.response.address.AddressUserReponse;
import com.example.shose.server.dto.response.user.GetByAccountResponse;
import com.example.shose.server.dto.response.user.SimpleUserResponse;
import com.example.shose.server.entity.Address;
import com.example.shose.server.entity.User;
import com.example.shose.server.infrastructure.constant.Message;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.exception.rest.RestApiException;
import com.example.shose.server.repository.AddressRepository;
import com.example.shose.server.repository.UserReposiory;
import com.example.shose.server.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.List;
import java.util.Optional;

/**
 * @author Hào Ngô
 */
@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserReposiory userReposiory;

    @Override
    public List<AddressUserReponse> findAddressByUserId(String idUser) {
        return addressRepository.findAddressByUserId(idUser);
    }

    @Override
    public List<AddressResponse> getList(FindAddressRequest req) {

        return addressRepository.getAll(req);
    }

    @Override
    public Address create(CreateAddressRequest req) {
        List<Address> checkStatusAddress = addressRepository.findAllAddressByStatus(Status.DANG_SU_DUNG, req.getUserId());
        Optional<User> user = userReposiory.findById(req.getUserId());
        System.out.println(checkStatusAddress);
        if (checkStatusAddress.isEmpty()) {
            Address address = Address.builder().line(req.getLine()).district(req.getDistrict()).province(req.getProvince())
                    .ward(req.getWard()).status(Status.DANG_SU_DUNG).provinceId(req.getProvinceId()).toDistrictId(req.getToDistrictId())
                    .wardCode(req.getWardCode()).fullName(req.getFullName()).phoneNumber(req.getPhoneNumber()).user(user.get()).build();
            return addressRepository.save(address);
        } else {
            Address address = Address.builder().line(req.getLine()).district(req.getDistrict()).province(req.getProvince())
                    .ward(req.getWard()).status(Status.KHONG_SU_DUNG).provinceId(req.getProvinceId()).toDistrictId(req.getToDistrictId())
                    .wardCode(req.getWardCode()).fullName(req.getFullName()).phoneNumber(req.getPhoneNumber()).user(user.get()).build();
            return addressRepository.save(address);
        }

    }

    @Override
    public Address update(UpdateAddressRequest req) {
        List<Address> checkStatusAddress = addressRepository.findAllAddressByStatus(Status.DANG_SU_DUNG, req.getUserId());
        Address addressStatus = addressRepository.getOneAddressByStatus(Status.DANG_SU_DUNG, req.getUserId());
        Optional<Address> optional = addressRepository.findById(req.getId());
        Optional<User> user = userReposiory.findById(req.getUserId());
        System.out.println(req.getStatus());
        if (req.getStatus().equals(Status.DANG_SU_DUNG)) {
            Address addressUpdateStatus = new Address();
            addressUpdateStatus.setId(addressStatus.getId());
            addressUpdateStatus.setLine(addressStatus.getLine());
            addressUpdateStatus.setDistrict(addressStatus.getDistrict());
            addressUpdateStatus.setProvince(addressStatus.getProvince());
            addressUpdateStatus.setWard(addressStatus.getWard());
            addressUpdateStatus.setStatus(Status.KHONG_SU_DUNG);
            addressUpdateStatus.setToDistrictId(addressStatus.getToDistrictId());
            addressUpdateStatus.setProvinceId(addressStatus.getProvinceId());
            addressUpdateStatus.setWardCode(addressStatus.getWardCode());
            addressUpdateStatus.setFullName(addressStatus.getFullName());
            addressUpdateStatus.setPhoneNumber(addressStatus.getPhoneNumber());
            addressUpdateStatus.setUser(user.get());
            addressRepository.save(addressUpdateStatus);
        }
        Address address = optional.get();
        address.setLine(req.getLine());
        address.setDistrict(req.getDistrict());
        address.setProvince(req.getProvince());
        address.setWard(req.getWard());
        address.setStatus(req.getStatus());
        address.setToDistrictId(req.getToDistrictId());
        address.setProvinceId(req.getProvinceId());
        address.setWardCode(req.getWardCode());
        address.setFullName(req.getFullName());
        address.setPhoneNumber(req.getPhoneNumber());
        address.setUser(user.get());
        if (checkStatusAddress == null) {
            return addressRepository.save(address);
        }
        return addressRepository.save(address);
    }

    @Override
    public Boolean delete(String id) {
        Optional<Address> optional = addressRepository.findById(id);
        if (!optional.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        addressRepository.delete(optional.get());
        return true;
    }

    @Override
    public Address getOneById(String id) {
        Optional<Address> optional = addressRepository.findById(id);
        if (!optional.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        return optional.get();
    }

    @Override
    public List<SimpleUserResponse> getAllSimpleEntityUser() {
        return addressRepository.getAllSimpleEntityUser();
    }

    @Override
    public Address getAddressByUserIdAndStatus(String id, Status status) {
        return addressRepository.getAddressByUserIdAndStatus(id, Status.DANG_SU_DUNG);
    }

    @Override
    public AddressAccountResponse getAddressByAccountIdAndStatus(String idAccount) {
        return addressRepository.getAddressByAccountIdAndStatus(idAccount);
    }

    @Override
    public List<AddressAccountResponse> getListAddressByAccountId(String idAccount) {
        return addressRepository.getListAddressByAccountId(idAccount);
    }

    @Override
    public Address setDefault(SetAddressDefaultClientRequest request) {
        Optional<Address> optional = addressRepository.findById(request.getIdAddress());
        if(!optional.isPresent()){
            throw new RestApiException("Địa chỉ của khách không tồn tại");
        }

        Address address1 = addressRepository.getAddressDefaultAccount(request.getIdAccount());
        address1.setStatus(Status.KHONG_SU_DUNG);
        addressRepository.save(address1);
        Address address =  optional.get();
        address.setStatus(Status.DANG_SU_DUNG);
        return addressRepository.save(address);
    }

    @Override
    public Address updateAddressClient(UpdateAddressClientRequest req) {
        Optional<Address> optional = addressRepository.findById(req.getId());
        if(!optional.isPresent()){
            throw new RestApiException("Địa chỉ của khách không tồn tại");
        }
        Address address = optional.get();
        address.setLine(req.getLine());
        address.setDistrict(req.getDistrict());
        address.setProvince(req.getProvince());
        address.setWard(req.getWard());
        address.setToDistrictId(req.getToDistrictId());
        address.setProvinceId(req.getProvinceId());
        address.setWardCode(req.getWardCode());
        address.setFullName(req.getFullName());
        address.setPhoneNumber(req.getPhoneNumber());

        return addressRepository.save(address);
    }

    @Override
    public Address createAddressClient(CreateAddressClientRequest req) {
        Optional<GetByAccountResponse> optional = userReposiory.getByAccount(req.getIdAccount());
        if(!optional.isPresent()){
            throw new RestApiException("Người dùng không tồn tại");
        }
        Optional<User> user = userReposiory.findById(optional.get().getId());
        if(!user.isPresent()){
            throw new RestApiException("Người dùng không tồn tại");
        }
        if(req.getStatus().equals(Status.DANG_SU_DUNG)){
            Address address = addressRepository.getAddressDefaultAccount(req.getIdAccount());
            if(address != null){
                address.setStatus(Status.KHONG_SU_DUNG);
                addressRepository.save(address);
            }
        }
        Address address = Address.builder()
                .user(user.get())
                .fullName(req.getFullName())
                .phoneNumber(req.getPhoneNumber())
                .status(req.getStatus())
                .ward(req.getWard())
                .wardCode(req.getWardCode())
                .district(req.getDistrict())
                .toDistrictId(req.getDistrictId())
                .province(req.getProvince())
                .provinceId(req.getProvinceId())
                .line(req.getLine()).build();
        return addressRepository.save(address);
    }

    @Override
    public Address deleteAddressAccount(String id) {
        Optional<Address> optional = addressRepository.findById(id);
        if(!optional.isPresent()){
            throw new RestApiException("Tài khoản của khách không tồn tại");
        }
        addressRepository.deleteById(id);
        return optional.get();
    }

}
