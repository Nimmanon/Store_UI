import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FormTitle from "../../../components/FormTitle";
import APIService from "../../../services/APIService";
import FormInput from "../../../components/FormInput";
import MassageBox from "../../../components/MassageBox";

const GroupUserView = () => {
  const [setDataSelected, setAction] = useOutletContext();

  const [data, setData] = useState();
  const navigate = useNavigate();
  let params = useParams();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

  //MessageBox
  const [content, setContent] = useState();
  const [show, setShow] = useState(false);
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
    defaultValues: {
      Id: 0,
      Name: "",
      Value: "",
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      setInitial();
      getData();
      return () => (effectRan.current = true);
    }
  }, []);

  const getData = () => {
    if (params.id === undefined || params.id === null || params.id === 0)
      return;
    APIService.getById("Group/GetById", params.id)
      .then((res) => {
        setData(res.data);
        // console.log("group get by id=>",res.data);
      })
      .catch((err) => console.log(err));
  };

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  useEffect(() => {
    if (data === undefined || data === null) return;

    setValue("Id", data?.Id);
    setValue("Prefix", data?.Prefix);
    setValue("Name", data?.Name);
    setValue("Value", data?.Value);
  }, [data]);

  const handledDeleteItem = () => {
    var credential = { Id: data.Id, InputBy: userId };
    APIService.Post("Group/Delete", credential)
      .then((res) => {
        if (res.status !== 200) return;
        setShow(false);
        handleBackClick();
      })
      .catch((err) => console.log(err));
  };

  const handleBackClick = () => {
    navigate("/groupuser");
    setDataSelected();
    setAction("list");
  };

  const onSubmit = (value) => {
    value.InputBy = Number(userId);
    handleSaveClick(value);
  };

  const handleSaveClick = (data) => {
    //console.log("handleSaveClick=> ", data);
    APIService.Put("Group/Put", data)
      .then((res) => {
        if (res.status !== 200) return;
        handleBackClick();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <FormTitle title={"VIEW"} home={"Group User"} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid lg:grid-cols-3 gap-2">
          <div className="grid lg:grid-cols-1">
            <div className="card p-3">
              <div>
                <div className="grid lg:grid-cols-1 gap-1">
                  <div className="mt-5">
                    <FormInput
                      name="Name"
                      label="Name"
                      placeholder=""
                      register={register}
                      type="text"
                      required
                      error={errors.Name}                    
                    />
                    <FormInput
                      name="Value"
                      label="Value"
                      placeholder=""
                      register={register}
                      type="text"
                      required
                      error={errors.Value}                     
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt-2">
          <button
            type="submit"
            className="btn btn_info uppercase "
            onClick={handleBackClick}
          >
            <span className="la la-chevron-circle-left text-xl leading-none mr-1 "></span>
            GO BACK
          </button>

          <button type="submit" className="btn btn_primary uppercase ml-2">
            Update Group
          </button>

          <div className="ml-2">
            <div>
              <button
                type="button"
                className="btn btn_danger uppercase"
                onClick={() => setShow(true)}
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      </form>

      <MassageBox
        show={show}
        action={"delete"}
        name={"Group"}
        content={content}
        size={"xl"}
        Massage={"Are you sure want to delete this item?"}
        handleCancelClick={() => {
          setShow(false);
        }}
        onDeleteClick={handledDeleteItem}
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
  );
};

export default GroupUserView;
