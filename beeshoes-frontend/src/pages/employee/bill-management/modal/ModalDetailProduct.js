import { Button, Col, InputNumber, Row } from "antd";
import React, { useEffect, useState } from "react";
import { ProducDetailtApi } from "../../../../api/employee/product-detail/productDetail.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import './detail-product.css' 

function ModalDetailProduct({ id, ChangedSelectSize,  ChangeQuantity, clearSelectSize, quantity, setQuantity, state, selectedSizes, setSelectedSizes }) {
  const [listSize, setListSize] = useState([]);
  // const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState();
  const [listColor, setListColor] = useState([]);
  const [productDetail, setProductDetail] = useState({});
  const [listProductDetail, setListProductDetail] = useState([]);
  const [max, setMax] = useState(0);
 

  const getPromotionStyle = (promotion) => {
    return promotion >= 50 ? { color: "white" } : { color: "#000000" };
  };
  const getPromotionColor = (promotion) => {
    return promotion >= 50 ? { color: "#FF0000" } : { color: "#FFCC00" };
  };

  const toggleSizeSelection = (e, size) => {
    setSelectedSizes((prevSelected) =>
      prevSelected.includes(size)
        ? prevSelected.filter((selected) => selected !== size)
        : [...prevSelected, size]
    );
    setProductDetail(size)
    // ChangedSelectSize(e, size);
    if (max < size.quantity) {
      setMax(size.quantity);
    }
  };

  const toggleColorlection = (e, item) => {
    const listSize = [...new Set(listProductDetail.filter((x) => x.color === item))];
    setListSize(listSize)
    setSelectedSizes([])
    setSelectedColor(item)
    clearSelectSize()
  };


  const getProductDetail = async() => {
    await ProducDetailtApi.getByIdProductDetail(id).then((res) => {
      var products = res.data.data
      const nameColorArray = [...new Set(products.map((item) => item.color))];
      const listSize = [...new Set(products.filter((item) => item.color === products[0].color))];
      setListSize(listSize)
      setListColor(nameColorArray)
      setListProductDetail(products)
      setProductDetail(products[0]);
    });
  };

  useEffect(() => {
    setSelectedSizes([]);
    getProductDetail();
    setQuantity(1);
    }, [id, state]);

  const handleIncrease = () => {
    if (max > quantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
      // ChangeQuantity(quantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      // ChangeQuantity(quantity);
    }
  };

  const changeInputNumber = (v) => {
    if (max > quantity) {
      setQuantity(v);
      // ChangeQuantity(v);
    }
  };

  return (
    <div>
      <Row style={{ marginTop: "20px" }}>
        <Col span={10}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={productDetail.image}
              alt="Ảnh sản phẩm"
              style={{ width: "100%", borderRadius: "10%", height: "100%" }}
            />
            {productDetail.promotion !== null && (
              <div
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  padding: "0px",
                  cursor: "pointer",
                  borderRadius: "50%",
                }}
              >
                <FontAwesomeIcon
                  icon={faBookmark}
                  style={{
                    ...getPromotionColor(productDetail.promotion),
                    fontSize: "3.5em",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "calc(50% - 10px)", // Đặt "50%" lên trên biểu tượng (từ 50% trừ 10px)
                    left: "50%", // Để "50%" nằm chính giữa biểu tượng
                    transform: "translate(-50%, -50%)", // Dịch chuyển "50%" đến vị trí chính giữa
                    fontSize: "0.8em",
                    fontWeight: "bold",
                    ...getPromotionStyle(productDetail.promotion),
                  }}
                >
                  {`${productDetail.promotion}%`}
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: "60%", // Để "Giảm" nằm chính giữa biểu tượng
                    left: "50%", // Để "Giảm" nằm chính giữa biểu tượng
                    transform: "translate(-50%, -50%)", // Dịch chuyển "Giảm" đến vị trí chính giữa
                    fontSize: "0.8em",
                    fontWeight: "bold",
                    ...getPromotionStyle(productDetail.promotion),
                  }}
                >
                  Giảm
                </span>
              </div>
            )}
          </div>
        </Col>
        <Col span={14}>
          <Row style={{ marginLeft: "10px" }}>
            <Row style={{ width: "100%" }}>
              {" "}
              <span style={{ fontWeight: "600", fontSize: "20px" }}>
                {" "}
                {productDetail.nameProduct}{" "}
              </span>
            </Row>
            <Row style={{ marginTop: "15px", width: "100%" }}>
              <Col span={6}>Thương hiệu</Col>
              <Col span={18}>
                <span>{productDetail.nameBrand} </span>
              </Col>
            </Row>
            <Row style={{ marginTop: "15px", width: "100%" }}>
              <Col span={6}>Danh mục</Col>
              <Col span={18}>
                <span>{productDetail.nameCategory} </span>
              </Col>
            </Row>
            <Row style={{ marginTop: "15px", width: "100%" }}>
              <Col span={6}>Dành cho</Col>
              <Col span={18}>
                <span>{productDetail.gender == "NU" ? "Nữ" : "Nam"} </span>
              </Col>
            </Row>
          </Row>
          <Row style={{ marginTop: "15px", width: "100%", marginBottom: "15px" }}>
            {productDetail.promotion != null ? (
              <Row>
                <Row style={{ marginTop: "15px", width: "100%" }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "24px",
                      color: "red",
                    }}
                  >
                    {" "}
                    {(productDetail.price * (100 - productDetail.promotion)) /
                      100 >=
                    1000
                      ? (
                          (productDetail.price *
                            (100 - productDetail.promotion)) /
                          100
                        ).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : (productDetail.price *
                          (100 - productDetail.promotion)) /
                          100 +
                        " đ"}{" "}
                  </span>
                </Row>
                <Row style={{ marginTop: "15px", width: "100%", marginBottom: "15px" }}>
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "12px",
                      color: "red",
                      textDecoration: "line-through",
                    }}
                  >
                    {" "}
                    {productDetail.price >= 1000
                      ? productDetail.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : productDetail.price + " đ"}{" "}
                  </span>
                </Row>
              </Row>
            ) : (
              <Row style={{ marginTop: "15px", width: "100%", marginBottom: "15px" }}>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "24px",
                    color: "red",
                  }}
                >
                  {" "}
                  {productDetail.price >= 1000
                    ? productDetail.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    : productDetail.price + " đ"}{" "}
                </span>
              </Row>
            )}
          </Row>
          <Row style={{ marginTop: "15px", width: "100%" }}>
            <Col span={4}>
              Màu sắc
            </Col>
            <Col span={20}>
            <Row
            gutter={[16, 16]}
            style={{ width: "100%" }}
            justify={"start"}
          >
            {/* Hiển thị các nút button cho các kích thước */}
            {listColor.map((item, index) => (
              <Col key={"Cl"+ item} span={6}>
                <Button
                  // block
                  className={selectedColor === item ? "selected" : ""}
                  onClick={(e) => toggleColorlection(e, item)}
                  style={{backgroundColor: item}}
                  color={item}
                >
                  {item}
                </Button>
              </Col>
            ))}
          </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: "15px", width: "100%" }}>
            <Col span={4}>
              Kích cỡ
            </Col>
            <Col span={20}>
            <Row
            gutter={[16, 16]}
            style={{  width: "100%" }}
            justify={"center"}
          >
            {/* Hiển thị các nút button cho các kích thước */}
            {listSize.map((size) => (
              <Col key={selectedColor + size.id} span={6}>
                <Button
                  block
                  className={selectedSizes.includes(size) ? "selected" : ""}
                  onClick={(e) => toggleSizeSelection(e, size)}
                >
                  {size.nameSize}
                </Button>
              </Col>
            ))}
          </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: "15px", width: "100%" }} justify={"center"}>
            <Button onClick={handleDecrease} style={{ margin: "0 4px 0 10px" }}>
              -
            </Button>
            <InputNumber
              min={1}
              max={max}
              value={quantity}
              onChange={(value) => {
                if(value < max || value != undefined || value > 0){
                  changeInputNumber(value)
                }
                
              }}
            />
            <Button onClick={handleIncrease} style={{ margin: "0 4px 0 4px" }}>
              +
            </Button>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default ModalDetailProduct;
