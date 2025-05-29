package com.example.shose.server.service;

import com.example.shose.server.dto.ProductDetailDTO;
import com.example.shose.server.dto.request.image.ImageColorFilerequestDTO;
import com.example.shose.server.dto.request.productdetail.CreateProductDetailRequest;
import com.example.shose.server.dto.request.productdetail.FindProductDetailByCategorysRequest;
import com.example.shose.server.dto.request.productdetail.FindProductDetailRequest;
import com.example.shose.server.dto.request.productdetail.UpdateProductDetailRequest;
import com.example.shose.server.dto.request.productdetail.UpdateQuantityAndPrice;
import com.example.shose.server.dto.response.ProductDetailDTOResponse;
import com.example.shose.server.dto.response.ProductDetailReponse;
import com.example.shose.server.dto.response.cart.ListSizeOfItemCart;
import com.example.shose.server.dto.response.productdetail.GetDetailProductOfClient;
import com.example.shose.server.dto.response.productdetail.GetProductDetail;
import com.example.shose.server.dto.response.productdetail.GetProductDetailByCategory;
import com.example.shose.server.dto.response.productdetail.GetProductDetailByProduct;
import com.example.shose.server.entity.ProductDetailGiveBack;
import com.example.shose.server.infrastructure.common.PageableRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * @author Nguyễn Vinh
 */
public interface ProductDetailService {

    List<ProductDetailReponse> getAll(FindProductDetailRequest findProductDetailRequest);

    List<ProductDetailDTO> create(@Valid List<CreateProductDetailRequest> listData,
                                  List<ImageColorFilerequestDTO> listFileImage) throws IOException, ExecutionException, InterruptedException;

    ProductDetailDTO update(final UpdateProductDetailRequest req,
                            List<MultipartFile> multipartFiles) throws IOException, ExecutionException, InterruptedException;

    List<UpdateQuantityAndPrice> updateList(List<UpdateQuantityAndPrice> requestData);

    Boolean delete(String id);

    ProductDetailDTOResponse getOneById(String id);

    List<GetProductDetailByProduct> getByIdProduct(String id);

    List<GetProductDetailByCategory> GetProductDetailByCategory(String id);

    Page<GetProductDetail> getProductDetailHavePromotion(Pageable pageable);

    Page<GetProductDetail> getProductDetailNew(Pageable pageable);

    Page<GetProductDetail> getProductDetailSellMany(Pageable pageable);

    List<ProductDetailReponse> findAllByIdProduct(String id);

    GetDetailProductOfClient getDetailProductOfClient(String id);

    List<ListSizeOfItemCart> listSizeByProductAndColor(String idProduct, String codeColor);

    Page<GetProductDetail> getProductDetailByCategorys(FindProductDetailByCategorysRequest request,Pageable pageable);
    ProductDetailReponse checkQuantityAndPriceByProducDetailByAll(CreateProductDetailRequest request);

    ProductDetailGiveBack getQuantityProductDetailGiveBack(String idProductDetail);
}
