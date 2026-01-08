import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import FormTitle from "../../components/FormTitle";
import AttachmentForm from "../attachment/AttachmentForm";
import { useEffect, useRef, useState } from "react";
import DatePicker from "../../components/DatePicker";
import Modal from "../../components/Modal";
import { IndicatorForm } from "../master/indicator/IndicatorForm";
import Editor from "../../components/Editor";

const ActivityForm = () => {
  const [, setAction] = useOutletContext();

  const [projectList, setProjectList] = useState([]);
  const [organizeList, setOrganizeList] = useState([]);
  const [indicatorList, setIndicatorList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [fileList, setFileList] = useState([]);

  const [date, setDate] = useState();
  const [project, setProject] = useState();
  const [organize, setOrganize] = useState();
  const [indicator, setIndicator] = useState();

  const [description, setDescription] = useState(""); // เก็บค่าจาก Editor
  const [errorEditor, setErrorEditor] = useState(false); // ใช้ตรวจสอบ error

  const [isResetFile, setResetFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //modal
  const [show, setShow] = useState(false);
  const [exists, setExists] = useState(false);

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const [userGroup, setUserGroup] = useState();
  const [userOrganize, setUserOrganize] = useState();

  const effectRan = useRef(false);
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    reset,
    setValue,
    setError,
    getValues,
    handleSubmit,
    clearErrors,
  } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    if (effectRan.current === false) {
      reset();
      getIndicator();
      getUnit();
      setAction("new");
      setInitial();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
    setUserGroup(JSON.parse(auth.Group));
    setUserOrganize(JSON.parse(auth.Organize));
  };

  useEffect(() => {
    if (userOrganize) {
      getProjectByOrganize(userOrganize?.Id);
      setOrganize(userOrganize);
    } else {
      getOrganize();
    }
  }, [userOrganize]);

  const getOrganize = () => {
    APIService.getAll("Organize/Get")
      .then((res) => {
        setOrganizeList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getProjectByOrganize = (id) => {
    if (id === 0 || id === undefined) {
      setProjectList([]);
      setProject(null);
    } else {
      setProjectList([]);
      setProject(null);
      APIService.getById("Project/GetByOrganize", id)
        .then((res) => {
          setProjectList(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const getIndicator = () => {
    APIService.getAll("Indicator/Get")
      .then((res) => {
        setIndicatorList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getUnit = () => {
    APIService.getAll("Unit/Get")
      .then((res) => {
        setUnitList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val === null ? setError(name, { type: "required" }) : clearErrors(name);

    switch (name?.toLowerCase()) {
      case "project":
        setProject(val);
        break;
      case "organize":
        setOrganize(val);
        getProjectByOrganize(val?.Id);
        break;
      case "indicator":
        let [ind] = indicatorList?.filter((x) => x.Id === val?.Id);
        setIndicator(ind);
        break;
    }
  };

  const onSubmit = (value) => {
    //console.log("save data => ", value);

    if (!value.Description?.trim()) {
      // เช็คว่ามีข้อความจริงๆ หรือไม่
      setErrorEditor(true);
      return;
    }
    setErrorEditor(false);

    if (isSubmitting) return; // ป้องกันการส่งซ้ำ
    setIsSubmitting(true);

    value.Organize = organize;
    value.Details = fileList;
    value.InputBy = Number(userId);
    handleSaveClick(value);
  };

  const handleSaveClick = (data) => {
    //console.log("save data => ", data);
    APIService.Post("Activity/Post", data)
      .then((res) => {
        if (res.status !== 200) return;
        setIsSubmitting(false);
        handleBackClick();
      })
      .catch((err) => {
        console.log(err);
        setIsSubmitting(false);
      });
  };

  const handleClearClick = () => {
    reset();
    clearErrors();
    setResetFile(true);
  };

  const handleFileSelected = (items) => {
    setFileList(items);
    setValue("Details", items);
  };

  const handleBackClick = () => {
    navigate("/activity");
    setAction("list");
  };

  const handleIndicatorAddClick = () => {
    setShow(true);
  };

  const handleIndicatorSaveChange = (newItem) => {
    if (exists) return;
    newItem.InputBy = userId;
    APIService.Post("Indicator/Post", newItem)
      .then((res) => {
        if (res.status !== 200) return;
        setIndicatorList((prevItem) => {
          return [res.data, ...prevItem];
        });
        setShow(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <FormTitle home={"Activity"} title={"Add New"} />
      <div className="grid xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-2 gap-3 mt-3">
        
          <div className="xl:col-span-3 lg:col-span-3 md:grid-cols-1">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="card p-3">
              <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-1">
                <div className="mt-5">
                  <Select
                    list={organizeList}
                    onSelectItem={onSelectItem}
                    setValue={organize}
                    name="Organize"
                    label="องค์กร"
                    register={register}
                    type="text"
                    required
                    error={errors.Organize}
                    disable={
                      userOrganize && userGroup?.Name !== "admin" ? true : false
                    }
                  />
                </div>
                <div className="mt-5">
                  <Select
                    list={projectList}
                    onSelectItem={onSelectItem}
                    setValue={project}
                    name="Project"
                    label="โครงการ"
                    register={register}
                    type="text"
                    required
                    error={errors.Project}
                  />
                </div>
                <div>
                  <DatePicker
                    name="Date"
                    label="Date"
                    onChange={(date) => {
                      setDate(date);
                      setValue("Date", date);
                    }}
                    placeholder="Date"
                    format="d MMM yyyy"
                    value={date || ""}
                    required
                    error={errors?.Date}
                  />
                </div>
                <div>
                  <FormInput
                    name="Writer"
                    label="ผู้เขียน"
                    placeholder=""
                    register={register}
                    type="text"
                    required
                    error={errors.Writer}
                  />
                </div>
                <div className="mt-5">
                  <FormInput
                    name="Subject"
                    label="ชื่อกิจกรรม"
                    placeholder=""
                    register={register}
                    type="text"
                    required
                    error={errors.Subject}
                  />
                </div>
                <div className="mt-5">
                  <FormInput
                    name="Reference"
                    label="ลิงค์วิดีโอ (ถ้ามี)"
                    placeholder=""
                    register={register}
                    type="text"
                  />
                </div>
                <div className="xl:col-span-2 lg:col-span-2 md:grid-cols-1 mt-5">
                  <Editor
                    name="Description"
                    label="รายละเอียด"
                    onChange={(val) => {
                      setDescription(val); // อัปเดต state
                      setValue("Description", val); // อัปเดตค่าในฟอร์ม
                      setErrorEditor(false);
                    }}
                    required
                    error={errorEditor}
                    value={description} // ใช้ค่าจาก state แทน
                  />
                </div>
                <div className="mt-5">
                  <div className="flex items-end space-x-2 gap-1">
                    <div className="flex flex-col w-full">
                      <Select
                        list={indicatorList}
                        onSelectItem={onSelectItem}
                        setValue={indicator}
                        name="Indicator"
                        label="ตัวชี้วัดด้านผลลัพธ์"
                        register={register}
                        type="text"
                        required
                        error={errors.Indicator}
                        className="flex-grow"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn_info py-2 px-4 rounded flex items-center justify-center self-end"
                      style={{ marginTop: "1.3rem" }}
                      onClick={handleIndicatorAddClick}
                    >
                      <span className="la la-plus text-xl leading-none"></span>
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <FormInput
                    name="Quantity"
                    label={
                      "จำนวน" +
                      (!indicator ? "" : "(" + indicator?.Unit?.Name + ")")
                    }
                    placeholder=""
                    register={register}
                    type="number"
                    required
                    error={errors.Quantity}
                  />
                </div>
              </div>
            </div>
            <div className="flex mt-2 gap-1">
              <button
                type="submit"
                className="btn btn_info uppercase "
                onClick={handleBackClick}
              >
                <span className="la la-chevron-circle-left text-xl leading-none mr-1"></span>
                GO BACK
              </button>

              <button
                type="submit"
                className="btn btn_primary uppercase"
                disabled={isSubmitting}
              >
                <span
                  className={`la ${
                    isSubmitting ? "la-spinner la-spin" : "la-save"
                  } text-xl leading-none mr-1`}
                ></span>
                {isSubmitting ? "Saving data..." : "Save Data"}
              </button>

              <button
                type="button"
                className="btn btn_outlined btn_secondary uppercase"
                onClick={handleClearClick}
              >
                <span className="la la-eraser text-xl leading-none mr-1"></span>
                Clear Form
              </button>
            </div>
            </form>
          </div>
       
        <div className="xl:col-span-2 lg:col-span-2 md:grid-cols-1 gap-1">
          <div className="">
            <AttachmentForm
              showDesc={true}
              isReset={isResetFile}
              onFileSelect={handleFileSelected}
              format="row"
              maxImage={20}
            />
          </div>
        </div>
      </div>

      <Modal
        show={show}
        onCancelClick={() => setShow(false)}
        onSaveChange={handleIndicatorSaveChange}
        action={"add"}
        name={"Indicator"}
        size={"xl"}
        form={
          <IndicatorForm
            data={indicatorList}
            onExists={(val) => setExists(val)}
          />
        }
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
  );
};

export default ActivityForm;
