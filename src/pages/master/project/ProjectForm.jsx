import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../../components/FormInput";
import { useState } from "react";
import Textarea from "../../../components/Textarea";
import Select from "../../../components/Select";
import APIService from "../../../services/APIService";

const ProjectForm = ({ data, action, dataList, onExists }) => {
  const [boiList, setBoiList] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  const [name, setName] = useState();
  const [boi, setBoi] = useState();
  const [company, setCompany] = useState();
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
    },
  });

  useEffect(() => {
    if (action === "add") {
      reset({
        Id: 0,
        Name: "",
      });
    }

    getBoi();
    getCompany();
  }, []);

  const getBoi = () => {
    APIService.getAll("BOI/Get")
      .then((res) => {
        setBoiList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getCompany = () => {
    APIService.getAll("Company/Get")
      .then((res) => {
        setCompanyList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (data === undefined) return;

    setValue("Id", data?.Id);
    setValue("BOI", data?.BOI);
    setValue("Company", data?.Company);
    setValue("Name", data?.Name);
    setValue("Budget", data?.Budget);
    setValue("Justification", data?.Justification);

    setBoi(data?.BOI);
    setCompany(data?.Company);
  }, [data]);

  useEffect(() => {
    if (name === undefined || name === "" || dataList?.length === 0) return;
    let exists = dataList?.some(
      (x) => x.Name.toUpperCase() === name?.toUpperCase()
    );

    setExists(exists);
    onExists(exists);
  }, [name]);

  const onSelectItem = (e, name) => {
    setValue(name, e == null ? null : e);
    e == null ? setError(name, { type: "required" }) : clearErrors(name);
  };

  return (
    <div className="p-3 mb-10">
      <div>
        <Select
          list={boiList}
          onSelectItem={onSelectItem}
          name="BOI"
          label="BOI"
          register={register}
          type="text"
          multi={false}
          setValue={boi}
          required
          error={errors.BOI}   
        />
      </div>
      <div className="mt-5">
        <Select
          list={companyList}
          onSelectItem={onSelectItem}
          name="Company"
          label="บริษัท"
          register={register}
          type="text"
          multi={false}
          setValue={company}
          required
          error={errors.Company}      
        />
      </div>
      <div className="mt-5">
        <FormInput
          name="Name"
          label="ชื่อโครงการ"
          placeholder=""
          register={register}
          type="text"
          required
          error={errors.Name}        
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="mt-5">
        <FormInput
          name="Budget"
          label="มูลค่าโครงการ"
          placeholder=""
          register={register}
          type="number"
          required
          error={errors.Budget}       
        />
      </div>
      <div className="mt-5">
        <Textarea
          name="Justification"
          label="เหตุผล/ความจำเป็น"
          placeholder=""
          register={register}
          type="text"
        />
      </div>

      {exists && (
        <small className="block mt-2 invalid-feedback">
          This name already exists !!!!
        </small>
      )}
    </div>
  );
};

export default ProjectForm;
