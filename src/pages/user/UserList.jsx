import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MassageBox from "../../components/MassageBox";
import Panel from "../../components/Panel";
import Table from "../../components/Table";
import APIService from "../../services/APIService";
import { useNavigate, useOutletContext } from "react-router-dom";
import Search from "../../components/Search";

const UserList = () => {
  const [setDataSelected, setAction, setDataSearch, dataSearch] =
    useOutletContext();

  //table
  const [dataList, setDataList] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //modal
  const [show, setShow] = useState(false);
  const [content, setContent] = useState({ Id: 0, Name: "" });

  //from
  const [search, setSearch] = useState();
  const [display, setDisplay] = useState(true);

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const [usergroup, setUserGroup] = useState();

  const navigate = useNavigate();
  const effectRan = useRef(false);

  const column = [
    {
      label: "FirstName",
      key: "FirstName",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "LastName",
      key: "LastName",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Username",
      key: "Username",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Email",
      key: "Email",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Group",
      key: "Group",
      align: "left",
      format: "string",
      export: true,
      type: "object",
      sort: "Name",
    },
    {
      label: "Company",
      key: "Company",
      align: "left",
      format: "string",
      export: true,
      type: "object",
      sort: "Name",
    },
    {
      label: "Organize",
      key: "Organize",
      align: "left",
      format: "string",
      export: true,
      type: "object",
      sort: "Name",
    },
    {
      label: "Status",
      key: "IsActive",
      align: "center",
      format: "status",
      text: "Active,Inactive",
      export: true,
    },
    {
      label: "",
      key: "button",
      align: "center",
      format: "",
      action: [
        { event: "edit", display: true },
        { event: "delete", display: "display" },
      ],
    },
  ];

  const setInitial = () => {
    if (auth === undefined) return;

    setUserId(atob(auth.Id));
    let group = JSON.parse(auth.Group);
    setUserGroup(group?.Name?.toLowerCase());
  };

  useEffect(() => {
    if (effectRan.current == false) {
      setInitial();
      getData();
      return () => (effectRan.current = true);
    }
  }, []);

  const getData = (data) => {
    setIsLoading(true);
    APIService.Post("Auth/GetBySearch", data)
      .then((res) => {
        res.data?.forEach((x) => (x.display = !x.IsAdmin));
        setDataList(res.data);
        setIsLoading(false);
        //console.log("get data user => ", res.data);
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

  const addNew = () => {
    navigate("/user/new");
    setAction("new");
  };

  const buttonTableClick = (act, value) => {
    if (!act) return;

    if (act === "delete") {
      setShow(true);
      setContent({ Id: value?.Id, Name: value?.Name });
    } else {
      setAction(act);
      setDataSelected(value);
    }
  };

  const handledDeleteItem = () => {
    let credentials = { Id: content?.Id, InputBy: userId };
    APIService.Post("Auth/Delete", credentials)
      .then((res) => {
        //remove array
        let items = dataList.filter((item) => item.Id !== content.Id);
        setDataList(items);

        setShow(false);
        setAction("");
      })
      .catch((err) => console.log(err));
  };

  const handleSearchClick = (data) => {
    setDataSearch(data);
    setDataList([]);
    setDataSelected();
    getData(data);
  };

  return (
    <>
      <Panel
        onAddNew={addNew}
        onSearchChange={handleSearch}
        showAdd={true}
        showExport={true}
        showSearch={true}
        setViewStyle={"list"}
        data={dataList}
        headExport={column}
        page={"Manage User"}
        home={"Manage"}
        title={"Manage User"}
      />

      <Search
        onSearchClick={handleSearchClick}
        showOrganize={true}
        showCompany={true}
        data={dataSearch}
      />

      <Table
        data={dataTable}
        column={column}
        actionClick={buttonTableClick}
        tableStyle={"list"}
        isLoading={isLoading}
      />

      <MassageBox
        show={show}
        action={"delete"}
        name={"User"}
        content={content}
        size={"xl"}
        Massage={"Are you sure want to delete this user?"}
        handleCancelClick={() => setShow(false)}
        onDeleteClick={handledDeleteItem}
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
  );
};

export default UserList;
