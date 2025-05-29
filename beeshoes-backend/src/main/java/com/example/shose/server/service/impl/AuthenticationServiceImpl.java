package com.example.shose.server.service.impl;

import com.example.shose.server.dto.logindto.ChangePassword;
import com.example.shose.server.dto.logindto.ResetPassword;
import com.example.shose.server.entity.Account;
import com.example.shose.server.entity.User;
import com.example.shose.server.infrastructure.constant.Message;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.email.SendEmailService;
import com.example.shose.server.infrastructure.exception.rest.RestApiException;
import com.example.shose.server.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.example.shose.server.infrastructure.sercurity.auth.RefreshTokenRequets;
import com.example.shose.server.infrastructure.sercurity.auth.SignUpRequets;
import com.example.shose.server.infrastructure.sercurity.auth.SigninRequest;
import com.example.shose.server.infrastructure.sercurity.token.JwtSerrvice;
import com.example.shose.server.infrastructure.session.ShoseSession;
import com.example.shose.server.repository.AccountRepository;
import com.example.shose.server.repository.UserReposiory;
import com.example.shose.server.service.AuthenticationService;
import com.example.shose.server.util.RandomNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AccountRepository accountRepository;

    private final UserReposiory userReposiory;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtSerrvice jwtSerrvice;

    private final SendEmailService sendEmailService;

    private final ShoseSession shoseSession;

    @Override
    public String signUp(SignUpRequets signUpRequets) {

        Optional<Account> optional = accountRepository.getByEmail(signUpRequets.getEmail());
        if(optional.isPresent()){
            throw new RestApiException(Message.EMAIL_USER_EXIST);
        }
        User checkUser = userReposiory.getOneUserByPhoneNumber(signUpRequets.getPhoneNumber());
        if(checkUser != null){
            throw new RestApiException("Số điện thoại đã được sử dụng.");
        }
        User user = new User();
        user.setEmail(signUpRequets.getEmail());
        user.setPhoneNumber(signUpRequets.getPhoneNumber());
        user.setStatus(Status.DANG_SU_DUNG);
        user.setPoints(0);
        userReposiory.save(user);

        var check = accountRepository.getOneByEmail(signUpRequets.getEmail());
        if (check != null) {
            throw new RestApiException("Tài khoản đã đăng ký.");
        }

        Account account = new Account();
        account.setEmail(signUpRequets.getEmail());
        account.setRoles(signUpRequets.getRoles());
        account.setUser(user);
        account.setStatus(Status.DANG_SU_DUNG);
        account.setPassword(passwordEncoder.encode(signUpRequets.getPassword()));
        accountRepository.save(account);

        String subject = "Xin chào, bạn đã đăng ký thành công tài khoản. ";
        sendEmailService.sendEmailPasword(account.getEmail(), subject, signUpRequets.getPassword());
        return "Người dùng đã được thêm vào hệ thống";
    }

    @Override
    public JwtAuhenticationResponse singIn(SigninRequest request) {

        var check = accountRepository.getOneByEmail(request.getEmail());
        if (check == null) {
            throw new RestApiException("Tài khoản hoặc mật khẩu không đúng.");
        }

        if (!passwordEncoder.matches(request.getPassword(), check.getPassword()) && check != null) {
            throw new RestApiException("Tài khoản hoặc mật khẩu không đúng.");
        }

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword()
        ));
        var account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RestApiException("Email hoặc mật khẩu không hợp lệ."));
        var jwt = jwtSerrvice.genetateToken(account);
        var refreshToken = jwtSerrvice.genetateRefreshToken(new HashMap<>(), account);

        return JwtAuhenticationResponse.builder()
                .refreshToken(refreshToken)
                .token(jwt)
                .build();
    }

    @Override
    public JwtAuhenticationResponse refreshToken(RefreshTokenRequets refresh) {
        String userEmail = jwtSerrvice.extractUserName(refresh.getToken());
        Account account = accountRepository.findByEmail(userEmail).orElseThrow();
        if (jwtSerrvice.isTokenValid(refresh.getToken(), account)) {
            var jwt = jwtSerrvice.genetateToken(account);
            return JwtAuhenticationResponse.builder()
                    .refreshToken(refresh.getToken())
                    .token(jwt)
                    .build();
        }
        return null;
    }

    @Override
    public String resetPassword(ResetPassword resetPassword) {
        var account = accountRepository.resetPassword(resetPassword.getEmailForgot(), resetPassword.getPhoneNumber());
        if (account == null) {
            throw new RestApiException("Không tìm thấy tài khoản.");
        }
        String password = String.valueOf(new RandomNumberGenerator().generateRandom6DigitNumber());
        account.setPassword(passwordEncoder.encode(password));
        accountRepository.save(account);
        String subject = "Xin chào, bạn đã đổi mật khẩu thành công. ";
        sendEmailService.sendEmailPasword(account.getEmail(), subject, password);
        return "Đổi mật khẩu thành công.";
    }

    @Override
    public String changePassword(ChangePassword changePassword) {
        String emailUser = shoseSession.getEmployee().getEmail();
        var account = accountRepository.getOneByEmail(emailUser);
        if (passwordEncoder.matches(changePassword.getPassword(), account.getPassword())) {
            String newPasswordEncoded = passwordEncoder.encode(changePassword.getNewPassword());
            account.setPassword(newPasswordEncoded);
            accountRepository.save(account);
        } else {
            throw new RestApiException("Mật khẩu hiện tại không đúng");
        }
        return "Đổi mật khẩu thành công";
    }
}
