package com.example.shose.server.infrastructure.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Configuration
public class QRCodeAndCloudinary {

    @Autowired
    private Cloudinary cloudinary;

    private ExecutorService executorService = Executors.newFixedThreadPool(20); // luồng chạy

    public  String generateAndUploadQRCode(String content) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, 200, 200);

            BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bufferedImage, "png", baos);

            byte[] imageData = baos.toByteArray();

            Future<Map> uploadTask = executorService.submit(() -> cloudinary.uploader().upload(imageData, ObjectUtils.emptyMap()));
            Map uploadResult = uploadTask.get();

            return uploadResult.get("url").toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


}
