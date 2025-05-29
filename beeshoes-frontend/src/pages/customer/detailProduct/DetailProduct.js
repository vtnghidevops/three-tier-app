import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Col, InputNumber, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { CartClientApi } from "../../../api/customer/cart/cartClient.api";
import { useParams } from "react-router";
import tableSize from "./../../../assets/images/SizeChart.jpg";
import { ProductDetailClientApi } from "../../../api/customer/productdetail/productDetailClient.api";
import "./style-detail-product.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRetweet,
  faTruckFast,
  faFileInvoiceDollar,
  faShieldHeart,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardItem from "../component/Card";
import { sync } from "framer-motion";

function DetailProduct() {
  const idAccountLocal = sessionStorage.getItem("idAccount");
  const [itemSize, setItemSize] = useState("");
  const [infoAndSize, setInfoAndSize] = useState(1);
  const id = useParams();
  const [listSize, setListSize] = useState([]);
  const [cartAccount, setCartAccount] = useState([]);
  const itemsPerPage = 4;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [image, setImage] = useState("");
  const initialCartLocal = JSON.parse(localStorage.getItem("cartLocal")) || [];
  const [cartLocal, setCartLocal] = useState(initialCartLocal);
  const [quantity, setQuantity] = useState(1);
  const [detailProduct, setDetailProduct] = useState({
    codeColor: "",
    idProductDetail: "",
    image: "",
    nameSize: "",
    nameProduct: "",
    price: 0,
    quantity: 0,
    createdDate: "",
    valuePromotion: 0,
  });
  const productSawLocal =
    JSON.parse(sessionStorage.getItem("listProductSaw")) || [];
  const [productSaw, setProductSaw] = useState(productSawLocal);
  useEffect(() => {
    sessionStorage.setItem("listProductSaw", JSON.stringify(productSaw));
  }, [productSaw]);

  useEffect(() => {
    localStorage.setItem("cartLocal", JSON.stringify(cartLocal));
  }, [cartLocal]);

  useEffect(() => {
    getDetailProduct(id.id);
    if (idAccountLocal !== null) {
      CartClientApi.listCart(idAccountLocal).then((res) => {
        setCartAccount(res.data.data);
      });
    }
  }, []);
  useEffect(() => {
    setImage(detailProduct.image.split(",")[0]);
    console.log(detailProduct);
    const newCartItem = {
      idProductDetail: detailProduct.idProductDetail,
      image: detailProduct.image,
      price: detailProduct.price,
      quantity: quantity,
      nameProduct: detailProduct.nameProduct,
      codeColor: detailProduct.codeColor,
      nameSize: detailProduct.nameSize,
      createdDate: detailProduct.createdDate,
      valuePromotion: detailProduct.valuePromotion,
    };
    console.log(newCartItem);
    setProductSaw((prev) => {
      console.log(newCartItem.idProductDetail);
      console.log(prev);
      const exists = prev.find(
        (item) => item.idProductDetail === newCartItem.idProductDetail
      );
      if (!exists) {
        console.log("mới");
        return [...prev, newCartItem];
      } else {
        console.log("trùng");
        return prev.map((item) =>
          item.idProductDetail === newCartItem.idProductDetail
            ? { ...item, quantity: item.quantity + newCartItem.quantity }
            : item
        );
      }
    });
    console.log(detailProduct);
  }, [detailProduct]);

  const getDetailProduct = (idProductDetail) => {
    setItemSize(idProductDetail);
    ProductDetailClientApi.getDetailProductOfClient(idProductDetail).then(
      (res) => {
        console.log(res.data.data);
        setDetailProduct(res.data.data);
        const nameSizeArray = res.data.data.listSize.split(",");
        const sizeList = [];
        for (let index = 0; index < nameSizeArray.length; index += 2) {
          const name = nameSizeArray[index];
          const id = nameSizeArray[index + 1];
          sizeList.push({ name, id });
        }
        setListSize(sizeList);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const formatMoney = (price) => {
    return (
      parseInt(price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
    );
  };
  // thay doi kich thuoc
  const changeSize = (item) => {
    window.location.href = `/detail-product/${item}`;
    getDetailProduct(item);
  };

  const handleAddCartLocal = (newCartItem) => {
    setCartLocal((prev) => {
      console.log(cartLocal);
      const exists = prev.find(
        (item) => item.idProductDetail === newCartItem.idProductDetail
      );
      if (!exists) {
        return [...prev, newCartItem];
      } else {
        return prev.map((item) =>
          item.idProductDetail === newCartItem.idProductDetail
            ? { ...item, quantity: item.quantity + newCartItem.quantity }
            : item
        );
      }
    });
  };
  // them san pham vao gio hang
  const addToCard = async () => {
    if (detailProduct.quantity === 0) {
      toast.error("Sản phẩm đã hết hàng", {
        autoClose: 3000,
      });
      return;
    }
    if (idAccountLocal === null) {
      const newCartItem = {
        idProductDetail: detailProduct.idProductDetail,
        image: detailProduct.image,
        price: detailProduct.price,
        quantity: quantity,
        nameProduct: detailProduct.nameProduct,
        codeColor: detailProduct.codeColor,
        nameSize: detailProduct.nameSize,
        quantityProductDetail: detailProduct.quantity,
      };
      const detailProductCart = cartLocal.find(
        (item) => item.idProductDetail === id.id
      );
      if (detailProductCart !== undefined) {
        if (
          parseInt(quantity) + parseInt(detailProductCart.quantity) <=
          detailProduct.quantity
        ) {
          handleAddCartLocal(newCartItem);
          window.location.href = `/detail-product/${id.id}`;
          toast.success("Thêm giỏ hàng thành công", {
            autoClose: 3000,
          });
        } else {
          toast.warning(
            detailProduct.quantity - detailProductCart.quantity > 0
              ? `Bạn chỉ được thêm tối đa ${
                  detailProduct.quantity - detailProductCart.quantity
                } sản phẩm`
              : "Số lượng của sản phẩm trong giỏ đã đầy"
          );
        }
      } else {
        handleAddCartLocal(newCartItem);
        window.location.href = `/detail-product/${id.id}`;
        toast.success("Thêm giỏ hàng thành công", {
          autoClose: 3000,
        });
      }
    } else {
      const newCartItem = {
        idAccount: idAccountLocal,
        idProductDetail: detailProduct.idProductDetail,
        price: detailProduct.price,
        quantity: quantity,
      };
      const detailProductCart = cartAccount.find(
        (item) => item.idProductDetail === id.id
      );
      debugger;
      console.log(detailProductCart);
      if (detailProductCart !== undefined) {
        if (
          parseInt(quantity) + parseInt(detailProductCart.quantity) <=
          detailProduct.quantity
        ) {
          await CartClientApi.addCart(newCartItem);
          window.location.href = `/detail-product/${id.id}`;
          toast.success("Thêm giỏ hàng thành công", {
            autoClose: 3000,
          });
        } else {
          toast.warning(
            detailProduct.quantity - detailProductCart.quantity > 0
              ? `Bạn chỉ được thêm tối đa ${
                  detailProduct.quantity - detailProductCart.quantity
                } sản phẩm`
              : "Số lượng của sản phẩm trong giỏ đã đầy"
          );
        }
      } else {
        await CartClientApi.addCart(newCartItem);
        window.location.href = `/detail-product/${id.id}`;
        toast.success("Thêm giỏ hàng thành công", {
          autoClose: 3000,
        });
      }
    }
  };

  const changeQuantity = (value) => {
    setQuantity(value);
  };
  const changeTitleInfoAndSize = (item) => {
    setInfoAndSize(item);
  };

  const totalPages = Math.ceil(
    detailProduct.image.split(",").length / itemsPerPage
  );
  const changeImage = (image, index) => {
    setImage(image);
    setImageIndex(index);
  };
  const previous = () => {
    if (currentIndex === 0) {
      return;
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const next = () => {
    if (currentIndex === totalPages - 1) {
      return;
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1860,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1370,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  const goToNext = () => {
    sliderRef.current.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <React.Fragment>
      <div className="box-detail-product">
        <Row>
          <Col
            lg={{ span: 16, offset: 4 }}
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 50,
              borderTop: "3px solid black",
            }}
            className="box-info-detail-product"
          >
            <div className="box-image-pd">
              <img
                className="img-detail-product-pd"
                src={image === "" ? detailProduct.image.split(",")[0] : image}
                alt="..."
              />

              <div className="box-slide-image">
                <LeftOutlined
                  className="button-prev-img-pd"
                  onClick={previous}
                  style={{
                    cursor: currentIndex <= 0 ? "not-allowed" : "pointer",
                  }}
                />

                {detailProduct.image
                  .split(",")
                  .slice(
                    currentIndex * itemsPerPage,
                    (currentIndex + 1) * itemsPerPage
                  )
                  .map((item, index) => (
                    <img
                      key={index}
                      className="img-slide-detail-product-pd"
                      src={item}
                      alt="..."
                      style={{
                        border: image === item ? "1px solid #ff4400" : null,
                      }}
                      onClick={() => changeImage(item, index)}
                    />
                  ))}

                <RightOutlined
                  className="button-next-img-pd"
                  onClick={next}
                  style={{
                    cursor:
                      currentIndex >= totalPages - 1
                        ? "not-allowed"
                        : "pointer",
                  }}
                />
              </div>
            </div>
            <div className="box-info-pd">
              <div className="name-pd">{detailProduct.nameProduct}</div>
              <div className="price-product-pd">
                {" "}
                {detailProduct.valuePromotion !== null ? (
                  <>
                    <span style={{ marginLeft: 5 }}>
                      {" "}
                      {formatMoney(
                        detailProduct.price -
                          detailProduct.price *
                            (detailProduct.valuePromotion / 100)
                      )}
                    </span>
                    <del
                      style={{ color: "black", fontSize: 16, marginLeft: 5 }}
                    >
                      {formatMoney(detailProduct.price)}
                    </del>
                  </>
                ) : (
                  formatMoney(detailProduct.price)
                )}
              </div>
              <div className="box-color-pd">
                <div>Màu:</div>
                <div className="list-color-detail-pd">
                  <div
                    className="color-product-pd"
                    style={{
                      backgroundColor: detailProduct.codeColor,
                    }}
                  ></div>
                </div>
              </div>

              <div className="box-size-pd">
                <div>Size:</div>
                <Row>
                  <div className="list-size-product-pd" tabIndex="0">
                    {listSize.map((item, index) => (
                      <div
                        key={index}
                        className={
                          itemSize === item.id
                            ? "size-product-pd-click"
                            : "size-product-pd"
                        }
                        tabIndex="0"
                        onClick={() => changeSize(item.id)}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </Row>
              </div>

              <div className="box-quantity-pd">
                Số lượng tồn:{" "}
                <span style={{ color: "#ff4400" }}>
                  {detailProduct.quantity} sản phẩm
                </span>
              </div>

              <div className="add-to-card-pd">
                <InputNumber
                  className="input-quantity-card-pd"
                  name="quantity"
                  type="number"
                  disabled={detailProduct.quantity === 0}
                  min={1}
                  defaultValue={1}
                  max={detailProduct.quantity}
                  onChange={(value) => changeQuantity(value)}
                ></InputNumber>
                <div className="button-add-to-card-pd" onClick={addToCard}>
                  Thêm vào Giỏ hàng
                </div>
              </div>

              <div className="box-policy">
                <ul>
                  <li className="item-policy">
                    <div className="box-icon">
                      <FontAwesomeIcon
                        icon={faTruckFast}
                        className="icon-policy"
                      />
                    </div>{" "}
                    <span className="title-policy">
                      Miễn phí giao hàng đơn từ 2 triệu.{" "}
                    </span>
                  </li>
                  <li className="item-policy">
                    <div className="box-icon">
                      <FontAwesomeIcon
                        icon={faRetweet}
                        className="icon-policy"
                      />
                    </div>{" "}
                    <span className="title-policy">
                      Trả miễn phí trong vòng 2 ngày.
                    </span>
                  </li>
                  <li className="item-policy">
                    <div className="box-icon">
                      <FontAwesomeIcon
                        icon={faFileInvoiceDollar}
                        className="icon-policy"
                      />{" "}
                    </div>
                    <span className="title-policy">
                      Thanh toán trực tuyến nhanh chóng và an toàn.{" "}
                    </span>
                  </li>
                  <li className="item-policy">
                    <div className="box-icon">
                      <FontAwesomeIcon
                        icon={faShieldHeart}
                        className="icon-policy"
                      />
                    </div>{" "}
                    <span className="title-policy">
                      Sản phẩm chính hãng 100%.{" "}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
          <Col span={10} style={{ marginLeft: "5%", marginTop: "54px" }}>
            <div
              className="box-policy"
              style={{ width: "100%", height: "90%" }}
            >
              <h2>Mô tả sản phẩm</h2> <br />
              <p>GIÀY SNEAKERS - HÀNG CHÍNH HÃNG</p>
              <p>
                Thiết kế Authentic cổ điển với phần Upper Canvas được phủ đầy
                họa tiết Checkerboard hiệu ứng Iridescent giúp đôi giày trở nên
                lấp lánh hơn.
              </p>
              <p>Chất liệu Canvas với họa tiết Checker</p>
              <p>Hiệu ứng Iridescent với màu sắc lấp lánh</p>
              <p>Các khoen xỏ dây giày bằng nhựa chống rỉ sét</p>
              <p>Lớp lót bên trong êm ái, thông thoáng</p>
              <p>Mặt đế Waffle đặc trưng tăng độ bám</p>
              <p>- Loại hình bảo hành: Cửa hàng</p>
              <p>- Quy cách đóng gói: Double Box</p>
            </div>
          </Col>
          <Col span={12}>
            <div className="box-info-detail">
              <div className="box-title-info-detail">
                <div
                  className="detail-info"
                  style={{ color: infoAndSize === 1 ? "black" : "white" }}
                  onClick={() => changeTitleInfoAndSize(1)}
                >
                  THÔNG TIN CHI TIẾT
                </div>
                <div
                  className="guide-to-choose-size"
                  style={{ color: infoAndSize === 2 ? "black" : "white" }}
                  onClick={() => changeTitleInfoAndSize(2)}
                >
                  CÁCH CHỌN SIZE
                </div>
              </div>
              {infoAndSize === 1 ? (
                <ul className="ul-info-pd" style={{ padding: "30px 10px" }}>
                  <li className="li-info-pd">
                    <span className="title-info-pd"> Tên sản phẩm</span>
                    <span className="content-info-pd">
                      {" "}
                      {detailProduct.nameProduct}
                    </span>
                  </li>
                  <li className="li-info-pd">
                    <span className="title-info-pd"> Giá</span>
                    <span className="content-info-pd">
                      {" "}
                      {formatMoney(detailProduct.price)}
                    </span>
                  </li>
                  <li className="li-info-pd">
                    <span className="title-info-pd"> Thương hiệu</span>
                    <span className="content-info-pd">
                      {" "}
                      {detailProduct.nameBrand}
                    </span>
                  </li>
                  <li className="li-info-pd">
                    <span className="title-info-pd"> Loại sản phẩm</span>
                    <span className="content-info-pd">
                      {" "}
                      {detailProduct.nameCategory}
                    </span>
                  </li>
                  <li className="li-info-pd">
                    <span className="title-info-pd"> Chất liệu</span>
                    <span className="content-info-pd">
                      {" "}
                      {detailProduct.nameMaterial}
                    </span>
                  </li>
                  <li className="li-info-pd">
                    <span className="title-info-pd"> Kích thước</span>
                    <span className="content-info-pd">
                      {" "}
                      {detailProduct.nameSize}
                    </span>
                  </li>
                  <li className="li-info-pd">
                    <span className="title-info-pd"> Đế giày</span>
                    <span className="content-info-pd">
                      {" "}
                      {detailProduct.nameSole}
                    </span>
                  </li>
                </ul>
              ) : (
                <div className="box-img-guide-choose-size">
                  <img src={tableSize} alt="..." />
                </div>
              )}
            </div>
          </Col>

          <Col
            lg={{ span: 16, offset: 4 }}
            style={{ textAlign: "center", marginTop: 100 }}
          >
            <h1>Sản phẩm đã xem</h1>
            <div className="box-product-saw">
              {productSaw
                .filter((item) => item.idProductDetail !== id.id)
                .slice(1).length < 5 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {productSaw
                    .filter((item) => item.idProductDetail !== id.id)
                    .slice(1)
                    .map((item, index) => (
                      <div>
                        <CardItem item={item} index={index} />
                      </div>
                    ))}
                </div>
              ) : (
                <>
                  <div style={{ position: "relative" }}>
                    <Slider
                      style={{ display: "flex", justifyContent: "center" }}
                      ref={sliderRef}
                      {...settings}
                    >
                      {productSaw
                        .filter((item) => item.idProductDetail !== id.id)
                        .slice(1)
                        .map((item, index) => (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <CardItem item={item} index={index} />
                          </div>
                        ))}
                    </Slider>
                  </div>
                  {productSaw.length > 5 ? (
                    <>
                      <FontAwesomeIcon
                        className="button-prev-product-saw"
                        icon={faChevronLeft}
                        onClick={goToPrev}
                      />
                      <FontAwesomeIcon
                        className="button-next-product-saw"
                        icon={faChevronRight}
                        onClick={goToNext}
                      />
                    </>
                  ) : null}
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
}

export default DetailProduct;
