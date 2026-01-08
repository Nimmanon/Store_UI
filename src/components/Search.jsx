import APIService from "../services/APIService";
import { useEffect, useRef, useState } from "react";
import { set, useForm } from "react-hook-form";
import Select from "./Select";
import ExportExcel from "./ExportExcel";
import moment from "moment";
import DatePicker from "./DatePicker";
import FormInput from "./FormInput";
import { useLocation } from "react-router-dom";

const Search = ({
  showExport = false,
  data,
  headExport,
  name,
  showperiod = false,
  labelPeriod = "",
  setDefaultPeriod = true,
  requiredperiod = false,
  showyearmonth = false,
  showyear = false,
  onSearchClick,
  showtxtSearch = false,
  showCustomer = false,
  showDocNo = false,
  showWorkOrder = false,
  showToDocNo = false,
  showSendMail = false,
  onSendMailClick,
  showStatus = false,
  showPrint = false,
  onPrintClick,
  onChangeStatusClick,
  onCompleteStatusClick,
  onSuccessStatusClick,
  showDownload = false,
  onDownloadClick,
  showStatusPayment = false,
  showDueDate = false,
  showGroupUser = false,
  showCompleteStatus = false,
  showSuccessStatus = false,
  showbutton = false,
  onSearchChange,
}) => {
  const [customerList, setCustomerList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [statusPaymentList, setStatusPaymentList] = useState([]);
  const [groupUserList, setGroupUserList] = useState([]);

  const [docNo, setDocNo] = useState("");
  const [todocNo, setToDocNo] = useState("");
  const [date, setDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customer, setCustomer] = useState();
  // const [status, setStatus] = useState([]);
  const [statusPayment, setStatusPayment] = useState();
  const [duedate, setDueDate] = useState("");
  const [workOrder, setWorkOrder] = useState("");
  const [group, setGroup] = useState();

  const [textSearch, setTextSearch] = useState();
  // const [dataSearch, setDataSearch] = useState();

  const effectRan = useRef(false);
  const ref = useRef();
  const ref2 = useRef();
  const loc = useLocation();

  let current = new Date();
  let fday = new Date(current.getFullYear(), current.getMonth(), 1, 0, 0, 0, 0);

  let lastday = new Date(
    current.getFullYear(),
    current.getMonth() + 1,
    0
  ).getDate();
  let tday = new Date(
    current.getFullYear(),
    current.getMonth(),
    lastday,
    0,
    0,
    0,
    0
  );
  const [year, setYear] = useState(current.getFullYear());
  const [month, setMonth] = useState(current.getMonth() + 1);

  const {
    formState: { errors },
    register,
    setValue,
    getValues,
    handleSubmit,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      Id: 0,
      Year: null,
      Month: null,
      Date: null,
      ToDate: null,
      DueDate: null,
      DocNo: null,
      WorkOrder: null,
      ToDocNo: null,
      Status: null,
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      if (showperiod && setDefaultPeriod) {
        setDate(fday);
        setToDate(tday);
      } else {
        setDate(null);
        setToDate(null);
      }

      if (showCustomer === true) getCustomer();

      if (showStatus === true) getStatus();

      if (showStatusPayment === true) getStatusPay();

      if (showGroupUser === true) getGroupUser();

      return () => (effectRan.current = true);
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(textSearch) !== JSON.stringify(data)) {
      onSearchChange(textSearch);
    }
  }, [textSearch]);

  useEffect(() => {
    if (data === undefined) return;
    //console.log("search datasearch=>", data);
    setDataSearch(data);

    if (
      showperiod &&
      data?.Date !== null &&
      data?.Date !== undefined
    ) {
      setDate(new Date(data?.Date));
    }

    if (
      showperiod &&
      data?.ToDate !== null &&
      data?.ToDate !== undefined
    ) {
      setToDate(new Date(data?.ToDate));
    }

    if (
      showDueDate &&
      data?.DueDate !== null &&
      data?.DueDate !== undefined
      //data?.DueDate instanceof Date &&
      //!isNaN(data?.DueDate)
    ) {
      setDueDate(new Date(data?.DueDate));
    }

    if (showCustomer === true) {
      setValue("Customer", data?.Customer);
      setCustomer(data?.Customer);
    }

    if (showDocNo === true) {
      setValue("DocNo", data?.DocNo);
      setDocNo(data?.DocNo);
    }

    if (showWorkOrder === true) {
      setValue("WorkOrder", data?.WorkOrder);
      setWorkOrder(data?.WorkOrder);
      //console.log("workorder =>", data?.WorkOrder);
    }

    // if (showStatus === true) {
    //   setValue("Status", data?.Status);
    //   setStatus(data?.Status);
    // }

    // if (showStatusPayment === true) {
    //   setValue("Status", data?.Status);
    //   setStatusPayment(data?.Status);
    // }

    if (showGroupUser === true) {
      setValue("Group", data?.Group);
      setGroup(data?.Group);
    }
  }, [data]);

  const getCustomer = async () => {
    APIService.getAll("Customer/GetList")
      .then((res) => {
        setCustomerList(res.data);
      })
      .catch((err) => console.log(err));
  };
  const getStatus = () => {
    APIService.getAll("Status/Get")
      .then((res) => {
        setStatusList(res.data);
        //console.log("getStatus = >", res.data);
      })
      .catch((err) => console.log(err));
  };


  const getGroupUser = async () => {
    APIService.getByName("Group/GetByPrefix", "user")
      .then((res) => {
        setGroupUserList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const onSelectItem = async (e, name) => {
    setValue(name, e);
    e === null ? setError(name, { type: "required" }) : clearErrors(name);
  };

  const handelSearchClick = () => {
    if (
      showperiod &&
      requiredperiod &&
      (date === undefined ||
        date === null ||
        toDate === undefined ||
        toDate === null)
    ) {
      return;
    }
    let credentials = {};

    if (showCustomer === true) {
      let customer = getValues("Customer");
      credentials.Customer =
        customer === null || customer === undefined ? null : customer;
    }

    if (showperiod === true) {
      credentials.Date =
        date !== null &&
          date !== undefined &&
          date instanceof Date &&
          !isNaN(date)
          ? moment(date).format("YYYY-MM-DD")
          : null;

      credentials.ToDate =
        toDate !== null &&
          toDate !== undefined &&
          toDate instanceof Date &&
          !isNaN(toDate)
          ? moment(toDate).format("YYYY-MM-DD")
          : null;
    }

    if (showDueDate === true) {
      credentials.DueDate =
        duedate !== null &&
          duedate !== undefined &&
          duedate instanceof Date &&
          !isNaN(duedate)
          ? moment(duedate).format("YYYY-MM")
          : null;
    }

    if (showStatus === true) {
      let selectedList = getValues("Status")?.map((m) => m.Id);
      let status = statusList?.filter((x) => selectedList?.includes(x.Id));
      credentials.Status =
        status === null || status === undefined ? null : status;
    }

    if (showStatusPayment === true) {
      let [status] = statusPaymentList?.filter(
        (x) => x.Id === getValues("Status")?.Id
      );
      credentials.Status =
        status === null || status === undefined ? null : status;
    }

    if (showGroupUser === true) {
      let group = getValues("Group");
      credentials.Group = group === null || group === undefined ? null : group;
    }

    if (showDocNo === true) {
      credentials.DocNo = docNo === "" || docNo === undefined ? null : docNo;
    }

    if (showToDocNo === true) {
      credentials.ToDocNo =
        todocNo === "" || todocNo === undefined ? null : todocNo;
    }

    if (showyearmonth === true) {
      credentials.Year = year === "" || year === 0 ? null : year;
      credentials.Month = month === "" || month === 0 ? null : month;
    }

    if (showyear === true) {
      credentials.Year = year === "" || year === 0 ? null : year;
    }

    if (showtxtSearch === true) {
      credentials.Word = textSearch === "" ? null : textSearch;
    }

    if (showWorkOrder === true) {
      credentials.WorkOrder = workOrder === "" || workOrder === undefined ? null : workOrder;
    }

    //console.log("search panel onSearchClick =>", credentials);
    onSearchClick(credentials);
  };

  const handelSendMailClick = () => {
    onSendMailClick();
  };

  const handelPrintClick = () => {
    onPrintClick();
  };

  const handleCompleteStatus = () => {
    onCompleteStatusClick();
  };

  const handleChangeStatus = () => {
    onSuccessStatusClick();
  };

  const handelDownloadClick = () => {
    onDownloadClick();
  };

  return (
    <>
      <div className="card p-2 mb-2">
        <div className="grid lg:grid-cols-6 gap-1">
          {showperiod && (
            <div className="flex flex-row xl:col-span-1 lg:col-span-1 gap-1">
              <DatePicker
                onChange={(fdate) => setDate(fdate)}
                placeholder={labelPeriod !== "" ? labelPeriod : "วันที่"}
                format="d-MMM-yy"
                value={date || ""}
                required={requiredperiod}
                error={
                  requiredperiod
                    ? date === null || date === undefined
                      ? true
                      : false
                    : false
                }
              />
              <DatePicker
                onChange={(tdate) => setToDate(tdate)}
                placeholder={
                  labelPeriod !== "" ? "To " + labelPeriod : "ถึงวันที่"
                }
                format="d-MMM-yy"
                value={toDate || ""}
                required={requiredperiod}
                error={
                  requiredperiod
                    ? toDate === null || toDate === undefined
                      ? true
                      : false
                    : false
                }
              />
            </div>
          )}

          {showyear && (
            <input
              type="number"
              className="form-control is-invalid mb-1 bg-yellow-100"
              placeholder="เลือกปี"
              value={year}
              onChange={(e) => {
                setYear(e.target.value <= 0 ? 1 : e.target.value);
              }}
            />
          )}

          {showyearmonth && (
            <div className="flex flex-row xl:col-span-1 lg:col-span-1 gap-1">
              <input
                type="number"
                className="form-control is-invalid mb-1 bg-yellow-100"
                placeholder="เลือกปี"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value <= 0 ? 1 : e.target.value);
                }}
              />
              <input
                type="number"
                className="form-control is-invalid ml-1 mb-1 bg-yellow-100"
                value={month}
                placeholder="เลือกเดือน"
                onChange={(e) => {
                  setMonth(
                    e.target.value <= 0
                      ? 0
                      : e.target.value >= 12
                        ? 12
                        : e.target.value
                  );
                }}
              />
            </div>
          )}

          {showDueDate && (
            <div>
              <DatePicker
                onChange={(date) => setDueDate(date)}
                placeholder="Due Date"
                format="MMM-yy"
                showMonthYearPicker={true}
                value={duedate || ""}
              />
            </div>
          )}

          {showCustomer && (
            <div>
              <Select
                list={customerList}
                onSelectItem={onSelectItem}
                name="Customer"
                placeholder="เลือก Customer"
                register={register}
                type="text"
                setValue={customer}
              />
            </div>
          )}

          {showGroupUser && (
            <div>
              <Select
                list={groupUserList}
                onSelectItem={onSelectItem}
                name="Group"
                placeholder="เลือก Group"
                register={register}
                type="text"
                setValue={group}
              />
            </div>
          )}

          {showDocNo && (
            <div>
              <FormInput
                name="DocNo"
                placeholder="Document No"
                register={register}
                type="text"
                onChange={(e) => {
                  setDocNo(e.target.value);
                }}
              />
            </div>
          )}

          {showWorkOrder && (
            <div>
              <FormInput
                name="WorkOrder"
                placeholder="Work Order"
                register={register}
                type="text"
                onChange={(e) => {
                  setWorkOrder(e.target.value);
                }}
              />
            </div>
          )}

          {showToDocNo && (
            <div>
              <FormInput
                name="ToDocNo"
                placeholder="To Document No"
                register={register}
                type="text"
                onChange={(e) => {
                  setToDocNo(e.target.value);
                }}
              />
            </div>
          )}

          {showStatus && (
            <div>
              <Select
                list={statusList}
                onSelectItem={onSelectItem}
                name="Status"
                placeholder="เลือก Staus"
                register={register}
                type="text"
              // multi={true}
              // defaultOptions={statusList}
              />
            </div>
          )}

          {showStatusPayment && (
            <div>
              <Select
                list={statusPaymentList}
                onSelectItem={onSelectItem}
                name="Status"
                placeholder="เลือก Staus"
                register={register}
                type="text"
                multi={false}
                setValue={statusPayment}
              />
            </div>
          )}

          {/* Search */}
          {showtxtSearch && (
            <div className="flex flex-auto items-center">
              <label className="form-control-addon-within rounded-full bg-yellow-100">
                <input
                  type="text"
                  className="form-control border-none bg-yellow-100"
                  placeholder="Search"
                  onChange={(e) => {
                    e.preventDefault();
                    setTextSearch(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-link bg-yellow-100 text-primary text-xl leading-none la la-search mr-4 ml-4"
                  onClick={(e) => {
                    e.preventDefault();
                    onSearchChange(textSearch);
                  }}
                />
              </label>
            </div>
          )}
          { }
          <div className="flex flex-row xl:col-span-1 lg:col-span-1">
            {showbutton && (
              <button
                type="submit"
                className="btn btn_primary"
                onClick={handelSearchClick}
                title="search"
              >
                <span className="la la-search text-base leading-none" />
              </button>
            )}

            {showExport && (
              <ExportExcel
                data={data}
                headExport={headExport}
                name={name}
                mini={true}
              />
            )}
            {showSendMail && (
              <button
                type="button"
                className="btn btn_secondary ml-1"
                onClick={handelSendMailClick}
                title="send mail"
              >
                <span className="la la-envelope text-base leading-none" />
              </button>
            )}
            {showPrint && (
              <button
                type="button"
                className="btn btn_success ml-1"
                onClick={handelPrintClick}
                title="print"
              >
                <span className="la la-print text-base leading-none" />
              </button>
            )}

            {showCompleteStatus && (
              <button
                type="button"
                className="btn btn_info ml-1"
                onClick={handleCompleteStatus}
                title="change status"
              >
                <span className="la la-clipboard-check" />
              </button>
            )}
            {showSuccessStatus && (
              <button
                type="button"
                className="btn btn_success ml-1"
                onClick={handleChangeStatus}
                title="change status"
              >
                <span className="la la-clipboard-check" />
              </button>
            )}

            {showDownload && (
              <button
                type="button"
                className="btn btn_info ml-1"
                onClick={handelDownloadClick}
                title="download"
              >
                <span className="la la-download text-base leading-none" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
