import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import loading from "../../../../src/assets/image/loading2.gif";
import APIService from "../../../services/APIService";

const ProjectView = ({ id }) => {
  const [data, setData] = useState([]);

  const [supportList, setSupportList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [organizeList, setOrganizeList] = useState([]);

  const [project, setProject] = useState();
  const [support, setSupport] = useState();
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

    let [sp] = data?.ProjectSupports?.filter(
      (x) => Number(x.Support.Id) === Number(tab)
    );

    let orgList = sp?.SupportOrganizes;
    setOrganizeList(orgList);
    setTabDetailActive("O1");
  };

  //tab detail
  const [tabDetailActive, setTabDetailActive] = useState("O1");
  const handleActiveTapDetail = (e, item) => {
    e.preventDefault();
    const tab = e.target.id;
    setTabDetailActive(tab);
  };

  const columnObj = [
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
      type: "object",
      sort: "Name",
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
      type: "object",
      sort: "Name",
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
    if (id === undefined) return;
    getById(id);
  }, [id]);

  const getById = () => {
    APIService.getById("Project/GetDetailById", id)
      .then((res) => {
        setData(res.data?.result);
        setSupportList(res.data?.support);
        //console.log("project get by id=>",res.data);
        console.log(res.data?.result);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div>
        {isLoading && (
          <div /*className="xl:col-span-6 lg:col-span-6 md:col-span-3 gap-3"*/>
            <div className="card p-3 mt-1">
              <div className="flex justify-center">
                <img src={loading} alt="loading..." />
              </div>
            </div>
          </div>
        )}

        <div className="p-4">
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
              {supportList?.map((sp, index) => {
                let tabid = "S" + (2 + index)?.toString();
                return (
                  <button
                    key={index}
                    id={sp?.Id}
                    name={sp?.Name}
                    className={`nav-link with ${
                      tabActive === tabid ? "active" : ""
                    }`}
                    onClick={(e) => {
                      handleActiveTap(e);
                      setSupport(sp);
                    }}
                  >
                    {sp?.Name}
                  </button>
                );
              })}
            </nav>

            <div className="tab-content mt-1">
              <div
                id="tab1"
                className={`collapse_tab ${tabActive === "S1" ? "open" : ""}`}
              >
                {/* สรุปโครงการ */}
                <div className="p-4">
                  <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                    <div>
                      <div className="input-group mt-1">
                        <h4 className="w-40">ชื่อโครงการ</h4>
                        {data?.Name}
                      </div>
                      <div className="input-group mt-1">
                        <h4 className="w-40">มูลค่ารวม (บาท)</h4>
                        {data?.Budget?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || ""}
                      </div>
                    </div>
                  </div>
                  <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1">
                    {data?.ProjectSupports?.map((p, index) => {
                      return (
                        <div key={index}>
                          <h4 className="mt-3">{p?.Support?.Name}</h4>
                          <div className="p-1">
                            <Table
                              data={p?.SupportOrganizes}
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

              {tabActive !== "S1" && (
                <div className="p-3">
                  <div className="tabs wizard wizard-style-1">
                    <nav className="tab-nav">
                      {organizeList?.map((org, index) => {
                        let tabDetailId = "O" + (index + 1)?.toString();
                        return (
                          <button
                            key={index}
                            id={tabDetailId}
                            className={`nav-link with ${
                              tabDetailActive === tabDetailId ? "active" : ""
                            }`}
                            onClick={(e) => handleActiveTapDetail(e, org)}
                          >
                            {org?.Organize?.Name}
                          </button>
                        );
                      })}
                    </nav>

                    <div className="tab-content mt-1">
                      {organizeList?.map((org, index) => {
                        let tabDetailId = "O" + (index + 1)?.toString();
                        let objList = org?.Departments[0]?.Objectives;
                        return (
                          <div
                            key={index}
                            id={"tab" + tabDetailId}
                            className={`collapse_tab ${
                              tabDetailActive === tabDetailId ? "open" : ""
                            }`}
                          >
                            <div className="p-3">
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="w-40 text-left">
                                      <h4>ชื่อองค์กร</h4>
                                    </td>
                                    <td>{org?.Organize?.Name}</td>
                                    <td className="w-40 text-left">
                                      <h4>จังหวัด</h4>
                                    </td>
                                    <td>{org?.Organize?.Location?.Name}</td>
                                  </tr>
                                  <tr>
                                    <td className="w-40 text-left">
                                      <h4>สนับสนุน</h4>
                                    </td>
                                    <td>{support?.Name}</td>
                                    <td className="w-40 text-left">
                                      <h4>มูลค่ารวม (บาท)</h4>
                                    </td>
                                    <td>
                                      {org?.Budget?.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="w-40 text-left">
                                      <h4>หน่วยงานที่ดูแล</h4>
                                    </td>
                                    <td colSpan={3}>
                                      {org?.Departments[0].Name}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="w-40 text-left align-top">
                                      <h4>เหตุผล/ความจำเป็น</h4>
                                    </td>
                                    <td colSpan={3}>{org?.Justification}</td>
                                  </tr>
                                </tbody>
                              </table>
                              <div className="mt-2 p-1">
                                <Table
                                  data={objList}
                                  column={columnObj}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectView;
