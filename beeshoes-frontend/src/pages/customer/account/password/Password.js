import React, { useEffect, useState } from "react";
import "./style-password.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AccountClientApi } from "../../../../api/customer/account/accountClient.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Password() {
  const nav = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formChange, setFormChange] = useState({
    id: sessionStorage.getItem("idAccount"),
  });
  const [formErrors, setFormErrors] = useState({
    id: sessionStorage.getItem("idAccount"),
  });
  useEffect(() => {
    console.log(formChange);
  }, [formChange]);
  const handleShowChange = () => {
    if (showChangePassword === false) {
      setShowChangePassword(true);
    } else {
      setShowChangePassword(false);
    }
  };
  const handleShowConfirm = () => {
    if (showConfirmPassword === false) {
      setShowConfirmPassword(true);
    } else {
      setShowConfirmPassword(false);
    }
  };
  const changeForm = (name, value) => {
    setFormChange((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors({});
  };
  const handleChangePassword = (form) => {
    const isFormValid = form.newPassword && form.confirmPassword;
    if (!isFormValid) {
      const errors = {
        newPassword: !form.newPassword ? "Nhập mật khẩu mới" : "",
        confirmPassword: !form.confirmPassword ? "Xác nhận mật khẩu" : "",
      };
      setFormErrors(errors);
      return;
    }
    AccountClientApi.changePassword(form).then(
      (res) => {
        toast.success("Thay đổi thành công");
        nav("/profile");
      },
      (err) => {
        if (err.response.data.message === "Mật khẩu không khớp") {
          setFormErrors((prev) => ({
            ...prev,
            confirmPassword: err.response.data.message,
          }));
        }
      }
    );
  };
  return (
    <React.Fragment>
      <div className="change-password">
        <div className="box-title-change-password">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>Thay đổi mật khẩu</p>
        </div>
        <div className="box-form-change-password">
          <div className="form-change-password">
            <div
              className="form-new-password"
              style={{ textAlign: "left" }}
              validateStatus={formErrors["newPassword"] ? "error" : ""}
              help={formErrors["newPassword"] || ""}
            >
              <label className="label-form-change-password">
                Mật khẩu mới :
              </label>
              <input
                type={showChangePassword === false ? "password" : "text"}
                className="input-change-password"
                onChange={(e) => changeForm("newPassword", e.target.value)}
                style={{
                  border: formErrors["newPassword"]
                    ? "1px solid red"
                    : "1px solid rgb(201, 201, 201)",
                }}
              />

              <FontAwesomeIcon
                className="show-new-password"
                icon={showChangePassword === false ? faEyeSlash : faEye}
                onClick={handleShowChange}
              />
            </div>
            <div
              className="form-confirm-password"
              style={{ textAlign: "left" }}
              validateStatus={formErrors["confirmPassword"] ? "error" : ""}
              help={formErrors["confirmPassword"] || ""}
            >
              <label className="label-form-change-password">Xác nhận :</label>
              <input
                type={showConfirmPassword === false ? "password" : "text"}
                className="input-confirm-password"
                style={{
                  border: formErrors["confirmPassword"]
                    ? "1px solid red"
                    : "1px solid rgb(201, 201, 201)",
                }}
                onChange={(e) => changeForm("confirmPassword", e.target.value)}
              />
              <FontAwesomeIcon
                className="show-confirm-password"
                icon={showConfirmPassword === false ? faEyeSlash : faEye}
                onClick={handleShowConfirm}
              />
            </div>
            <div className="form-submit-change-password">
              <div
                className="submit-change-password"
                onClick={() => handleChangePassword(formChange)}
              >
                Thay đổi
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Password;
