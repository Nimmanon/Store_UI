import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../../components/FormInput";
import { useState } from "react";


export const EmployeeForm = ({ data, action, dataList, onExists }) => {
    const [employeecode, setEmployeeCode] = useState();
    const [fistname, setFirstName] = useState();
    const [lastname, setLastName] = useState();
    const [exists, setExists] = useState(false);

    const {
        formState: { errors },
        register,
        reset,
        setError,
        clearErrors,
        setValue,
    } = useFormContext({
        defaultValues: {
            Id: 0,
            EmployeeCode: "",
            FirstName: "",
            LastName: "",
        },
    });

    useEffect(() => {
        if (action === "add") {
            reset({
                Id: 0,
                EmployeeCode: "",
                FirstName: "",
                LastName: "",
            });
        }
    }, []);

    useEffect(() => {
        // console.log("data =>", data);
        setValue("Id", data?.Id);
        setValue("EmployeeCode", data?.EmployeeCode);
        setValue("FirstName", data?.FirstName);
        setValue("LastName", data?.LastName);
    }, [data]);

    useEffect(() => {
        if (name === undefined || name === "" || dataList?.length === 0) return;
        let exists = dataList?.some(
            (x) => x.Name.toUpperCase() === name?.toUpperCase()
        );

        setExists(exists);
        onExists(exists);
    }, [name]);

    return (
        <div className="p-3">
            <FormInput
                name="EmployeeCode"
                label="EmployeeCode"
                register={register}
                type="text"
                required
                error={errors.EmployeeCode}
                onChange={(e) => {
                    setEmployeeCode(e.target.value);
                }}
            />
            <FormInput
                name="FirstName"
                label="FirstName"
                register={register}
                type="text"
                required
                error={errors.FirstName}
                onChange={(e) => {
                    setFirstName(e.target.value);
                }}

            />
            <FormInput
                name="LastName"
                label="LastName"
                register={register}
                type="text"
                required
                error={errors.LastName}
                onChange={(e) => {
                    setLastName(e.target.value);
                }}

            />
            {exists && (
                <small className="block mt-2 invalid-feedback">
                    This name already exists !!!!
                </small>
            )}
        </div>
    );
};
