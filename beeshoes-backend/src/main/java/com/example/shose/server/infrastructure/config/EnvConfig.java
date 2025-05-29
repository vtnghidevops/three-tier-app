package com.example.shose.server.infrastructure.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class EnvConfig {

    private static Dotenv dotenv;

    @PostConstruct
    public void init() {
        // Tạo instance của Dotenv để đọc file .env
        dotenv = Dotenv.configure()
                .ignoreIfMissing()  // Không throw exception nếu file không tồn tại
                .load();
    }

    /**
     * Phương thức để lấy giá trị từ biến môi trường hoặc file .env
     * @param key Tên biến môi trường
     * @param defaultValue Giá trị mặc định nếu không tìm thấy
     * @return Giá trị của biến môi trường
     */
    public static String get(String key, String defaultValue) {
        String value = System.getenv(key);  // Ưu tiên biến môi trường hệ thống
        
        if (value == null && dotenv != null) {
            value = dotenv.get(key);  // Thử lấy từ file .env
        }
        
        return value != null ? value : defaultValue;
    }

    /**
     * Phương thức để lấy giá trị từ biến môi trường hoặc file .env
     * @param key Tên biến môi trường
     * @return Giá trị của biến môi trường
     */
    public static String get(String key) {
        return get(key, null);
    }
} 