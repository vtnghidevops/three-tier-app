import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Col, InputNumber, Modal, Row } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartClientApi } from "./../../../api/customer/cart/cartClient.api";
import { ProductDetailClientApi } from "./../../../api/customer/productdetail/productDetailClient.api";
import "./style-card.css";

function CardItem({ item, index }) {
  const now = dayjs();
  const [modal, setModal] = useState(false);
  const [id, setId] = useState("");
  const [itemSize, setItemSize] = useState("");
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [listSize, setListSize] = useState([]);
  const [cartAccount, setCartAccount] = useState([]);
  const nav = useNavigate();
  const [detailProduct, setDetailProduct] = useState({
    codeColor: "",
    idProductDetail: "",
    image: "",
    nameSize: "",
    nameProduct: "",
    price: 0,
    quantity: 0,
  });

  const idAccountLocal = sessionStorage.getItem("idAccount");
  const [quantity, setQuantity] = useState(1);
  const initialCartLocal = JSON.parse(localStorage.getItem("cartLocal")) || [];

  const [cartLocal, setCartLocal] = useState(initialCartLocal);

  useEffect(() => {
    localStorage.setItem("cartLocal", JSON.stringify(cartLocal));
    console.log(cartLocal);
  }, [cartLocal]);
  useEffect(() => {
    console.log(item);
    console.log(now.format("HH:mm:ss DD-MM-YYYY"));
    console.log(
      now.subtract(15, "day").format("DD-MM-YYYY"),
      dayjs.unix(item.createdDate / 1000).format("DD-MM-YYYY"),
      now.format("DD-MM-YYYY")
    );
    if(idAccountLocal !== null){
      CartClientApi.listCart(idAccountLocal).then((res)=>{
        setCartAccount(res.data.data)
      })
    }
  }, []);

  const handleAddCartLocal = (newCartItem) => {
    setCartLocal((prev) => {
      console.log(cartLocal);
      const exists = prev.find(
        (item) => item.idProductDetail === newCartItem.idProductDetail
      );
      console.log(exists);
      if (exists=== undefined) {
        console.log(exists);
        return [...prev, newCartItem];
      } else {
        console.log(exists);
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
        valuePromotion: detailProduct.valuePromotion,
      };
      const detailProductCart = cartLocal.find(
        (item) => item.idProductDetail === id
      );
      if (detailProductCart !== undefined) {
        if (
          parseInt(quantity) + parseInt(detailProductCart.quantity) <=
          detailProduct.quantity
        ) {
          await handleAddCartLocal(newCartItem);
          nav("/cart");
          toast.success("Thêm giỏ hàng thành công", {
            autoClose: 3000,
          });
        } else {
          toast.warning(
            detailProduct.quantity - detailProductCart.quantity > 0 ? 
            (`Bạn chỉ được thêm tối đa ${
              detailProduct.quantity - detailProductCart.quantity
            } sản phẩm`) :("Số lượng của sản phẩm trong giỏ đã đầy")
          );
        }
      } else {
        await handleAddCartLocal(newCartItem);
        nav("/cart");
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
        (item) => item.idProductDetail === id
      );
      console.log(detailProductCart);
      if (detailProductCart !== undefined) {
        if (
          parseInt(quantity) + parseInt(detailProductCart.quantity) <=
          detailProduct.quantity
        ) {
          await CartClientApi.addCart(newCartItem);
          nav("/cart");
          toast.success("Thêm giỏ hàng thành công", {
            autoClose: 3000,
          });
        } else {
          toast.warning(
            detailProduct.quantity - detailProductCart.quantity > 0 ? 
            (`Bạn chỉ được thêm tối đa ${
              detailProduct.quantity - detailProductCart.quantity
            } sản phẩm`) :("Số lượng của sản phẩm trong giỏ đã đầy")
          );
        }
      } else {
        await CartClientApi.addCart(newCartItem);
        nav("/cart");
        toast.success("Thêm giỏ hàng thành công", {
          autoClose: 3000,
        });
      }
    }
  };
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
        setModal(true);
        setCurrentImageIndex(0);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const changeSize = (item) => {
    getDetailProduct(item);
  };

  const handleClickDetail = (idProductDetail) => {
    setClickedIndex(-1);
    getDetailProduct(idProductDetail);
    setId(idProductDetail);
  };
  const closeModal = () => {
    setModal(false);
    setClickedIndex(-1);
    setQuantity(1);
  };

  const formatMoney = (price) => {
    return (
      parseInt(price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
    );
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    // Thiết lập một interval để tự động chuyển ảnh sau một khoảng thời gian
    const intervalId = setInterval(() => {
      nextImage();
    }, 2000); // Thay đổi số 3000 để đặt khoảng thời gian chuyển ảnh (tính bằng mili giây)

    // Xóa interval khi component unmount để tránh lỗi memory leak
    return () => clearInterval(intervalId);
  }, [currentImageIndex]);
  const previousImage = () => {
    if (currentImageIndex === 0) {
      // Nếu đang ở ảnh đầu tiên, chuyển đến ảnh cuối cùng
      setCurrentImageIndex(detailProduct.image.split(",").length - 1);
    } else {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const nextImage = () => {
    if (currentImageIndex === detailProduct.image.split(",").length - 1) {
      // Nếu đang ở ảnh cuối cùng, chuyển đến ảnh đầu tiên
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  const itemTimestamp = dayjs.unix(item.createdDate / 1000);
  const nowTimestampReduce = now.subtract(15, "day");
  return (
    <>
      <div
        className="card-item"
        data-slick-index="-1"
        tabindex="0"
      >
        <div>
          <Link
            className="link-card-item"
            to={`/detail-product/${item.idProductDetail}`}
            onClick={() => window.location.href = `/detail-product/${item.idProductDetail}`}
          >
            <div className="box-img-product">
              <div
                style={{
                  backgroundImage: `url(${item.image.split(",")[0]})`,
                }}
                className="image-product"
              >
                {item.valuePromotion !== null ? (
                  <div className="value-promotion">
                    Giảm {parseInt(item.valuePromotion)}%
                  </div>
                ) : null}
                {nowTimestampReduce <= itemTimestamp && (
                  <div className="new-product">Mới</div>
                )}
              </div>
            </div>
            <div>
              <p className="name-product">
                {item.nameProduct} - [{item.nameSize}]
              </p>
            </div>
            <div className="list-color-detail-card">
                  <div
                    className="color-product"
                    key={index}
                    style={{
                      backgroundColor: item.codeColor,
                    }}
                  ></div>
                </div>
            <p className="price-product">
              {item.valuePromotion !== null ? (
                <>
                  <span style={{ marginLeft: 5 }}>
                    {" "}
                    {formatMoney(
                      item.price - item.price * (item.valuePromotion / 100)
                    )}
                  </span>
                  <del style={{ color: "black", fontSize: 16, marginLeft: 5 }}>
                    {formatMoney(item.price)}
                  </del>
                </>
              ) : (
                formatMoney(item.price)
              )}
            </p>
          </Link>
        </div>
        <div
          className="button-buy-now"
          onClick={() => {
            handleClickDetail(item.idProductDetail);
          }}
        >
          Mua ngay
        </div>
      </div>

      <Modal
        className="modal-detail-product"
        width={1000}
        onCancel={closeModal}
        open={modal}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="modal-detail-product">
          <Row justify="center">
            <Col
              lg={{ span: 11, offset: 0 }}
              style={{ height: 500, display: "flex", alignItems: "center" }}
            >
              <LeftOutlined
                className="button-prev-card"
                onClick={previousImage}
              />
              <img
                className="img-detail-product"
                src={detailProduct.image.split(",")[currentImageIndex]}
                alt="..."
              />
              <RightOutlined className="button-next-card" onClick={nextImage} />
            </Col>
            <Col
              lg={{ span: 12, offset: 1 }}
              style={{ height: 500, paddingLeft: 20 }}
            >
              <h1>{detailProduct.nameProduct}</h1>
              <div className="price-product">
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
              <div>
                <div>
                  ------------------------------------------------------------------------
                </div>
                <div>Màu:</div>
                <div className="list-color-detail">
                  <div
                    className="color-product"
                    key={index}
                    style={{
                      backgroundColor: detailProduct.codeColor,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                ------------------------------------------------------------------------
              </div>
              <div className="box-size-pd">
                <div>Size:</div>
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
              </div>

              <div>
                <div style={{ marginBottom: "10px", color: "black" }}>
                  Số lượng tồn:{" "}
                  <span style={{ color: "#ff4400" }}>
                    {detailProduct.quantity} sản phẩm
                  </span>
                </div>
              </div>
              <div className="add-to-card">
                <InputNumber
                  className="input-quantity-card"
                  name="quantity"
                  type="number"
                  value={quantity}
                  disabled={detailProduct.quantity === 0}
                  min={1}
                  max={detailProduct.quantity}
                  onChange={(value) => setQuantity(value)}
                ></InputNumber>
                <div className="button-add-to-card" onClick={addToCard}>
                  Thêm vào Giỏ hàng
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
}

export default CardItem;
