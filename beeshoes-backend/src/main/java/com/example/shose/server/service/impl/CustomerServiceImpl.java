package com.example.shose.server.service.impl;

import com.example.shose.server.dto.request.address.CreateAddressRequest;
import com.example.shose.server.dto.request.address.UpdateAddressRequest;
import com.example.shose.server.dto.request.customer.CreateCustomerRequest;
import com.example.shose.server.dto.request.customer.QuickCreateCustomerRequest;
import com.example.shose.server.dto.request.customer.UpdateCustomerRequest;
import com.example.shose.server.dto.request.customer.UpdateInfoClient;
import com.example.shose.server.dto.request.employee.FindEmployeeRequest;
import com.example.shose.server.dto.response.EmployeeResponse;
import com.example.shose.server.entity.Account;
import com.example.shose.server.entity.Address;
import com.example.shose.server.entity.User;
import com.example.shose.server.infrastructure.cloudinary.UploadImageToCloudinary;
import com.example.shose.server.infrastructure.constant.Message;
import com.example.shose.server.infrastructure.constant.Roles;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.email.SendEmailService;
import com.example.shose.server.infrastructure.exception.rest.RestApiException;
import com.example.shose.server.repository.AccountRepository;
import com.example.shose.server.repository.AddressRepository;
import com.example.shose.server.repository.UserReposiory;
import com.example.shose.server.service.CustomerService;
import com.example.shose.server.util.ConvertDateToLong;
import com.example.shose.server.util.RandomNumberGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * @author Phuong Oanh
 */
@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private UserReposiory userReposiory;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UploadImageToCloudinary imageToCloudinary;

    @Autowired
    private SendEmailService sendEmailService;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public List<EmployeeResponse> findAll(FindEmployeeRequest req) {
        return userReposiory.getAllCustomer(req);
    }

    @Override
    public List<EmployeeResponse> searchDate(FindEmployeeRequest req) {
        return userReposiory.findByDate(req);
    }

    @Override
    public User create(CreateCustomerRequest request,
                       CreateAddressRequest addressRequest,
                       MultipartFile file) {
        // check xem có tồn tại sdt không => Khách hàng => roles là USER
        User checkUserPhoneNumber = userReposiory.getOneUserByPhoneNumber(request.getPhoneNumber());
        if (checkUserPhoneNumber != null) {
            throw new RestApiException(Message.PHONENUMBER_USER_EXIST);
        }
        //check email có tồn tại không
        Account checkUserEmail = userReposiory.getOneUserByEmail(request.getEmail());
        if (checkUserEmail != null) {
            throw new RestApiException(Message.EMAIL_USER_EXIST);
        }

        // xử lý ảnh
        String urlImage = imageToCloudinary.uploadImage(file);

        //  thông tin user
        User user = User.builder()
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .status(request.getStatus())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .points(0)
                .citizenIdentity(request.getCitizenIdentity())
                .avata(urlImage) // đường dẫn ảnh từ url
                .build();
        userReposiory.save(user); // add user vào database
        User addressUser = userReposiory.getById(user.getId());

        // tạo tài khoản cho khách hàng
        String password = String.valueOf(new RandomNumberGenerator().generateRandom6DigitNumber());
        Account account = new Account();
        account.setUser(user);
        account.setRoles(Roles.ROLE_USER);
        account.setEmail(user.getEmail());
        account.setPassword(passwordEncoder.encode(password));
        account.setStatus(Status.DANG_SU_DUNG);
        accountRepository.save(account); // add tài khoản vào database

        //  địa chỉ user
        Address address = new Address();
        address.setStatus(Status.DANG_SU_DUNG);
        address.setWard(addressRequest.getWard());
        address.setToDistrictId(addressRequest.getToDistrictId());
        address.setProvinceId(addressRequest.getProvinceId());
        address.setWardCode(addressRequest.getWardCode());
        address.setLine(addressRequest.getLine());
        address.setProvince(addressRequest.getProvince());
        address.setDistrict(addressRequest.getDistrict());
        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setUser(addressUser); // add địa chỉ vào database
        addressRepository.save(address);


        // gửi email
        String subject = "Xin chào, bạn đã đăng ký thành công ";
        sendEmailService.sendEmailPasword(account.getEmail(), subject, password);

        return user;
    }


    @Override
    @Transactional
    public User update(UpdateCustomerRequest request,
                       UpdateAddressRequest addressRequest,
                       MultipartFile file) {

//        User checkUserEmail = userReposiory.getOneUserByEmail(request.getEmail());
//        if (checkUserEmail != null) {
//            throw new RestApiException(Message.EMAIL_USER_EXIST);
//        }

        // xử lý ảnh
        String urlImage = imageToCloudinary.uploadImage(file);

        //  thông tin user
        User user = new User();
        user.setId(request.getId());
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setEmail(request.getEmail());
        user.setGender(request.getGender());
        user.setStatus(request.getStatus());
        user.setPoints(0);
        user.setCitizenIdentity(request.getCitizenIdentity());
        user.setAvata(urlImage);
        user.setDateOfBirth(request.getDateOfBirth());

        userReposiory.save(user); // update user vào database

        //  địa chỉ user
        Address addressUser = addressRepository.getAddressByUserIdAndStatus(user.getId(), Status.DANG_SU_DUNG);

        Address address = new Address();
        if (addressUser != null) {
            address.setId(addressUser.getId());
        }
        address.setWard(addressRequest.getWard());
        address.setToDistrictId(addressRequest.getToDistrictId());
        address.setProvinceId(addressRequest.getProvinceId());
        address.setWardCode(addressRequest.getWardCode());
        address.setLine(addressRequest.getLine());
        address.setProvince(addressRequest.getProvince());
        address.setStatus(Status.DANG_SU_DUNG);
        address.setDistrict(addressRequest.getDistrict());
        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setUser(user);
        addressRepository.save(address);
        return user;

    }

    @Override
    public User updateInfoClient(UpdateInfoClient req) {
        Optional<User> optional = userReposiory.findById(req.getId());
        if (!optional.isPresent()) {
            throw new RestApiException("Người dùng không tồn tại");
        }

        User user = optional.get();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setGender(req.getGender());
        if (req.getAvata() == null) {
           user.setAvata(user.getAvata());
        }else{
            String urlImage = imageToCloudinary.uploadImage(req.getAvata());
            user.setAvata(urlImage);
        }
        user.setDateOfBirth(req.getDateOfBirth());
        return userReposiory.save(user);
    }


    @Override
    public Boolean delete(String id) {
        Optional<User> optional = userReposiory.findById(id);
        if (!optional.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        userReposiory.delete(optional.get());
        return null;
    }

    @Override
    public EmployeeResponse getOneById(String id) {
        Optional<EmployeeResponse> optional = userReposiory.getOneWithPassword(id);
        if (!optional.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        return optional.get();
    }

    @Override
    public User quickCreate(QuickCreateCustomerRequest request, CreateAddressRequest addressRequest) {
        User checkUserPhoneNumber = userReposiory.getOneUserByPhoneNumber(request.getPhoneNumber());
        if (checkUserPhoneNumber != null) {
            throw new RestApiException(Message.PHONENUMBER_USER_EXIST);
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .status(Status.DANG_SU_DUNG)
                .gender(request.getGender())
                .points(0)
                .build();
        userReposiory.save(user);
        User addressUser = userReposiory.getById(user.getId());

        Account account = new Account();
        account.setUser(user);
        account.setRoles(Roles.ROLE_USER);
        account.setEmail(user.getEmail());
        account.setPassword(String.valueOf(new RandomNumberGenerator().generateRandom6DigitNumber()));
        account.setStatus(Status.DANG_SU_DUNG);
        accountRepository.save(account);
        return user;
    }

    @Override
    public EmployeeResponse getOneByPhoneNumber(String phoneNumber) {
        Optional<EmployeeResponse> optional = userReposiory.getOneByPhoneNumber(phoneNumber);
        if (!optional.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        return optional.get();
    }

    @Override
    public User findByEmail(String email) {
        return userReposiory.findByEmail(email).get();
    }
}
