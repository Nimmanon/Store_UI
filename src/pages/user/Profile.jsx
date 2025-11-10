import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import FormInput from "../../components/FormInput";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormTitle from "../../components/FormTitle";
import { logoutUser } from "../../store/reducers/auth";
import MassageBox from "../../components/MassageBox";

const Profile = () => {
  const [data, setData] = useState();
  const [usernameOld, setUsernameOld] = useState();
  const [textInvalid, setTextInvalid] = useState("");

  const [company, setCompany] = useState();
  const [organize, setOrganize] = useState();
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const effectRan = useRef(false);
  const dispatch = useDispatch();

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
      setInitial();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  useEffect(() => {
    if (userId === undefined || userId === null) return;
    getData(userId);
  }, [userId]);

  const getData = (id) => {
    APIService.getById("Auth/GetById", id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (data === undefined || data === null) return;
    console.log("profile data =>", data);

    setValue("Id", data?.Id);
    setValue("Organize", data?.Organize?.Name);
    setValue("Company", data?.Company?.Name);
    setValue("Group", data?.Group);
    setValue("FirstName", data?.FirstName);
    setValue("LastName", data?.LastName);
    setValue("Email", data?.Email);
    setValue("Username", data?.Username);
    setUsernameOld(data?.Username);

    setOrganize(data?.Organize);
    setCompany(data?.Company);
  }, [data]);

  const onSubmit = (data) => {
    data.Company = company;
    data.Organize = organize;
    data.InputBy = userId;
    console.log("save profile =>", data);
    APIService.Put("Auth/Put", data)
      .then((res) => {
        if (res.status !== 200) return;

        if (usernameOld?.toLowerCase() !== res.data?.Username.toLowerCase()) {
          dispatch(logoutUser());
        }
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setTextInvalid(err.response?.data);
      });
  };

  const handleResetClick = () => {
    let email = getValues("Email");
    if (email === "" || email === null || email === undefined) {
      setError("Email", { type: "required" });
      return;
    }

    setShow(true);
    setEmail(email);
  };

  const handleConfirmClick = () => {
    let item = {};
    item.Id = data?.Id;
    item.InputBy = userId;

    APIService.Post("Auth/Reset", item)
      .then((res) => {
        if (res.status !== 200) return;
        setShow(false);
        setEmail("");
        logout();
      })
      .catch((err) => {
        console.log(err);
        setTextInvalid(err.response?.data);
      });
  };

  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <>
      <FormTitle home={"Manage"} title={"Profile"} />
      <div className="grid lg:grid-cols-6 gap-2 mt-1 mr-2">
        <div className="flex flex-col md:col-span-3 lg:col-span-2 xl:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="card p-3 mt-2">
              <div className="grid lg:grid-cols-1 gap-2">
                {textInvalid !== "" && (
                  <div className="bg-red-100 border border-red-400 text-red px-4 py-2 rounded relative">
                    <div className="flex items-center">
                      <div>
                        <span className="la la-exclamation-triangle text-bold text-xl" />
                      </div>
                      <div className="ml-2">{textInvalid}</div>
                    </div>
                  </div>
                )}

                {company && (
                  <div>
                    <FormInput
                      name="Customer"
                      label="Customer"
                      type="text"
                      className="form-control"
                      register={register}
                      readonly
                    />
                  </div>
                )}

                {organize && (
                  <div>
                    <FormInput
                      name="Organize"
                      label="Organize"
                      type="text"
                      className="form-control"
                      register={register}
                      readonly
                    />
                  </div>
                )}

                <div>
                  <FormInput
                    name="FirstName"
                    label="FirstName"
                    type="text"
                    className="form-control"
                    placeholder="FirstName"
                    register={register}
                    required
                    error={errors?.FirstName}
                  />
                </div>
                <div>
                  <FormInput
                    name="LastName"
                    label="LastName"
                    type="text"
                    className="form-control"
                    placeholder="LastName"
                    register={register}
                  />
                </div>
                <div>
                  <FormInput
                    name="Email"
                    label="Email"
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    register={register}
                    required
                    error={errors?.Email}
                  />
                </div>
                <div>
                  <FormInput
                    name="Username"
                    label="Username"
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    register={register}
                    required
                    error={errors?.Username}
                  />
                </div>

                <div className="flex mt-2 gap-1">
                  <button type="submit" className="btn btn btn_info uppercase">
                    <span className="la la-download text-xl leading-none mr-1" />
                    Update Profile
                  </button>
                  <button
                    type="button"
                    className="btn btn btn_warning uppercase"
                    onClick={handleResetClick}
                  >
                    <span className="la la-undo-alt text-xl leading-none mr-1" />
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <MassageBox
        show={show}
        action={"confirm"}
        name={"Reset Password"}
        size={"xl"}
        Massage={"ระบบจะส่งรหัสผ่านใหม่ไปที่ " + email}
        handleCancelClick={() => setShow(false)}
        onConfrimClick={handleConfirmClick}
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
  );
};

export default Profile;
