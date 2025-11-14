import React, { useEffect, useRef, useState } from "react";
import { useForm, FormProvider, set, get } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import FormTitle from "../../components/FormTitle";
import APIService from "../../services/APIService";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";

const ReceiveForm = () => {
  const [dataList, setDataList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [stockList, setStockList] = useState([]);

  const [product, setProduct] = useState();
  const [employeecode, setEmployeeCode] = useState();
  const [location, setLocation] = useState();
  const [qty, setQty] = useState(0);
  const [exists, setExists] = useState(false);
  const [issubmit, setIsSubmit] = useState(false);

  // system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const employeeRef = useRef(null);
  const ProductRef = useRef(null);

  const effectRan = useRef(false);
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    reset,
    getValues,
    setError,
    setValue,
    clearErrors,
    handleSubmit,
  } = useForm({
    defaultValues: {
      Id: 0,
      EmployeeCode: "",
      Product: "",
      Location: null,
      Qty: 0
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      reset();
      getLocation();
      //setActionForm("add");
      return () => (effectRan.current = true);
    }
  }, []);

  const handleSaveClick = (newItem) => {
    setIsSubmit(true);
    newItem.Product = Number(newItem.Product);
    newItem.Qty = Number(newItem.Qty);    
    console.log("handledSaveChange Receive =>", newItem);
    // handleClearClick();
    if (exists) return;
    APIService.Post("Receive/Post", newItem)
      .then((res) => {
        if (res.status !== 200) return;
        setDataList((prevItem) => {
          return [res.data, ...prevItem];
        });
        handleClearClick();
      })
      .catch((err) => console.log(err)).finally(() => {
        setIsSubmit(false);
      });

  };


  const onSubmit = (value) => {
    value.InputBy = Number(userId);
    handleSaveClick(value);

  }

  const handleBackClick = () => {
    navigate("/receive");
    // setAction("list");
  };

  const handleProductChange = (prod) => {
    setValue("Location", ([]));
    setValue("Qty", "");
    if (prod === null || prod === undefined || prod === "") return;
    setProduct(prod);
    setValue("Product", prod);
    // getStatus(prod);
    getLocation(prod);
  };

  const getLocation = () => {
    APIService.getAll("Location/Get")
      .then((res) => {
        setLocationList(res.data);
        //console.log("Location =>", res.data);
      })
      .catch((err) => console.log(err));
  };


  const handleEmployeeScan = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      setEmployeeCode(value);
      // โฟกัสไปช่องถัดไป
      ProductRef.current?.focus();
      setValue("EmployeeCode", value)
    }
  };

  const handleProductScan = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      setProduct(value);
      setValue("Product", value)
      handleProductChange(value);
    }
  };

  const onSelectItem = async (e, name) => {
    //console.log("onSelectItem ", name, " => ", e);
    setValue(name, e);
    e === null ? setError(name, { type: "required" }) : clearErrors(name);
  };


  const handleClearClick = () => {
    reset();
    setLocation(null);
    setLocationList([]);
    clearErrors();
    employeeRef.current?.focus();
    // refocus to employee code for next scan        
  };


  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="card p-8 w-full max-w-2xl mx-4 shadow-lg rounded-2xl">
            <FormTitle title={"ADD NEW"} home={"Receive"} />
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-3">
              <FormInput
                name="EmployeeCode"
                label="EmployeeCode"
                register={register}
                type="text"
                inputRef={employeeRef}
                inputMode="none"
                onKeyDown={(e) => {
                  handleEmployeeScan(e);
                }}
                onChange={(e) => {
                  setEmployeeCode(e.target.value);
                }}
                error={errors.EmployeeCode}
                required
              />
              <FormInput
                name="Product"
                label="Product"
                register={register}
                type="text"
                inputRef={ProductRef}
                inputMode="none"
                onKeyDown={handleProductScan}
                // onChange={(e) => {
                //     setWorkOrder(e.target.value); // trigger useEffect
                // }}
                error={errors.WorkOrder}
                required
              />
              <Select
                list={locationList}
                onSelectItem={onSelectItem}
                setValue={location}
                name="Location"
                label="Location"
                register={register}
                type="text"
                required
                error={errors.Location}
              />
              <FormInput
                name="Qty"
                label="Qty"
                register={register}
                type="number"
                required
                error={errors.Qty}
                onChange={(e) => {
                  setQty(e.target.value);
                }}
                max={Number(qty)}
                min={1}
              />

              <div className="pt-3 flex justify-center gap-2">
                <button type="submit" className="btn btn_primary uppercase" disabled={issubmit}>
                  บันทึกข้อมูล
                </button>
                <button
                  type="button"
                  className="btn btn_outlined btn_info uppercase"
                  onClick={handleClearClick}
                >
                  เคลียร์ข้อมูล
                </button>
                <button
                  type="button"
                  className="btn btn_secondary uppercase"
                  onClick={handleBackClick}
                >
                  กลับไปหน้าหลัก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReceiveForm
