package com.example.shose.server.controller.admin;

import com.example.shose.server.dto.request.image.ImageColorFilerequestDTO;
import com.example.shose.server.dto.request.productdetail.CreateProductDetailRequest;
import com.example.shose.server.dto.request.productdetail.FindProductDetailRequest;
import com.example.shose.server.dto.request.productdetail.UpdateProductDetailRequest;
import com.example.shose.server.dto.request.productdetail.UpdateQuantityAndPrice;
import com.example.shose.server.service.ProductDetailService;
import com.example.shose.server.util.ResponseObject;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * @author Nguyễn Vinh
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/admin/product-detail")
public class ProductDetailRestController {

    @Autowired
    private ProductDetailService productDetailService;

    @GetMapping("")
    public ResponseObject view(final FindProductDetailRequest request) {
        return new ResponseObject(productDetailService.getAll(request));
    }

    @GetMapping("/{id}")
    public ResponseObject getOneById(@PathVariable("id") String id) {
        return new ResponseObject(productDetailService.getOneById(id));
    }

    @PostMapping("")
    public ResponseObject add(@RequestParam Map<String, MultipartFile> fileMap,
                              @RequestParam("data") String requestData) throws IOException, ExecutionException, InterruptedException {

        Gson gson = new Gson();

        JsonArray jsonData = JsonParser.parseString(requestData).getAsJsonArray();
        List<CreateProductDetailRequest> listData =  new ArrayList<>();
        for (JsonElement data : jsonData) {
            CreateProductDetailRequest detail = gson.fromJson(data, CreateProductDetailRequest.class);
            listData.add(detail);
        }

        List<ImageColorFilerequestDTO> dtoList = new ArrayList<>();
        for (String color : fileMap.keySet()) {
            ImageColorFilerequestDTO dto = new ImageColorFilerequestDTO();
            MultipartFile file = fileMap.get(color);
            dto.setColor(color.substring(0, color.indexOf('-')));
            dto.setFiles(file);
            dtoList.add(dto);
        }
        return new ResponseObject(productDetailService.create(listData,dtoList));
    }


    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") String id,
                                 @RequestParam("multipartFiles") List<MultipartFile> multipartFiles,
                                 @RequestParam("data") String requestData) throws IOException, ExecutionException, InterruptedException {

        Gson gson = new Gson();
        UpdateProductDetailRequest request = gson.fromJson(requestData, UpdateProductDetailRequest.class);
        request.setId(id);

        return new ResponseObject(productDetailService.update(request, multipartFiles));
    }

    @PutMapping("/list-data")
    public ResponseObject updateList(@RequestBody List<UpdateQuantityAndPrice> requestData) {
        System.out.println(requestData);
        return new ResponseObject(productDetailService.updateList(requestData));
    }

    @GetMapping("/byProduct/{id}")
    public ResponseObject getByIdProduct(@PathVariable("id") String id) {
        return new ResponseObject(productDetailService.getByIdProduct(id));
    }

    @GetMapping("/custom-product/{id}")
    public ResponseObject findByIdProductDetail(@PathVariable("id") String id){
        return new ResponseObject(productDetailService.findAllByIdProduct(id));
    }

    @GetMapping("/ok")
    public ResponseObject test(final CreateProductDetailRequest request) {
        return new ResponseObject(productDetailService.checkQuantityAndPriceByProducDetailByAll(request));
    }

    @GetMapping("/quantity-product-detail-give-back")
    public ResponseObject getQuantityProductDetailGiveBack(@RequestParam ("idProductDetail") String idProductDetail) {
        return new ResponseObject(productDetailService.getQuantityProductDetailGiveBack(idProductDetail));
    }
}
