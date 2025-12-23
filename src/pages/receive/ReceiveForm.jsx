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
  const LocationRef = useRef(null);
  // const QtyRef = useRef(null);
  const { setFocus } = useForm(); // เพิ่มจาก useForm


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
    newItem.Product = String(newItem.Product);
    newItem.Qty = Number(newItem.Qty);
    newItem.InputBy = Number(userId);
    // console.log("handledSaveChange Receive =>", newItem);
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

  const handleStockClick = () => {
    navigate("/reportstock");
    // setAction("list");
  };
  //อันนี้ใช้ได้ปกติ
  // const handleProductChange = (prod) => {
  //   setValue("Location", ([]));
  //   setValue("Qty", "");
  //   if (prod === null || prod === undefined || prod === "") return;
  //   setProduct(prod);
  //   setValue("Product", prod);
  //   // getStatus(prod);
  //   getLocation(prod);
  //   console.log("Product =>", prod);
  // };

  const handleProductChange = (prodRaw) => {
    const raw = (prodRaw ?? "").trim();
    if (!raw) return;

    // ✅ แยก Product | Qty
    const [p, q] = raw.split("|");
    const productCode = (p ?? "").trim();
    const qtyValue = q !== undefined ? Number(String(q).trim()) : null;

    // ✅ set product ที่ถูกตัดแล้ว
    setProduct(productCode);
    setValue("Product", productCode, { shouldValidate: true, shouldDirty: true });

    // ✅ ถ้ามี qty หลัง | ให้ใส่ลง Qty
    if (qtyValue !== null && Number.isFinite(qtyValue)) {
      setValue("Qty", qtyValue, { shouldValidate: true, shouldDirty: true });
      setQty(qtyValue); // ถ้าคุณยังใช้ state qty อยู่
    } else {
      setValue("Qty", "", { shouldValidate: true });
      setQty(0);
    }

    // ✅ reset location และโหลด location ตาม productCode
    setValue("Location", null);
    setLocation(null);

    getLocation(productCode);

    console.log("Product =>", productCode, "Qty =>", qtyValue);
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
  // อันนี้ใช้ได้ปกติ
  const handleProductScan = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      setProduct(value);
      setValue("Product", value)
      handleProductChange(value);
      setTimeout(() => LocationRef.current?.focus?.(), 0);
      // console.log("Product =>", value);
    }
  };
  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    // keep RHF errors in sync
    val == null ? setError(name, { type: "required" }) : clearErrors(name);
    // also sync local state used by <Select setValue={...}>
    if (name === "Location") {
      setLocation(val == null ? null : val);
      setTimeout(() => setFocus("Qty"), 0); // ✅ โฟกัสไป Qty โดยไม่ต้องใช้ ref
    }
  };


  const handleClearClick = () => {
    reset();
    setLocation(null);
    setLocationList([]);
    setValue("Qty", "");
    setValue("Product", "");
    setValue("EmployeeCode", "");
    setValue("Location", null);
    clearErrors();
    employeeRef.current?.focus();
    // console.log("handleClearClick");
    // refocus to employee code for next scan        
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="card p-8 w-full max-w-2xl mx-4 shadow-lg rounded-2xl">
            <FormTitle title={"ADD NEW"} home={"Receive"} />
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                e.preventDefault(); // กัน Enter submit form
              }
            }} autoComplete="off" className="space-y-3">
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
                onChange={(e) => {
                  setProduct(e.target.value); // trigger useEffect
                }}
                error={errors.Product}
                required
              />
              <Select
                list={locationList}
                onSelectItem={onSelectItem}
                setValue={location}
                name="Location"
                label="Location"
                register={register}
                selectRef={LocationRef}
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
                // max={Number(qty)}
                // min={1}
              />

              <div className="pt-3 flex justify-center gap-2">
                {Number(qty) > 0 && (
                  <button type="submit" className="btn btn_primary uppercase">
                    บันทึกข้อมูล
                  </button>
                )}
                {/* <button type="submit" className="btn btn_primary uppercase" disabled={issubmit}>
                  บันทึกข้อมูล
                </button> */}
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
                <button
                  type="button"
                  className="btn btn_info uppercase"
                  onClick={handleStockClick}
                >
                  กลับไปหน้า Stock
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
