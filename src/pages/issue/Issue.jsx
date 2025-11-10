<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Panel from "../../components/Panel";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import APIService from "../../services/APIService";
import IssueForm from "./IssueForm";


=======
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
>>>>>>> 1496d0238286f0535a5a28809f24f3421f218190
const Issue = () => {
  const [action, setAction] = useState("list");
  const [dataSelected, setDataSelected] = useState();

  const [dataSearch, setDataSearch] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false);

<<<<<<< HEAD
  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

  const columnTable = [
    {
      label: "EmployeeCode",
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
    {
      label: "Qty",
      key: "Qty",
      align: "left",
      format: "number",
      export: true,
      total: true,
    },

    {
      label: "Issue Date",
      key: "InputDate",
      align: "left",
      format: "shotdatetime",
      export: true,
    },

    // {
    //   label: "",
    //   key: "button",
    //   align: "right",
    //   format: "",
    //   action: [
    //     { event: "edit", display: true },
    //     { event: "delete", display: true },
    //   ],
    // },
  ];

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

=======
>>>>>>> 1496d0238286f0535a5a28809f24f3421f218190
  useEffect(() => {
    if (effectRan.current === false) {
      document.title = "Issue";
      return () => (effectRan.current = true);
    }
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    getSearch(search);
  }, [dataList]);

  const getData = () => {
    setIsLoading(true);
    APIService.getAll("Issue/Get")
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
    //console.log(newItem);
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
        name={"Issue"}
        page={"Issue"}
        home={"Master"}
        title={"Issue"}
      />

      <Table
        data={dataTable}
        column={columnTable}
        actionClick={buttonTableClick}
        tableStyle={"list"}
        isLoading={isLoading}
        showPagging={true}
        showPaggingButton={true}
        
      />

      <Modal
        show={show}
        onCancelClick={handledCancelClick}
        onSaveChange={handledSaveChange}
        onUpdateChange={handledUpdateChange}
        onDeleteItem={handledDeleteItem}
        content={content}
        action={action}
        name={"Issue"}
        size={"xl"}
        form={
          <IssueForm
            data={dataselected}
            action={action}
            dataList={dataList}
            onExists={(val) => setExists(val)}
          />
        }
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
=======
    if (dataSelected === undefined || dataSelected === "") return;
    navigate("/issue/view/" + dataSelected?.Id);
  }, [dataSelected]);
  return (
    <div>
      <Outlet
        context={[setDataSelected, setAction, setDataSearch, dataSearch]}
      />
    </div>
>>>>>>> 1496d0238286f0535a5a28809f24f3421f218190
  )
}

export default Issue
