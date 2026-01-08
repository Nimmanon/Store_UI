import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import FormTitle from "../../components/FormTitle";
import MassageBox from "../../components/MassageBox";

const UserView = () => {
  const [setDataSelected, setAction] = useOutletContext();

  const [data, setData] = useState();
  const [organizeList, setOrganizeList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  const [company, setCompany] = useState();
  const [group, setGroup] = useState();
  const [organize, setOrganize] = useState();

  const [textInvalid, setTextInvalid] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const effectRan = useRef(false);
  let params = useParams();

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
      getOrganize();
      getGroup();
      getCompany();
      getData();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  const getData = () => {
    if (params.id === undefined || params.id === null || params.id === 0)
      return;

    APIService.getById("Auth/GetById", params.id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getOrganize = () => {
    APIService.getAll("Organize/Get")
      .then((res) => {
        setOrganizeList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getCompany = () => {
    APIService.getAll("Company/Get")
      .then((res) => {
        setCompanyList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getGroup = () => {
    APIService.getAll("Group/Get")
      .then((res) => {
        setGroupList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (data === undefined || data === null) return;
    //console.log("User View data =>", data);

    setValue("Id", data?.Id);
    setValue("Company", data?.Company);
    setValue("Organize", data?.Organize);
    setValue("Address", data?.Address);
    setValue("Group", data?.Group);
    setValue("FirstName", data?.FirstName);
    setValue("LastName", data?.LastName);
    setValue("Email", data?.Email);
    setValue("Username", data?.Username);
    setValue("IsAdmin", data?.IsAdmin);

    setCompany(data?.Company);
    setOrganize(data?.Organize);
    setGroup(data?.Group);
  }, [data]);

  const onSubmit = (data) => {
    data.InputBy = userId;

    APIService.Put("Auth/Put", data)
      .then((res) => {
        if (res.status !== 200) return;
        handleBackClick();
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
        handleBackClick();
      })
      .catch((err) => {
        console.log(err);
        setTextInvalid(err.response?.data);
      });
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val == null ? setError(name, { type: "required" }) : clearErrors(name);

    switch (name?.toLowerCase()) {
      case "group":
        let [grp] = groupList?.filter((x) => x.Id === val?.Id);
        setGroup(grp?.Value?.toLowerCase());
        break;
      case "organize":
        setOrganize(val);
        break;
      case "company":
        setCompany(val);
        break;
    }
  };

  const handleBackClick = () => {
    navigate("/user");
    setAction("list");
  };

  return (
    <>
      <FormTitle home={"Manage"} title={"Update User"} />
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
                <div>
                  <Select
                    list={groupList}
                    onSelectItem={onSelectItem}
                    name="Group"
                    label="Group"
                    placeholder="Group"
                    register={register}
                    type="text"
                    required
                    error={errors?.Group}
                    setValue={group}
                  />
                </div>
                {group?.Value?.toLowerCase() === "superuser" && (
                  <div>
                    <Select
                      list={companyList}
                      onSelectItem={onSelectItem}
                      name="Company"
                      label="Company"
                      placeholder="Company"
                      register={register}
                      type="text"
                      setValue={company}
                    />
                  </div>
                )}
                {(group?.Value?.toLowerCase() === "superuser" || group?.Value?.toLowerCase() === "user") && (
                  <div>
                    <Select
                      list={organizeList}
                      onSelectItem={onSelectItem}
                      name="Organize"
                      label="Organize"
                      register={register}
                      type="text"
                      setValue={organize}
                    />
                  </div>
                )}

                <div>
                  <FormInput
                    name="FirstName"
                    label="FirstName"
                    type="text"
                    className="form-control mt-1"
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
                    className="form-control mt-1"
                    placeholder="LastName"
                    register={register}
                  />
                </div>
                <div>
                  <FormInput
                    name="Email"
                    label="Email"
                    type="text"
                    className="form-control mt-1"
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
                    className="form-control mt-1"
                    placeholder="Username"
                    register={register}
                    required
                    error={errors?.Username}
                  />
                </div>

                <div className="flex mt-2 gap-1">
                  <button
                    type="submit"
                    className="btn btn btn_info uppercase"
                    onClick={handleBackClick}
                  >
                    <span className="la la-chevron-circle-left text-xl leading-none mr-1" />
                    GO BACK
                  </button>

                  <button
                    type="submit"
                    className="btn btn btn_primary uppercase"
                  >
                    <span className="la la-download text-xl leading-none mr-1" />
                    Update User
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

export default UserView;
