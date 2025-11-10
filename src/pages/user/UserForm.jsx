import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import FormTitle from "../../components/FormTitle";
import MassageBox from "../../components/MassageBox";

const UserForm = () => {
  const [setDataSelected, setAction] = useOutletContext();

  const [organizeList, setOrganizeList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [textInvalid, setTextInvalid] = useState("");

  const [email, setEmail] = useState("");
  const [group, setGroup] = useState();
  const [show, setShow] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
    defaultValues: {
      Id: 0,
      Organize: null,
      Group: null,
      Name: "",
      Email: "",
      Username: "",
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      setInitial();
      getOrganize();
      getGroup();
      getCompany();
      setAction("new");
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
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

  const onSubmit = (data) => {
    setTextInvalid("");
    setEmail(data?.Email);
    handleSaveClick(data);
  };

  const handleSaveClick = (data) => {
    setIsProcessing(true);
    data.InputBy = userId;
    //console.log("handleSaveClick => ",data);
    APIService.Post("Auth/Register", data)
      .then((res) => {
        if (res.status !== 200) return;
        setShow(true);
        setIsProcessing(false);
      })
      .catch((err) => {
        console.log(err);
        setTextInvalid(err.response?.data);
        setIsProcessing(false);
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
    }
  };

  const handleBackClick = () => {
    navigate("/user");
    setDataSelected();
    setAction("list");
  };

  const clearForm = () => {
    reset();
    setTextProduct("");
    setTextLocation("");
  };

  const handleCancelClick = () => {
    handleBackClick();
    setShow(false);
  };

  return (
    <>
      <FormTitle home={"Manage"} title={"Add New User"} />
      <div className="grid lg:grid-cols-6 gap-2 mt-1 mr-2">
        <div className="flex flex-col lg:col-span-2 xl:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="card p-3 mt-2">
              <div className="grid lg:grid-cols-1 gap-2 ">
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
                    register={register}
                    type="text"
                    required
                    error={errors?.Group}
                  />
                </div>
                {group === "superuser" && (
                  <div>
                    <Select
                      list={companyList}
                      onSelectItem={onSelectItem}
                      name="Company"
                      label="Company"
                      placeholder="Company"
                      register={register}
                      type="text"
                    />
                  </div>
                )}
                {(group === "superuser" || group === "user") && (
                  <div>
                    <Select
                      list={organizeList}
                      onSelectItem={onSelectItem}
                      name="Organize"
                      label="Organize"
                      register={register}
                      type="text"
                    />
                  </div>
                )}
                <div>
                  <FormInput
                    name="FirstName"
                    type="text"
                    className="form-control mt-1"
                    label="FirstName"
                    register={register}
                    required
                    error={errors?.FirstName}
                  />
                </div>
                <div>
                  <FormInput
                    name="LastName"
                    type="text"
                    className="form-control mt-1"
                    label="LastName"
                    register={register}
                  />
                </div>
                <div>
                  <FormInput
                    name="Email"
                    type="email"
                    className="form-control mt-1"
                    label="Email"
                    register={register}
                    required
                    error={errors?.Email}
                  />
                </div>
                <div>
                  <FormInput
                    name="Username"
                    type="text"
                    className="form-control mt-1"
                    label="Username"
                    register={register}
                    required
                    error={errors?.Username}
                  />
                </div>
                <div className="flex mt-2 gap-1">
                  <button
                    type="submit"
                    className="btn btn btn_info uppercase "
                    onClick={handleBackClick}
                  >
                    <span className="la la-chevron-circle-left text-xl leading-none mr-1" />
                    GO BACK
                  </button>

                  {!isProcessing && (
                    <button
                      type="submit"
                      className="btn btn btn_primary uppercase"
                    >
                      <span className="la la-save text-xl leading-none mr-1" />
                      Save User
                    </button>
                  )}

                  {isProcessing && (
                    <button type="button" className="btn btn_primary uppercase">
                      <span
                        className="la la-spinner la-spin text-xl mr-1"
                        aria-hidden="true"
                      />
                      Processing
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <MassageBox
        show={show}
        title="User Result"
        action={"warning"}
        name={"User"}
        showTitle={false}
        size={"xl"}
        Massage={"ระบบได้ส่งรหัสผ่านไปที่ " + email}
        handleCancelClick={handleCancelClick}
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
  );
};

export default UserForm;
