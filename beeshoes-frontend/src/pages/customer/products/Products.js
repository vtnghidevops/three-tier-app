import { Checkbox, Col, Menu, Row, Pagination, Card } from "antd";
import React from "react";
import "./Style-products.css";
import { useState } from "react";
import { useEffect } from "react";
import CardItem from "./../component/Card";
import { ProductDetailClientApi } from "../../../api/customer/productdetail/productDetailClient.api";
import { BrandApi } from "../../../api/employee/brand/Brand.api";
import { ColorApi } from "../../../api/employee/color/Color.api";
import { MaterialApi } from "../../../api/employee/material/Material.api";
import { SoleApi } from "../../../api/employee/sole/sole.api";
import { SizeApi } from "../../../api/employee/size/Size.api";
import { CategoryApi } from "../../../api/employee/category/category.api";
import  banner  from "../../../assets/images/banner-2.png";
const categoryGender = [
  {
    name: "TẤT CẢ",
    value: "",
  },
  {
    name: "NAM",
    value: "NAM",
  },
  {
    name: "NỮ",
    value: "NU",
  },
];

const categorySellOff = [
  {
    label: "Sản phẩm giảm giá",
    name: "sellOff",
    value: "true",
  },
];
const newProduct = [
  {
    label: "Sản phẩm mới",
    name: "newProduct",
    value: "true",
  },
];
const categoryPrice = [
  {
    name: "Dưới 1 triệu",
    minPrice: "0",
    maxPrice: "1000000",
  },
  {
    name: "1 triệu - 3 triệu",
    minPrice: "1000000",
    maxPrice: "3000000",
  },
  {
    name: "3 triệu - 5 triệu",
    minPrice: "3000000",
    maxPrice: "5000000",
  },
  {
    name: "5 triệu - 10 triệu",
    minPrice: "5000000",
    maxPrice: "10000000",
  },
  {
    name: "Trên 10 triệu",
    minPrice: "10000000",
    maxPrice: "100000000000",
  },
];

function Products() {
  const [list, setList] = useState([]);
  const [listBrand, setListBrand] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [listMaterial, setListMaterial] = useState([]);
  const [listSize, setListSize] = useState([]);
  const [listSole, setListSole] = useState([]);
  const [listColor, setListColor] = useState([]);
  const [totalPagesProduct, setTotalPagesProduct] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [formPrice, setFormPrice] = useState({});
  const [formSearch, setFormSearch] = useState({
    page: currentPage,
    size: 15,
    gender: "",
  });
  const [isChecked, setIsChecked] = useState({});
  useEffect(() => {
    BrandApi.getBrandInProductDetail().then((res) => {
      setListBrand(res.data.data);
    });
    CategoryApi.getCategoryInProductDetail().then((res) => {
      setListCategory(res.data.data);
    });
    MaterialApi.getMaterialInProductDetail().then((res) => {
      setListMaterial(res.data.data);
    });
    SizeApi.getSizeInProductDetail().then((res) => {
      setListSize(res.data.data);
    });
    SoleApi.getSoleInProductDetail().then((res) => {
      setListSole(res.data.data);
    });
    ColorApi.getColorInProductDetail().then((res) => {
      setListColor(res.data.data);
    });
    console.log(formSearch);
    ProductDetailClientApi.list(formSearch).then((res) => {
      setList(res.data.data.data);
      setTotalPagesProduct(res.data.data.totalPages);
    });
  }, [formSearch]);
  useEffect(() => {
    if (totalPagesProduct === 1) {
      changeFormSearch("page", 0);
      setCurrentPage(0);
    }
  }, [totalPagesProduct]);
  const changeFormSearch = (name, value) => {
    setFormSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePageChange = (page) => {
    console.log(page);
    setCurrentPage(page - 1);
    changeFormSearch("page", page - 1);
  };
  const categorys = [
    {
      label: "Thương hiệu",
      name: "brand",
      children: listBrand,
    },
    {
      label: "Dòng sản phẩm",
      name: "category",
      children: listCategory,
    },
    {
      label: "Chất liệu",
      name: "material",
      children: listMaterial,
    },
    {
      label: "Kích thước",
      name: "nameSize",
      children: listSize,
    },
    {
      label: "Đế giày",
      name: "sole",
      children: listSole,
    },
  ];

  // change form category
  const changeFomSearch = (name, value, checked) => {
    setIsChecked((prevStates) => ({
      ...prevStates,
      [name]: {
        ...prevStates[name],
        [value]: checked,
      },
    }));

    setFormSearch((prev) => {
      if (checked) {
        return {
          ...prev,
          [name]: prev[name] ? `${prev[name]},${value}` : value,
        };
      } else {
        const updatedValue = prev[name]
          .split(",")
          .filter((item) => item !== value)
          .join(",");
        return {
          ...prev,
          [name]: updatedValue,
        };
      }
    });
  };
  // change color
  const changeColor = (name, value) => {
    if (!formSearch.color || formSearch.color === "") {
      setFormSearch((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormSearch((prev) => {
        if (!formSearch.color.split(",").includes(value)) {
          return {
            ...prev,
            [name]: prev[name] ? `${prev[name]},${value}` : value,
          };
        } else {
          const updatedValue = prev[name]
            .split(",")
            .filter((item) => item !== value)
            .join(",");
          return {
            ...prev,
            [name]: updatedValue,
          };
        }
      });
    }
  };
  // change price
  const changePrice = (min, max, name, checked) => {
    setIsChecked((prevStates) => ({
      ...prevStates,
      ["price"]: {
        ...prevStates["price"],
        [name]: checked,
      },
    }));

    setFormPrice((prev) => {
      if (checked) {
        return {
          ...prev,
          ["minPrice"]: prev["minPrice"] ? `${prev["minPrice"]},${min}` : min,
          ["maxPrice"]: prev["maxPrice"] ? `${prev["maxPrice"]},${max}` : max,
        };
      } else {
        const updatedMin = prev["minPrice"]
          .split(",")
          .filter((item) => item !== min)
          .join(",");
        const updatedMax = prev["maxPrice"]
          .split(",")
          .filter((item) => item !== max)
          .join(",");
        return {
          ...prev,
          ["minPrice"]: updatedMin,
          ["maxPrice"]: updatedMax,
        };
      }
    });
  };
  useEffect(() => {
    console.log();
    if (formPrice["minPrice"] && formPrice["maxPrice"] !== "") {
      changeFormSearch(
        "minPrice",
        formPrice.minPrice.split(",").sort((a, b) => a - b)[0]
      );
      changeFormSearch(
        "maxPrice",
        formPrice.maxPrice.split(",").sort((a, b) => a - b)[
          formPrice.minPrice.split(",").length - 1
        ]
      );
    } else {
      changeFormSearch("minPrice", "");
      changeFormSearch("maxPrice", "");
    }
  }, [formPrice]);

  return (
    <React.Fragment>
      <Row style={{ marginTop: "100px", display: "flex" }}>
        <Col
          lg={{ span: 16, offset: 4 }}
          style={{ display: "flex", justifyContent: "center", padding: "auto" }}
        >
          <div className="category-of-products">
            <div className="title-category-of-products">Bộ lọc sản phẩm</div>
            <ul className="category-gender">
              {categoryGender.map((item, index) => (
                <>
                  <li
                    className={`sub-gender ${
                      formSearch["gender"] === item.value ? "clicked" : ""
                    }`}
                    onClick={() => changeFormSearch("gender", item.value)}
                  >
                    {item.name}
                  </li>
                  {index !== categoryGender.length - 1 && (
                    <p style={{ color: "rgb(183, 188, 188)" }}>|</p>
                  )}
                </>
              ))}
            </ul>
            {/* search by status */}

            <label
              style={{
                color: "#ff4400",
                fontSize: "20px",
                paddingBottom: 20,
                fontWeight: 700,
                padding: 10,
              }}
            >
              Trạng thái
            </label>
            <ul className="sell-off">
              {categorySellOff.map((item, index) => (
                <>
                  <li className="child-category">
                    <Checkbox
                      checked={isChecked[item.name]?.[item.value] || false}
                      onChange={(e) =>
                        changeFomSearch(item.name, item.value, e.target.checked)
                      }
                    >
                      {item.label}
                    </Checkbox>
                  </li>
                </>
              ))}
            </ul>

            {/* search by new product */}

            <ul className="new-product-search">
              {newProduct.map((item, index) => (
                <>
                  <li className="child-category">
                    <Checkbox
                      checked={isChecked[item.name]?.[item.value] || false}
                      onChange={(e) =>
                        changeFomSearch(item.name, item.value, e.target.checked)
                      }
                    />{" "}
                    {item.label}
                  </li>
                </>
              ))}
            </ul>
            {/* search by price */}
            <label
              style={{
                color: "#ff4400",
                fontSize: "20px",
                fontWeight: 700,
                padding: 10,
              }}
            >
              Giá
            </label>
            <ul className="category-price">
              {categoryPrice.map((item, index) => (
                <>
                  <li className="child-category" key={index}>
                    <Checkbox
                      checked={isChecked["price"]?.[item.name] || false}
                      onChange={(e) =>
                        changePrice(
                          item.minPrice,
                          item.maxPrice,
                          item.name,
                          e.target.checked
                        )
                      }
                    />{" "}
                    {item.name}
                  </li>
                </>
              ))}
            </ul>

            {/* search by categorys */}
            <ul className="categorys">
              {categorys.map((item, index) => (
                <li key={index} className="box-category">
                  <label
                    style={{
                      color: "#ff4400",
                      fontSize: "20px",
                      paddingBottom: 20,
                    }}
                  >
                    {item.label}
                  </label>
                  <ul>
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex} className="child-category">
                        <Checkbox
                          checked={isChecked[item.name]?.[child.name] || false}
                          onChange={(e) =>
                            changeFomSearch(
                              item.name,
                              child.name,
                              e.target.checked
                            )
                          }
                        />{" "}
                        {child.name}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            {/* search by color */}
            <ul className="category-color-search">
              <label
                style={{
                  color: "#ff4400",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                Màu
              </label>
              <div style={{ display: "flex", marginTop: 10, paddingLeft: 20 }}>
                {listColor.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: decodeURIComponent(item.code),
                      width: "30px",
                      height: "30px",
                      marginRight: 5,
                    }}
                    className={
                      formSearch.color &&
                      formSearch.color !== "" &&
                      (formSearch.color.split(",").includes(item.name)
                        ? "item-color-search"
                        : "")
                    }
                    onClick={() => changeColor("color", item.name)}
                  ></div>
                ))}
              </div>
            </ul>
          </div>

          <div className="box-products">
            <img className="title-of-products" src={banner} alt="..." />
            {list.length === 0 ?(
                <div style={{textAlign:"center",color:"#ff4400",fontSize:30}}>
                  Không có sản phẩm nào!
                </div>
            ):(
               <>
                 <div className="list-product">
                   {list.map((item, index) => (
                       <CardItem item={item} index={index} />
                   ))}
                 </div>

                 <div className="box-pagination-products">
                   <Pagination
                       defaultCurrent={1}
                       current={currentPage + 1}
                       total={totalPagesProduct * 10}
                       onChange={handlePageChange}
                   />
                 </div>
               </>
            )}

          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
}
export default Products;
