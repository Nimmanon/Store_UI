import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import APIService from "../../../services/APIService";
import Panel from "../../../components/Panel";
import Table from "../../../components/Table";
import Modal from "../../../components/Modal";
import { EmployeeForm } from "./EmployeeForm";


const Employee = () => {
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
            label: "EmployeeCode",
            key: "EmployeeCode",
            align: "left",
            format: "string",
            export: true,
        },
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
            document.title = "Employee";
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
        APIService.getAll("Employee/Get")
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
        APIService.Post("Employee/Post", newItem)
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
        APIService.Put("Employee/Put", newItem)
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
        APIService.Post("Employee/Delete", credential)
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
                name={"Employee"}
                page={"Employee"}
                home={"Master"}
                title={"Employee"}
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
                name={"Employee"}
                size={"xl"}
                form={
                    <EmployeeForm
                        data={dataselected}
                        action={action}
                        dataList={dataList}
                        onExists={(val) => setExists(val)}
                    />
                }
            />
            <div className={`${show ? "overlay active" : ""}`}></div>
        </>
    )
}

export default Employee
