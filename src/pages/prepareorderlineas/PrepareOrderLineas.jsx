import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import APIService from "../../services/APIService";
import Panel from "../../components/Panel";
import Table from "../../components/Table";

const PrepareOrderLineAs = () => {
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
            label: "Work Order",
            key: "ProductionOrderId",
            align: "left",
            format: "string",
            export: true,
        },
        // {
        //     label: "ProductId",
        //     key: "ProductId",
        //     align: "left",
        //     format: "string",
        //     export: true,
        // },
        {
            label: "Packing Status",
            key: "PackingStatusName",
            align: "left",
            format: "string",
            export: true,
        },



        {
            label: "PlanedQty",
            key: "PlanedQty",
            align: "left",
            format: "number",
            export: true,
        },



        {
            label: "PP Receive Name",
            key: "PpReceiveByName",
            align: "left",
            format: "string",
            export: true,
        },

         {
            label: "PP รับเข้า",
            key: "PpReceiveDateTime",
            align: "left",
            format: "datetime",
            export: true,
        },

        {
            label: "PP Issue Name",
            key: "PpIssueByName",
            align: "left",
            format: "string",
            export: true,
        },

       

        {
            label: "PP จ่ายออก",
            key: "PpIssueDateTime",
            align: "left",
            format: "datetime",
            export: true,
        },

        {
            label: "Shelf",
            key: "PpReceiveToShelf",
            align: "left",
            format: "string",
            export: true,
        },


        // {
        //     label: "",
        //     key: "button",
        //     align: "right",
        //     format: "",
        //     action: [
        //         { event: "edit", display: true },
        //         { event: "delete", display: true },
        //     ],
        // },
    ];

    const setInitial = () => {
        if (auth === undefined) return;
        setUserId(atob(auth.Id));
    };

    useEffect(() => {
        if (effectRan.current == false) {
            document.title = "Prepare Check Status";
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
        APIService.getAll("PrepareOrderLineAs/Get")
            .then((res) => {
                setDataList(res.data);
                setIsLoading(false);
                //console.log("PrepareOrderLineAs Get  =>", res.data);
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
    return (
        <>
            <Panel
                onAddNew={addNew}
                onSearchChange={getSearch}
                showAdd={false}
                showExport={true}
                showSearch={true}
                setViewStyle={"list"}
                data={dataTable}
                headExport={columnTable}
                showSection={false}
                name={"PrepareOrderLineAs"}
                page={"PrepareOrderLineAs"}
                title={"Prepare Check Status"}
            />

            <Table
                data={dataTable}
                column={columnTable}
                actionClick={buttonTableClick}
                tableStyle={"list"}
                isLoading={isLoading}
            />


        </>
    )
}

export default PrepareOrderLineAs
