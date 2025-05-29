import { useState, useEffect } from "react";
import { Row, Col, Menu, Tabs, Pagination, Card } from "antd";
import { RiseOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import banner1 from "./../../../assets/images/third_slider_img01.png";
import banner2 from "./../../../assets/images/shoes_cat_img01.jpg";
import banner3 from "./../../../assets/images/shoes_cat_img03.jpg";
import banner4 from "./../../../assets/images/shoes_cat_img02.jpg";
import category3 from "./../../../assets/images/trending_banner03.jpg";
import "./style-home.css";

import { CategoryClientApi } from "./../../../api/customer/category/categoryClient.api";
import { ProductDetailClientApi } from "./../../../api/customer/productdetail/productDetailClient.api";

import CardItem from "../component/Card";

function Home() {
  const [listCategory, setListcategory] = useState([]);
  const [listProductDetailByCategory, setListProductDetailByCategory] =
    useState([]);
  const [listProductDetail, setListProductDetail] = useState([]);
  const [keyTab, setKeyTab] = useState("1");
  const [totalPagesProduct, setTotalPagesProduct] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const firstCategoryId = listCategory.length > 0 ? listCategory[0].id : null;
  // useEffect(() => {
  //   console.log(firstCategoryId);
  //   if (firstCategoryId !== null) {
  //     getProductDetailByCategory(firstCategoryId);
  //   }
  // }, [firstCategoryId]);

  useEffect(() => {
    // console.log(listProductDetail);
  }, [listProductDetail]);
  useEffect(() => {
    // console.log(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // console.log(totalPagesProduct);
  }, [totalPagesProduct]);

  useEffect(() => {
    getCategory();
    // console.log(listCategory);
    setKeyTab("1");
    // console.log(firstCategoryId);
  }, []);
  useEffect(() => {
    getDetailProduct(keyTab);
  }, [keyTab]);
  useEffect(() => {
    console.log(listCategory);
    console.log(firstCategoryId);
    if (firstCategoryId !== null) {
      getProductDetailByCategory(firstCategoryId);
    }
  }, [listCategory]);
  useEffect(() => {
    console.log(listProductDetailByCategory);
  }, [listProductDetailByCategory]);

  const getCategory = () => {
    CategoryClientApi.getAll().then(
      (res) => {
        setListcategory(res.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const getKeyTab = (key) => {
    setKeyTab(key);
  };
  const getProductDetailByCategory = (id) => {
    ProductDetailClientApi.getByIdCategory(id).then(
      (res) => {
        setListProductDetailByCategory(res.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const getDetailProductNew = (page) => {
    ProductDetailClientApi.getDetailProductNew(page).then(
      (res) => {
        setListProductDetail(res.data.data.data);
        setTotalPagesProduct(res.data.data.totalPages);
        console.log(res.data.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const getDetailProductSellMany = (page) => {
    ProductDetailClientApi.getDetailProductSellMany(page).then(
      (res) => {
        setListProductDetail(res.data.data.data);
        setTotalPagesProduct(res.data.data.totalPages);
        console.log(res.data.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const getDetailProductHavePromotion = (page) => {
    ProductDetailClientApi.getDetailProductHavePromotion(page).then(
      (res) => {
        setListProductDetail(res.data.data.data);
        setTotalPagesProduct(res.data.data.totalPages);
        console.log(res.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const handlePageChange = (page) => {
    if (keyTab === "1") {
      getDetailProductNew(page - 1);
    } else if (keyTab === "2") {
      getDetailProductSellMany(page - 1);
    } else {
      getDetailProductHavePromotion(page - 1);
    }

    setCurrentPage(page);
  };
  const getDetailProduct = (keyTab) => {
    setCurrentPage(1);
    setListProductDetail([]);
    console.log(keyTab);
    if (keyTab === "1") {
      getDetailProductNew(0);
    } else if (keyTab === "2") {
      getDetailProductSellMany(0);
    } else {
      getDetailProductHavePromotion(0);
    }
  };

  const itemsPerPage = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalPages = Math.ceil(
    listProductDetailByCategory.length / itemsPerPage
  );

  const previous = () => {
    console.log(listProductDetailByCategory.length);
    console.log(totalPages);
    if (currentIndex === 0) {
      // Nếu đang ở trang đầu tiên, chuyển đến trang cuối cùng
      setCurrentIndex(totalPages - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const next = () => {
    if (currentIndex === totalPages - 1) {
      // Nếu đang ở trang cuối cùng, chuyển đến trang đầu tiên
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const categoryProduct = [
    { name: "Mới" },
    { name: "Bán chạy" },
    { name: "Giảm giá" },
  ];
  const tabItems = categoryProduct.map((item, index) => ({
    label: item.name,
    key: `${index + 1}`,
    children: `Content of Tab Pane ${index + 1}`,
  }));

  return (
    <div className="home">
      <div className="banner">
        <div className="img-banner-home">
          <img className="img-banner-home-shoes" src={banner1} alt="..." />
        </div>
      </div>
      <div>
        <Row justify="center">
          <Col className="col-choose-1" lg={{ span: 6, offset: 0 }}>
            <Link className="hover-wrapper">
              <div className="type-gender-1">
                <div type="" className="button-choose-gender">
                  Giày Nữ <RiseOutlined />
                </div>
              </div>
            </Link>
          </Col>
          <Col className="col-choose" lg={{ span: 6, offset: 1 }}>
            <div className="type-gender-2">
              <Link className="hover-wrapper">
                <img
                  className="img-choose-gender"
                  src={banner4}
                  alt="..."
                  style={{ borderRadius: "5px" }}
                />
              </Link>

              <div className="text-product-center">
                <div className="text-product">Sản phẩm</div>
                <div className="horizontal-line"></div>
                <div className="quantity-product-home">19</div>
              </div>
            </div>
          </Col>
          <Col className="col-choose-3" lg={{ span: 6, offset: 1 }}>
            <Link className="hover-wrapper">
              <div className="type-gender-3">
                <div type="" className="button-choose-gender">
                  Giày Nam <RiseOutlined />
                </div>
              </div>
            </Link>
          </Col>
        </Row>
      </div>

      <div className="search-category">
        <div className="title-product-category">
          <p> SẢN PHẨM </p>
        </div>
        <Row>
          <Col lg={{ span: 23 }} className="content-search-category">
            <div className="title-category-home">
              <div className="text-category">Loại giày</div>

              <Menu defaultSelectedKeys={["0"]}>
                {listCategory.map((item, index) => (
                  <Menu.Item
                    className="item-category"
                    key={index}
                    onClick={() => {
                      getProductDetailByCategory(item.id);
                    }}
                    style={{ marginBottom: "20px" }}
                  >
                    {item.name}
                  </Menu.Item>
                ))}
              </Menu>
            </div>
            <div
              style={{
                width: "362px",
                height: "100%",
              }}
            >
              <Link>
                <img src={category3} alt="..."></img>
              </Link>
            </div>

            <div className="list-product-of-category">
              <LeftOutlined className="button-prev-card" onClick={previous} />

              {listProductDetailByCategory
                .slice(
                  currentIndex * itemsPerPage,
                  (currentIndex + 1) * itemsPerPage
                )
                .map((item, index) => (
                  <CardItem key={index} item={item} />
                ))}

              <RightOutlined className="button-next-card" onClick={next} />
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <Row justify={"center"}>
          <Col>
            <Tabs
              defaultActiveKey="1"
              centered
              onTabClick={(key) => getKeyTab(key)}
            >
              {tabItems.map((tab) => (
                <Tabs.TabPane
                  className="title-tabs-product"
                  tab={<span className="custom-tab">{tab.label}</span>}
                  key={tab.key}
                >
                  {listProductDetail.map((item, index) => (
                    <CardItem item={item} index={index} />
                  ))}
                </Tabs.TabPane>
              ))}
            </Tabs>
          </Col>
        </Row>
        <Row justify={"center"} style={{ marginBottom: "30px" }}>
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            total={totalPagesProduct * 10}
            onChange={handlePageChange}
          />
        </Row>
      </div>
    </div>
  );
}

export default Home;
