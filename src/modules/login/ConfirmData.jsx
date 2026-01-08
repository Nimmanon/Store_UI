import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import { useNavigate } from "react-router-dom";
import MassageBox from "../../components/MassageBox";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/reducers/auth";
import Table from "../../components/Table";
import FormInput from "../../components/FormInput";

const ConfirmData = () => {
  const [dataList, setDataList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [customer, setCustomer] = useState();
  const [main, setMain] = useState("M2");
  const [action, setAction] = useState("add");
  const [contact, setContact] = useState();
  const [address, setAddress] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const effectRan = useRef(false);

  //system
  const [userId, setUserId] = useState();
  const [customerId, setCustomerId] = useState();
  const [addressId, setAddressId] = useState();

  const {
    register,
    formState: { errors },
    reset,
    getValues,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({
    defaultValues: {},
  });

  const column = [
    {
      label: "Address Info",
      key: "Address",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Province",
      key: "Province",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Postal",
      key: "Postal",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Branch",
      key: "Branch",
      align: "left",
      format: "string",
      export: true,
    },
  ];

  const columnContact = [
    {
      label: "E-mail",
      key: "Email",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Contact",
      key: "Name",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Tel",
      key: "Tel",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Phone",
      key: "Phone",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Fax",
      key: "Fax",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Main Contact",
      key: "IsMain",
      align: "center",
      format: "status",
      text: "Yes,No",
      export: true,
    },
    {
      label: "",
      key: "button",
      align: "center",
      format: "",
      action: [
        { event: "edit", display: true },
        { event: "delete", display: true },
      ],
    },
  ];

  useEffect(() => {
    if (effectRan.current === false) {
      setInitial();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (localStorage === undefined) return;
    setUserId(atob(localStorage.getItem("_userid")));
    setCustomerId(atob(localStorage.getItem("_customerid")));
    setAddressId(atob(localStorage.getItem("_addressid")));
  };

  useEffect(() => {    
    if (customerId === undefined) return;
    getCustomerById(customerId);
  }, [customerId]);

  const getCustomerById = (id) => {
    APIService.getById("Customer/GetById", id)
      .then((res) => {
        setCustomer(res.data);      
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {    
    if (customer === undefined || customer === null) return;
    getAddress(customer?.Id);
  }, [customer]);

  const getAddress = (id) => {
    if (id === undefined || id === null) return;

    APIService.getById("Address/GetByCustomerId", id)
      .then((res) => {
        console.log("GetByCustomerId => ", res.data);
        console.log("addressId => ", addressId);
        let datalist = res.data;
        if (customer?.IsMerge === false) {
          datalist = datalist?.filter((x) => Number(x.Id) === Number(addressId));
        }

        datalist?.forEach((item) => {
          item.Address =
            item.Address1 +
            " " +
            item.Address2 +
            " " +
            item.Address3 +
            " " +
            item.Address4;

          item.Contacts = item.Contacts?.filter((x) => x.IsActive === true);
        });
        console.log("datalist => ", datalist);
        setDataList(datalist);
        handleAddressClick(datalist[0]);
      })
      .catch((err) => console.log(err));
  };

  const handleAddressClick = (data) => {
    setAddress(data);
    clearForm();
  };

  useEffect(() => {
    if (address === null || address === undefined) return;

    setContactList(address?.Contacts);
  }, [address]);

  const handleContactSelected = (act, val) => {
    setAction(act);
    setContact(val);

    if (act === "edit") {
      setValue("Email", val?.Email);
      setValue("Name", val?.Name);
      setValue("Tel", val?.Tel);
      setValue("Phone", val?.Phone);
      setValue("Fax", val?.Fax);
      setValue("IsMain", val?.IsMain);
      setMain(val?.IsMain ? "M1" : "M2");
    } else {
      setShow(true);
      setMessage();
    }
  };

  const onSubmit = (data) => {
    data.AddressId = address?.Id;
    data.Id = contact?.Id;
    data.InputBy = userId;

    if (action === "add") {
      saveData(data);
    } else {
      updateData(data);
    }
  };

  const saveData = (data) => {
    data.InputBy = userId;
    APIService.Post("Contact/Post", data)
      .then((res) => {
        if (res.status !== 200) return;

        setContactList((prevItem) => {
          return [res.data, ...prevItem];
        });
        clearForm();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    let data = dataList?.map((p) =>
      p.Id === address?.Id ? { ...p, Contacts: contactList } : { ...p }
    );
    setDataList(data);
  }, [contactList]);

  const updateData = (item) => {
    item.InputBy = userId;
    APIService.Put("Contact/Put", item)
      .then((res) => {
        if (res.status !== 200) return;

        setContactList(contactList?.filter((x) => x.Id !== contact?.Id));
        setContactList((prevItem) => {
          return [res.data, ...prevItem];
        });

        clearForm();
      })
      .catch((err) => console.log(err));
  };

  const deleteData = () => {
    let data = {};
    data.Id = contact?.Id;
    data.InputBy = userId;
    APIService.Post("Contact/Delete", data)
      .then((res) => {
        if (res.status !== 200) return;

        let contacts = contactList?.filter((x) => x.Id !== contact?.Id);
        setContactList(contacts);

        setShow(false);
      })
      .catch((err) => console.log(err));
  };

  const clearForm = () => {
    reset();
    setAction("add");
    setMain("M2");
  };

  const handleConfirmClick = () => {
    APIService.getAll("Customer/Confirm/" + customerId + "/" + userId)
      .then((res) => {
        if (res.status !== 200) return;
        setShow(false);
        dispatch(loginUser(res.data));
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const handleBackClick = () => {
    navigate("/verifypassword");
  };

  const handleHelpClick = () => {
    window.open("/help/preview?data=" + btoa("profile"), "_blank");
  };

  return (
    <>
      <div className="p-3">
        <h4>
          <span className="la la-landmark text-xl leading-none mr-1" />
          {customer?.Name}
        </h4>
      </div>
      <div className="grid lg:grid-cols-1">
        <div className="lg:grid-cols-1">
          <div className="p-2">
            <div className="grid lg:grid-cols-2 gap-2">
              <div>
                <Table
                  column={column}
                  data={dataList}
                  tableStyle={"list"}
                  showPagging={false}
                  showSelectedRow={true}
                  selectedRowClick={handleAddressClick}
                  rowSelected={0}
                />
                <div className="flex mt-3">
                  <div>
                    <button
                      type="submit"
                      className="btn btn btn_info uppercase "
                      onClick={handleBackClick}
                    >
                      <span className="la la-chevron-circle-left text-xl leading-none mr-1" />
                      GO BACK
                    </button>
                  </div>
                  <div className="ml-2">
                    <div>
                      <button
                        type="button"
                        className="btn btn btn_success uppercase"
                        onClick={() => setShow(true)}
                      >
                        <span className="la la-check-circle text-xl leading-none mr-1" />
                        Confirm Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div>
                  {address !== undefined && (
                    <div className="card">
                      <div
                        className="p-2"
                        style={{ borderBottom: "1px solid #E7E5E4" }}
                      >
                        <h3>
                          Contact Info{" "}
                          {/* <button
                            type="button"
                            className="btn btn-icon btn-icon_small btn_outlined btn_primary uppercase"
                            title="help"
                            onClick={handleHelpClick}
                          >
                            ?
                          </button> */}
                        </h3>
                      </div>
                      <div className="grid lg:grid-cols-2 gap-2 p-2">
                        <div>
                          <FormInput
                            name="Email"
                            placeholder="E-mail"
                            label="E-mail"
                            type="text"
                            className="form-control"
                            register={register}
                            required
                            error={errors?.Email}
                          />
                        </div>
                        <div>
                          <FormInput
                            name="Name"
                            placeholder="Contact"
                            label="Contact"
                            type="text"
                            className="form-control"
                            register={register}
                          />
                        </div>
                        <div>
                          <FormInput
                            name="Tel"
                            placeholder="Tel"
                            label="Tel"
                            type="text"
                            className="form-control"
                            register={register}
                          />
                        </div>
                        <div>
                          <FormInput
                            name="Phone"
                            placeholder="Phone"
                            label="Phone"
                            type="text"
                            className="form-control"
                            register={register}
                          />
                        </div>
                        <div>
                          <FormInput
                            name="Fax"
                            placeholder="Fax"
                            label="Fax"
                            type="text"
                            className="form-control"
                            register={register}
                          />
                        </div>
                        <div className="flex flex-col lg:col-span-1 xl:col-span-1">
                          <label>Main Contact</label>
                          <div className="card p-2">
                            <div className="flex">
                              <label className="custom-radio">
                                <input
                                  name="IsMain"
                                  type="radio"
                                  value="M1"
                                  required
                                  checked={main === "M1" ? true : false}
                                  onChange={(e) => {
                                    setMain(e.target.value);
                                    setValue(
                                      "IsMain",
                                      e.target.value === "M1" ? true : false
                                    );
                                  }}
                                />
                                <span></span>
                                <span>YES</span>
                              </label>
                              <label className="custom-radio ml-5">
                                <input
                                  type="radio"
                                  name="IsMain"
                                  value="M2"
                                  required
                                  checked={main === "M2" ? true : false}
                                  onChange={(e) => {
                                    setMain(e.target.value);
                                    setValue(
                                      "IsMain",
                                      e.target.value === "M1" ? true : false
                                    );
                                  }}
                                />
                                <span></span>
                                <span>NO</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="btn btn btn_primary uppercase"
                          >
                            <span className="la la-save text-xl leading-none mr-1" />
                            {action === "edit" ? "Update" : "Add"} Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-3">
                    <Table
                      column={columnContact}
                      data={contactList}
                      tableStyle={"list"}
                      showPagging={false}
                      actionClick={handleContactSelected}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <MassageBox
        show={show}
        action={"confirm"}
        name={"Data"}
        //content={content}
        size={"xl"}
        Massage={
          action === "delete"
            ? "Are you sure want to delete data?"
            : "Are you sure want to confirm data?"
        }
        handleCancelClick={() => setShow(false)}
        onConfrimClick={action === "delete" ? deleteData : handleConfirmClick}
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
  );
};

export default ConfirmData;
