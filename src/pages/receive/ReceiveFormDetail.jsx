import React, { useState } from 'react'
import FormInput from '../../components/FormInput';
import { useForm } from 'react-hook-form';

const ReceiveFormDetail = ({ onAddClick, }) => {

    const [productcode, setProductCode] = useState("");

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
            ProductCode: "",
            Location: null,
        },
    });

    const handleAddClick = () => {        
        var data = {};
        data.ProductCode = productcode;
        // data.WeightBefore = Number(weightBefore);
        // data.WeightAfter = Number(weightAfter);
        // data.Quantity = Number(quantity);
        // data.UnitPrice = Number(unitPrice);
        // data.Total = Number(total);
        onAddClick(data);
        //console.log("data =>", data);
        console.log("handleAddClick");
        //clearForm();
        // setDisable(true);
    };

    // const handleClearClick = () => {
    //     //console.log("handleClearClick");
    //     reset();
    //     setLocation(null);
    //     // ensure RHF values are cleared for controlled selects
    //     setValue("Location", null);
    // };

    return (
        <>
            <div className="grid lg:grid-cols-3 gap-2 card p-2">
                <div className="flex">
                    <div className="w-5/6">
                        <FormInput
                            name="ProductCode"
                            label="ProductCode"
                            register={register}
                            setValue={productcode}  
                        // type="text"
                        // inputRef={employeeRef}
                        // inputMode="none"
                        // onKeyDown={(e) => {
                        //     handleEmployeeScan(e);
                        // }}
                        // onChange={(e) => {
                        //     setEmployeeCode(e.target.value);
                        // }}
                        // error={errors.EmployeeCode}
                        // required
                        />
                    </div>
                    <div className="ml-2">
                        <FormInput
                            name="Quantity"
                            label="จำนวน"
                            // placeholder=""
                            register={register}
                            setValue={productcode}
                        // type="text"
                        // required
                        // error={errors.Quantity}
                        // showErrMsg={false}
                        // //onChange={(e) => setQuantity(e.target.value)}
                        // readonly={true}
                        // value={
                        //     quantity?.toLocaleString(undefined, {
                        //         minimumFractionDigits: 2,
                        //         maximumFractionDigits: 2,
                        //     }) || ""
                        // }
                        />
                    </div>
                </div>
                <div className="mt-3">

                    <button
                        type="button"
                        className="btn btn btn_primary uppercase mt-2 "
                        onClick={handleAddClick}
                    >
                        เพิ่มรายการ
                    </button>
                </div>
            </div>
        </>
    )
}

export default ReceiveFormDetail
