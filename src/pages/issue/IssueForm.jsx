import React, { useEffect, useRef, useState } from "react";
import { useForm, FormProvider, set, get } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import FormTitle from "../../components/FormTitle";
import APIService from "../../services/APIService";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";

const IssueForm = () => {
  const [dataList, setDataList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [stockList, setStockList] = useState([]);

  const [product, setProduct] = useState();
  const [employeecode, setEmployeeCode] = useState();
  const [location, setLocation] = useState();

  const [qty, setQty] = useState(0);
  const [remain, setRemain] = useState(0);

  const qtyNum = Number(qty || 0);
  const remainNum = Number(remain || 0);
  const canSave = qtyNum > 0 && qtyNum <= remainNum;


  // const remainNum = Number(remain || 0);
  // const isOverQty = qtyNum > remainNum;
  // const canSubmit = qtyNum > 0 && !isOverQty;

  const [exists, setExists] = useState(false);
  const [issubmit, setIsSubmit] = useState(false);

  const [isBN, setIsBN] = useState("BN2");

  // system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const employeeRef = useRef(null);
  const ProductRef = useRef(null);
  const LocationRef = useRef(null);
  const QtyRef = useRef(null);

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
      //getLocation();
      //setActionForm("add");
      return () => (effectRan.current = true);
    }
  }, []);

  //ทดสอบ
//   const handleSaveClick = (newItem) => {
//   setIsSubmit(true);

//   // ✅ บังคับว่าต้องเลือก stock row ก่อน
//   if (!selectedStockRow) {
//     alert("กรุณาเลือก Location/รายการสินค้า (-B/-N) ก่อนจ่ายออก");
//     setIsSubmit(false);
//     return;
//   }

//   const payload = {
//     ...newItem,
//     Product: String(selectedStockRow.Product),       // ✅ ใช้ตัวเต็ม
//     LocationId: Number(selectedStockRow.LocationId), // ✅ ใช้ location ที่เลือก
//     Qty: Number(newItem.Qty),
//   };

//   // ✅ validate กันตัดเกิน
//   if (payload.Qty <= 0) {
//     alert("Qty ต้องมากกว่า 0");
//     setIsSubmit(false);
//     return;
//   }
//   if (payload.Qty > Number(selectedStockRow.OnHand)) {
//     alert(`Qty ห้ามเกินคงเหลือ (${selectedStockRow.OnHand})`);
//     setIsSubmit(false);
//     return;
//   }

//   APIService.Post("Issue/Post", payload)
//     .then((res) => {
//       if (res.status !== 200) return;
//       setDataList((prev) => [res.data, ...prev]);
//       handleClearClick();
//       setSelectedStockRow(null);
//     })
//     .catch(console.log)
//     .finally(() => setIsSubmit(false));
// };


  //ใช้งานได้จริง
  const handleSaveClick = (newItem) => {
    setIsSubmit(true);
    newItem.Product = String(newItem.Product);
    newItem.Qty = Number(newItem.Qty);
    //console.log("handledSaveChange issue =>", newItem);
    // handleClearClick();
    if (exists) return;
    APIService.Post("Issue/Post", newItem)
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
    navigate("/issue");
    // setAction("list");
  };

  const handleStockClick = () => {
    navigate("/reportstock");
    // setAction("list");
  };
  const handleProductChange = (prod) => {
    setValue("Location", ([]));
    setValue("Qty", "");
    if (prod === null || prod === undefined || prod === "") return;
    setProduct(prod);
    setValue("Product", prod);
    // getStatus(prod);
    //getLocation(prod);
  };

  // const getLocation = () => {
  //   APIService.getAll("Location/Get")
  //     .then((res) => {
  //       setLocationList(res.data);
  //       //console.log("Location =>", res.data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const GetLocationByProduct = (product) => {
    //console.log("GetLocationByProduct =>", product);
    APIService.getByName("Issue/GetLocationByProduct", product)
      .then((res) => {
        // setData(res.data);
        setLocationList(res.data);
        // setRemain(res.data?.[0]?.Qty ?? 0);  // ✅ Qty อยู่ใน element ตัวแรก
        // console.log("setRemain =>", res.data?.[0]?.Qty ?? 0);
        // console.log("setLocationList =>", res.data);
        // ✅ โฟกัสหลัง state update
        setTimeout(() => LocationRef.current?.focus?.(), 0);
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
  //อันนี้สามามารถใช้ได้นะครับ
  // const handleProductScan = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     const value = e.target.value.trim();
  //     setProduct(value);
  //     setValue("Product", value)
  //     handleProductChange(value);
  //     GetLocationByProduct(value);
  //   }
  // };

  //อันนี้คือcursorไปอยู่ในช่อง location
  const handleProductScan = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      setProduct(value);
      setValue("Product", value);
      handleProductChange(value);
      GetLocationByProduct(value); // จะไป focus ที่ location หลังโหลดเสร็จ
      console.log("Product =>", value);
    }
  };

  const handleBNChange = (e) => {
    const value = e.target.value; // "BN1" = B, "BN2" = N (สมมติใช้แบบนี้)
    setIsBN(value);
    setValue("isBN", value === "BN1"); // true = B, false = N

    const currentProduct = getValues("Product") || "";

    // ตัด -B หรือ -N ทิ้งก่อน (กันซ้อน)
    const baseProduct = currentProduct.replace(/-(B|N)$/, "");

    let newProduct = baseProduct;

    if (value === "BN1") {
      newProduct = baseProduct + "-B";
    } else if (value === "BN2") {
      newProduct = baseProduct + "-N";
    }

    setValue("Product", newProduct, {
      shouldDirty: true,
      shouldValidate: true,
    });
    //console.log("Product =>", newProduct);
  };



  // เดิมใช้อันนี้
  const onSelectItem = async (e, name) => {
    //console.log("onSelectItem ", name, " => ", e);
    setValue(name, e);
    e === null ? setError(name, { type: "required" }) : clearErrors(name);
    let [q] = locationList?.filter((x) => x.Id === e?.Id);
    setValue("Qty", q?.Qty);
    //console.log("Qty =>", q?.Qty);  
    setQty(q?.Qty);
    if (name === "Location") {
      setLocation(e == null ? null : e);
      setRemain(q?.Qty ?? 0);
      //console.log("Remain =>", q?.Qty);
      // setTimeout(() => QtyRef.current?.focus?.(), 0);
    }
  };


  // const onSelectItem = (e, name) => {
  //   setValue(name, e ?? null, { shouldValidate: true, shouldDirty: true });
  //   e == null ? setError(name, { type: "required" }) : clearErrors(name);

  //   if (name === "Location") {
  //     setLocation(e ?? null);

  //     const q = locationList?.find(x => x.Id === e?.Id);
  //     setRemain(q?.Qty ?? 0);            // ✅ คงเหลือ
  //     setValue("Qty", "", { shouldValidate: true }); // ✅ ให้ user กรอกเอง
  //     // setTimeout(() => setFocus("Qty"), 50);
  //   }
  // };




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
            <FormTitle title={"ADD NEW"} home={"Issue"} />
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                e.preventDefault(); // กัน Enter submit form
              }
            }}
              autoComplete="off" className="space-y-3">
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
                error={errors.Product}
                required
              />
              {/* <div className=" mt-3 mb-2">
                <div className="flex">
                  <h4 className="mr-5">B & N</h4>
                  <label className="custom-radio">
                    <input
                      name="IsBN"
                      type="radio"
                      value="BN1"
                      required
                      checked={isBN === "BN1"}
                      onChange={handleBNChange}
                    />
                    <span></span>
                    <span>B</span>
                  </label>

                  <label className="custom-radio ml-4">
                    <input
                      name="IsBN"
                      type="radio"
                      value="BN2"
                      checked={isBN === "BN2"}
                      onChange={handleBNChange}
                    />
                    <span></span>
                    <span>N</span>
                  </label>
                </div>
              </div> */}
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
                max={Number(qty)}
                min={1}
              />

              <div className="pt-3 flex justify-center gap-2">
                {/* {Number(qty) > 0 &&( */}
                {canSave && (
                  <button type="submit" className="btn btn_primary uppercase">
                    บันทึกข้อมูล
                  </button>
                )}
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

export default IssueForm
