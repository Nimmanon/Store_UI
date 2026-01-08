import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../../components/FormInput";
import { useState } from "react";
import AttachmentForm from "../../attachment/AttachmentForm";

const SupportForm = ({ data, action, dataList, onExists }) => {
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
      Description: "",
      Resource: "",
    },
  });

  useEffect(() => {
    if (action === "add") {
      reset({
        Name: "",
        Description: "",
        Resource: "",
      });
    }
    setFile();
  }, []);

  useEffect(() => {
    if (data === undefined || data === null) return;
    //console.log("support data => ",data);
    setValue("Id", data?.Id);
    setValue("Name", data?.Name);
    setValue("Description", data?.Description);
    setValue("Resource", data?.Resource);

    if (data?.Resource !== null && data?.Resource !== "") {
      let f = {};
      f.Id = data?.Id;
      f.Name = data?.Resource;
      setFile(f);
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
    setValue("Resource", item);    
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
        <FormInput
          name="Description"
          label="Description"
          register={register}
          type="text"          
        />
      </div>
      <div className="mt-5">
        <label>Resource</label>
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

export default SupportForm;
