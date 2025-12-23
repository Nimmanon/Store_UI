import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import APIService from "../../services/APIService";
import Panel from "../../components/Panel";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";

const IssueList = () => {

  //table
  const [dataList, setDataList] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //modal
  const [show, setShow] = useState(false);
  const [content, setContent] = useState({ Id: 0, Name: "" });
  const [action, setAction] = useState("");
  const [exists, setExists] = useState(false);
  // const [isSaving, setIsSaving] = useState(false);

  //from
  const [dataselected, setDataSelected] = useState();
  const [search, setSearch] = useState();

  const effectRan = useRef(false);

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const navigate = useNavigate();

  const columnTable = [

    {
      label: "Employee Code",
      key: "EmployeeCode",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Product",
      key: "Product",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Location",
      key: "Location",
      align: "left",
      format: "string",
      type: "object",
      sort: "Name",
      export: true,
    },

    // {
    //     label: "Group",
    //     key: "Group",
    //     align: "left",
    //     format: "string",
    //     type: "object",
    //     sort: "Name",
    //     export: true,
    // },
    // {
    //     label: "Status",
    //     key: "Status",
    //     align: "left",
    //     format: "string",
    //     type: "object",
    //     sort: "Name",
    //     export: true,
    // },
    {
      label: "Qty",
      key: "Qty",
      align: "left",
      format: "string",
      export: true,
    },

    {
      label: "Receive Date",
      key: "InputDate",
      align: "left",
      format: "shotdatetime",
      export: true,
    },
    // {
    //   label: "",
    //   key: "button",
    //   align: "center",
    //   format: "",
    //   action: [
    //     { event: "view", display: true },
    //     // { event: "print", display: "IsActive" }, // ตรวจสอบค่า IsActive
    //   ],
    // },
  ];

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  const addNew = () => {
    navigate("/issue/new");
    setAction("new");
  };

  useEffect(() => {
    if (effectRan.current == false) {
      document.title = "Issue";
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
    APIService.getAll("Issue/Get")
      .then((res) => {
        setDataList(res.data);
        setIsLoading(false);
        //console.log("Issue Get = >", res.data);
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


  const buttonTableClick = (action, value) => {
    if (!action) return;

    setShow(true);
    setContent({ Id: value.Id, Name: value.Name });
    setDataSelected(value);
    setAction(action);
  };

  const handledSaveChange = (newItem) => {
    console.log("handledSaveChange Issue =>", newItem);
    newItem.WorkOrder = Number(newItem.WorkOrder);
    newItem.Qty = Number(newItem.Qty);
    if (exists) return;
    APIService.Post("Issue/Post", newItem)
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
    APIService.Put("Issue/Put", newItem)
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
    var credential = { Id: content.Id };
    APIService.Post("Issue/Delete", credential)
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
        name={"Receive"}
        page={"Receive"}
        home={"Master"}
        title={"Receive"}
        showBreadcrumb={false}
      />

      <Table
        data={dataTable}
        column={columnTable}
        actionClick={buttonTableClick}
        tableStyle={"list"}
        isLoading={isLoading}
        showPagging={true}
      />
    </>

  )
}

export default IssueList
