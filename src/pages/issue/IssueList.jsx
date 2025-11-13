import React, { useEffect, useRef, useState } from "react";
import { useForm, FormProvider, set, get } from "react-hook-form";
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

  const [employeecode, setEmployeeCode] = useState();
  const [workorder, setWorkOrder] = useState();
  const [qty, setQty] = useState();
  const [location, setLocation] = useState();
  const [area, setArea] = useState();
  const [group, setGroup] = useState();
  const [status, setStatus] = useState();
  const [unit, setUnit] = useState();
  const [exists, setExists] = useState(false);

  // system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const employeeRef = useRef(null);
  const workOrderRef = useRef(null);

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
    },
  });

  useEffect(() => {
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
    GetLocationByWo(wo);
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

  const getLocation = () => {
    APIService.getAll("Location/Get")
      .then((res) => {
        setLocationList(res.data);
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
  const getStatus = () => {
    APIService.getAll("Status/Get")
      .then((res) => {
        setStatusList(res.data);
        //console.log("Status Get =>", res.data);
      })
      .catch((err) => console.log(err));
  };

  const GetLocationByWo = (workorder) => {
    APIService.getById(`Receive/GetLastLocationByWo`, workorder)
      .then((res) => {
        setLocation(res.data.Location);
        setGroup(res.data.Group);

      })
      .catch((err) => console.log(err));
  }

  const GetPalnQtyByWorkOrder = (workorder) => {
    APIService.getById(`Receive/GetPalnQtyByWorkOrder`, workorder)
      .then((res) => {
        setPlanQty(res.data?.PlanQty);
        setValue("PlanQty", res.data?.PlanQty);
        setValue("ReceivedQty", res.data?.ReceivedQty);
        let remainqty = res.data?.PlanQty - res.data?.ReceivedQty;
        setValue("Qty", remainqty);
        setRemainQty(remainqty);
        //console.log("setPlanQty res.data =>", res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleEmployeeScan = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      setEmployeeCode(value);
      //console.log("setEmployeeCode:", value);
      // โฟกัสไปช่องถัดไป
      workOrderRef.current?.focus();
      setValue("EmployeeCode", value)
    }
  };

  const handleWorkOrderScan = (e) => {
    //console.log("handleWorkOrderScan=>",e.key);
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      setWorkOrder(value);
      // ทำอย่างอื่น เช่น submit อัตโนมัติ หรือ alert
      //console.log("setWorkOrder:", value);
      setValue("WorkOrder", value)
      handleWorkOrderChange(value);
    }
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    // keep RHF errors in sync
    val == null ? setError(name, { type: "required" }) : clearErrors(name);
    // also sync local state used by <Select setValue={...}>
    if (name === "Location") {
      setLocation(val == null ? null : val);
    } else if (name === "Group") {
      setGroup(val == null ? null : val);
    }
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
    // ensure RHF values are cleared for controlled selects
    setValue("Location", null);
    setValue("Group", null);
    setPlanQty, null;
    setRemainQty, null;
    setEmployeeCode, null;
    setWorkOrder, null;
    clearErrors();
  };

  return (
    <>

      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="card p-8 w-full max-w-4xl mx-4 shadow-lg rounded-2xl">
            <FormTitle title={"ADD NEW"} home={"Receive"} />
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-3">
              {/* Grid 2 คอลัมน์ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ซ้าย: EMP + Location */}
                <div className="space-y-3">
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
                </div>

                {/* ขวา: ฟิลด์อื่นทั้งหมด */}
                <div className="space-y-3 ml-2">
                  <FormInput
                    name="ProductCode"
                    label="WorkOrder"
                    register={register}
                    type="text"
                    inputRef={workOrderRef}
                    inputMode="none"
                    onKeyDown={handleWorkOrderScan}
                    // onChange={(e) => { handleWorkOrderChange(e.target.value); }}
                    error={errors.WorkOrder}
                    required
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
                  <table>
                    Table
                  </table>
                </div>

                {/* ปุ่ม: ให้กินเต็มแถว */}
                {/* <div className="pt-3 flex justify-center gap-2 md:col-span-2">
                  <button type="submit" className="btn btn_primary uppercase">
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
                </div> */}
              </div>
              {/* ปุ่ม: ให้กินเต็มแถวและจัดกลาง */}
              <div className="md:col-span-2 w-full">
                <div className="pt-3 w-full flex justify-center items-center gap-2">
                  <button type="submit" className="btn btn_primary uppercase">
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
              </div>

            </form>
          </div>
        </div>

        {/* <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
                // onChange={(e) => {
                //   handleWorkOrderChange(e.target.value); // trigger useEffect
                // }}
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
        </div> */}
      </div>
    </>
  )
}

export default ReceiveForm
