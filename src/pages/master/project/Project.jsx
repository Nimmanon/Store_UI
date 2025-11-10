import { useState, useEffect, useRef } from "react";
import Modal from "../../../components/Modal";
import Panel from "../../../components/Panel";
import Table from "../../../components/Table";
import { useSelector } from "react-redux";
import ProjectForm from "./ProjectForm";
import CustomModal from "../../../components/CustomModal";
import ProjectView from "./ProjectView";
import APIService from "../../../services/APIService";

const Project = () => {
  //table
  const [dataList, setDataList] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  

  //modal
  const [show, setShow] = useState(false);
  const [content, setContent] = useState({ Id: 0, Name: "" });
  const [action, setAction] = useState("");
  const [exists, setExists] = useState(false);

  //from
  const [dataselected, setDataSelected] = useState();
  const [search, setSearch] = useState();

  const effectRan = useRef(false);

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

  const columnTable = [
    {
      label: "บัตรส่งเสริม (BOI)",
      key: "BOI",
      align: "left",
      format: "string",
      export: true,
      type: "object",
      sort: "Name",
    },
    {
      label: "บริษัท/มูลนิธิ",
      key: "Company",
      align: "left",
      format: "string",
      export: true,
      type: "object",
      sort: "Name",
    },
    {
      label: "ชื่อโครงการ",
      key: "Name",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "มูลค่าโครงการ (บาท)",
      key: "Budget",
      align: "right",
      format: "number",
      export: true,
    },
    {
      label: "เหตุผล/ความจำเป็น",
      key: "Justification",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "",
      key: "button",
      align: "right",
      format: "",
      action: [
        { event: "edit", display: true },
        { event: "delete", display: true },
        { event: "view", display: true },
      ],
    },
  ];

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  useEffect(() => {
    if (effectRan.current == false) {
      document.title = "Project";
      getData();
      setInitial();
      return () => (effectRan.current = true);
    }
  }, []);

  useEffect(() => {
    getSearch(search);
  }, [dataList]);

  const getData = () => {
    setIsLoading(true);
    APIService.getAll("Project/GetList")
      .then((res) => {
        setDataList(res.data);
        setIsLoading(false);
        // console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getSearch = (textSearch) => {
    if (!textSearch) {
      setDataTable(dataList);
    } else {
      let val = textSearch.toLowerCase();
      let items = dataList.filter(function (data) {
        return JSON.stringify(data).toLowerCase().includes(val);
      });
      setSearch(textSearch);
      setDataTable(items);
    }
  };

  const addNew = () => {
    setAction("add");
    setDataSelected();
    setShow(true);
  };

  const buttonTableClick = (action, value) => {
    if (!action) return;

    setShow(true);
    setContent({ Id: value.Id, Name: value.Name });
    setDataSelected(value);
    setAction(action);
  };

  const handledSaveChange = (newItem) => {
    if (exists) return;
    newItem.InputBy = userId;
    //console.log('handledSaveChange => ',newItem);
    APIService.Post("Project/Post", newItem)
      .then((res) => {
        if (res.status !== 200) return;
        setDataList((prevItem) => {
          return [res.data, ...prevItem];
        });
        handledCancelClick();
      })
      .catch((err) => console.log(err));
  };

  const handledUpdateChange = (newItem) => {
    if (exists) return;
    newItem.InputBy = userId;
    APIService.Put("Project/Put", newItem)
      .then((res) => {
        if (res.status !== 200) return;
        //remove old array
        let items = dataList.filter((item) => item.Id !== content.Id);
        setDataList(items);
        setDataList((prevItem) => {
          return [res.data, ...prevItem];
        });
        handledCancelClick();
      })
      .catch((err) => console.log(err));
  };

  const handledDeleteItem = () => {
    var credential = { Id: content.Id, InputBy: userId };
    APIService.Post("Project/Delete", credential)
      .then((res) => {
        if (res.status !== 200) return;
        //remove array
        let items = dataList.filter((item) => item.Id !== content.Id);
        setDataList(items);
        handledCancelClick();
      })
      .catch((err) => console.log(err));
  };

  const handledCancelClick = () => {
    setShow(false);
    setAction("");
    setDataSelected();
  };

  return (
    <>
      <Panel
        onAddNew={addNew}
        onSearchChange={getSearch}
        showAdd={true}
        showExport={true}
        showSearch={true}
        setViewStyle={"list"}
        data={dataTable}
        headExport={columnTable}
        name={"Project"}
        page={"โครงการ"}
        home={"Masters"}
        title={"โครงการ"}
      />

      <Table
        data={dataTable}
        column={columnTable}
        actionClick={buttonTableClick}
        tableStyle={"list"}
        isLoading={isLoading}
      />

      {show && action === "view" ? (
        <>
          <CustomModal
            show={show}
            handleCancelClick={handledCancelClick}
            action={action}
            name={"Project"}
            size={"full"}
            form={<ProjectView id={dataselected?.Id} />}
          />
          <div className={`${show ? "overlay active" : ""}`}></div>
        </>
      ) : (
        <>
          <Modal
            show={show}
            onCancelClick={handledCancelClick}
            onSaveChange={handledSaveChange}
            onUpdateChange={handledUpdateChange}
            onDeleteItem={handledDeleteItem}
            content={content}
            action={action}
            name={"Project"}
            size={"xl"}
            form={
              <ProjectForm
                data={dataselected}
                action={action}
                dataList={dataList}
                onExists={(val) => setExists(val)}
              />
            }
          />
          <div className={`${show ? "overlay active" : ""}`}></div>
        </>
      )}
    </>
  );
};

export default Project;
