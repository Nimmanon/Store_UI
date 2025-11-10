import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../../components/FormInput";
import { useState } from "react";
import AttachmentForm from "../../attachment/AttachmentForm";

const CompanyForm = ({ data, action, dataList, onExists }) => {
  const [name, setName] = useState();
  const [exists, setExists] = useState(false);

  const [file, setFile] = useState();
  const [uploadFile, setUploadFile] = useState();

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
      Logo: "",
    },
  });

  useEffect(() => {
    if (action === "add") {
      reset({
        Id: 0,
        Name: "",
        Logo: "",
      });
    }
    setFile();
  }, []);

  useEffect(() => {
    if (data === undefined || data === null) return;
    //console.log("company data => ",data);

    setValue("Id", data?.Id);
    setValue("Name", data?.Name);
    //setValue("Logo", data?.Logo);

    if (data?.Logo !== null && data?.Logo !== "") {
      let f = {};
      f.Id = data?.Id;
      f.Name = data?.Logo;
      setFile(f);
      setValue("Logo", f);
    }
  }, [data]);

  useEffect(() => {
    if (name === undefined || name === "" || dataList?.length === 0) return;
    let exists = dataList?.some(
      (x) => x.Name.toUpperCase() === name?.toUpperCase()
    );

    setExists(exists);
    onExists(exists);
  }, [name]);

  const handleFileSelected = (item) => {
    setValue("Logo", item);   
  };

  return (
    <div className="p-3">
      <div className="mt-5">
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
        {exists && (
          <small className="block mt-2 invalid-feedback">
            This name already exists !!!!
          </small>
        )}
      </div>
      <div className="mt-5">
        <label>Logo</label>
        <AttachmentForm
          data={file}
          onFileSelect={handleFileSelected}
          maxImage={1}
          multiple={false}
          showCard={false}
        />
      </div>
    </div>
  );
};

export default CompanyForm;
