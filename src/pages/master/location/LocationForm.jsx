import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../../components/FormInput";
import { useState } from "react";

const LocationForm = ({ data, action, dataList, onExists }) => {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
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
      Name: "",
      Description: "",
    },
  });

  useEffect(() => {
    if (action === "add") {
      reset({
        Id: 0,
        Name: "",
        Description: "",
      });
    }
  }, []);

  useEffect(() => {
    console.log("data =>", data);
    setValue("Id", data?.Id);
    setValue("Name", data?.Name);
    setValue("Description", data?.Description);
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
        name="Name"
        label="Name"
        register={register}
        type="text"
        required
        error={errors.Name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <FormInput
        name="Description"
        label="Description"
        register={register}
        type="text"
        onChange={(e) => {
          setDescription(e.target.value);
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

export default LocationForm;
