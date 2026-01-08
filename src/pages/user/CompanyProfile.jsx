import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import MassageBox from "../../components/MassageBox";
import Table from "../../components/Table";
import FormInput from "../../components/FormInput";
import { useSelector, useDispatch } from "react-redux";
import Panel from "../../components/Panel";

const CompanyProfile = () => {
  const [dataList, setDataList] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [customer, setCustomer] = useState(false);
  const [main, setMain] = useState("M2");
  const [action, setAction] = useState("add");
  const [contact, setContact] = useState();
  const [address, setAddress] = useState();

  const [search, setSearch] = useState();

  //table
  const [rowSelected, setRowSelected] = useState();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const [userAddress, setUserAddress] = useState();

  const effectRan = useRef(false);

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
      document.title = "COP : PROFILE";
      setInitial();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (localStorage === undefined) return;
    setUserId(atob(auth.Id));
    setCustomer(JSON.parse(auth.Customer));
    setUserAddress(JSON.parse(auth.Address));
  };

  useEffect(() => {
    if (customer === undefined) return;
    getAddress(customer?.Id);
  }, [customer]);

  const getAddress = (id) => {
    if (id === undefined) return;
    APIService.getById("Address/GetByCustomerId", id)
      .then((res) => {

        let datalist = res.data;        
        if (customer?.IsMerge === false) {
          datalist = datalist?.filter((x) => x.Id === userAddress?.Id);
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
        setDataList(datalist);
        setRowSelected(0);
        handleAddressClick(datalist[0]);
        //console.log("address data =>", res.data);
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

  const handleAddressClick = (data) => {
    setAddress(data);
    clearForm();
  };

  useEffect(() => {
    if (address === null || address === undefined) return;

    setContactList(address?.Contacts);
  }, [address]);

  const handleContactClick = (act, val) => {
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

        if (data?.IsMain) {
          let contacts = contactList?.map((p) =>
            p.Id !== res.data?.Id ? { ...p, IsMain: false } : { ...p }
          );
          setContactList(contacts);
        }

        setContactList((prevItem) => {
          return [res.data, ...prevItem];
        });

        clearForm();
      })
      .catch((err) => console.log(err));
  };

  const updateData = (data) => {
    data.InputBy = userId;
    APIService.Put("Contact/Put", data)
      .then((res) => {
        if (res.status !== 200) return;

        if (data?.IsMain) {
          let contacts = contactList?.map((p) =>
            p.Id !== res.data?.Id ? { ...p, IsMain: false } : { ...p }
          );
          setContactList(contacts);
        }
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

        setContactList(contactList?.filter((x) => x.Id !== contact?.Id));
        setShow(false);
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

  const clearForm = () => {
    reset();
    setAction("add");
    setMain("M2");
  };

  const handleSearch = (textSearch) => {
    setSearch(textSearch);
  };

  useEffect(() => {
    if (search === undefined) return;
    getSearch(search);
  }, [search]);

  const getSearch = () => {
    //console.log("get search => ",search);
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

  return (
    <>
      <div>
        <Panel
          onSearchChange={handleSearch}
          showSearch={true}
          showHelp={true}
          showSection={false}
          page={"Profile"}
          home={"Profile"}
          title={customer?.Name}
        />
        <div className="grid lg:grid-cols-1 p-1">
          <div className="lg:grid-cols-1">
            <div className="grid lg:grid-cols-2 gap-2">
              <div className="mt-1">
                <Table
                  column={column}
                  data={dataTable}
                  tableStyle={"list"}
                  showPagging={false}
                  showSelectedRow={true}
                  selectedRowClick={handleAddressClick}
                  rowSelected={rowSelected}
                />
              </div>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="mt-1">
                  {address !== undefined && (
                    <div className="card">
                      <div
                        className="p-3"
                        style={{ borderBottom: "1px solid #E7E5E4" }}
                      >
                        <h3>Contact Info</h3>
                      </div>
                      <div className="grid lg:grid-cols-2 gap-1 p-3">
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
                        <div className="mt-2">
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
                  <div className="mt-2">
                    <Table
                      column={columnContact}
                      data={contactList}
                      tableStyle={"list"}
                      showPagging={false}
                      actionClick={handleContactClick}
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
        Massage={"Are you sure want to delete data?"}
        handleCancelClick={() => setShow(false)}
        onConfrimClick={deleteData}
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
  );
};

export default CompanyProfile;
