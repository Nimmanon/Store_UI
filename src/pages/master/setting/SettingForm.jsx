import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../../components/FormInput";
import { useState } from "react";
import Textarea from "../../../components/Textarea";

const SettingForm = ({ data, action }) => {
  const [actual1, setActual1] = useState("A2");
  const [actual2, setActual2] = useState("A2");
  const [actual3, setActual3] = useState("A2");
  const [actual4, setActual4] = useState("A2");
  const [actual5, setActual5] = useState("A2");

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
      Prefix: "",
      Name1: "",
      Name2: "",
      Name3: "",
      Name4: "",
      Name5: "",
      Value1: 0,
      Value2: 0,
      Value3: 0,
      Value4: 0,
      Value5: 0,
      Actual1: null,
      Actual2: null,
      Actual3: null,
      Actual4: null,
      Actual5: null,
      Description: "",
    },
  });

  useEffect(() => {
    if (action === "add") {
      reset({
        Id: 0,
        Prefix: "",
        Name1: "",
        Name2: "",
        Name3: "",
        Name4: "",
        Name5: "",
        Value1: 0,
        Value2: 0,
        Value3: 0,
        Value4: 0,
        Value5: 0,
        Actual1: null,
        Actual2: null,
        Actual3: null,
        Actual4: null,
        Actual5: null,
        Description: "",
      });
    }
  }, []);

  useEffect(() => {
    if (data === undefined || data === null) return;
    // console.log("Setting View data =>", data);

    setValue("Id", data?.Id);
    setValue("Prefix", data?.Prefix);
    setValue("Description", data?.Description);
    setValue("Name1", data?.Name1);
    setValue("Name2", data?.Name2);
    setValue("Name3", data?.Name3);
    setValue("Name4", data?.Name4);
    setValue("Name5", data?.Name5);
    setValue("Value1", data?.Value1);
    setValue("Value2", data?.Value2);
    setValue("Value3", data?.Value3);
    setValue("Value4", data?.Value4);
    setValue("Value5", data?.Value5);
    setActual1(data?.Actual1 === true ? "A1" : "A2");
    setActual2(data?.Actual2 === true ? "A1" : "A2");
    setActual3(data?.Actual3 === true ? "A1" : "A2");
    setActual4(data?.Actual4 === true ? "A1" : "A2");
    setActual5(data?.Actual5 === true ? "A1" : "A2");
  }, [data]);

  return (
    <div>
      <div className="grid lg:grid-cols-4 gap-2">
        <div className="lg:grid-cols-1">
          <div className="mt-1">
            <Textarea
              name="Prefix"
              label="Prefix"
              placeholder=""
              register={register}
              type="text"
              required
              error={errors.Prefix}          
            />
          </div>
          <div className="mt-1">
            <Textarea
              name="Description"
              label="Description"
              placeholder=""
              register={register}
              type="text"
            />
          </div>
        </div>
        <div className="lg:grid-cols-1">
          <div className="mt-1">
            <Textarea
              name="Name1"
              label="Name1"
              placeholder=""
              register={register}
              type="text"
            />
          </div>
          <div className="mt-1">
            <Textarea
              name="Name2"
              label="Name2"
              placeholder=""
              register={register}
              type="text"
            />
          </div>
          <div className="mt-1">
            <Textarea
              name="Name3"
              label="Name3"
              placeholder=""
              register={register}
              type="text"
            />
          </div>
          <div className="mt-1">
            <Textarea
              name="Name4"
              label="Name4"
              placeholder=""
              register={register}
              type="text"
            />
          </div>
          <div className="mt-1">
            <Textarea
              name="Name5"
              label="Name5"
              placeholder=""
              register={register}
              type="text"
            />
          </div>
        </div>

        <div className="lg:grid-cols-1">
          <div className="mt-1">
            <FormInput
              name="Value1"
              label="Value1"
              placeholder=""
              register={register}
              type="number"
            />
          </div>
          <div className="mt-1">
            <FormInput
              name="Value2"
              label="Value2"
              placeholder=""
              register={register}
              type="number"
            />
          </div>
          <div className="mt-1">
            <FormInput
              name="Value3"
              label="Value3"
              placeholder=""
              register={register}
              type="number"
            />
          </div>
          <div className="mt-1">
            <FormInput
              name="Value4"
              label="Value4"
              placeholder=""
              register={register}
              type="number"
            />
          </div>
          <div className="mt-1">
            <FormInput
              name="Value5"
              label="Value5"
              placeholder=""
              register={register}
              type="number"
            />
          </div>
        </div>
        <div className="lg:grid-cols-1">
          {/* Actual1 */}
          <div>
            <label>Actual1</label>
            <div className="card p-2 ">
              <div className="flex">
                <label className="custom-radio">
                  <input
                    name="Actual1"
                    type="radio"
                    value="A1"
                    required
                    checked={actual1 === "A1"}
                    onClick={(e) => setActual1(e.target.value)}
                    onChange={(e) => {
                      setActual1(e.target.value);
                      setValue(
                        "Actual1",
                        e.target.value === "A1" ? true : false
                      );
                    }}
                  />
                  <span></span>
                  <span>YES</span>
                </label>
                <label className="custom-radio ml-5">
                  <input
                    type="radio"
                    name="Actual1"
                    value="A2"
                    required
                    checked={actual1 === "A2"}
                    onClick={(e) => setActual1(e.target.value)}
                    onChange={(e) => {
                      setActual1(e.target.value);
                      setValue(
                        "Actual1",
                        e.target.value === "A1" ? true : false
                      );
                    }}
                  />
                  <span></span>
                  <span>NO</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actual2 */}
          <div className="mt-5">
            <label>Actual2 </label>
            <div className="card p-2">
              <div className="flex">
                <label className="custom-radio">
                  <input
                    name="Actual2"
                    type="radio"
                    value="A1"
                    required
                    checked={actual2 === "A1" ? true : false}
                    onClick={(e) => setActual2(e.target.value)}
                    onChange={(e) => {
                      setActual2(e.target.value);
                      setValue(
                        "Actual2",
                        e.target.value === "A1" ? true : false ? true : false
                      );
                    }}
                  />
                  <span></span>
                  <span>YES</span>
                </label>
                <label className="custom-radio ml-5">
                  <input
                    type="radio"
                    name="Actual2"
                    value="A2"
                    required
                    checked={actual2 === "A2" ? true : false}
                    onClick={(e) => setActual2(e.target.value)}
                    onChange={(e) => {
                      setActual2(e.target.value);
                      setValue(
                        "Actual2",
                        e.target.value === "A1" ? true : false
                      );
                    }}
                  />
                  <span></span>
                  <span>NO</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actual3 */}
          <div className="mt-5">
            <label>Actual3 </label>
            <div className="card p-2">
              <div className="flex">
                <label className="custom-radio">
                  <input
                    name="Actual3"
                    type="radio"
                    value="A1"
                    required
                    checked={actual3 === "A1" ? true : false}
                    onClick={(e) => setActual3(e.target.value)}
                    onChange={(e) => {
                      setActual3(e.target.value);
                      setValue(
                        "Actual3",
                        e.target.value === "A1" ? true : false
                      );
                    }}
                  />
                  <span></span>
                  <span>YES</span>
                </label>
                <label className="custom-radio ml-5">
                  <input
                    type="radio"
                    name="Actual3"
                    value="A2"
                    required
                    checked={actual3 === "A2" ? true : false}
                    onClick={(e) => setActual3(e.target.value)}
                    onChange={(e) => {
                      setActual3(e.target.value);
                      setValue(
                        "Actual3",
                        e.target.value === "A1" ? true : false
                      );
                    }}
                  />
                  <span></span>
                  <span>NO</span>
                </label>
              </div>
            </div>
          </div>

           {/* Actual4 */}
           <div className="mt-5">
            <label>Actual4 </label>
            <div className="card p-2">
              <div className="flex">
                <label className="custom-radio">
                  <input
                    name="Actual4"
                    type="radio"
                    value="A1"
                    required
                    checked={actual4 === "A1" ? true : false}
                    onClick={(e) => setActual4(e.target.value)}
                    onChange={(e) => {
                      setActual4(e.target.value);
                      setValue(
                        "Actual4",
                        e.target.value === "A1" ? true : false
                      );
                    }}
                  />
                  <span></span>
                  <span>YES</span>
                </label>
                <label className="custom-radio ml-5">
                  <input
                    type="radio"
                    name="Actual4"
                    value="A2"
                    required
                    checked={actual4 === "A2" ? true : false}
                    onClick={(e) => setActual4(e.target.value)}
                    onChange={(e) => {
                      setActual4(e.target.value);
                      setValue(
                        "Actual4",
                        e.target.value === "A1" ? true : false
                      );
                    }}
                  />
                  <span></span>
                  <span>NO</span>
                </label>
              </div>
            </div>
          </div>

           {/* Actual5 */}
           <div className="mt-5">
            <label>Actual5 </label>
            <div className="card p-2">
              <div className="flex">
                <label className="custom-radio">
                  <input
                    name="Actual5"
                    type="radio"
                    value="A1"
                    required
                    checked={actual5 === "A1" ? true : false}
                    onClick={(e) => setActual5(e.target.value)}
                    onChange={(e) => {
                      setActual5(e.target.value);
                      setValue(
                        "Actual5",
                        e.target.value === "A1" ? true : false
                      );
                    }}
                  />
                  <span></span>
                  <span>YES</span>
                </label>
                <label className="custom-radio ml-5">
                  <input
                    type="radio"
                    name="Actual5"
                    value="A2"
                    required
                    checked={actual5 === "A2" ? true : false}
                    onClick={(e) => setActual5(e.target.value)}
                    onChange={(e) => {
                      setActual5(e.target.value);
                      setValue(
                        "Actual5",
                        e.target.value === "A1" ? true : false
                      );
                    }}
                  />
                  <span></span>
                  <span>NO</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingForm;
