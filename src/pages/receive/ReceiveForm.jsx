import React, { useEffect, useRef, useState } from 'react'
import ReceiveFormDetail from './ReceiveFormDetail'
import ReceiveConfirm from './ReceiveConfirm';
import FormTitle from '../../components/FormTitle';
import Table from '../../components/Table';
import CustomModal from '../../components/CustomModal';
import { useForm } from 'react-hook-form';
import FormInput from '../../components/FormInput';
import Select from '../../components/Select';
import APIService from '../../services/APIService';



const ReceiveForm = () => {

  const [locationList, setLocationList] = useState();
  const [dataList, setDataList] = useState([]);
  const [employeecode, setEmployeeCode] = useState();

  const [location, setLocation] = useState();



  //modal MessageBox
  // const [content, setContent] = useState({ Id: 0, Name: "" });
  // const [actionMsgBox, setActionMsgBox] = useState(false);
  // const [show, setShow] = useState(false);
  // const [showform, setShowForm] = useState(false);
  // const [form, setForm] = useState();

  // const [dataSave, setDataSave] = useState();
  //const [showConfirm, setShowConfirm] = useState(false);
  // const [actionConfirm, setActionConfirm] = useState(false);


  //form
  // const ref = useRef();
  const effectRan = useRef(false);

  //system
  const employeeRef = useRef(null);

  const {
    register,
    formState: { errors },
    reset,
    getValues,
    setError,
    setValue,
    clearErrors,
    handleSubmit,
  } = useForm({
    defaultValues: {
      Id: 0,
      EmployeeCode: "",
      Location: null,
    },
  });

  const column = [
    {
      label: "Product",
      key: "Product",
      align: "left",
      format: "string",
      type: "object",
      sort: "Name",
      export: true,
    },
    {
      label: "จำนวน",
      key: "Quantity",
      align: "right",
      format: "number",
      digit: 2,
      export: true,
      total: true,
    },
    {
      label: "",
      key: "button",
      align: "center",
      format: "",
      action: [
        // { event: "edit", display: display },
        { event: "delete", display: "IsActive" },
      ],
    },
  ];

  useEffect(() => {
    if (effectRan.current === false) {
      reset();
      //   setInitial();     
      getLocation();
      return () => (effectRan.current = true);
    }
  }, []);


  const handleAddClick = (data) => {
    console.log("data =>", data);
    // const idList = dataList?.map((item) => item?.Id);
    // const max = Math.max(...idList);
    // let newid = dataList?.length === 0 ? 1 : max + 1;
    // data.Id = newid;

    // let allList = [...dataList, data];
    // const newdata = allList?.map((p) =>
    //   p.Id === newid
    //     ? {
    //       ...p,
    //       IsActive: true,
    //     }
    //     : {
    //       ...p,
    //       IsActive: false,
    //     }
    // );

    // //console.log("after update data => ",newdata)

    // setDataList(newdata);
  };

  const getLocation = () => {
    APIService.getAll("Location/Get")
      .then((res) => {
        setLocationList(res.data);
        //console.log("getLocation =>", res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleEmployeeScan = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      setEmployeeCode(value);
      // โฟกัสไปช่องถัดไป
      setValue("EmployeeCode", value)
      console.log("setEmployeeCode:", value);
    }
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val == null ? setError(name, { type: "required" }) : clearErrors(name);
  };
  return (
    <>
      <FormTitle title={"ADD NEW"} home={"Receive"} />
      <div className="grid lg:grid-cols-6 gap-2">
        {/* header */}
        <div className="flex flex-col lg:col-span-2 xl:col-span-2  card p-2">
          {/* <form onSubmit={handleSubmit(onSubmit)} autoComplete="off"> */}
          <form>
            <div className=" lg:grid-cols-2 gap-2 ">
              <div>
                <FormInput
                  name="EmployeeCode"
                  label="EmployeeCode"
                  register={register}
                  type="text"
                  inputRef={employeeRef}
                  inputMode="none"
                  onKeyDown={(e) => {
                    handleEmployeeScan(e);
                  }}
                  onChange={(e) => {
                    setEmployeeCode(e.target.value);
                  }}
                  error={errors.EmployeeCode}
                  required
                />

              </div>
              <div >
                <Select
                  list={locationList}
                  onSelectItem={onSelectItem}
                  setValue={location}
                  name="Location"
                  label="Location"
                  register={register}
                  type="text"
                  required
                  error={errors.Location}
                />
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-2">
                <button type="submit" className="btn btn_primary  uppercase">
                  บันทึกข้อมูล
                </button>
                <button
                  type="button"
                  className="btn btn_outlined btn_info  uppercase ml-1"
                //onClick={handleClearClick}
                >
                  เคลียร์ข้อมูล
                </button>
                <button
                  type="button"
                  className="btn btn btn_secondary uppercase ml-1"
                //onClick={handleBackClick}
                >
                  กลับไปหน้าหลัก
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* details */}
        <div className="flex flex-col gap-y-2 lg:col-span-4 xl:col-span-4 ">
          <div>
            <ReceiveFormDetail
              onAddClick={handleAddClick}
            //onUpdateClick={handleUpdateDetailClick}
            //action={actionForm}
            //editdata={editData}
            //dataList={dataList}
            />
          </div>
          <div>
            <Table
              column={column}
              data={dataList}
              tableStyle={"list"}
              showSammary={true}
            //actionClick={buttonTableClick}
            />
          </div>
        </div>
      </div>

      {/* <MassageBox
        show={show}
        action={actionMsgBox}
        name={"Sale"}
        content={content}
        size={"xl"}
        Massage={"Are you sure want to delete this item?"}
        handleCancelClick={() => {
          setShow(false);
        }}
        onDeleteClick={handleDeleteDetailClick}
      />
      <div className={`${show ? "overlay active" : ""}`}></div> */}
      {/* 
      {showform && (
        <>
          <Modal
            show={showform}
            onCancelClick={handledCancelClick}
            onSaveChange={handledMasterSaveChange}
            action={"add"}
            name={form}
            size={"xl"}
            content={content}
            form={
              form === "car" ? (
                <CarFormAdd showButton={false} />
              ) : (
                <VatFormAdd showButton={false} />
              )
            }
          />
          <div className={`${showform ? "overlay active" : ""}`}></div>
        </>
      )} */}
      <CustomModal
        //show={showConfirm}
        //content={content}
        //action={"confirm"}
        name={"Sale"}
        size={"4xl"}
        // handleCancelClick={() => {
        //   setShowConfirm(false);
        //   setActionConfirm(false);
        //   // setErrMsgSave("");
        // }}
        form={
          <ReceiveConfirm
          //action={actionConfirm}
          //dataSelected={dataSave}
          //onSaveClick={handleSaveClick}
          // onBackClick={() => {
          //   setShowConfirm(false);
          //   setActionConfirm(false);
          //   // setErrMsgSave("");
          // }}
          />
        }
      />
      {/* <div className={`${showConfirm ? "overlay active" : ""}`}></div> */}
    </>
  )
}

export default ReceiveForm
