import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../../components/FormInput";
import { useState } from "react";
import Select from "../../../components/Select";
import APIService from "../../../services/APIService";
import { useSelector } from "react-redux";

export const IndicatorForm = ({ data, action, dataList, onExists }) => {
  const [unitList, setUnitList] = useState([]);
  const [name, setName] = useState();
  const [unit, setUnit] = useState();
  const [exists, setExists] = useState(false);

  //modal
  const [showUnit, setShowUnit] = useState(false);
  const [unitExists, setUnitExists] = useState(false);
  const [unitName, setUnitName] = useState();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

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
      Unit: null,
    },
  });

  useEffect(() => {
    getUnit();
    setInitial();
    if (action === "add") {
      reset({
        Id: 0,
        Name: "",
        Unit: null,
      });
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  const getUnit = () => {
    APIService.getAll("Unit/Get")
      .then((res) => {
        setUnitList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setValue("Id", data?.Id);
    setValue("Name", data?.Name);
    setValue("Unit", data?.Unit);
    setUnit(data?.Unit);
  }, [data]);

  useEffect(() => {
    if (name === undefined || name === "" || dataList?.length === 0) return;
    let exists = dataList?.some(
      (x) => x.Name.toUpperCase() === name?.toUpperCase()
    );

    setExists(exists);
    onExists(exists);
  }, [name]);

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val == null ? setError(name, { type: "required" }) : clearErrors(name);
  };

  const handleUnitSaveChange = () => {
    if (unitExists) return;

    let newItem = {};
    newItem.Name = unitName;
    newItem.InputBy = userId;
    APIService.Post("Unit/Post", newItem)
      .then((res) => {
        if (res.status !== 200) return;
        setUnitList((prevItem) => {
          return [res.data, ...prevItem];
        });
        setShowUnit(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (unitName === undefined || unitName === "" || unitList?.length === 0) return;
    let exists = unitList?.some(
      (x) => x.Name.toUpperCase() === unitName?.toUpperCase()
    );

    setUnitExists(exists);    
  }, [unitName]);

  return (
    <>
      <div className="p-3">
        <div>
          <FormInput
            name="Name"
            label="Name"
            placeholder=""
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
          {!showUnit && (
            <div className="flex items-end space-x-2 gap-1">
              <div className="flex flex-col w-full">
                <Select
                  list={unitList}
                  onSelectItem={onSelectItem}
                  setValue={unit}
                  name="Unit"
                  label="Unit"
                  register={register}
                  type="text"
                  required
                  error={errors.Unit}
                />
              </div>
              <button
                type="button"
                className="btn btn_info py-2 px-4 rounded flex items-center justify-center self-end"
                style={{ marginTop: "1.2rem" }}
                onClick={() => setShowUnit(true)}
              >
                <span className="la la-plus text-xl leading-none"></span>
              </button>
            </div>
          )}
          {showUnit && (
            <>
              <div className="flex items-end space-x-2 gap-1">
                <div className="flex flex-col w-full">
                  <FormInput
                    name="Unit"
                    label="Add New Unit"
                    placeholder=""
                    register={register}
                    type="text"
                    required
                    error={errors.Unit}                    
                    onChange={(e) => {
                      setUnitName(e.target.value);
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn_info py-2 px-4 rounded flex items-center justify-center self-end"
                  style={{ marginTop: "1.2rem" }}
                  onClick={handleUnitSaveChange}
                >
                  <span className="la la-save text-xl leading-none"></span>
                </button>
              </div>
              {unitExists && (
                <small className="block mt-2 invalid-feedback">
                  This name already exists !!!!
                </small>
              )}
            </>
          )}
        </div>
      </div>      
    </>
  );
};
