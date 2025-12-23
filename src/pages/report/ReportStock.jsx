import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import APIService from "../../services/APIService";
import Panel from "../../components/Panel";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
const ReportStock = () => {
    //table
    const [dataList, setDataList] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    //modal
    const [show, setShow] = useState(false);
    const [content, setContent] = useState({ Id: 0, Name: "" });
    const [exists, setExists] = useState(false);

    //from
    const [dataselected, setDataSelected] = useState();
    const [search, setSearch] = useState();

    const effectRan = useRef(false);

    //system
    const [auth, setAuth] = useState(useSelector((state) => state.auth));
    const [userId, setUserId] = useState();

    const navigate = useNavigate();
    const [action, setAction] = useState("");

    const columnTable = [
        // {
        //     label: "Employee Code",
        //     key: "EmployeeCode",
        //     align: "left",
        //     format: "string",
        //     export: true,
        // },
        {
            label: "Product",
            key: "Product",
            align: "left",
            format: "string",
            export: true,
        },
        {
            label: "Location",
            key: "LocationName",
            align: "left",
            format: "string",
            // type: "object",
            // sort: "Name",
            export: true,
        },
        {
            label: "รับเข้า",
            key: "ReceiveQty",
            align: "left",
            format: "string",
            export: true,
        },
        {
            label: "จ่ายออก",
            key: "IssueQty",
            align: "left",
            format: "string",
            export: true,
        },
         {
            label: "คงเหลือ",
            key: "OnHand",
            align: "left",
            format: "string",
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

        // {
        //     label: "Bf Qty",
        //     key: "BfQty",
        //     align: "left",
        //     format: "string",
        //     export: true,
        // },

        // {
        //     label: "Receive Date",
        //     key: "InputDate",
        //     align: "left",
        //     format: "shotdatetime",
        //     export: true,
        // },
        {
            label: "",
            key: "button",
            align: "center",
            format: "",
            action: [
                { event: "receive", display: true },
                { event: "issue", display: "IsActive" }, // ตรวจสอบค่า IsActive
            ],
        },
    ];


    const setInitial = () => {
        if (auth === undefined) return;
        setUserId(atob(auth.Id));
    };

    useEffect(() => {
        if (effectRan.current == false) {
            document.title = "Report Stock";
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
        APIService.getAll("Stock/GetOnHand")
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

    // const buttonTableClick = (action, value) => {
    //     if (!action) return;
    //     setShow(true);
    //     setContent({ Id: value.Id, Name: value.Name });
    //     setDataSelected(value);
    //     setAction(action);
    // };


    const buttonTableClick = (event, row) => {
        switch (event) {
            case "receive":
                setAction("new");
                // ถ้าอยากส่งข้อมูลแถวไปด้วย ใช้ state
                navigate("/receive/new", { state: { item: row } });
                console.log("item:row",row);
                break;

            case "issue":
                setAction("new");
                // ถ้าอยากส่งข้อมูลแถวไปด้วย ใช้ state
                navigate("/issue/new", { state: { item: row } });
                break;

            default:
                break;
        }
    };

    return (
        <>
            <Panel
                onSearchChange={getSearch}
                showExport={true}
                showSearch={true}
                setViewStyle={"list"}
                data={dataTable}
                headExport={columnTable}
                name={"Reveive"}
                page={"Reveive"}
                home={"Master"}
                title={"Reveive"}
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

export default ReportStock
