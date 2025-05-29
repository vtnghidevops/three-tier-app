import React, { useEffect, useState } from "react";
import {  Input, Button, Select, Table } from "antd";
import "./style-sole.css";
import { useAppDispatch, useAppSelector } from "../../../app/hook";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faFilter,
  faKaaba,
  faListAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment/moment";
import { SoleApi } from "../../../api/employee/sole/sole.api";
import { GetSole, SetSole } from "../../../app/reducer/Sole.reducer";
import ModalCreateSole from "./modal/ModalCreateSole";
import ModalUpdateSole from "./modal/ModalUpdateSole";
import ModalDetailSole from "./modal/ModalDetailSole";

const { Option } = Select;

const SoleManagement = () => {
  const [listSole, setListSole] = useState([]);
  const dispatch = useAppDispatch();
  const [searchSole, setSearchSole] = useState({
    keyword: "",
    status: "",
  });

  // lấy mảng redux ra
  const data = useAppSelector(GetSole);
  useEffect(() => {
    if (data != null) {
      setListSole(data);
    }
  }, [data]);

  // seach  sole
  const handleInputChangeSearch = (name, value) => {
    setSearchSole((prevSearchCategory) => ({
      ...prevSearchCategory,
      [name]: value,
    }));
  };

  const handleKeywordChange = (event) => {
    const { value } = event.target;
    handleInputChangeSearch("keyword", value);
  };

  const handleStatusChange = (value) => {
    handleInputChangeSearch("status", value);
  };

  const handleSubmitSearch = (event) => {
    event.preventDefault();
    SoleApi.fetchAll({
      name: searchSole.keyword,
      status: searchSole.status,
    }).then((res) => {
      setListSole(res.data.data);
      dispatch(SetSole(res.data.data));
    });
  };

  // Xử lý làm mới bộ lọc
  const handleClear = () => {
    setSearchSole({
      keyword: "",
      status: "",
    });
  };

  const loadData = () => {
    SoleApi.fetchAll().then(
      (res) => {
        console.log(res);
        setListSole(res.data.data);
        dispatch(SetSole(res.data.data));
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const [idUpdate, setIdUpdate] = useState("");
  const [idDetail, setIdDetail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [modalVisibleDetail, setModalVisibleDetail] = useState(false);

  const handleCancel = () => {
    setModalVisible(false);
    setModalVisibleUpdate(false);
    setModalVisibleDetail(false);
  };

  // Xử lý logic chỉnh sửa
  const handleViewDetail = (id) => {
    setIdDetail(id);
    setModalVisibleDetail(true);
  };
  const handleUpdate = (id) => {
    setIdUpdate(id);
    setModalVisibleUpdate(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  const listSoleWithStt = listSole.map((item, index) => ({
    ...item,
    stt: index + 1,
  }));

  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      sorter: (a, b) => a.stt - b.stt,
    },
    {
      title: "Tên Thể Loại",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "lastModifiedDate",
      key: "lastModifiedDate",
      align: "center",
      sorter: (a, b) => a.lastModifiedDate - b.lastModifiedDate,
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => {
        const genderClass =
          text === "DANG_SU_DUNG" ? "trangthai-sd" : "trangthai-ksd";
        return (
          <button className={`gender ${genderClass}`}>
            {text === "DANG_SU_DUNG" ? "Đang sử dụng " : "Không sử dụng"}
          </button>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button
            type="primary"
            title="Chi tiết thể loại"
            style={{ backgroundColor: "#FF9900" }}
            onClick={() => handleViewDetail(record.id)}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            type="primary"
            title="Chỉnh sửa thể loại"
            style={{ backgroundColor: "#0099FF", borderColor: "#0099FF" }}
            onClick={() => handleUpdate(record.id)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="title_sole">
        {" "}
        <FontAwesomeIcon icon={faKaaba} style={{ fontSize: "26px" }} />
        <span style={{ marginLeft: "10px" }}>Quản lý đế giày</span>
      </div>
      <div className="filter">
        <FontAwesomeIcon icon={faFilter} size="2x" />{" "}
        <span style={{ fontSize: "18px", fontWeight: "500" }}>Bộ lọc</span>
        <hr />
        <div className="content">
          <div className="content-wrapper">
            <div className="content-left">
              Tên đế giày :{" "}
              <Input
                placeholder="Tìm kiếm"
                type="text"
                style={{ width: "50%", marginLeft: "10px", height: "40px" }}
                name="keyword"
                value={searchSole.keyword}
                onChange={handleKeywordChange}
              />
            </div>
            <div className="content-right">
              Trạng thái:{" "}
              <Select
                style={{ width: "40%", marginLeft: "10px" }}
                name="status"
                value={searchSole.status}
                onChange={handleStatusChange}
              >
                <Option value="">Tất cả</Option>
                <Option value="DANG_SU_DUNG">Đang sử dụng</Option>
                <Option value="KHONG_SU_DUNG">Không sử dụng</Option>
              </Select>
            </div>
          </div>
        </div>
        <div className="box_btn_filter">
          <Button
            className="btn_filter"
            type="submit"
            onClick={handleSubmitSearch}
          >
            Tìm kiếm
          </Button>
          <Button className="btn_clear" onClick={handleClear}>
            Làm mới bộ lọc
          </Button>
        </div>
      </div>

      <div className="sole-table">
        <div
          className="title_sole"
          style={{ display: "flex", alignItems: "center" }}
        >
          <FontAwesomeIcon
            icon={faListAlt}
            style={{ fontSize: "26px", marginRight: "10px" }}
          />
          <span style={{ fontSize: "18px", fontWeight: "500" }}>
            Danh sách đế giày
          </span>
          <div style={{ marginLeft: "auto", marginRight: "3%" }}>
            <Button
              type="primary"
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => setModalVisible(true)}
              style={{ height: "40px" }}
            >
              Thêm
            </Button>
          </div>
        </div>
        <div style={{ marginTop: "25px" }}>
          <Table
            dataSource={listSoleWithStt}
            rowKey="id"
            columns={columns}
            pagination={{ pageSize: 5 }}
            className="category-table"
            rowClassName={getRowClassName}
          />
        </div>
        {/* modal thêm */}
        <ModalCreateSole visible={modalVisible} onCancel={handleCancel} />
        {/* modal update */}
        <ModalUpdateSole
          visible={modalVisibleUpdate}
          id={idUpdate}
          onCancel={handleCancel}
        />
        <ModalDetailSole
          visible={modalVisibleDetail}
          id={idDetail}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
};

export default SoleManagement;
