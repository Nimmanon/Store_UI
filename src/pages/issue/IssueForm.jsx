<<<<<<< HEAD
import { useEffect, useRef } from "react";
import { set, useFormContext } from "react-hook-form";
import { useState } from "react";
import FormInput from "../../components/FormInput";
import APIService from "../../services/APIService";
import Select from "../../components/Select";

const IssueForm = ({ data, action, dataList, onExists }) => {
    const [employeecode, setEmployeeCode] = useState();
    const [product, setProduct] = useState();
    const [location, setLocation] = useState();
    const [qty, setQty] = useState();
    const [onhand, setOnhand] = useState();
    const [locationList, setLocationList] = useState([]);
=======
import React, { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import FormTitle from "../../components/FormTitle";
import APIService from "../../services/APIService";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";

const IssueForm = ({ showButton = true }) => {
    const [showErrMsg, setShowErrMsg] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [stockList, setStockList] = useState([]);
    const [groupList, setGroupList] = useState([]);

    const [workorder, setWorkOrder] = useState();
    const [employeecode, setEmployeeCode] = useState();
    const [status, setStatus] = useState();
    const [location, setLocation] = useState();
    const [group, setGroup] = useState();
    const [qty, setQty] = useState(0);
    const [remain, setRemain] = useState();
    const [exists, setExists] = useState(false);
    const [issubmit, setIsSubmit] = useState(false);
>>>>>>> 1496d0238286f0535a5a28809f24f3421f218190

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
=======
            WorkOrder: "",
            Location: null,
            Group: null,
            Status: "",
>>>>>>> 1496d0238286f0535a5a28809f24f3421f218190
            Qty: "",
        },
    });

<<<<<<< HEAD
    useEffect(() => {
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
        //console.log("data =>", data);
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

    const getLocation = () => {
        APIService.getAll("Location/Get")
            .then((res) => {
                setLocationList(res.data);
                //console.log(res.data);
=======

    useEffect(() => {
        if (workorder) {
            getStatus(workorder);
        }
    }, [workorder]);



    const getStatus = (workorder) => {
        if (!workorder) return;
        APIService.getById("Issue/GetStatusByWorkOrder", workorder)
            .then((res) => {
                setStatus(res.data);
                setValue("Status", res.data);
                setValue("Qty", res.data?.Remain);
                setStockList(res.data);
                setLocationList(res.data?.map(x => x.Location));
                console.log("getLocation =>", res.data?.map(x => x.Location));
                setGroup(res.data?.map(x => x.Group));
>>>>>>> 1496d0238286f0535a5a28809f24f3421f218190
            })
            .catch((err) => console.log(err));

<<<<<<< HEAD
    };

    const onSelectItem = (val, name) => {
        setValue(name, val == null ? null : val);
        val == null ? setError(name, { type: "required" }) : clearErrors(name);
        // console.log("val =>", val);
        getStockOnHand(val);
=======
    const handleSaveClick = (newItem) => {
        setIsSubmit(true);
        newItem.WorkOrder = Number(newItem.WorkOrder);
        newItem.Qty = Number(newItem.Qty);
        // console.log("handledSaveChange Issue =>", newItem);
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

    const handleShowErrMsg = (value) => {
        setShowErrMsg(value);
    };

    const handleBackClick = () => {
        navigate("/issue");
        // setAction("list");
    };

    const handleClearClick = () => {
        //console.log("handleClearClick");
        reset();
        setLocation(null);
        setGroup(null);
        clearErrors();
>>>>>>> 1496d0238286f0535a5a28809f24f3421f218190
    };


    const getStockOnHand = (location) => {
        APIService.getAll("Stock/GetOnHand/" + product + "/" + location.Id)
            .then((res) => {

                console.log("geyById =>", res.data);
                setValue("Qty", res.data);
                setOnhand(res.data);
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

        switch (name?.toLowerCase()) {
            case "location":
                setGroupList(stockList?.filter(x => x.Location?.Id === val?.Id).map(x => x.Group));
                setLocation(val);

                break;
            case "group":
                let [stock] = stockList?.filter(x => x.Location?.Id === location?.Id && x.Group?.Id === val?.Id);
                //console.log("stock =>", stock);
                setStatus(stock.Status);
                setValue("Status", stock.Status);
                setValue("StatusName", stock.Status.Name);
                setValue("Qty", stock.Remain);
                setQty(stock.Remain);
                setRemain(stock.Remain);
                break;
        }
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
                max={Number(onhand)}
                min={1}
            />
        </div>
=======
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="card p-8 w-full max-w-2xl mx-4 shadow-lg rounded-2xl">
                        <FormTitle title={"ADD NEW"} home={"Issue"} />
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
                                    setWorkOrder(e.target.value); // trigger useEffect
                                }}
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

                            <Select
                                list={groupList}
                                onSelectItem={onSelectItem}
                                setValue={group}
                                name="Group"
                                label="Group"
                                register={register}
                                type="text"
                                required
                                error={errors.Group}
                            />

                            <FormInput
                                name="StatusName"
                                label="Status"
                                readOnly
                                register={register}
                                //value={status?.Name || ""}
                                readonly={true}
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
                                max={Number(remain)}
                                min={1}
                            />
>>>>>>> 1496d0238286f0535a5a28809f24f3421f218190

                            <div className="pt-3 flex justify-center gap-2">
                                {Number(qty) > 0 && (
                                    <button type="submit" className="btn btn_primary uppercase" disabled={issubmit}>
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
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default IssueForm
