import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import APIService from "../../services/APIService";
import { loginUser, logoutUser } from "../../store/reducers/auth";
import loading from "../../assets/image/loading2.gif";
import FormInput from "../../components/FormInput";
import { useForm } from "react-hook-form";
import MassageBox from "../../components/MassageBox";

const ForgotPassword = () => {
  const [formValid, setFormValid] = useState(false);
  const [textInvalid, setTextInvalid] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const effectRan = useRef(false);

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
    if (effectRan.current == false) {
      dispatch(logoutUser());
      return () => (effectRan.current = true);
    }
  }, []);

  const onSubmit = (data) => {
    setIsLoading(true);
    APIService.getByName("Auth/Forgot", data?.Email)
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          setShow(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        setFormValid(false);
        setTextInvalid(err?.response?.data);
      });
  };

  const handleBackClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    const verify = email !== "";
    setFormValid(verify);
  }, [email]);

  const handleCancelClick = () => {
    setShow(false);
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <>
      <div className="container flex items-center justify-center mt-20 py-10">
        <div className="w-full md:w-1/2 xl:w-1/3">
          <div className="mx-5 md:mx-10">
            <h2 className="uppercase">FORGOT PASSWORD?</h2>
            <h4 className="uppercase">WE'LL EMAIL YOU SOON</h4>
          </div>
          <form
            className="card mt-5 p-3 md:p-10"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            {textInvalid !== "" && (
              <div className="alert-wrapper mb-5">
                <div className="alert alert_danger alert_outlined">
                  {textInvalid}
                </div>
              </div>
            )}

            <div className="mb-5">
              <FormInput
                name="Email"
                label="Email"
                type="email"
                className="form-control mt-1"
                placeholder="example@example.com"
                register={register}
                required
                error={errors?.Email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                autoComplete="off"
              />
            </div>
            {!isLoading && (
              <div className="flex mt-2">
                <button
                  type="submit"
                  className="btn btn btn_primary uppercase "
                  onClick={handleBackClick}
                >
                  <span className="la la-chevron-circle-left text-xl leading-none mr-1" />
                  BACK
                </button>

                <button
                  className="btn btn btn_info uppercase ml-2"
                  type="submit"
                  disabled={!formValid}
                >
                  <span className="la la-envelope text-xl leading-none mr-1" />
                  Send Reset Password
                </button>
              </div>
            )}
            {isLoading && (
              <div className="flex justify-center">
                <img src={loading} alt="loading..." />
              </div>
            )}
          </form>
        </div>
      </div>

      <MassageBox
        show={show}
        title="Result"
        action={"warning"}
        name={"User"}
        //content={content}
        size={"xl"}
        Massage={"ระบบได้ส่งรหัสผ่านไปที่ " + email}
        handleCancelClick={handleCancelClick}
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
  );
};

export default ForgotPassword;
