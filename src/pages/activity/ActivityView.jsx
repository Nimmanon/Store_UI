import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FormTitle from "../../components/FormTitle";
import { useSelector } from "react-redux";
import AttachmentForm from "../attachment/AttachmentForm";
import Select from "../../components/Select";
import DatePicker from "../../components/DatePicker";
import FormInput from "../../components/FormInput";
import Modal from "../../components/Modal";
import { IndicatorForm } from "../master/indicator/IndicatorForm";
import Editor from "../../components/Editor";

const ActivityView = () => {
  const [setDataSelected, setAction] = useOutletContext();

  const [data, setData] = useState();
  const [projectList, setProjectList] = useState([]);
  const [organizeList, setOrganizeList] = useState([]);
  const [indicatorList, setIndicatorList] = useState([]);
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
  const [content, setContent] = useState({ Id: 0, Name: "" });
  const [exists, setExists] = useState(false);

  const effectRan = useRef(false);
  const navigate = useNavigate();
  let params = useParams();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const [userGroup, setUserGroup] = useState();
  const [userOrganize, setUserOrganize] = useState();

  const {
    register,
    formState: { errors },
    reset,
    getValues,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    if (effectRan.current === false) {
      setInitial();
      getData();
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

  const getData = () => {
    if (params.id === undefined || params.id === null || params.id === 0)
      return;

    APIService.getById("Activity/GetById", params.id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (data === undefined || data === null) return;
    setValueObject(data);
  }, [data]);

  const setValueObject = async (data) => {
    if (data === undefined) return;
    //console.log("Activity data =>", data);

    let proj = data?.Project;
    let org = data?.Organize;

    setValue("Id", data?.Id);
    setValue("Organize", org);
    setValue("Project", proj);
    setValue("Date", data?.Date);
    setDate(new Date(data?.Date));
    setValue("Writer", data?.Writer);
    setValue("Subject", data?.Subject);
    setValue("Description", data?.Description);
    setValue("Indicator", data?.Indicator);
    setValue("Quantity", data?.Quantity);
    setValue("Reference", data?.Reference);

    getProjectByOrganize(organize?.Id);
    getIndicator();

    setProject(proj);
    setOrganize(org);
    setIndicator(data?.Indicator);
    setDescription(data?.Description);

    data?.ActivityDetails?.forEach((x) => {
      x.Name = x.Resource;
    });
    setFileList(data?.ActivityDetails);
  };

  const clearForm = () => {
    navigate("/activity");
    setDataSelected();
    setAction("list");
  };

  const handleBackClick = () => {
    clearForm();
  };

  const handleFileSelected = (items) => {
    setFileList(items);
    setValue("Files", items);
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
        break;
      case "indicator":
        let [ind] = indicatorList?.filter((x) => x.Id === val?.Id);
        setIndicator(ind);
        break;
    }
  };

  const onSubmit = (value) => {
    //console.log("update data => ", value);

    if (!value.Description.trim()) {
      // เช็คว่ามีข้อความใน editor หรือไม่
      setErrorEditor(true);
      return;
    }
    setErrorEditor(false);

    if (isSubmitting) return; // ป้องกันการส่งซ้ำ
    setIsSubmitting(true);

    value.Organize = organize;
    value.Details = fileList;
    value.InputBy = Number(userId);
    handleUpdateClick(value);
  };

  const handleUpdateClick = (data) => {
    APIService.Put("Activity/Put", data)
      .then((res) => {
        if (res.status !== 200) return;
        setIsSubmitting(false);
        handleBackClick();
      })
      .catch((err) => {
        console.log(err);
        setShow(true);
        setContent({ Name: err?.response.data });
        setIsSubmitting(false);
      });
  };

  const handleClearClick = () => {
    reset();
    clearErrors();
    setResetFile(true);
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
      <FormTitle home={"Activity"} title={"Update"} />
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
                {isSubmitting ? "Updating data..." : "Update Data"}
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
              data={fileList}
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

export default ActivityView;
