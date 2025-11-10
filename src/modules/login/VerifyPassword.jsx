import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import APIService from "../../services/APIService";
import loading from "../../assets/image/loading2.gif";

const VerifyPassword = () => {
  const [formValid, setFormValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [textInvalid, setTextInvalid] = useState("");

  const [IsShowNewPassword, setShowNewPassword] = useState(false);
  const [IsShowConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRefCode, setShowRefCode] = useState(false);

  const [lengthValid, setLengthValid] = useState(false);
  const [letterValid, setLetterValid] = useState(false);
  const [numberValid, setNumberValid] = useState(false);

  const pwdConfirmRef = useRef(null);
  const btnSubmitRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState(atob(localStorage.getItem("_userid")));
  const [group, setGroup] = useState(atob(localStorage.getItem("_group")));
  const [referCode, setReferCode] = useState(
    atob(localStorage.getItem("_refcode"))
  );

  const effectRan = useRef(false);

  useEffect(() => {
    if (referCode === null || referCode === "null" || referCode === "") {
      setShowRefCode(false);
    } else {
      setShowRefCode(true);
    }
  }, [referCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    let credentials = {
      Id: userId,
      ReferCode: referCode,
      Password: newPassword,
    };

    let path = "";
    if (referCode === null || referCode === "null" || referCode === "") {
      path = "Auth/FirstLogin";
    } else {
      path = "Auth/VerifyPassword";
    }

    APIService.Put(path, credentials)
      .then((res) => {
        if (res.status !== 200) return;

        //dispatch(loginUser(res.data));

        if (group === "user") {
          navigate("/confirmdata");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        setFormValid(false);
        setTextInvalid(err.response.data);
      });
  };

  useEffect(() => {
    if (
      newPassword === undefined ||
      newPassword === "" ||
      newPassword === null
    ) {
      setPasswordValid(true);      
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
    if (!passwordValid || !lengthValid || !letterValid || !numberValid) {
      setFormValid(false);
      return;
    } else {
      setFormValid(true);
    }
  }, [passwordValid, lengthValid, letterValid, numberValid]);

  const handleKeyDown = (e, nextInputRef) => {
    if (e.key === "Tab") {
      e.preventDefault();
      nextInputRef.current.focus();
    }
  };

  return (
    <div className="container flex items-center justify-center mt-20 py-10">
      <div className="w-full sm:w-3/4 md:w-3/5 xl:w-3/4">
        <div>
          <h2 className="uppercase">Change Password</h2>
        </div>
        <form
          className="card mt-3 p-5 md:p-10"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="grid lg:grid-cols-4">
            <div className="lg:col-span-2">
              {textInvalid !== "" && (
                <div className="mb-3 text-center">
                  <div>
                    <label className="block invalid-feedback">
                      {textInvalid}
                      <br /> กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง
                    </label>
                  </div>
                </div>
              )}
              {showRefCode && (
                <div className="mb-5">
                  <label className="label block">Reference Code</label>
                  <label className="form-control-addon-within">
                    <input
                      type="text"
                      className="form-control border-none readOnly"
                      placeholder="Reference Code"
                      //onChange={e => setReferCode(e.target.value)}
                      defaultValue={referCode}
                      autoComplete="off"
                    />
                  </label>
                </div>
              )}
              <div className="mb-5">
                <label className="label block">New Password *</label>
                <label className="form-control-addon-within">
                  <input
                    type={IsShowNewPassword ? "text" : "password"}
                    className="form-control border-none bg-yellow-100"
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, pwdConfirmRef)}
                    value={newPassword}
                    autoComplete="off"
                  />
                  <span className="flex items-center ltr:pr-4 rtl:pl-4">
                    <button
                      type="button"
                      className="btn btn-link text-gray-300 dark:text-gray-700 la la-eye text-xl leading-none"
                      onClick={(e) => setShowNewPassword(!IsShowNewPassword)}
                    ></button>
                  </span>
                </label>
              </div>
              <div className="mb-5">
                <label className="label block">Confirm New Password *</label>
                <label className="form-control-addon-within">
                  <input
                    ref={pwdConfirmRef}
                    type={IsShowConfirmPassword ? "text" : "password"}
                    className="form-control border-none bg-yellow-100"
                    placeholder="Confirm New Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, btnSubmitRef)}
                    value={confirmPassword}
                    autoComplete="off"
                  />
                  <span className="flex items-center ltr:pr-4 rtl:pl-4">
                    <button
                      type="button"
                      className="btn btn-link text-gray-300 dark:text-gray-700 la la-eye text-xl leading-none"
                      onClick={(e) =>
                        setShowConfirmPassword(!IsShowConfirmPassword)
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
                  <i className="la la-check-circle mr-2" aria-hidden="true"></i>
                  At least 6 but not more than 12 characters.
                </p>
                <p className="ml-5">
                  [ อย่างน้อยต้องมี 6 แต่ไม่เกิน 12 ตัวอักษร ]
                </p>
              </div>
              <div className={`mt-3 ${letterValid ? "text-success" : ""}`}>
                <p>
                  <i className="la la-check-circle mr-2" aria-hidden="true"></i>
                  Must contain both uppercase and lowercase letters.
                </p>
                <p className="ml-5">[ ตัวอักษร ต้องมีทั้งตัวเล็กและตัวใหญ่ ]</p>
              </div>
              <div className={`mt-3 ${numberValid ? "text-success" : ""}`}>
                <p>
                  <i className="la la-check-circle mr-2" aria-hidden="true"></i>
                  Must contain both letters and numbers.
                </p>
                <p className="ml-5">[ ต้องมีทั้งตัวอักษรและตัวเลขรวมกัน ]</p>
              </div>              
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyPassword;
