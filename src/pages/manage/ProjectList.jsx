import { useEffect, useState, useRef } from "react";
import Panel from "../../components/Panel";
import Search from "../../components/Search";
import Table from "../../components/Table";
import APIService from "../../services/APIService";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

const ProjectList = () => {
  const [setDataSelected, setAction, setDataSearch, dataSearch] =
    useOutletContext();

  const [dataList, setDataList] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [search, setSearch] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const effectRan = useRef(false);

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const [group, setGroup] = useState();

  const columnTable = [
    {
      label: "เลขที่แจ้ง",
      key: "DocumentNo",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "วันที่เเจ้ง",
      key: "Date",
      align: "left",
      format: "shotdate",
      export: true,
    },
    {
      label: "ผู้แจ้ง",
      key: "Projector",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "หัวหน้าผู้อนุมัติ",
      key: "Approver",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Service Tag",
      key: "ServiceTag",
      align: "center",
      format: "string",
      export: true,
    },
    {
      label: "สถานที่",
      key: "Location",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "เบอร์ติดต่อ",
      key: "Tel",
      align: "center",
      format: "string",
      export: true,
    },
    {
      label: "เรื่อง",
      key: "Subject",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "หมายเหตุ",
      key: "Remark",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "เหตุผลยกเลิก",
      key: "Reason",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "สถานะ",
      key: "Status",
      align: "left",
      //format: "tag",
      format: "progress",
      type: "object",
      sort: "Name",
      export: true,
    },
    {
      label: "",
      key: "button",
      align: "center",
      format: "",
      action: [{ event: "view", display: true }],
    },
  ];

  useEffect(() => {
    if (effectRan.current === false) {
      setInitial();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));    
  };

  const addNew = () => {
    navigate("/project/new");
    setAction("new");
  };

  const buttonTableClick = (act, value) => {
    if (!act) return;

    if (act === "view") {
      setDataSelected(value);
      setAction(act);
    }
  };

  const getData = (data) => {    
    setIsLoading(true);
    setDataList([]);

    //data.UserId = userId;
    //data.UserGroup = group;

    APIService.postByObject("Project/GetBySearch", null)
      .then((res) => {
        setDataList(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (dataSearch === undefined || userId === undefined) return;
    getData(dataSearch);
  }, [dataSearch, userId]);

  useEffect(() => {
    getSearch(search);
  }, [dataList]);

  const getSearch = (textSearch) => {
    if (!textSearch) {
      setDataTable(dataList);
    } else {
      let val = textSearch.toLowerCase();
      let items = dataList.filter(function (data) {
        return JSON.stringify(data).toLowerCase().includes(val);
      });
      setDataTable(items);
    }
  };

  const handleSearchClick = (data) => {
    setDataSearch(data);
  };

  return (
    <div>
      <Panel
        onAddNew={addNew}
        onSearchChange={getSearch}
        showAdd={true}
        showExport={true}
        showSearch={true}
        setViewStyle={"list"}
        //export csv file
        data={dataTable}
        headExport={columnTable}
        name={"Project"}
        showHelp={true}
      />
      <Search
        showperiod={true}
        showLocation={true}
        onSearchClick={handleSearchClick}
        data={dataSearch}
      />
      <Table
        data={dataTable}
        column={columnTable}
        actionClick={buttonTableClick}
        tableStyle={"list"}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectList;
