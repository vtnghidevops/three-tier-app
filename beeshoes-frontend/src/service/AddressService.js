import axios from "axios";

// Đường dẫn api
var api = process.env.REACT_APP_API_URL || "http://api-beeshoes.devopsedu.vn";
let adminApi = api + "/admin/address";

var dataUser = [];

const getDataUser = () => {
  return dataUser;
};

const getAllUser = () => {
  try {
    axios.get(adminApi + "/simple-user").then((response) => {
      dataUser = response.data.data;
      console.log(response.data.data);
      // dispatch(addAllDataUsers(response.data.data));
    });
  } catch {}
  return dataUser;
};

// tạo đối tượng để hứng data
let dataAddress = [];
const getDataAddress = () => {
  return dataAddress;
};

// list page Address
const fetchAllAddress = (page) => {
  return axios.get(adminApi + `/list?page=${page}`);
};
const fetchAllAddressSearch = (page, line, city, province, country, user) => {
  return axios.get(
    adminApi +
      `/list?page=${page}&line=${line}&city=${city}&province=${province}&country=${country}&user=${user}`
  );
};

// list all Address
const listAllAddress = () => {
  return axios.get(adminApi + "/list");
};

// list all Address
const listAllUser = () => {
  return axios.get(adminApi + "/simple-user");
};

// get one Address
const getOneById = (id) => {
  return axios.get(adminApi + "/" + id);
};

// add Address
const addAddress = (address) => {
  return axios
    .post(adminApi, {
      line: address.line,
      city: address.city,
      province: address.province,
      country: address.country,
      userId: address.userId,
    })
    .then((response) => {
      if (response.status === 201) {
        console.log(response.data.data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// add Address
const updateAddress = (id, address) => {
  return axios
    .put(adminApi + `/${id}`, {
      line: address.line,
      city: address.city,
      province: address.province,
      country: address.country,
      userId: address.userId,
    })
    .catch((err) => {
      console.log(err);
    });
};
const AddressService = {
  getDataAddress,
  fetchAllAddress,
  listAllAddress,
  getOneById,
  addAddress,
  updateAddress,
  getDataUser,
  getAllUser,
  // searchAddress,
};
export default AddressService;
