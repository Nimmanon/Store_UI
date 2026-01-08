import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../../components/FormInput";
import { useState } from "react";
import Select from "../../../components/Select";
import APIService from "../../../services/APIService";
import { useSelector } from "react-redux";

export const OrganizeForm = ({ data, action, dataList, onExists }) => {
  const [locationList, setLocationList] = useState([]);
  const [name, setName] = useState();
  const [location, setLocation] = useState();
  const [exists, setExists] = useState(false);  

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
      Location: null,
    },
  });

  useEffect(() => {
    getLocation();
    setInitial();
    if (action === "add") {
      reset({
        Id: 0,
        Name: "",
        Location: null,
      });
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  const getLocation = () => {
    APIService.getAll("Location/Get")
      .then((res) => {
        setLocationList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setValue("Id", data?.Id);
    setValue("Name", data?.Name);
    setValue("Location", data?.Location);
    setLocation(data?.Location);
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
        </div>
      </div>
    </>
  );
};
