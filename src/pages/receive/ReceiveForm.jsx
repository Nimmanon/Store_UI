<<<<<<< HEAD
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import FormInput from "../../components/FormInput";
import APIService from "../../services/APIService";
import Select from "../../components/Select";

const ReceiveForm = ({ data, action, dataList, onExists }) => {
=======
import React, { useEffect, useRef, useState } from "react";
import { useForm, FormProvider, set } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import FormTitle from "../../components/FormTitle";
import APIService from "../../services/APIService";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";

const ReceiveForm = () => {

  const [locationList, setLocationList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  // const [packingstatus, setPackingStatus] = useState("");
  const [planqty, setPlanQty] = useState(0);
  const [remainqty, setRemainQty] = useState(0);
>>>>>>> 1496d0238286f0535a5a28809f24f3421f218190

  const [employeecode, setEmployeeCode] = useState();
  const [product, setProduct] = useState();
  const [location, setLocation] = useState();
  const [qty, setQty] = useState();
  const [locationList, setLocationList] = useState([]);

  // system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const employeeRef = useRef(null);
  const productRef = useRef(null);

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
<<<<<<< HEAD
      Product: "",
      Location: "",
      Qty: "",
=======
      WorkOrder: "",
      Location: null,
      Group: null,
      Status: "",
      PackingStatusName: "",
      PpReceiveToShelf: "",
      ReceivedQty: "",
      PlanQty: "",
      StatusName: "",
      Qty: 0,
>>>>>>> 1496d0238286f0535a5a28809f24f3421f218190
    },
  });

  useEffect(() => {
<<<<<<< HEAD
    employeeRef.current?.focus();
    getLocation();
    if (action === "add") {
      reset({
        Id: 0,
        EmployeeCode: "",
        Product: "",
        Location: "",
        Qty: "",

      });
    }
  }, []);

  useEffect(() => {
    console.log("data =>", data);
    setValue("Id", data?.Id);
    setValue("EmployeeCode", data?.EmployeeCode);
    setValue("Product", data?.Product);
    setValue("Location", data?.Location);
    setValue("Qty", data?.Qty);
  }, [data]);

  useEffect(() => {
    if (name === undefined || name === "" || dataList?.length === 0) return;
    let exists = dataList?.some(
      (x) => x.Name.toUpperCase() === name?.toUpperCase()
    );
    onExists(exists);
  }, [name]);
=======
    if (effectRan.current === false) {
      reset();
      getLocation();
      getGroup();
      getStatus();
      //setActionForm("add");
      return () => (effectRan.current = true);
    }
  }, []);



  const handleSaveClick = (newItem) => {
    newItem.EmployeeCode = Number(newItem.EmployeeCode);
    newItem.WorkOrder = Number(newItem.WorkOrder);
    console.log("handledSaveChange =>", newItem);
    handleClearClick();
    if (exists) return;
    APIService.Post("Receive/Post", newItem)
      .then((res) => {
        if (res.status !== 200) return;
        //console.log("handledSaveChange =>", res.data);
        //remove old 
        let item = dataList.filter((x) => x.WorkOrder !== res.data.WorkOrder);
        setDataList(item);
        //add new
        setDataList((prev) => {
          res.data.Check = false;
          return [res.data, ...prev];
        });
        handleClearClick();
        handleSelectedRowClick(res.data);
      })
      .catch((err) => console.log(err));
    //console.log("handledSaveChange =>", newItem);
  };

  const handleWorkOrderChange = (wo) => {
    setValue("PackingStatusName", "");
    setValue("PpReceiveToShelf", "");
    setValue("PlanQty", "");
    setValue("Status", null);
    setValue("StatusName", "");
    setValue("Location", null);
    setValue("Group", null);
    setValue("Qty", "");
    if (wo === null || wo === undefined || wo === "") return;
    setWorkOrder(wo);
    setValue("WorkOrder", wo);
    GetPalnQtyByWorkOrder(wo);
    GetStatusByWorkOrder(wo);
  };

  const GetStatusByWorkOrder = (workorder) => {
    APIService.getAll(`Receive/GetStatusByWorkOrder/${workorder}`)
      .then((res) => {
        //console.log("GetStatusByWorkOrder =>", res.data);
        if (res.data) {
          const { PackingStatusName, PlanQty, PpReceiveToShelf } = res.data;
          setValue("PackingStatusName", PackingStatusName);
          setValue("PpReceiveToShelf", PpReceiveToShelf);
          // setValue("PlanQty", Number(PlanQty).toLocaleString(undefined));

          // ✅ เงื่อนไข: ถ้ามีข้อมูลครบ → set Status เป็น "MAT ครบ"
          const matStatus = statusList.find(
            (s) => s.Value === "ok"
          );
          setValue("Status", matStatus);
          setValue("StatusName", matStatus?.Name);
        } else {
          setValue("PackingStatusName", "");
          setValue("PpReceiveToShelf", "");
          // setValue("PlanQty", "");

          // ✅ เงื่อนไข: ถ้ามีข้อมูลไม่ครบ → set Status เป็น "ติด MAT"
          const matStatus = statusList.find(
            (s) => s.Value === "pending"
          );
          setValue("Status", matStatus);
          setValue("StatusName", matStatus?.Name);
        }
      })
      .catch((err) => console.log(err));
  };
>>>>>>> 1496d0238286f0535a5a28809f24f3421f218190

  const getLocation = () => {
    APIService.getAll("Location/Get")
      .then((res) => {
        setLocationList(res.data);
        //console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  const GetPalnQtyByWorkOrder = (workorder) => {
    APIService.getById(`Receive/GetPalnQtyByWorkOrder`, workorder)
      .then((res) => {
        setPlanQty(res.data?.PlanQty);
        setValue("PlanQty", res.data?.PlanQty);
        setValue("ReceivedQty", res.data?.ReceivedQty);
        let remainqty = res.data?.PlanQty - res.data?.ReceivedQty;
        setValue("Qty", remainqty);
        setRemainQty(remainqty);
        console.log("setPlanQty res.data =>", res.data);
      })
      .catch((err) => console.log(err));
  };


  const handleEmployeeScan = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      setEmployeeCode(value);
      // โฟกัสไปช่องถัดไป
      productRef.current?.focus();
      setValue("EmployeeCode", value)
    }
  };
  const handleProductScan = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      setProduct(value);
      setValue("Product", value)
    }
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val == null ? setError(name, { type: "required" }) : clearErrors(name);
  };

  const onSubmit = (value) => {
    value.InputBy = Number(userId);
    handleSaveClick(value);
  }

  const handleBackClick = () => {
    navigate("/receive");
  };

  const handleClearClick = () => {
    //console.log("handleClearClick");
    reset();
    setLocation(null);
    setGroup(null);
    clearErrors();   
  };


  return (
<<<<<<< HEAD
    <div className="p-3">
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
        inputRef={productRef}
        inputMode="none"
        onKeyDown={handleProductScan}
        onChange={(e) => {
          setProduct(e.target.value); // trigger useEffect
        }}
        error={errors.Product}
        required
      />
      {/* <FormInput
        name="Product"
        label="Product"
        register={register}
        type="text"
        onChange={(e) => {
          setProduct(e.target.value);
        }}
      /> */}
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
      />
    </div>
=======
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
                name="WorkOrder"
                label="WorkOrder"
                register={register}
                type="text"
                inputRef={workOrderRef}
                inputMode="none"
                onKeyDown={handleWorkOrderScan}
                onChange={(e) => {
                  handleWorkOrderChange(e.target.value); // trigger useEffect
                }}
                error={errors.WorkOrder}
                required
              />
              <FormInput
                name="PackingStatusName"
                label="PackingStatusName"
                register={register}
                type="text"
                readonly
                error={errors.PackingStatusName}
              />
              <FormInput
                name="PpReceiveToShelf"
                label="PpReceiveToShelf"
                register={register}
                type="text"
                readonly
                error={errors.PpReceiveToShelf}
              />
              <FormInput
                name="PlanQty"
                label="Plan Qty"
                register={register}
                type="text"
                readonly
                error={errors.PlanQty}
              />
              <FormInput
                name="ReceivedQty"
                label="Received Qty"
                register={register}
                type="text"
                readonly
              />
              <FormInput
                name="Qty"
                label="Qty"
                register={register}
                type="number"
                required
                setValue={qty}
                error={errors.Qty}
                onChange={(e) => {
                  setQty(e.target.value);
                }}
                max={remainqty}
              />
              <Select
                name="Location"
                label="Location"
                register={register}
                list={locationList}
                onSelectItem={onSelectItem}
                setValue={location}
                type="text"
                required
                error={errors.Location}
              />
              <Select
                name="Group"
                label="Group"
                register={register}
                list={groupList}
                onSelectItem={onSelectItem}
                setValue={group}
                type="text"
                required
                error={errors.Group}
              />
              <FormInput
                name="StatusName"
                label="Status"
                register={register}
                type="text"
                required
                error={errors.StatusName}
                readonly
              />
              <div className="pt-3 flex justify-center gap-2">
                <button type="submit" className="btn btn_primary uppercase" >
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
>>>>>>> 1496d0238286f0535a5a28809f24f3421f218190
  )
}

export default ReceiveForm
