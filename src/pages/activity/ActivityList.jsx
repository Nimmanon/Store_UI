import { useEffect, useRef, useState } from "react";
import Panel from "../../components/Panel";
import Table from "../../components/Table";
import APIService from "../../services/APIService";
import { useSelector } from "react-redux";
import Search from "../../components/Search";
import { useNavigate, useOutletContext } from "react-router-dom";
import MassageBox from "../../components/MassageBox";

const ActivityList = () => {
  const [setDataSelected, setAction, setDataSearch, dataSearch] =
    useOutletContext();

  //table
  const [dataList, setDataList] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //modal
  const [show, setShow] = useState(false);
  const [content, setContent] = useState({ Id: 0, Name: "" });

  const [search, setSearch] = useState();
  const navigate = useNavigate();
  const effectRan = useRef(false);

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const [userGroup, setUserGroup] = useState();
  const [userOrganize, setUserOrganize] = useState();

  const column = [
    {
      label: "องค์กร",
      key: "Organize",
      align: "left",
      format: "string",
      export: true,
      type: "object",
      sort: "Name",
    },
    {
      label: "โครงการ",
      key: "Project",
      align: "left",
      format: "string",
      export: true,
      type: "object",
      sort: "Name",
    },
    {
      label: "วันที่กิจกรรม",
      key: "Date",
      align: "center",
      format: "shotdate",
      export: true,
    },
    {
      label: "ชื่อกิจกรรม",
      key: "Subject",
      align: "center",
      format: "string",
      export: true,
    },
    {
      label: "ผู้เขียน",
      key: "Writer",
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
      ],
    },
  ];

  useEffect(() => {
    if (effectRan.current === false) {
      document.title = "BOI : ACTIVITY";
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
  const addNew = () => {
    navigate("/activity/new");
    setAction("new");
  };

  useEffect(() => {
    if (dataSearch === undefined || userGroup === undefined) return;
    getData(dataSearch);
  }, [dataSearch, userGroup]);

  const getData = (data) => {
    setIsLoading(true);
    setDataList([]);

    if (userOrganize) data.Organize = userOrganize;
   
    APIService.Post("Activity/GetBySearch", data)
      .then((res) => {
        setDataList(res.data);
        setIsLoading(false);
        //console.log("get Activity data =>", res.data);
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

  const handleSearch = (textSearch) => {
    setSearch(textSearch);
    setDataSelected();
  };

  useEffect(() => {
    if (search === undefined) return;
    getSearch(search);
  }, [search]);

  const getSearch = () => {
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

  const handleSearchClick = (data) => {
    setDataSearch(data);
    setDataList([]);
    setDataSelected();
    getData(data);
  };

  const buttonTableClick = (act, value) => {
    if (!act) return;

    if (act === "delete") {
      setShow(true);
      setContent({ Id: value?.Id, Name: value?.Subject });
    } else {
      setDataSelected(value);
      setAction(act);
    }
  };

  const handledDeleteClick = () => {
    let item = {};
    item.Id = content?.Id;
    item.InputBy = userId;

    APIService.Post("Activity/Delete", item)
      .then((res) => {
        if (res.status !== 200) return;
        let items = dataList.filter((x) => x.Id !== content.Id);
        setDataList(items);

        setShow(false);
        setContent();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Panel
        onAddNew={addNew}
        onSearchChange={handleSearch}
        showExport={true}
        showSearch={true}
        setViewStyle={"list"}
        data={dataList}
        headExport={column}
        page={"กิจกรรม"}
        home={"Main"}
        title={"กิจกรรม"}
        showSection={false}
      />

      <Search
        onSearchClick={handleSearchClick}
        data={dataSearch}
        showProject={true}
        showOrganize={userOrganize ? false : true}
        showPeriod={true}
      />

      <Table
        column={column}
        data={dataTable}
        tableStyle={"list"}
        isLoading={isLoading}
        showPagging={true}
        showSammary={true}
        actionClick={buttonTableClick}
      />

      <MassageBox
        show={show}
        action={"delete"}
        name={"Activity"}
        size={"xl"}
        content={content}
        handleCancelClick={() => setShow(false)}
        onDeleteClick={handledDeleteClick}
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
  );
};

export default ActivityList;
