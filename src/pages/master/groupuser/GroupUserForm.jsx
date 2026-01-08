import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import FormTitle from "../../../components/FormTitle";
import FormInput from "../../../components/FormInput";
import APIService from "../../../services/APIService";
const GroupUserForm = () => {
  const [setDataSelected, setAction] = useOutletContext();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

  const effectRan = useRef(false);
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    reset,
    setValue,
    setError,
    getValues,
    handleSubmit,
    clearErrors,
  } = useForm({
    defaultValues: {
      Id: 0,
      Name: "",     
      Value:"",
    },
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

  const onSubmit = (data) => {
    data.Prefix ="user";
    data.InputBy = Number(userId);
    handleSaveClick(value);
  };

  const handleSaveClick = (data) => {
    // console.log("handleSaveClick=> ", data);
    APIService.Post("Group/Post", data)
      .then((res) => {
        if (res.status !== 200) return;
        handleBackClick();       
      })
      .catch((err) => console.log(err));
  };

  const handleClearClick = () => {
    reset();
    clearErrors();
  };

  const handleBackClick = () => {
    navigate("/groupuser");
    setDataSelected();
    setAction("list");
  };
  return (
    <>
      <FormTitle home={"Group User"} title={"Add New"} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid lg:grid-cols-6 gap-3 mt-3">
          <div className="lg:col-span-2 xl:col-span-2">
            <div className="card p-3">
              <div className="grid lg:grid-cols-1 gap-1">
                <div>
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
        <div className="flex mt-2">
          <div>
            <button
              type="submit"
              className="btn btn btn_info uppercase "
              onClick={handleBackClick}
            >
              <span className="la la-chevron-circle-left text-xl leading-none mr-1"></span>
              GO BACK
            </button>
          </div>

          <div className="ml-1">
            <div>
              <button type="submit" className="btn btn btn_primary uppercase">
                Save Group
              </button>
            </div>
          </div>
          <div className="ml-1">
            <div>
              <button
                type="button"
                className="btn btn_outlined btn_secondary uppercase"
                onClick={handleClearClick}
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default GroupUserForm;
