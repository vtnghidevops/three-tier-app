import React from "react";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Slider,
  Space,
  Spin,
  Table,
} from "antd";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faEye,
  faFilter,
  faKaaba,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ProducDetailtApi } from "../../../api/employee/product-detail/productDetail.api";
import { useEffect } from "react";
import { MaterialApi } from "../../../api/employee/material/Material.api";
import { CategoryApi } from "../../../api/employee/category/category.api";
import { SoleApi } from "../../../api/employee/sole/sole.api";
import { BrandApi } from "../../../api/employee/brand/Brand.api";
import { ColorApi } from "../../../api/employee/color/Color.api";
import { Option } from "antd/es/mentions";

const ModalDetailProductManagment = ({ id, visible, onCancel }) => {

  // Bộ lọc
  const [listMaterial, setListMaterial] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [listBrand, setListBrand] = useState([]);
  const [listColor, setListColor] = useState([]);
  const [listSole, setListSole] = useState([]);

  const listSize = [];
  for (let size = 35; size <= 45; size++) {
    listSize.push(size);
  }

  const getList = () => {
    MaterialApi.fetchAll().then((res) => setListMaterial(res.data.data));
    CategoryApi.fetchAll().then((res) => setListCategory(res.data.data));
    SoleApi.fetchAll().then((res) => setListSole(res.data.data));
    BrandApi.fetchAll().then((res) => setListBrand(res.data.data));
    MaterialApi.fetchAll().then((res) => setListMaterial(res.data.data));
    ColorApi.getAllCode().then((res) => setListColor(res.data.data));
  };

  const [selectedValues, setSelectedValues] = useState({
    idProduct: id,
    color: "",
    brand: "",
    material: "",
    product: "",
    size: null,
    sole: "",
    category: "",
    gender: "",
    status: "",
    minPrice: 0,
    maxPrice: 50000000000,
  });

  const handleSelectChange = (value, fieldName) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handleChangeValuePrice = (value) => {
    const [minPrice, maxPrice] = value;

    setSelectedValues((prevValues) => ({
      ...prevValues,
      minPrice: minPrice,
      maxPrice: maxPrice,
    }));
  };

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmitSearch = (event) => {
    event.preventDefault();
    ProducDetailtApi.fetchAll({
      product: search,
    }).then((res) => {
      setListProductDetails(res.data.data);
      // dispatch(SetProductDetail(res.data.data));
    });
  };

  // Xử lý làm mới bộ lọc
  const handleClear = () => {
    setSearch("");
    ProducDetailtApi.fetchAll({
      idProduct: id,
      product: "",
    }).then((res) => {
      setListProductDetails(res.data.data);
      // dispatch(SetProductDetail(res.data.data));
    });
  };

  const loadData = () => {
    ProducDetailtApi.fetchAll(selectedValues).then((res) => {
      setListProductDetails(res.data.data);
    });
  };

  useEffect(() => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      idProduct: id, 
    }));
  }, [id, visible]);

  useEffect(() => {
    if (id != null && id !== "") {
      getList();
      loadData();
    }
    return () => {
      setListProductDetails(null);
      id = null;
    };
  }, [selectedValues, visible, id]);

  useEffect(() => {
    loadData();
  }, [selectedValues]);

  const getPromotionStyle = (promotion) => {
    return promotion >= 50 ? { color: "white" } : { color: "#000000" };
  };
  const getPromotionColor = (promotion) => {
    return promotion >= 50 ? { color: "#FF0000" } : { color: "#FFCC00" };
  };

  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "5%",
      sorter: (a, b) => a.stt - b.stt,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={text}
            alt="Ảnh sản phẩm"
            style={{ width: "100px", borderRadius: "10%", height: "100px" }}
          />
          {record.promotion !== null && (
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
                  ...getPromotionColor(record.promotion),
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
                  ...getPromotionStyle(record.promotion),
                }}
              >
                {`${record.promotion}%`}
              </span>
              <span
                style={{
                  position: "absolute",
                  top: "60%", 
                  left: "50%", // Để "Giảm" nằm chính giữa biểu tượng
                  transform: "translate(-50%, -50%)", // Dịch chuyển "Giảm" đến vị trí chính giữa
                  fontSize: "0.8em",
                  fontWeight: "bold",
                  ...getPromotionStyle(record.promotion),
                }}
              >
                Giảm
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "nameProduct",
      key: "nameProduct",
      sorter: (a, b) => a.nameProduct.localeCompare(b.nameProduct),
    },
    {
      title: "Giá Bán",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (text) => formatCurrency(text),
    },
    {
      title: "Số Lượng ",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      align: "center",
    },
    {
      title: "Kích Thước",
      dataIndex: "size",
      key: "size",
      width: "10%",
      sorter: (a, b) => a.quantity - b.quantity,
      align: "center",
    },
    {
      title: "Màu Sắc",
      dataIndex: "color",
      key: "color",
      align: "center",
      render: (color) => (
        <div
          style={{
            backgroundColor: color,
            borderRadius: "6px",
            width: "60px",
            height: "25px",
            pointerEvents: "none", // Ngăn chặn sự kiện click
          }}
        />
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const genderClass =
          text === "DANG_SU_DUNG" ? "trangthai-sd" : "trangthai-ksd";
        return (
          <button className={`gender ${genderClass}`}>
            {text === "DANG_SU_DUNG" ? "Đang kinh doanh " : "Không kinh doanh"}
          </button>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      width: "10%",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            title="Chi tiết thể loại"
            style={{ backgroundColor: "#FF9900" }}
            // onClick={() => handleViewDetail(record.id)}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </div>
      ),
    },
  ];

  const [listProductDetails, setListProductDetails] = useState([]);

  // format tiền
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };

  return (
    <Modal visible={visible} onCancel={onCancel} footer={null} width={1200}>
      <div className="title_sole">
        <FontAwesomeIcon icon={faKaaba} style={{ fontSize: "26px" }} />
        <span style={{ marginLeft: "10px" }}>Quản lý sản phẩm chi tiết</span>
      </div>

      <div className="filter">
        <FontAwesomeIcon icon={faFilter} size="2x" />{" "}
        <span style={{ fontSize: "18px", fontWeight: "500" }}>Bộ lọc</span>
        <hr />
        <div className="content">
          <div className="content-wrapper">
            <div>
              <Input
                value={search}
                onChange={handleChange}
                placeholder="Nhập tên sản phẩm"
                style={{ width: 200, marginRight: 10, height: 40 }}
              />
              <Button
                className="btn_filter"
                type="submit"
                onClick={handleSubmitSearch}
                style={{ height: 40 }}
              >
                Tìm kiếm
              </Button>
              <Button
                className="btn_clear"
                onClick={handleClear}
                style={{ height: 40 }}
              >
                Làm mới
              </Button>
            </div>
          </div>
        </div>
        <div className="box_btn_filter">
          <Row align="middle">
            <Col span={3} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Chất Liệu :</label>
            </Col>
            <Col span={2}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.material}
                onChange={(value) => handleSelectChange(value, "material")}
                defaultValue=""
              >
                <Option value="">Tất cả</Option>
                {listMaterial.map((material, index) => (
                  <Option key={index} value={material.name}>
                    {material.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={3} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Thương Hiệu :</label>
            </Col>
            <Col span={2}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.brand}
                onChange={(value) => handleSelectChange(value, "brand")}
              >
                <Option value="">Tất cả</Option>
                {listBrand.map((brand, index) => (
                  <Option key={index} value={brand.name}>
                    {brand.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Đế giày :</label>
            </Col>
            <Col span={2}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.sole}
                onChange={(value) => handleSelectChange(value, "sole")}
                defaultValue=""
              >
                <Option value="">Tất cả</Option>
                {listSole.map((sole, index) => (
                  <Option key={index} value={sole.name}>
                    {sole.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Kích cỡ :</label>
            </Col>
            <Col span={2}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.size}
                onChange={(value) => handleSelectChange(value, "size")}
                defaultValue={null}
              >
                <Option value={null}>Tất cả</Option>
                {listSize.map((size, index) => (
                  <Option key={index} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Màu Sắc :</label>
            </Col>
            <Col span={2}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.color}
                onChange={(value) => handleSelectChange(value, "color")}
                defaultValue=""
              >
                <Option value="">Tất cả</Option>
                {listColor.map((color, index) => (
                  <Option key={index} value={color.code}>
                    <div
                      style={{
                        backgroundColor: color.code,
                        width: "100%",
                        height: "100%",
                        borderRadius: "5px",
                      }}
                    ></div>
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
        <div className="box_btn_filter">
          <Row align="middle">
            <Col span={4} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Thể Loại :</label>
            </Col>
            <Col span={3}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.category}
                onChange={(value) => handleSelectChange(value, "category")}
                defaultValue=""
              >
                <Option value="">Tất cả</Option>
                {listCategory.map((category, index) => (
                  <Option key={index} value={category.name}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Trạng Thái :</label>
            </Col>
            <Col span={3}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.status}
                onChange={(value) => handleSelectChange(value, "status")}
                defaultValue=""
              >
                <Option value="">Tất cả</Option>
                <Option value="DANG_SU_DUNG">Đang sử dung</Option>
                <Option value="KHONG_SU_DUNG">Không sử dụng</Option>
              </Select>
            </Col>
            <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Giới Tinh :</label>
            </Col>
            <Col span={3}>
              <Select
                style={{ width: "100%" }}
                value={selectedValues.gender}
                onChange={(value) => handleSelectChange(value, "gender")}
                defaultValue=""
              >
                <Option value="">Tất cả</Option>
                <Option value="NAM">Nam</Option>
                <Option value="NU">Nữ</Option>
              </Select>
            </Col>

            <Col span={2} style={{ textAlign: "right", paddingRight: 10 }}>
              <label>Khoảng giá :</label>
            </Col>
            <Col span={3}>
              <Slider
                range={{
                  draggableTrack: true,
                }}
                defaultValue={[
                  selectedValues.minPrice,
                  selectedValues.maxPrice,
                ]}
                min={100000}
                max={30000000}
                tipFormatter={(value) => formatCurrency(value)}
                onChange={handleChangeValuePrice}
              />
            </Col>
          </Row>
        </div>
      </div>

      <div className="product-table">
        <div
          className="title_product"
          style={{ display: "flex", alignItems: "center" }}
        >
          <FontAwesomeIcon
            icon={faListAlt}
            style={{ fontSize: "26px", marginRight: "10px" }}
          />
          <span style={{ fontSize: "18px", fontWeight: "500" }}>
            Danh sách sản phẩm chi tiết
          </span>
        </div>
        <Table
          dataSource={listProductDetails}
          rowKey="id"
          columns={columns}
          pagination={{ pageSize: 5 }}
          scroll={{ y: 400 }}
          rowClassName={getRowClassName}
        />
      </div>
    </Modal>
  );
};

export default ModalDetailProductManagment;
