import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import Table from "../../components/Table";
import loading from "../../../src/assets/image/loading2.gif";
import Select from "../../components/Select";

const ProjectUpload = () => {
  const [, setAction] = useOutletContext();
  const [uploadFile, setUploadFile] = useState([]);
  const [fileName, setFileName] = useState("");
  const [sheetList, setSheetList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [supportList, setSupportList] = useState([]);  
  const [companyList, setCompanyList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [organizeList, setOrganizeList] = useState([]);

  const [company, setCompany] = useState();
  const [project, setProject] = useState();
  const [total, setTotal] = useState(0);
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  //modal
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

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

  //tab
  const [tabActive, setTabActive] = useState("S1");
  const handleActiveTap = (e) => {
    setOrganizeList([]);

    e.preventDefault();
    const tab = e.target.id;
    setTabActive(tab);

    let orgList = dataList?.filter(
      (x) => x.Support?.toLowerCase() === e.target.name?.toLowerCase()
    );
    setOrganizeList(orgList);
    setTabDetailActive(tab + "O1");
  };

  //tab detail
  const [tabDetailActive, setTabDetailActive] = useState("O1");
  const handleActiveTapDetail = (e) => {
    e.preventDefault();
    const tab = e.target.id;
    setTabDetailActive(tab);
  };

  const column = [
    { label: "obj", key: "check", align: "left", format: "", display: true },
    {
      label: "ชื่อแผ่นงาน",
      key: "Name",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "สถานะแปลงข้อมูล",
      key: "IsComplete",
      align: "center",
      format: "status",
      text: "สำเร็จ,ไม่สำเร็จ",
      export: true,
      display: false,
    },
  ];

  const columnProject = [
    {
      label: "ลำดับ",
      key: "No",
      align: "center",
      format: "string",
      export: true,
    },
    {
      label: "รายละเอียด",
      key: "Description",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "จำนวน",
      key: "Qty",
      align: "right",
      format: "number",
      export: true,
    },
    {
      label: "หน่วย",
      key: "Unit",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "ความสำคัญ",
      key: "Importance",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "ประโยชน์ที่จะได้รับ",
      key: "Benefits",
      align: "left",
      format: "string",
      export: true,
    },
  ];

  const columnOrganize = [
    {
      label: "ชื่อหน่วยงาน",
      key: "Organize",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "มูลค่า (บาท)",
      key: "Budget",
      align: "right",
      format: "number",
      digit: 2,
      export: true,
      total: true,
    },
  ];

  useEffect(() => {
    if (effectRan.current === false) {
      reset();
      getCompany();
      setInitial();     
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  const getCompany = () => {
    APIService.getAll("Company/Get")
    .then((res) => {
      setCompanyList(res.data);
    })
    .catch((err) => console.log(err));
  };

  const getProjectByCompany = (id) => {
    if (id === 0 || id === undefined) {
      setProjectList([]);
      setProject(null);
    } else {
      setProjectList([]);
      setProject(null);
      APIService.getById("Project/GetByCompany", id)
        .then((res) => {
          setProjectList(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const onUploadFile = async (event) => {
    setUploadFile(event.target.files);
    clearMessage();
  };

  useEffect(() => {
    if (uploadFile.length === 0) return;
    fileUpload();
  }, [uploadFile]);

  const fileUpload = async () => {
    const data = new FormData();
    data.append("file", uploadFile[0]);

    APIService.Post("Upload/UploadFile", data)
      .then((res) => {
        var file = {
          name:
            uploadFile[0]?.name !== res.data?.FileName
              ? res.data?.FileName
              : uploadFile[0].name,
          type: uploadFile[0].type,
          filetype: uploadFile[0].type.split("/")[1],
        };

        setFile(file);
        setFileName(res.data?.FileName);

        res.data?.Sheets?.forEach((item) => {
          item.Check = false;
          item.IsComplete = null;
        });
        setSheetList(res.data?.Sheets);
      })
      .catch((err) => console.log(err));
  };

  const onSubmit = () => {
    getPreview();
    setValue("File", null);
  };

  const getPreview = async () => {
    let data = {};
    data.FileName = fileName;
    data.Sheets = sheetList.filter((x) => x.Check);

    setIsLoading(true);
    APIService.Post("Upload/Convert", data)
      .then((res) => {
        //console.log("convert data => ", res.data);
        setDataList(res.data?.result);
        setSupportList(res.data?.support);

        const totalAmount = res.data?.result?.reduce(
          (sum, item) => sum + item.Budget,
          0
        );
        setTotal(totalAmount);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (dataList.length === 0) return;

    // Update status in sheetList
    let data = sheetList?.map((s) => {
      let status = dataList?.find((x) => x.Sheet === s.Name)?.IsComplete;
      return { ...s, IsComplete: status };
    });

    setSheetList(data);
  }, [dataList]);

  const handleClearClick = () => {
    clearForm();
    clearMessage();
  };

  const clearForm = () => {
    reset();
    clearErrors();
    setDataList([]);
    setSheetList([]);
    setFile(null);   
    setCompany(null);
    setProject(null);
  };

  const clearMessage = () => {
    setIsComplete(false);
    setMessage("");
  };

  const handleCheckClick = (item) => {
    let data = sheetList?.map((p) =>
      p.Id === item.Id ? { ...p, Check: !item.Check } : { ...p }
    );
    setSheetList(data);
  };

  const handleAllCheckClick = (e) => {
    if (sheetList.length === 0) return;

    sheetList.forEach((item) => {
      setSheetList(sheetList?.filter((x) => x.Id !== item.Id));
      item.Check = e;
      setSheetList((prevItem) => {
        return [...prevItem, item];
      });
    });
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val == null ? setError(name, { type: "required" }) : clearErrors(name);

    switch (name?.toLowerCase()) {      
      case "company":
        setCompany(val);
        getProjectByCompany(val.Id);
        break;
      case "project":
        setProject(val);
        break;
    }

    clearMessage();
  };

  const handleImportClick = () => {
    let data = {};
    data.Project = project;
    data.Details = dataList?.filter((x) => x.IsComplete === true);
    data.InputBy = userId;

    setIsImporting(true);
    APIService.Post("Project/Import", data)
      .then((res) => {
        if (res.status === 200) {
          setIsImporting(false);
          clearForm();
          setMessage("นำเข้าข้อมูลสำเร็จ");
          setIsComplete(true);
        } else {
          setMessage("นำเข้าข้อมูลไม่สำเร็จ");
          setIsComplete(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage("นำเข้าข้อมูลไม่สำเร็จ");
        setIsComplete(false);
      });
  };

  return (
    <>
      <h2 className="mb-2">นำเข้าโครงการ</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-3 gap-2">
          <div className="xl:col-span-2 lg:col-span-2 md:grid-cols-1 gap-1">
            <div className="card p-3">
              {message !== "" && (
                <div
                  className={`border ${
                    isComplete
                      ? "bg-green-100 border-green-400 text-green"
                      : "bg-red-100 border-red-400 text-red"
                  }  px-4 py-2 rounded relative mb-2`}
                >
                  <div className="flex items-center">
                    <div>
                      <span
                        className={`la ${
                          isComplete
                            ? "la-check-circle"
                            : "la-exclamation-triangle"
                        } text-bold text-xl`}
                      />
                    </div>
                    <div className="ml-2">{message}</div>
                  </div>
                </div>
              )}              
              <div className="mt-5">
                <Select
                  list={companyList}
                  onSelectItem={onSelectItem}
                  setValue={company}
                  name="Company"
                  label="บริษัท/มูลนิธิ"
                  register={register}
                  type="text"
                  required
                  error={errors.Company}
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
              <div className="mt-5">
                <label>เลือกไฟล์ *</label>
                <input
                  name="File"
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={onUploadFile}
                />
                <div className="input-container">
                  <input
                    type="text"
                    id="fileName"
                    readOnly
                    placeholder={!file ? "No file chosen" : file?.name}
                  />
                  <label htmlFor="fileInput" className="browse-btn">
                    <span className="la la-folder-open text-xl leading-none"></span>
                    Browse...
                  </label>
                </div>
              </div>
              <div className="mt-2">
                <Table
                  data={sheetList}
                  column={column}
                  tableStyle={"list"}
                  showPagging={false}
                  checkClick={handleCheckClick}
                  allCheckClick={handleAllCheckClick}
                />
              </div>
              <div className="flex mt-2 gap-1">
                {sheetList?.some((s) => s.Check) === true && (
                  <button type="submit" className="btn btn_info uppercase">
                    <span className="la la-sync-alt text-xl leading-none mr-1"></span>
                    แปลงข้อมูล
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn_outlined btn_secondary uppercase"
                  onClick={handleClearClick}
                >
                  <span className="la la-eraser text-xl leading-none mr-1"></span>
                  เคลียร์ข้อมูล
                </button>

                {dataList?.length !== 0 && (
                  <button
                    type="button"
                    className="btn btn_primary uppercase"
                    onClick={handleImportClick}
                    disabled={isImporting}
                  >
                    <span
                      className={`la ${
                        isImporting ? "la-spinner la-spin" : "la-file-upload"
                      } text-xl leading-none mr-1`}
                    ></span>
                    นำเข้าข้อมูล
                  </button>
                )}
              </div>
            </div>
          </div>
          {isLoading && (
            <div className="xl:col-span-6 lg:col-span-6 md:col-span-3 gap-3">
              <div className="card p-3 mt-1">
                <div className="flex justify-center">
                  <img src={loading} alt="loading..." />
                </div>
              </div>
            </div>
          )}

          {dataList?.length !== 0 && (
            <div className=" xl:col-span-4 lg:col-span-4 md:col-span-2 gap-3 ml-1">
              <div className="card p-4">
                <div className="tabs wizard wizard-style-1">
                  <nav className="tab-nav">
                    <button
                      id="S1"
                      className={`nav-link with ${
                        tabActive === "S1" ? "active" : ""
                      }`}
                      onClick={handleActiveTap}
                    >
                      สรุปโครงการ
                    </button>
                    {supportList?.map((item, index) => {
                      let tabid = "S" + (2 + index)?.toString();
                      return (
                        <button
                          key={index}
                          id={tabid}
                          name={item}
                          className={`nav-link with ${
                            tabActive === tabid ? "active" : ""
                          }`}
                          onClick={handleActiveTap}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </nav>

                  <div className="tab-content mt-1">
                    <div
                      id="tab1"
                      className={`collapse_tab ${
                        tabActive === "S1" ? "open" : ""
                      }`}
                    >
                      {/* สรุปโครงการ */}
                      <div className="p-4">
                        <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                          <div>
                            <div className="input-group mt-1">
                              <h4 className="w-40">ชื่อโครงการ</h4>
                              {project?.Name}
                            </div>
                            <div className="input-group mt-1">
                              <h4 className="w-40">มูลค่ารวม (บาท)</h4>
                              {total?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) || ""}
                            </div>
                          </div>
                        </div>
                        <div className="grid xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1">
                          {supportList?.map((item, index) => {
                            let organizeList = dataList?.filter(
                              (x) =>
                                x.Support?.toLowerCase() === item?.toLowerCase()
                            );
                            return (
                              <div key={index}>
                                <h4 className="mt-3">{item}</h4>
                                <div className="p-1">
                                  <Table
                                    data={organizeList}
                                    column={columnOrganize}
                                    tableStyle={"list"}
                                    showPagging={false}
                                    alignTop={true}
                                    showSammary={true}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {dataList?.map((item, index) => {
                      let tabid = "S" + (2 + index)?.toString();
                      return (
                        <div
                          key={index}
                          id={"tab" + tabid}
                          className={`collapse_tab ${
                            tabActive === tabid ? "open" : ""
                          }`}
                        >
                          {/* tab องค์กร */}
                          <div className="p-3">
                            <div className="tabs wizard wizard-style-1">
                              <nav className="tab-nav">
                                {organizeList?.map((org, index) => {
                                  let tabDetailId =
                                    "O" + (index + 1)?.toString();
                                  return (
                                    <button
                                      key={index}
                                      id={tabid + tabDetailId}
                                      className={`nav-link with ${
                                        tabDetailActive === tabid + tabDetailId
                                          ? "active"
                                          : ""
                                      }`}
                                      onClick={handleActiveTapDetail}
                                    >
                                      {org?.Organize}
                                    </button>
                                  );
                                })}
                              </nav>

                              <div className="tab-content mt-1">
                                {organizeList?.map((org, index) => {
                                  let tabDetailId =
                                    "O" + (index + 1)?.toString();
                                  return (
                                    <div
                                      key={index}
                                      id={"tab" + (tabActive + tabDetailId)}
                                      className={`collapse_tab ${
                                        tabDetailActive ===
                                        tabActive + tabDetailId
                                          ? "open"
                                          : ""
                                      }`}
                                    >
                                      <div className="p-3">
                                        <table className="w-full">
                                          <tbody>
                                            <tr>
                                              <td className="w-40 text-left">
                                                <h4>ชื่อองค์กร</h4>
                                              </td>
                                              <td>{org?.Organize}</td>
                                              <td className="w-40 text-left">
                                                <h4>จังหวัด</h4>
                                              </td>
                                              <td>{org?.Location}</td>
                                            </tr>
                                            <tr>
                                              <td className="w-40 text-left">
                                                <h4>สนับสนุน</h4>
                                              </td>
                                              <td>{org?.Support}</td>
                                              <td className="w-40 text-left">
                                                <h4>มูลค่ารวม (บาท)</h4>
                                              </td>
                                              <td>
                                                {org?.Budget?.toLocaleString(
                                                  undefined,
                                                  {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                  }
                                                )}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="w-40 text-left">
                                                <h4>หน่วยงานที่ดูแล</h4>
                                              </td>
                                              <td colSpan={3}>
                                                {org?.Department}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="w-40 text-left align-top">
                                                <h4>เหตุผล/ความจำเป็น</h4>
                                              </td>
                                              <td colSpan={3}>
                                                {org?.Justification}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <div className="mt-2 p-1">
                                          <Table
                                            data={org?.Details}
                                            column={columnProject}
                                            tableStyle={"list"}
                                            showPagging={true}
                                            pageSize={5}
                                            alignTop={true}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default ProjectUpload;
