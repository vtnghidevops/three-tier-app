import { Option } from "antd/es/mentions";
import "./style-product.css";
import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Upload,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { MaterialApi } from "../../../api/employee/material/Material.api";
import { CategoryApi } from "../../../api/employee/category/category.api";
import { SoleApi } from "../../../api/employee/sole/sole.api";
import { BrandApi } from "../../../api/employee/brand/Brand.api";
import ModalCreateSole from "../sole-management/modal/ModalCreateSole";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import { GetSole, SetSole } from "../../../app/reducer/Sole.reducer";
import ModalCreateBrand from "../brand-management/modal/ModalCreateBrand";
import ModalCreateCategory from "../category-management/modal/ModalCreateCategory";
import ModalCreateMaterial from "../material-management/modal/ModalCreateManterial";
import {
  GetMaterail,
  SetMaterial,
} from "../../../app/reducer/Materail.reducer";
import {
  GetCategory,
  SetCategory,
} from "../../../app/reducer/Category.reducer";
import { GetBrand, SetBrand } from "../../../app/reducer/Brand.reducer";
import { ProductApi } from "../../../api/employee/product/product.api";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import convert from "color-convert";
import ModalAddListSizeProduct from "./modal/ModalAddListSizeProduct";
import AddColorModal from "./modal/ModalAddListColor";
import { useNavigate } from "react-router-dom";
import { ProducDetailtApi } from "../../../api/employee/product-detail/productDetail.api";
import useDebounce from "../../custom-hook/useDebounce";
import ModalPriceAndQuantity from "./modal/ModalPriceAndQuantity";
const CreateProductManagment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = "DANG_SU_DUNG";
  const [form] = Form.useForm();
  const [modalAddSole, setModalAddSole] = useState(false);
  const [modalAddCategopry, setModalAddCategory] = useState(false);
  const [modalAddMaterial, setModalAddMaterial] = useState(false);
  const [modalAddBrand, setModalAddBrand] = useState(false);
  const [modalAddColor, setModalAddColor] = useState(false);
  const [modalAddSize, setModalAddSize] = useState(false);

  const dataSole = useAppSelector(GetSole);
  const dataCategory = useAppSelector(GetCategory);
  const dataMaterial = useAppSelector(GetMaterail);
  const dataBrand = useAppSelector(GetBrand);

  const initialValues = {
    status: "DANG_SU_DUNG",
  };

  const handleCancel = () => {
    setModalAddSole(false);
    setModalAddBrand(false);
    setModalAddMaterial(false);
    setModalAddColor(false);
    setModalAddCategory(false);
    setModalAddSize(false);
  };

  const [listProduct, setListProduct] = useState([]);

  const getList = () => {
    ProductApi.fetchAllByName().then((res) => {
      setListProduct(res.data.data);
    });
    MaterialApi.fetchAll({
      status: status,
    }).then((res) => {
      dispatch(SetMaterial(res.data.data));
    });
    CategoryApi.fetchAll({
      status: status,
    }).then((res) => {
      dispatch(SetCategory(res.data.data));
    });
    SoleApi.fetchAll({
      status: status,
    }).then((res) => {
      dispatch(SetSole(res.data.data));
    });
    BrandApi.fetchAll({
      status: status,
    }).then((res) => {
      dispatch(SetBrand(res.data.data));
    });
  };

  const handleSearch = (value) => {
    setValueInput(value);
  };

  const [valueInput, setValueInput] = useState("");

  const debouncedNameValue = useDebounce(valueInput, 700);

  useEffect(() => {
    ProductApi.fetchAllByName({
      name: valueInput,
    }).then((res) => {
      setListProduct(res.data.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNameValue]);

  const renderOptions = (nameList) => {
    return nameList.map((product, index) => ({
      key: `${product}-${index}`,
      value: product,
      label: product,
    }));
  };

  const [listSizeAdd, setListSizeAdd] = useState([]);

  const handleSaveData = (selectedSizeData) => {
    console.log(selectedSizeData);
    selectedSizeData.forEach((selectedSizeData) => {
      const existingSize = listSizeAdd.find(
        (item) => item.nameSize === selectedSizeData.size
      );

      if (existingSize) {
        toast.warning(
          `Kích cỡ ${selectedSizeData.size} đã tồn tại trong danh sách!`
        );
      } else {
        setListSizeAdd((prevList) => [
          ...prevList,
          {
            nameSize: selectedSizeData.size,
          },
        ]);
      }
    });
  };

  const [listColorAdd, setListColorAdd] = useState([]);

  const getColorName = (colorCode) => {
    const hexCode = colorCode.replace("#", "").toUpperCase();
    const rgb = convert.hex.rgb(hexCode);
    const colorName = convert.rgb.keyword(rgb);

    if (colorName === null) {
      return "Unknown"; // Trường hợp không tìm thấy tên màu
    } else {
      return colorName; // Trả về tên màu
    }
  };

  const handleSaveDataColor = (color) => {
    color.forEach((color) => {
      const existingSize = listColorAdd.find((item) => item.color === color);
      if (existingSize) {
        toast.warning(
          `Màu đã ${getColorName(color)} đã tồn tại trong danh sách!`
        );
      } else {
        setListColorAdd((prevList) => [
          ...prevList,
          {
            color: color,
          },
        ]);
      }
    });
    setModalAddColor(false);
  };

  const handleDeleteSize = (index, nameSize) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn kích cỡ " + nameSize + " này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        const updatedList = [...listSizeAdd];
        updatedList.splice(index, 1);
        setListSizeAdd(updatedList);
        toast.success("Đã xóa kích cỡ thành công");
      },
    });
  };

  const handleDeleteColor = (index, color) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn màu " + color + " này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        const updatedList = [...listColorAdd];
        updatedList.splice(index, 1);
        setListColorAdd(updatedList);
        toast.success("Đã xóa màu thành công");
      },
    });
  };

  const handleUpload = () => {
    form
      .validateFields()
      .then((values) => {
        const trimmedValues = Object.keys(values).reduce((acc, key) => {
          acc[key] =
            typeof values[key] === "string" ? values[key].trim() : values[key];
          return acc;
        }, {});
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có đồng ý thêm không?",
            okText: "Đồng ý",
            cancelText: "Hủy",
            onOk: () => resolve(trimmedValues),
            onCancel: () => reject(),
          });
        });
      })
      .then((trimmedValues) => {
        const updatedTableData = tableData.map((record) => ({
          ...record,
          ...trimmedValues,
        }));

        if (!listSizeAdd || listSizeAdd.length === 0) {
          toast.error("Bạn cần thêm kích thước cho sản phẩm");
          return;
        }
        if (!listColorAdd || listColorAdd.length === 0) {
          toast.error("Bạn cần thêm màu sắc sản phẩm");
          return;
        }
        // Kiểm tra tính hợp lệ của việc tải lên ảnh
        const hasMissingUploads = tableData.some((record) => {
          const colorFileData =
            listColorAndFileData.find((item) => item.color === record.color)
              ?.fileData || [];
          return colorFileData.length === 0;
        });
        if (hasMissingUploads) {
          toast.error("Bạn cần thêm ảnh cho tất cả các màu sắc");
          setUploadValid(false);
          return;
        }

        const formData = new FormData();

        listColorAndFileData.forEach((item) => {
          const color = item.color;
          const fileData = item.fileData;
          fileData.forEach((file, index) => {
            formData.append(`${color}-${index}`, file.originFileObj);
          });
        });
        formData.append("data", JSON.stringify(updatedTableData));

        if (updatedTableData.length === 0) {
          toast.warning("Bạn không có sản phẩm để thêm.");
          return;
        }

        ProducDetailtApi.addListProduct(formData)
          .then((response) => {
            console.log(response.data);
            navigate(`/product-management`);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch(() => {
        // Xử lý khi người dùng từ chối xác nhận
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "7%",
      sorter: (a, b) => a.stt - b.stt,
    },
    {
      title: <div style={{ textAlign: "center" }}>Tên Sản Phẩm</div>,
      dataIndex: "productId",
      key: "productId",
      width: "30%",
      render: (productId, record) =>
        `${productId} [ ${record.size} - ${getColorName(record.color)} ]`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(value, record.key)}
        />
      ),
    },
    {
      title: "Giá Bán",
      dataIndex: "price",
      key: "price",
      align: "center",
      width: "15%",
      render: (_, record) => (
        <Input
          min={100000}
          value={formatCurrency(record.price)}
          onChange={(e) =>
            handlePriceChange(e.target.value.replace(/\D/g, ""), record.key)
          }
        />
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "5%",
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Xóa chi tiết">
            <Button onClick={() => handleDelete(record)} type="danger">
              <FontAwesomeIcon
                icon={faTrash}
                style={{ fontSize: "20px", color: "red" }}
              />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Upload Ảnh</div>,
      dataIndex: "color",
      key: "color",
      width: "100%",
      render: (color, record, index) => {
        // Lọc các dòng có cùng màu sắc
        const rowsWithSameColor = tableData.filter(
          (item) => item.color === record.color
        );

        // Kiểm tra nếu đối tượng trước cùng màu
        if (index > 0 && record.color === tableData[index - 1].color) {
          return null; // Không hiển thị gì cả
        }

        // Hiển thị Upload Ảnh chỉ khi có 1 dòng hoặc là dòng đầu của cùng màu
        if (
          rowsWithSameColor.length === 1 ||
          rowsWithSameColor[0].key === record.key
        ) {
          const colorFileData =
            listColorAndFileData.find((item) => item.color === record.color)
              ?.fileData || [];
          const uploadColumn = (
            <>
              <Upload
                listType="picture-card"
                fileList={colorFileData}
                accept="image/*"
                onPreview={handlePreview}
                onChange={(info) => handleUploadImages(info, record)}
                customRequest={({ file, onSuccess }) => {
                  onSuccess(file);
                }}
                beforeUpload={(file) => {
                  // Kiểm tra xem tệp có phải là hình ảnh hay không
                  const isImage = file.type.startsWith("image/");
                  if (!isImage) {
                    toast.error("Chỉ cho phép tải lên các tệp hình ảnh!");
                  }
                  return isImage ? true : Upload.LIST_IGNORE;
                }}
                multiple
              >
                {colorFileData.length >= 6 ? null : (
                  <>
                    {uploadButton}
                    {!isUploadValid}
                  </>
                )}
              </Upload>
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancelImage}
              >
                <img
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewImage}
                />
              </Modal>
            </>
          );

          // Sử dụng rowSpan để gộp hàng dựa trên màu sắc
          return {
            children: (
              <td
                style={{
                  borderRadius: "15px",
                }}
                rowSpan={rowsWithSameColor.length}
              >
                {uploadColumn}
              </td>
            ),
            props: {
              rowSpan: rowsWithSameColor.length,
            },
          };
        }

        return null;
      },
    },
  ];

  // cập nhập số lượng
  const handleQuantityChange = (value, key) => {
    if (value <= 0) {
      value = 1;
    }
    setTableData((prevTableData) =>
      prevTableData.map((item) =>
        item.key === key ? { ...item, quantity: value } : item
      )
    );
  };
  // cập nhập giá tiền
  const handlePriceChange = (value, key) => {
    if (value <= 0) {
      value = 100000;
    }
    setTableData((prevTableData) =>
      prevTableData.map((item) =>
        item.key === key ? { ...item, price: value } : item
      )
    );
  };

  // format tiền
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    });
    return formatter.format(value);
  };
  // remove
  const handleDelete = (recordToDelete) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa  này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        // Lọc ra các dòng không phải dòng cần xóa
        const updatedTableData = tableData.filter(
          (item) => item.key !== recordToDelete.key
        );
        const updatedTableDataWithSTT = updatedTableData.map((item, index) => ({
          ...item,
          stt: index + 1,
        }));
        setTableData(updatedTableDataWithSTT);
      },
    });
  };

  // ảnh theo màu
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancelImage = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const [listColorAndFileData, setListColorAndFileData] = useState([]);
  const [isUploadValid, setUploadValid] = useState(true);

  const handleUploadImages = (info, record) => {
    const newFileData = [...listColorAndFileData];

    const existingColorData = newFileData.find(
      (item) => item.color === record.color
    );
    if (existingColorData) {
      existingColorData.fileData = info.fileList;
    } else {
      newFileData.push({
        color: record.color,
        fileData: info.fileList,
      });
    }

    setListColorAndFileData(newFileData);
  };

  // gen dữ liệu
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isProductNameValid, setProductNameValid] = useState(false);
  const handleProductNameChange = (value) => {
    setProductNameValid(value.trim() !== "");
  };

  const [tableData, setTableData] = useState([]);
  const dataDetail = () => {
    const formData = form.getFieldsValue();
    const newRecords = [];
    let stt = 1;
    listColorAdd.forEach((colorItem) => {
      listSizeAdd.forEach((sizeItem) => {
        const newRecord = {
          key: `${colorItem.color}-${sizeItem.nameSize}`,
          ...formData,
          color: colorItem.color,
          size: sizeItem.nameSize,
          quantity: 1,
          price: "1000000",
          stt: stt++,
        };
        newRecords.push(newRecord);
      });
    });
    setTableData(newRecords);
  };

  useEffect(() => {
    dataDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listColorAdd, listSizeAdd]);

  const handleUploadTableData = () => {
    dataDetail();
  };

  // cập nhập giá chúng vs số lượng chung
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [openQuantityAndPrice, setQuantityAndPrice] = useState(false);
  const handleUpdateQuantityAndPrice = (newValues) => {
    const updatedData = tableData.map((record) => {
      if (selectedRowKeys.includes(record.key)) {
        return {
          ...record,
          quantity: newValues.quantityCustom,
          price: newValues.priceCustom,
        };
      }
      return record;
    });

    setTableData(updatedData);
    setQuantityAndPrice(false);
  };

  const showModalQuantityAndPrice = () => {
    setQuantityAndPrice(true);
  };
  const handleCancelQuantityAndPrice = () => {
    setQuantityAndPrice(false);
  };

  return (
    <>
      <div className="filter">
        <div
          className="title_product"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{ fontSize: "25px", fontWeight: "bold", marginTop: "5%" }}
          >
            THÊM SẢN PHẨM
          </span>
        </div>

        <div style={{ marginTop: "1%" }}>
          <div className="content">
            <Form form={form} initialValues={initialValues}>
              <Form.Item
                label="Tên sản phẩm"
                name="productId"
                style={{ fontWeight: "bold" }}
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                  {
                    validator: (_, value) => {
                      if (value && value.trim() === "") {
                        return Promise.reject(
                          "Không được chỉ nhập khoảng trắng"
                        );
                      }
                      if (
                        !/^(?=.*[a-zA-Z]|[À-ỹ])[a-zA-Z\dÀ-ỹ\s\-_]*$/.test(value)
                      ) {
                        return Promise.reject(
                          "Phải chứa ít nhất một chữ cái và không có ký tự đặc biệt"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <AutoComplete
                  options={renderOptions(listProduct)}
                  placeholder="Nhập tên sản phẩm"
                  onSearch={handleSearch}
                  onSelect={(value) => {
                    handleProductNameChange(value);
                    setSelectedProduct(value);
                    handleUploadTableData();
                  }}
                  value={selectedProduct}
                >
                  <Input
                    className="form-input"
                    style={{ fontWeight: "bold" }}
                    onChange={(e) => {
                      handleProductNameChange(e.target.value.trim());
                      setSelectedProduct(e.target.value.trim());
                      handleUploadTableData();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === " " && e.target.value === "") {
                        e.preventDefault();
                        const inputValue = e.target.value.replace(/\s/g, "");
                        handleProductNameChange(inputValue);
                        setSelectedProduct(inputValue);
                        handleUploadTableData();
                      }
                    }}
                  />
                </AutoComplete>
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                style={{ fontWeight: "bold" }}
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả sản phẩm" },
                  {
                    validator: (_, value) => {
                      if (value && value.trim() === "") {
                        return Promise.reject(
                          "Không được chỉ nhập khoảng trắng"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.TextArea
                  rows={7}
                  placeholder="Nhập mô tả sản phẩm"
                  className="form-textarea-product "
                  onKeyDown={(e) => {
                    if (e.key === " " && e.target.value === "") {
                      e.preventDefault();
                      e.target.value.replace(/\s/g, "");
                    }
                  }}
                />
              </Form.Item>
              <br />

              <Row gutter={7} justify="space-around">
                <Col span={8}>
                  <Form.Item
                    label="Thương hiệu"
                    name="brandId"
                    style={{ fontWeight: "bold" }}
                    rules={[
                      { required: true, message: "Vui lòng chọn thương hiệu" },
                    ]}
                  >
                    <Select placeholder="Chọn thương hiệu">
                      {dataBrand.map((brand, index) => (
                        <Option key={index} value={brand.id}>
                          <span style={{ fontWeight: "bold" }}>
                            {brand.name}
                          </span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item>
                    <Tooltip title="Thêm thương hiệu">
                      <Button
                        type="primary"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        style={{ height: 30 }}
                        onClick={() => setModalAddBrand(true)}
                      />
                    </Tooltip>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Trạng thái"
                    name="status"
                    style={{ fontWeight: "bold" }}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn trạng thái sản phẩm",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="DANG_SU_DUNG">
                        <span style={{ fontWeight: "bold" }}>Kinh Doanh</span>
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item>
                    <Button
                      type="primary"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      style={{ height: 30 }}
                    ></Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={7} justify="space-around">
                <Col span={8}>
                  <Form.Item
                    label="Chất Liệu"
                    name="materialId"
                    style={{ fontWeight: "bold" }}
                    rules={[
                      { required: true, message: "Vui lòng chọn thương hiệu" },
                    ]}
                  >
                    <Select placeholder="Chọn chất liệu">
                      {dataMaterial.map((material, index) => (
                        <Option key={index} value={material.id}>
                          <span style={{ fontWeight: "bold" }}>
                            {material.name}
                          </span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item>
                    <Tooltip title="Thêm vật liệu">
                      <Button
                        type="primary"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        style={{ height: 30 }}
                        onClick={() => setModalAddMaterial(true)}
                      />
                    </Tooltip>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Đế Giày"
                    name="soleId"
                    style={{ fontWeight: "bold" }}
                    rules={[
                      { required: true, message: "Vui lòng chọn thể loại" },
                    ]}
                  >
                    <Select placeholder="Chọn đế giày">
                      {dataSole.map((sole, index) => (
                        <Option key={index} value={sole.id}>
                          <span style={{ fontWeight: "bold" }}>
                            {sole.name}
                          </span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item>
                    <Tooltip title="Thêm đế giày">
                      <Button
                        type="primary"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        style={{ height: 30 }}
                        onClick={() => setModalAddSole(true)}
                      />
                    </Tooltip>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={7} justify="space-around">
                <Col span={8}>
                  <Form.Item
                    label="Giới Tính"
                    name="gender"
                    style={{ fontWeight: "bold" }}
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính" },
                    ]}
                  >
                    <Select placeholder="Chọn giới tính">
                      <Option value="NAM">
                        <span style={{ fontWeight: "bold" }}>Nam</span>
                      </Option>
                      <Option value="NU">
                        {" "}
                        <span style={{ fontWeight: "bold" }}>Nữ</span>
                      </Option>
                      <Option value="NAM_VA_NU">
                        {" "}
                        <span style={{ fontWeight: "bold" }}>Nam và Nữ</span>
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item>
                    <Tooltip title="Thêm giới tính">
                      <Button
                        type="primary"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        style={{ height: 30 }}
                      />
                    </Tooltip>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Thể loại"
                    name="categoryId"
                    style={{ fontWeight: "bold" }}
                    rules={[
                      { required: true, message: "Vui lòng chọn thể loại" },
                    ]}
                  >
                    <Select placeholder="Chọn thể loại">
                      {dataCategory.map((category, index) => (
                        <Option key={index} value={category.id}>
                          <span style={{ fontWeight: "bold" }}>
                            {category.name}
                          </span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item>
                    <Tooltip title="Thêm thể loại">
                      <Button
                        type="primary"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        style={{ height: 30 }}
                        onClick={() => setModalAddCategory(true)}
                      ></Button>
                    </Tooltip>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <ModalCreateSole visible={modalAddSole} onCancel={handleCancel} />
          <ModalCreateBrand visible={modalAddBrand} onCancel={handleCancel} />
          <AddColorModal visible={modalAddColor} onCancel={handleCancel} />
          <ModalCreateCategory
            visible={modalAddCategopry}
            onCancel={handleCancel}
          />
          <ModalCreateMaterial
            visible={modalAddMaterial}
            onCancel={handleCancel}
          />
        </div>
      </div>

      <div className="filter">
        <div
          className="title_product"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}
          >
            KÍCH CỠ VÀ MÀU SẮC
          </span>
        </div>
        <div style={{ marginTop: "25px" }}>
          <Row
            align="middle"
            gutter={16}
            style={{ marginTop: "50px", marginBottom: "80px" }}
          >
            <Col span={3} style={{ flex: 1 }}>
              <h2>Kích Cỡ : </h2>
            </Col>
            <Col span={16}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {listSizeAdd.map((item, index) => (
                  <Button
                    className="custom-button-size"
                    onClick={() => handleDeleteSize(index, item.nameSize)}
                  >
                    <span
                      style={{ fontWeight: "bold" }}
                    >{`${item.nameSize}`}</span>
                    <FontAwesomeIcon
                      icon={faCircleMinus}
                      className="custom-icon"
                    />
                  </Button>
                ))}
                <Col span={16}>
                  <Tooltip title="Thêm kích cỡ">
                    <Button
                      style={{ height: "40px", marginLeft: "3%" }}
                      type="primary"
                      onClick={() => {
                        if (isProductNameValid) {
                          setModalAddSize(true);
                        } else {
                          toast.error(
                            "Vui lòng nhập thông tin sản phẩm trước khi thêm kích cỡ!"
                          );
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </Tooltip>
                  <ModalAddListSizeProduct
                    visible={modalAddSize}
                    onCancel={handleCancel}
                    onSaveData={handleSaveData}
                  />
                </Col>
              </div>
            </Col>
          </Row>

          <Row
            align="middle"
            gutter={16}
            style={{ marginTop: "80px", marginBottom: "80px" }}
          >
            <Col span={3} style={{ flex: 1 }}>
              <h2>Màu Sắc : </h2>
            </Col>
            <Col span={16}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {listColorAdd.map((item, index) => (
                  <Button
                    onClick={() =>
                      handleDeleteColor(index, getColorName(item.color))
                    }
                    className="custom-button-color"
                    style={{ backgroundColor: item.color }}
                    title={getColorName(item.color)}
                  >
                    <FontAwesomeIcon
                      icon={faCircleMinus}
                      className="custom-icon"
                    />
                  </Button>
                ))}
                <Col span={16}>
                  <Tooltip title="Thêm màu sắc">
                    <Button
                      style={{ height: "40px", marginLeft: "3%" }}
                      type="primary"
                      onClick={() => {
                        if (isProductNameValid) {
                          setModalAddColor(true);
                        } else {
                          toast.error(
                            "Vui lòng nhập thông tin sản phẩm trước khi thêm màu sắc!"
                          );
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </Tooltip>
                  <AddColorModal
                    visible={modalAddColor}
                    onCancel={handleCancel}
                    onSaveData={handleSaveDataColor}
                  />
                </Col>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="filter">
        <div
          className="title_product"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            Chi tiết sản phẩm
          </span>
        </div>
        
        <Form.Item>
          <Row gutter={16} justify={"end"}>
            <Tooltip title=" Chỉnh số lượng và giá chung">
              <Button
                type="primary"
                htmlType="submit"
                onClick={showModalQuantityAndPrice}
                style={{
                  height: "40px",
                  fontWeight: "bold",
                  margin: "0px 20px",
                }}
              >
                Chỉnh số lượng và giá chung
              </Button>
            </Tooltip>
            <Tooltip title="Thêm sản phẩm chi tiết">
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleUpload}
                style={{
                  height: "40px",
                  fontWeight: "bold",
                  margin: "0px 20px",
                }}
              >
                Hoàn Tất
              </Button>
            </Tooltip>
          </Row>
        </Form.Item>
        <Table
          rowKey="key"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tableData}
          pagination={{ pageSize: 5 }}
        />
      </div>
      <ModalPriceAndQuantity
        open={openQuantityAndPrice}
        onCancel={handleCancelQuantityAndPrice}
        onUpdate={handleUpdateQuantityAndPrice}
      />
    </>
  );
};
export default CreateProductManagment;
