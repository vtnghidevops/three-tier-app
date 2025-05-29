import React, { useEffect, useState } from "react";
import { Input, Button, Select, Table, Slider, Row, Col, Tooltip } from "antd";
import "react-toastify/dist/ReactToastify.css";
import "./style-staff.css";
import { AccountApi } from "../../../api/employee/account/account.api";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import { GetAccount, SetAccount } from "../../../app/reducer/Account.reducer";
import { GetAddress } from "../../../app/reducer/Address.reducer";

import { Link } from "react-router-dom";
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

const { Option } = Select;

const AccountManagement = () => {
  const [listAddress, setListAddress] = useState([]);
  const [initialAccountList, setInitialAccountList] = useState([]);
  const [listaccount, setListaccount] = useState([]);
  const [initialStartDate, setInitialStartDate] = useState(null);
  const [initialEndDate, setInitialEndDate] = useState(null);
  const dispatch = useAppDispatch();
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [searchAccount, setSearchAccount] = useState({
    keyword: "",
    status: "",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Lấy mảng redux ra
  const data = useAppSelector(GetAccount, GetAddress);
  useEffect(() => {
    if (data != null) {
      setListaccount(data);
    }
    if (data != null) {
      setListAddress(data);
    }
  }, [data]);
  // Search account
  const handleInputChangeSearch = (name, value) => {
    setSearchAccount((prevSearchAccount) => ({
      ...prevSearchAccount,
      [name]: value,
    }));
    // handleSubmitSearch(value);
  };
  const handleKeywordChange = (event) => {
    const { value } = event.target;
    handleInputChangeSearch("keyword", value);
  };

  const handleStatusChange = (value) => {
    handleInputChangeSearch("status", value);
  };

  useEffect(() => {
    const { keyword, status } = searchAccount;
    AccountApi.fetchAll({ status }).then((res) => {
      const filteredAccounts = res.data.data.filter(
        (account) =>
          account.fullName.includes(keyword) ||
          account.phoneNumber.includes(keyword)
      );
      setListaccount(filteredAccounts);
      dispatch(SetAccount(filteredAccounts));
    });
  }, [searchAccount.status]);

  const handleSubmitSearch = (value) => {
    const { keyword, status } = searchAccount;

    AccountApi.fetchAll({ status }).then((res) => {
      const filteredAccounts = res.data.data
        .filter((account) => {
          const toKeyword = keyword.toLowerCase();
          const fullName = account.fullName.toLowerCase();
          return (
            fullName.includes(toKeyword) ||
            account.phoneNumber.includes(keyword)
          );
        })
        .map((account, index) => ({
          ...account,
          stt: index + 1,
        }));
      setListaccount(filteredAccounts);
      dispatch(SetAccount(filteredAccounts));
    });
  };

  // Lọc danh sách theo khoảng ngày sinh
  const filterByDateOfBirthRange = (startDate, endDate) => {
    if (!startDate || !endDate) {
      setListaccount(initialAccountList);
      dispatch(SetAccount(initialAccountList));
      return;
    }

    const filteredAccounts = initialAccountList.filter((account) => {
      const accountDateOfBirth = moment(account.dateOfBirth).startOf("day");
      const start = moment(startDate).startOf("day");
      const end = moment(endDate).endOf("day");
      return accountDateOfBirth.isBetween(start, end, null, "[]");
    });

    setListaccount(filteredAccounts);
    dispatch(SetAccount(filteredAccounts));
  };
  const handleStartDateChange = (event) => {
    const startDate = event.target.value;
    setStartDate(startDate);
    filterByDateOfBirthRange(startDate, endDate);
  };

  const handleEndDateChange = (event) => {
    const endDate = event.target.value;
    setEndDate(endDate);
    filterByDateOfBirthRange(startDate, endDate);
  };
  const filterByAgeRange = (minAge, maxAge) => {
    if (minAge === 0 && maxAge === 100) {
      setListaccount(initialAccountList);
      dispatch(SetAccount(initialAccountList));
    } else {
      const filteredAccounts = initialAccountList.filter((account) => {
        const age = moment().diff(account.dateOfBirth, "years");
        return age >= minAge && age <= maxAge;
      });

      setListaccount(filteredAccounts);
      dispatch(SetAccount(filteredAccounts));
    }
  };
  const handleClear = () => {
    setSearchAccount({
      keyword: "",
      status: "",
    });
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);

    setListaccount(
      initialAccountList.map((account, index) => ({
        ...account,
        stt: index + 1,
      }))
    );
    setAgeRange([0, 100]);
  };
  const loadData = () => {
    AccountApi.fetchAll().then(
      (res) => {
        const accounts = res.data.data.map((account, index) => ({
          ...account,
          stt: index + 1,
        }));
        setListaccount(res.data.data);
        setInitialAccountList(accounts);
        setInitialStartDate(null);
        setInitialEndDate(null);
        dispatch(SetAccount(res.data.data));
      },
      (err) => {
        console.log(err);
      }
    );
  };

  // Xử lý logic chỉnh sửa
  const [idDetail, setIdDetail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleDetail, setModalVisibleDetail] = useState(false);

  const handleViewDetail = (id) => {
    setIdDetail(id);
    setModalVisibleDetail(true);
  };
  const handleAgeRangeChange = (value) => {
    setAgeRange(value);
  };
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    filterByAgeRange(ageRange[0], ageRange[1]);
  }, [ageRange, initialAccountList]);

  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      sorter: (a, b) => a.stt - b.stt,
    },
    {
      title: "Ảnh",
      dataIndex: "avata",
      key: "avata",
      render: (avata) => (
        <img
          src={avata}
          alt="Hình ảnh"
          style={{ width: "150px", height: "110px", borderRadius: "20px" }}
        />
      ),
    },
    {
      title: "Tên nhân viên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },

    {
      title: "CCCD",
      dataIndex: "citizenIdentity",
      key: "citizenIdentity",
      sorter: (a, b) => a.citizenIdentity.localeCompare(b.citizenIdentity),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    // {
    //   title: "Địa chỉ",
    //   dataIndex: "address",
    //   key: "address",
    //   render: (text, record) => (
    //     <p>
    //       {record.line}, {record.district}, {record.province}, {record.ward}
    //     </p>
    //   ),
    // },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      sorter: (a, b) => a.dateOfBirth - b.dateOfBirth,
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      render: (gender) => (gender ? "Nam" : "Nữ"),
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
            {text === "DANG_SU_DUNG" ? "Kích hoạt " : "Ngừng kích hoạt"}
          </button>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to={`/detail-staff-management/${record.id}`}>
            <Tooltip title="Chi tiết nhân viên">
              <Button
                type="primary"
                style={{ backgroundColor: "#FF9900" }}
                onClick={() => handleViewDetail(record.id)}
              >
                <FontAwesomeIcon icon={faEye} />
              </Button>
            </Tooltip>
          </Link>
          <Link to={`/update-staff-management/${record.id}`}>
            <Tooltip title="Chỉnh sửa nhân viên">
              <Button
                type="primary"
                style={{ backgroundColor: "green", borderColor: "green" }}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </Tooltip>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="title_account">
        <FontAwesomeIcon icon={faKaaba} style={{ fontSize: "26px" }} />
        <span style={{ marginLeft: "10px" }}>Quản lý tài khoản nhân viên</span>
      </div>
      <div className="filter">
        <FontAwesomeIcon icon={faFilter} size="2x" />
        <span style={{ fontSize: "18px", fontWeight: "500" }}>Bộ lọc</span>
        <hr />
        <div className="content_ac">
          <div className="content-wrapper-ac">
            <Row>
              <Col span={24} style={{ marginBottom: "10px" }}>
                <label>Tìm kiếm:</label>
                <Input
                  style={{
                    width: "300px",
                    marginLeft: "19px",
                    marginBottom: "20px",
                  }}
                  placeholder="Tìm kiếm tên và sđt... "
                  type="text"
                  name="keyword"
                  value={searchAccount.keyword}
                  onChange={handleKeywordChange}
                />
              </Col>
              <Col span={24}>
                <label>Trạng thái:</label>
                <Select
                  style={{ width: "300px", marginLeft: "15px" }}
                  name="status"
                  value={searchAccount.status}
                  onChange={handleStatusChange}
                >
                  <Option value="">Tất cả</Option>
                  <Option value="DANG_SU_DUNG">Kích hoạt</Option>
                  <Option value="KHONG_SU_DUNG">Ngừng kích hoạt</Option>
                </Select>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <label>Ngày sinh:</label>
                <Input
                  style={{
                    width: "200px",
                    marginRight: "15px",
                    marginLeft: "15px",
                  }}
                  type="date"
                  value={startDate || initialStartDate}
                  onChange={handleStartDateChange}
                />
                <Input
                  style={{ width: "200px" }}
                  type="date"
                  value={endDate || initialEndDate}
                  onChange={handleEndDateChange}
                />
              </Col>

              <Col
                span={24}
                style={{
                  display: "flex",
                  marginTop: "30px",
                }}
              >
                <label>Khoảng tuổi:</label>
                <Slider
                  style={{ width: "400px", marginLeft: "15px" }}
                  range
                  min={0}
                  max={100}
                  defaultValue={ageRange}
                  value={ageRange}
                  onChange={handleAgeRangeChange}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div>
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
      </div>
      <div className="account-table">
        <div
          className="title_account"
          style={{ display: "flex", alignItems: "center" }}
        >
          <FontAwesomeIcon
            icon={faListAlt}
            style={{ fontSize: "26px", marginRight: "10px" }}
          />
          <span style={{ fontSize: "18px", fontWeight: "500" }}>
            Danh sách nhân viên
          </span>
          <div style={{ marginLeft: "auto" }}>
            <Link to="/create-staff-management">
              <Tooltip title="Thêm nhân viên">
                <Button
                  type="primary"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={() => setModalVisible(true)}
                >
                  Thêm
                </Button>
              </Tooltip>
            </Link>
          </div>
        </div>
        <div style={{ marginTop: "25px" }}>
          <Table
            dataSource={listaccount}
            rowKey="id"
            columns={columns}
            pagination={{ pageSize: 5 }}
            className="account-table"
            rowClassName={getRowClassName}
          />
        </div>
      </div>
    </>
  );
};
export default AccountManagement;
