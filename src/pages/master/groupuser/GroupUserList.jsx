import { useSelector } from "react-redux";
import Panel from "../../../components/Panel";
import { useEffect, useRef, useState } from "react";
import Table from "../../../components/Table";
import APIService from "../../../services/APIService";
import { useNavigate, useOutletContext } from "react-router-dom";
const GroupUserList = () => {
  const [setDataSelected, setAction, setDataSearch, dataSearch] =
    useOutletContext();

  const [isLoading, setIsLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  // const [dataSelected, setDataSelected] = useState();
  const effectRan = useRef(false);
  const [search, setSearch] = useState();
  const [dataTable, setDataTable] = useState([]);
  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const navigate = useNavigate();

  const column = [
    {
      label: "Name",
      key: "Name",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Value",
      key: "Value",
      align: "left",
      format: "string",
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
      getData();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };
  const addNew = () => {
    navigate("/groupuser/new");
    setAction("new");
  };

  const buttonTableClick = (act, value) => {
    if (!act) return;
    if (act === "view") {
      setDataSelected(value);
      setAction(act);
    }
  };

  const getData = () => {
    setIsLoading(true);
    APIService.getByName("Group/GetByPrefix", "user")
      .then((res) => {       
        setDataList(res.data);
        setIsLoading(false);
        //console.log("get Group data =>", res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (dataList?.length === 0) {
      setDataTable([]);
    } else if (search !== "" && search !== undefined) {
      getSearch(search);
    } else {
      setDataTable(dataList);
    }
  }, [dataList]);

  useEffect(() => {
    if (search === undefined) return;
    getSearch(search);
  }, [search]);

  const handleSearch = (textSearch) => {
    setSearch(textSearch);
  };

  const getSearch = () => {
    //console.log("get search => ",search);
    if (!search) {
      setDataTable(dataList);
    } else {
      let val = search.toLowerCase();
      let items = dataList.filter(function (data) {
        return JSON.stringify(data).toLowerCase().includes(val);
      });
      setSearch(search);
      setDataTable(items);
    }
  };

  return (
    <>
      <Panel
        onAddNew={addNew}
        onSearchChange={handleSearch}
        home={"Manage"}
        title={"Group User"}
        page={"Group User"}
        setViewStyle={"list"}
        showExport={true}
        headExport={column}
        showSearch={true}
        data={dataList}
        showAdd={true}          
      />

      <Table
        column={column}
        data={dataTable}
        tableStyle={"list"}
        isLoading={isLoading}
        showPagging={true}
        actionClick={buttonTableClick}
      />
    </>
  );
};

export default GroupUserList;
