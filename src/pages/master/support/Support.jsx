import { useState, useEffect, useRef } from "react";
import Modal from "../../../components/Modal";
import Panel from "../../../components/Panel";
import Table from "../../../components/Table";
import APIService from "../../../services/APIService";
import { useSelector } from "react-redux";
import SupportForm from "./SupportForm";

const Support = () => {
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
      label: "Name",
      key: "Name",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Description",
      key: "Description",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Resource",
      key: "File",
      align: "left",
      format: "image",
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

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  useEffect(() => {
    if (effectRan.current == false) {
      document.title = "Support";
      getData();
      setInitial();
      return () => (effectRan.current = true);
    }
  }, []);

  useEffect(() => {
    getSearch(search);
  }, [dataList]);

  const getData = async () => {
    setIsLoading(true);
    APIService.getAll("Support/Get")
      .then((res) => {
        const fetchData = async () => {
          const datalist = await Promise.all(
            res.data?.map(async (item) => {
              const file = await getFile(item?.Resource);
              return { ...item, File: file }; // คืนค่า item ทั้งออบเจ็กต์ พร้อมเพิ่ม File
            })
          );

          setDataList(datalist);
        };

        fetchData();
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const getFile = async (name) => {
    try {
      if (name === null || name === "") return null;

      const res = await APIService.getByName("Upload/GetFile", name);
      if (res.status !== 200 || res.data === undefined) return null;

      const files = new File([res.data.Data], res.data.Name, {
        type: res.data.Type,
      });
      //files.Id = data.Id;
      files.Name = res.data.Name;
      files.src = `data:${res.data.Type};base64,${res.data.Data}`;
      files.action = "edit";

      files.IsFile = [
        "application/pdf",
        "application/xls",
        "application/xlsx",
        "application/doc",
        "application/docx",
        "application/ppt",
        "application/pptx",
      ].includes(files.type);

      //console.log("get file data => ", files);
      return files;
    } catch (error) {
      console.error("Error fetching file:", error);
      return null;
    }
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

  const handledSaveChange = async (newItem) => {
    if (exists) return;

    newItem.Resource = newItem.Resource?.Name;
    newItem.InputBy = userId;

    try {
      const res = await APIService.Post("Support/Post", newItem);
      if (res.status !== 200) return;

      // ดึงไฟล์โลโก้มาใส่
      const file = await getFile(newItem.Resource);
      res.data.File = file;

      // อัปเดตรายการข้อมูล
      setDataList((prevItem) => [res.data, ...prevItem]);

      // ปิด Modal หรือรีเซ็ตค่า
      handledCancelClick();
    } catch (err) {
      console.log(err);
    }
  };

  const handledUpdateChange = async (newItem) => {
    if (exists) return;

    newItem.Resource = newItem.Resource?.Name;
    newItem.InputBy = userId;

    try {
      const res = await APIService.Put("Support/Put", newItem);
      if (res.status !== 200) return;

      // ดึงไฟล์โลโก้มาใส่
      const file = await getFile(newItem.Resource);
      res.data.File = file;

      //remove old array
      let items = dataList.filter((item) => item.Id !== newItem.Id);
      setDataList(items);

      setDataList((prevItem) => {
        return [res.data, ...prevItem];
      });

      // ปิด Modal หรือรีเซ็ตค่า
      handledCancelClick();
    } catch (err) {
      console.log(err);
    }
  };

  const handledDeleteItem = () => {
    var credential = { Id: content.Id, InputBy: userId };
    APIService.Post("Support/Delete", credential)
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
        name={"Support"}
        page={"ด้านที่สนับสนุน"}
        home={"Masters"}
        title={"ด้านที่สนับสนุน"}
      />

      <Table
        data={dataTable}
        column={columnTable}
        actionClick={buttonTableClick}
        tableStyle={"list"}
        isLoading={isLoading}
      />

      <Modal
        show={show}
        onCancelClick={handledCancelClick}
        onSaveChange={handledSaveChange}
        onUpdateChange={handledUpdateChange}
        onDeleteItem={handledDeleteItem}
        content={content}
        action={action}
        name={"Support"}
        size={"xl"}
        form={
          <SupportForm
            data={dataselected}
            action={action}
            dataList={dataList}
            onExists={(val) => setExists(val)}
          />
        }
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
  );
};

export default Support;
