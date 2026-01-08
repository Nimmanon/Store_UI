import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import { useNavigate, useOutletContext } from "react-router-dom";
import MassageBox from "../../components/MassageBox";
import { logoutUser } from "../../store/reducers/auth";
import { useDispatch, useSelector } from "react-redux";

const ChangePassword = () => {
  const [formValid, setFormValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [textInvalid, setTextInvalid] = useState("");
  const [oldPasswordValid, setOldPasswordValid] = useState(false);
  const [lengthValid, setLengthValid] = useState(false);
  const [letterValid, setLetterValid] = useState(false);
  const [numberValid, setNumberValid] = useState(false);

  const [data, setData] = useState();
  const [show, setShow] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pwdOldRef = useRef(null);
  const pwdRef = useRef(null);
  const pwdConfirmRef = useRef(null);
  const btnSubmitRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const effectRan = useRef(false);

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

  const {
    register,
    formState: { errors },
    reset,
    getValues,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    if (effectRan.current === false) {
      document.title = "COP : CHANGE PASSWORD";
      setInitial();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  useEffect(() => {
    if (
      newPassword === undefined ||
      newPassword === "" ||
      newPassword === null ||
      oldPassword === undefined ||
      oldPassword === "" ||
      oldPassword === null
    ) {
      setPasswordValid(true);
      setOldPasswordValid(true);
    } else {
      setPasswordValid(false);
      setOldPasswordValid(false);
    }
  }, [oldPassword]);

  useEffect(() => {
    if (
      newPassword === undefined ||
      newPassword === "" ||
      newPassword === null
    ) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }

    //check least 6 but not more than 12 characters
    if (newPassword?.length >= 6 && newPassword?.length <= 12) {
      setLengthValid(true);
    } else {
      setLengthValid(false);
    }

    //check must contain both uppercase and lowercase letters
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    if (hasUpperCase && hasLowerCase) {
      setLetterValid(true);
    } else {
      setLetterValid(false);
    }

    //check must contain both letters and number
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (hasLetter && hasNumber) {
      setNumberValid(true);
    } else {
      setNumberValid(false);
    }

    var verify = newPassword === confirmPassword;
    setPasswordValid(verify);
  }, [newPassword]);

  useEffect(() => {
    if (
      newPassword === undefined ||
      newPassword === "" ||
      newPassword === null ||
      confirmPassword === undefined ||
      confirmPassword === "" ||
      confirmPassword === null
    ) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }

    var verify = newPassword === confirmPassword;
    setPasswordValid(verify);
  }, [confirmPassword]);

  useEffect(() => {
    if (
      !oldPasswordValid ||
      !passwordValid ||
      !lengthValid ||
      !letterValid ||
      !numberValid
    ) {
      setFormValid(false);
      return;
    } else {
      setFormValid(true);
    }
  }, [oldPasswordValid, passwordValid, lengthValid, letterValid, numberValid]);

  const onSubmit = (data) => {
    data.Id = userId;
    data.OldPassword = oldPassword;
    data.NewPassword = newPassword;
    data.InputBy = userId;
    setData(data);
    setShow(true);
  };

  const handleSaveClick = () => {
    console.log("handleSaveClick => ", data);
    APIService.Put("Auth/Change", data)
      .then((res) => {
        if (res.status !== 200) return;
        setShow(false);

        dispatch(logoutUser());
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setShow(false);
        setTextInvalid(err.response?.data);
      });
  };

  const handleKeyDown = (e, nextInputRef) => {
    if (e.key === "Tab") {
      e.preventDefault();
      nextInputRef.current.focus();
    }
  };

  return (
    <>
      <div className="container flex items-center justify-center mt-20 py-10">
        <div className="w-full sm:w-3/4 md:w-3/5 xl:w-3/4">
          <div>
            <h2 className="uppercase">Change Password</h2>
          </div>
          <form
            className="card mt-3 p-5 md:p-10"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <div className="grid lg:grid-cols-4">
              <div className="lg:col-span-2">
                {textInvalid !== "" && (
                  <div className="mb-3 text-center">
                    <div>
                      <label className="block invalid-feedback">
                        {textInvalid}
                      </label>
                    </div>
                  </div>
                )}

                <div className="mb-5">
                  <label className="label block">Old Password *</label>
                  <label className="form-control-addon-within">
                    <input
                      ref={pwdOldRef}
                      type={showPasswordOld ? "text" : "password"}
                      className={`form-control border-none bg-yellow-100`}
                      onChange={(e) => setOldPassword(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, pwdRef)}
                      value={oldPassword}
                      autoComplete="off"
                      placeholder="Enter Old Password"
                      required
                    />
                    <span className="flex items-center ltr:pr-4 rtl:pl-4">
                      <button
                        type="button"
                        className="btn btn-link text-gray-300 dark:text-gray-700 la la-eye text-xl leading-none"
                        onClick={(e) => setShowPasswordOld(!showPasswordOld)}
                      ></button>
                    </span>
                  </label>
                </div>
                <div className="mb-5">
                  <label className="label block">New Password *</label>
                  <label className="form-control-addon-within">
                    <input
                      ref={pwdRef}
                      type={showPasswordNew ? "text" : "password"}
                      className={`form-control border-none bg-yellow-100`}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, pwdConfirmRef)}
                      value={newPassword}
                      autoComplete="off"
                      placeholder="Enter New Password"
                      required
                    />
                    <span className="flex items-center ltr:pr-4 rtl:pl-4">
                      <button
                        type="button"
                        className="btn btn-link text-gray-300 dark:text-gray-700 la la-eye text-xl leading-none"
                        onClick={(e) => setShowPasswordNew(!showPasswordNew)}
                      ></button>
                    </span>
                  </label>
                </div>
                <div className="mb-5">
                  <label className="label block">Confirm New Password *</label>
                  <label className="form-control-addon-within">
                    <input
                      ref={pwdConfirmRef}
                      type={showPasswordConfirm ? "text" : "password"}
                      className="form-control border-none bg-yellow-100"
                      placeholder="Enter Confirm New Password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, btnSubmitRef)}
                      value={confirmPassword}
                      autoComplete="off"
                      required
                    />
                    <span className="flex items-center ltr:pr-4 rtl:pl-4">
                      <button
                        type="button"
                        className="btn btn-link text-gray-300 dark:text-gray-700 la la-eye text-xl leading-none"
                        onClick={(e) =>
                          setShowPasswordConfirm(!showPasswordConfirm)
                        }
                      ></button>
                    </span>
                  </label>
                  {!passwordValid && (
                    <small className="block mt-2 invalid-feedback">
                      Password and Confirm Password must be match.
                    </small>
                  )}
                </div>
                {!isLoading && (
                  <div className="flex flex-col items-center">
                    <button
                      ref={btnSubmitRef}
                      className="btn bg-primary ltr:ml-auto rtl:mr-auto uppercase"
                      type="submit"
                      disabled={!formValid}
                    >
                      Change Password
                    </button>
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-center">
                    <img src={loading} alt="loading..." />
                  </div>
                )}
              </div>
              <div
                className="lg:col-span-2 px-4 ml-5"
                style={{ borderLeft: "1px solid silver" }}
              >
                <div className="flex items-center p-3 text-primary border-l-4 border-blue-300 bg-blue-100 border-radius-3  mb-4">
                  <div className="ms-3 text-sm font-medium">                  
                    <p>
                      <i className="la la-square" /> เมื่อระบุ Password
                      ตรงตามเงื่อนไขที่กำหนด เงื่อนไขจะเปลี่ยนเป็นสีเขียว{" "}
                    </p>
                    <p>
                      <i className="la la-square" /> ปุ่ม Change Password
                      จะสามารถกดได้ เมื่อเงื่อนไขเปลี่ยนเป็นสีเขียวทั้งหมด
                      และกำหนดรหัสผ่านใหม่(New Password)
                      กับรหัสผ่านยืนยัน(Confirm New Password) ตรงกัน
                    </p>
                  </div>
                </div>
                <h4>Requirements of password ?</h4>

                <div className={`mt-2 ${lengthValid ? "text-success" : ""}`}>
                  <p>
                    <i
                      className="la la-check-circle mr-2"
                      aria-hidden="true"
                    ></i>
                    At least 6 but not more than 12 characters.
                  </p>
                  <p className="ml-5">
                    [ อย่างน้อยต้องมี 6 แต่ไม่เกิน 12 ตัวอักษร ]
                  </p>
                </div>
                <div className={`mt-3 ${letterValid ? "text-success" : ""}`}>
                  <p>
                    <i
                      className="la la-check-circle mr-2"
                      aria-hidden="true"
                    ></i>
                    Must contain both uppercase and lowercase letters.
                  </p>
                  <p className="ml-5">
                    [ ตัวอักษร ต้องมีทั้งตัวเล็กและตัวใหญ่ ]
                  </p>
                </div>
                <div className={`mt-3 ${numberValid ? "text-success" : ""}`}>
                  <p>
                    <i
                      className="la la-check-circle mr-2"
                      aria-hidden="true"
                    ></i>
                    Must contain both letters and numbers.
                  </p>
                  <p className="ml-5">[ ต้องมีทั้งตัวอักษรและตัวเลขรวมกัน ]</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <MassageBox
        show={show}
        action={"confirm"}
        name={"Change Password"}
        size={"xl"}
        Massage={"Are you sure want to change password ?"}
        handleCancelClick={() => setShow(false)}
        onConfrimClick={handleSaveClick}
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
  );
};

export default ChangePassword;
