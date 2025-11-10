import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import APIService from "../../services/APIService";
import Panel from "../../components/Panel";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import ReceiveForm from "./ReceiveForm";
import Search from "../../components/Search";
import { set } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const ReceiveList = () => {

    //table
    const [dataList, setDataList] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rowSelected, setRowSelected] = useState();
    const [checkedList, setCheckedList] = useState([]);
    const [receiveList, setReceiveList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [allowCompleteStatus, setAllowCompleteStatus] = useState(false);
    const [allowSuccessStatus, setAllowSuccessStatus] = useState(false);
    const autoDoneRef = useRef(""); // เก็บ query ที่ auto-select ไปแล้ว
    const norm = (v) => String(v ?? "").trim().toLowerCase();

    //from
    const [dataselected, setDataSelected] = useState();
    const [search, setSearch] = useState();
    const [action, setAction] = useState("");
    const effectRan = useRef(false);

    //system
    const [auth, setAuth] = useState(useSelector((state) => state.auth));
    const [userId, setUserId] = useState();
    const navigate = useNavigate();

    const columnWorkOrder = [
        { label: "obj", key: "check", align: "left", format: "" },

        {
            label: "WorkOrder",
            key: "WorkOrder",
            align: "left",
            format: "string",
            export: true,
        },
        {
            label: "Product Name",
            key: "Product",
            align: "left",
            format: "string",
            export: true,
        },
        {
            label: "Aging",
            key: "Aging",
            align: "center",
            format: "aging",
            export: true,
        },

        {
            label: "Status Mat",
            key: "StatusName",
            align: "center",
            format: "statusmat",
            export: true,
        },
        {
            label: "",
            key: "button",
            align: "center",
            format: "",
            action: [
                //{ event: "view", display: true },
                // { event: "print", display: "IsActive" }, // ตรวจสอบค่า IsActive
            ],
        },
    ];

    const columnDetail = [
        {
            label: "Employee Code",
            key: "EmployeeCode",
            align: "left",
            format: "string",
            export: true,
        },
        {
            label: "Location",
            key: "LocationName",
            align: "left",
            format: "string",
            export: true,
        },
        {
            label: "Group",
            key: "GroupName",
            align: "left",
            format: "string",
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
            label: "Status",
            key: "StatusName",
            align: "left",
            format: "string",
            export: true,
            total: true,
        },
        {
            label: "Receive Date",
            key: "InputDate",
            align: "left",
            format: "shotdatetime",
            export: true,
        },
    ];

    const setInitial = () => {
        if (auth === undefined) return;
        setUserId(atob(auth.Id));
    };

    useEffect(() => {
        if (effectRan.current == false) {
            document.title = "Receive";
            getData();
            calculateStock();
            getStatus();
            setRowSelected();
            setInitial();
            return () => (effectRan.current = true);
        }
    }, []);

    useEffect(() => {
        if (dataList?.length === 0) {
            setDataTable([]);
        } else if (search !== "" && search !== undefined) {
            getSearch(search);
        } else {
            setDataTable(dataList);
        }

        let checked = dataList
            ?.filter((x) => x.Check === true)
            .map((p) => p.WorkOrder);
        setCheckedList(checked);
    }, [dataList]);

    useEffect(() => {
        if (dataTable?.length === 0) {
            setDataSelected();
            setAllowCompleteStatus(false);
            setAllowSuccessStatus(false);
        } else {
            setDataSelected(dataTable[0]);

            let checked = dataTable?.some((x) => x.Check);
            setAllowCompleteStatus(checked);
            setAllowSuccessStatus(checked);
        }
    }, [dataTable]);

    const calculateStock = () => {
        //ถ้าเริ่มเดือนใหม่ ให้ยกยอดจากเดือนก่อนหน้า
        APIService.getAll("Stock/BroughtForward")
            .then((res) => { })
            .catch((err) => console.log(err));
    };

    const getData = () => {
        setIsLoading(true);
        APIService.getAll("Receive/GetGrouped")
            .then((res) => {
                setRowSelected(0);
                handleSelectedRowClick(res.data[0]);
                setIsLoading(false);
                //console.log("getData = >", res.data);
                res.data?.forEach((x) => {
                    let checked = checkedList?.some((workorder) => workorder === x.WorkOrder);
                    x.Check = checked;
                });
                setDataList(res.data);
                //console.log("handleSelectedRowClickd = >", res.data);
            })
            .catch((err) => console.log(err));
    };



    const getStatus = () => {
        setIsLoading(true);
        APIService.getAll("Status/Get")
            .then((res) => {
                //setStatusList(res.data);
                setIsLoading(false);
                //ชconsole.log("getStatus = >", res.data);
            })
            .catch((err) => console.log(err));
    };


    const getSearch = (q) => {
        if (!q || (typeof q === "string" && q.trim() === "")) {
            setSearch("");
            setDataTable(dataList);
            autoDoneRef.current = ""; // reset เมื่อเคลียร์
            return;
        }

        const isObj = typeof q === "object" && q !== null;
        const queryText = isObj ? norm(q.WorkOrder) : norm(q);

        const items = dataList.filter((row) =>
            isObj
                ? ((q.WorkOrder ? String(row.WorkOrder).includes(String(q.WorkOrder)) : true) &&
                    (Array.isArray(q.Status) && q.Status.length ? q.Status.includes(row.Status) : true))
                : JSON.stringify(row).toLowerCase().includes(String(q).toLowerCase())
        );

        setSearch(q);
        setDataTable(items);

        // ✅ auto-select “ครั้งเดียวต่อ query”
        if (norm(autoDoneRef.current) !== queryText) {
            if (items.length === 1) {
                autoDoneRef.current = queryText;
                handleSelectedRowClick(items[0]);
                return;
            }
            const exact = queryText
                ? items.find((r) => norm(r.WorkOrder) === queryText)
                : null;
            if (exact) {
                autoDoneRef.current = queryText;
                handleSelectedRowClick(exact);
            }
        }
    };


    const addNew = () => {
        navigate("/receive/new");
        setAction("new");
    };

    const buttonTableClick = (action, value) => {
        if (!action) return;
        setShow(true);
        setContent({ Id: value.Id, Name: value.Name });
        setDataSelected(value);
        setAction(action);
    };

    const geyById = (wo) => {
        APIService.getById("Receive/getById", wo)
            .then((res) => {
                res.data?.map((x) => {
                    x.LocationName = x.Location?.Name;
                    x.GroupName = x.Group?.Name;
                    x.StatusName = x.Status?.Name;

                });
                setReceiveList(res.data);
                //console.log("geyById =>", res.data);
            })
            .catch((err) => console.log(err));
    };

    const handledSaveChange = (newItem) => {
        newItem.EmployeeCode = Number(newItem.EmployeeCode);
        newItem.WorkOrder = Number(newItem.WorkOrder);
        if (exists) return;
        APIService.Post("Receive/Post", newItem)
            .then((res) => {
                if (res.status !== 200) return;

                //console.log("handledSaveChange =>", res.data);
                //remove old 
                let item = dataList.filter((x) => x.WorkOrder !== res.data.WorkOrder);
                setDataList(item);
                //add new
                setDataList((prev) => {
                    res.data.Check = false;
                    return [res.data, ...prev];
                });
                handledCancelClick();
                handleSelectedRowClick(res.data);
            })
            .catch((err) => console.log(err));
        //console.log("handledSaveChange =>", newItem);
    };

    const handledDeleteItem = () => {
        var credential = { Id: content.Id };
        APIService.Post("Receive/Delete", credential)
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

    const handleSelectedRowClick = (item) => {
        // ทำ flag เลือกแถวให้ชัดเจน
        setDataList((prev) =>
            prev.map((p) => (p.Id === item?.Id ? { ...p, Selected: true } : { ...p, Selected: false }))
        );

        // เรียกโหลดรายละเอียดตาม WorkOrder
        geyById(item?.WorkOrder);   // เดาว่าพิมพ์ผิดเป็น geyById ในโค้ดเดิม
    };
    //ให้เช็คจากId
    const handleCheckclick = (item) => {
        // ✅ toggle เฉพาะรายการที่คลิก
        const data = dataList?.map((p) =>
            p.WorkOrder === item.WorkOrder
                ? { ...p, Check: !p.Check }
                : p
        );
        setDataList(data);
        //console.log("handleCheckclick", data);
        // ✅ แสดง ReceiveList ของรายการล่าสุดที่คลิก
        //setReceiveList(item.ReceiveList ?? []);
    };



    const handleCompleteClick = () => {
        let dataSelected = dataList.filter(x => x.Check == true).map(x => x.WorkOrder);
        //console.log("handleCompleteClick =>", dataSelected);
        APIService.Post("Receive/Complete", dataSelected)
            .then((res) => {
                if (res.status !== 200) return;
                //console.log("handleChangeStatusClick =>", dataSelected); 

                let item = dataList.filter((x) => !x.Check);
                setDataList(item);

                //add new
                setDataList((prev) => {
                    res.data?.forEach((x) => {
                        x.Check = false;
                    });
                    return [...res.data, ...prev];
                });
                handledCancelClick();
            })
            .catch((err) => console.log(err));
    };

    const handleSuccesStatusClick = () => {
        let dataSelected = dataList.filter(x => x.Check == true).map(x => x.WorkOrder);
        //console.log("handleSuccesStatusClick =>", dataSelected);
        APIService.Post("Receive/Success", dataSelected)
            .then((res) => {
                if (res.status !== 200) return;
                //console.log("handleChangeStatusClick =>", dataSelected); 

                let item = dataList.filter((x) => !x.Check);
                setDataList(item);

                //add new

                setDataList((prev) => {
                    res.data?.forEach((x) => {
                        x.Check = false;
                    });
                    return [...res.data, ...prev];
                });
                handledCancelClick();
            })
            .catch((err) => console.log(err));
    };
    return (
        <>
            <Panel
                onAddNew={addNew}
                onSearchChange={getSearch}
                showAdd={true}
                showExport={false}
                showSearch={true}
                setViewStyle={"list"}
                data={dataTable}
                name={"Issue"}
                page={"Issue"}
                home={"Master"}
                title={"Issue"}
                showBreadcrumb={false}
            />
            <Search
                onSearchChange={getSearch}
                showtxtSearch={true}
                showCompleteStatus={allowCompleteStatus}
                showSuccessStatus={allowSuccessStatus}
                onCompleteStatusClick={handleCompleteClick}
                onSuccessStatusClick={handleSuccesStatusClick}
                showbutton={false}
            />
            <div className="grid lg:grid-cols-6 gap-2 mt-1 mr-2">
                <div className="flex flex-col lg:col-span-2 xl:col-span-2">
                    <Table
                        data={dataTable}
                        column={columnWorkOrder}
                        actionClick={buttonTableClick}
                        tableStyle={"list"}
                        isLoading={isLoading}
                        showSelectedRow={true}
                        selectedRowClick={handleSelectedRowClick}
                        rowSelected={rowSelected}
                        checkClick={handleCheckclick}
                        showCheckAll={false}
                        showPagging={true}
                    //allCheckClick={handleAllCheckClick}
                    />
                </div>
                <div className="flex flex-col lg:col-span-4 xl:col-span-4">
                    {
                        receiveList.length > 0 && (
                            <Table
                                data={receiveList}
                                column={columnDetail}
                                //selectedRowClick={handleSelectedRowClick}
                                actionClick={buttonTableClick}
                                tableStyle={"list"}
                                isLoading={isLoading}
                                showPagging={false}

                            />
                        )
                    }

                </div>
            </div>
        </>
    )
}

export default ReceiveList
