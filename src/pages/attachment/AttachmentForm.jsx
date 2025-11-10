import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import Textarea from "../../components/Textarea";
import Pagination from "../../components/Pagination";

const AttachmentForm = ({
  data,
  action,
  onFileSelect,
  showDesc = false,
  maxImage = 3,
  multiple = true,
  format = "card", //card or row
  showPagging = true,
  showCard = true,
}) => {
  const [file, setFile] = useState();
  const [fileList, setFileList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [error, setError] = useState();
  const [isFile, setIsFile] = useState(false);

  const [isSubmit, setIsSubmit] = useState(false);

  //pager
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const effectRan = useRef(false);

  const {
    register,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
    getValues,
  } = useForm({
    defaultValues: {
      Description: "",
    },
  });

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    reset();
    setFileList([]);
    setFile();
  };

  const compare = (a, b) => {
    if (a.Id < b.Id) {
      return -1;
    }
    if (a.Id > b.Id) {
      return 1;
    }
  };

  const getFile = async (data) => {
    try {
      const res = await APIService.getByName("Upload/GetFile", data.Name);
      if (res.status !== 200 || res.data === undefined) return null;
  
      const files = new File([res.data.Data], res.data.Name, {
        type: res.data.Type,
      });
      files.Id = data.Id;
      files.Name = res.data.Name;
      files.Description = data.Description;
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

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
  
      if (!data || data.length === 0) return;
      //console.log("get file data => ", data);
  
      if (!multiple) {
        const file = await getFile(data);        
        setFile(file);
      } else {
        const fileList = await Promise.all(
          data.sort(compare).map(async (item) => await getFile(item))
        );
        setFileList(fileList.filter((file) => file !== null));
      }
    };
  
    fetchData();
  }, [data]);

  const handleFileChange = (e) => {
    //console.log('handleFileChange=>', e);
    setError();

    if ((e !== undefined) & (e !== null)) {
      let name = e?.target?.name;
      let [file] = e.target.files;
      file.src = URL.createObjectURL(file);

      //check size > 1MB
      // if (file?.size > 1000000) {
      //   setError({ type: "size" });
      //   return;
      // }

      //check format
      if (
        ![
          "image/jpg",
          "image/jpeg",
          "image/png",
          "image/gif",
          "application/pdf",
          // "application/xls",
          // "application/xlsx",
          // "application/doc",
          // "application/docx",
          // "application/ppt",
          // "application/pptx",
        ].includes(file?.type)
      ) {
        setError({ type: "format" });
        return;
      }

      //check file type
      if (
        [
          "application/pdf",
          "application/xls",
          "application/xlsx",
          "application/doc",
          "application/docx",
          "application/ppt",
          "application/pptx",
        ].includes(file?.type)
      ) {
        setIsFile(true);
      } else {
        setIsFile(false);
      }

      uploadFile(file);
    }
  };

  const uploadFile = (file) => {
    const formData = new FormData();
    let filename = file.name;
    formData.append("file", file, filename);

    APIService.Post("Upload/UploadImage", formData)
      .then((res) => {
        if (res.status !== 200) return;

        let newFile = file;
        newFile.Name = file?.name;
        newFile.IsFile = isFile;

        if (file.name !== res.data) {
          //revised file name if exits
          const fd = new FormData();
          fd.append("file", file, res.data);

          newFile = fd.get("file");
          newFile.Name = res.data;
          newFile.src = URL.createObjectURL(newFile);
          newFile.action = "add";
        }

        if (!multiple) {
          setFile(newFile);
          onFileSelect(newFile);
        } else {
          if (showDesc) {
            setFile(newFile);
          } else {
            setFileList((prevItem) => {
              return [...prevItem, newFile];
            });

            //if (maxImage === 1) handleAddClick();
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const handleAddClick = () => {
    setIsSubmit(true);

    file.Description = getValues("Description");
    file.IsFile = isFile;

    setFileList((prevItem) => {
      return [...prevItem, file];
    });

    setFile();
    setValue("Description", "");
  };

  const handlePreviewClick = (file) => {
    if (file === undefined || file === null) return;

    if (file?.action === "edit") {
      const newWindow = window.open();
      const imageHtml = `<html style="height: 100%;">
                                <head>
                                    <title>${file?.name}</title>
                                    <link rel="icon" href="/favicon.ico">                       
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                </head>
                                <body style="margin: 0px; background: #0e0e0e; height: 100%">
                                    <img src="${file?.src}"
                                        style="position: absolute;
                                        top: 50%;
                                        left: 50%;
                                        transform: translate(-50%, -50%);
                                        -ms-transform: translate(-50%, -50%); 
                                        -webkit-transform: translate(-50%, -50%);"
                                    />
                                </body>
                            </html>`;
      newWindow.document.write(imageHtml);
    } else {
      window.open(file?.src, "_blank");
    }
  };

  const removeFileClick = (e, index) => {
    setIsSubmit(true);

    let [item] = fileList.filter((item, i) => i === index);

    let items = fileList.filter((item, i) => i !== index);
    setFileList(items);

    //clear Error
    if (error !== undefined) error.type = "";
  };

  useEffect(() => {
    getData();

    if (!isSubmit) return;
    onFileSelect(fileList);
    setIsSubmit(false);
  }, [fileList]);

  const handleClearClick = () => {
    setFile();
    setValue("Description", "");
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  const getData = () => {
    if (showPagging === true) {
      if (fileList?.length == 0) {
        setDataList([]);
      } else {
        const list = fileList?.slice(
          (currentPage - 1) * pageSize,
          (currentPage - 1) * pageSize + pageSize
        );
        setDataList(list);
      }
    } else {
      setDataList(fileList);
    }
  };

  const goPreviousClick = () => {
    if (currentPage == 1) return;
    setCurrentPage(currentPage - 1);
  };

  const goNextClick = () => {
    if (Math.ceil(fileList?.length / pageSize) == currentPage) return;
    setCurrentPage(currentPage + 1);
  };

  const goFirstPage = () => {
    setCurrentPage(1);
  };

  const goLastPage = () => {
    setCurrentPage(Math.ceil(fileList?.length / pageSize));
  };

  return (
    <>
      {fileList?.length < maxImage && action !== "view" && (
        <div className={`${showCard ? "card p-3" : ""}`}>
          <div>
            {!showDesc && multiple && (
              <label> {fileList?.length} files selected.</label>
            )}

            <div className="grid lg:grid-cols-4 gap-3">
              {file !== undefined && !isFile && (
                <div className="lg:grid-cols-1">
                  <div className="aspect-w-2 aspect-h-1">
                    <img
                      src={file?.src}
                      onClick={(e) => handlePreviewClick(file)}
                      style={{ cursor: "pointer" }}
                      title="preview"
                    />
                  </div>
                </div>
              )}

              <div className={`${file ? "lg:col-span-3" : "lg:col-span-4"}`}>
                <div /*className="file-upload"*/>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="input-container">
                    <input
                      type="text"
                      id="fileName"
                      readOnly
                      placeholder={!file ? "No file chosen" : file?.name}
                      className="w-72"
                    />
                    {file && (
                      <label
                        className="preview-btn"
                        onClick={(e) => handlePreviewClick(file)}
                      >
                        <span className="la la-search text-xl leading-none"></span>
                        Preview
                      </label>
                    )}

                    <label htmlFor="fileInput" className="browse-btn">
                      <span className="la la-folder-open text-xl leading-none"></span>
                      Browse...
                    </label>
                  </div>
                </div>
                {error && (
                  <small className="block mt-1 invalid-feedback">
                    {error?.type === "size"
                      ? "ไฟล์ต้องขนาดไม่เกิน 1 MB"
                      : error?.type === "format"
                      ? "เฉพาะไฟล์ jpg, jpeg, png, gif, pdf เท่านั้น"
                      : ""}
                  </small>
                )}

                {showDesc && file !== undefined && (
                  <div className="mt-5">
                    <Textarea
                      name="Description"
                      label=""
                      placeholder="คำอธิบาย"
                      register={register}
                      type="text"
                      row={2}
                    />
                  </div>
                )}
                {multiple && file !== undefined && (
                  <div>
                    <button
                      type="button"
                      className="btn btn_info uppercase"
                      onClick={handleAddClick}
                    >
                      <span className="la la-download text-xl leading-none mr-1"></span>
                      Add File
                    </button>
                    <button
                      type="button"
                      className="btn btn_outlined btn_secondary uppercase ml-1"
                      onClick={handleClearClick}
                    >
                      <span className="la la-eraser text-xl leading-none mr-1"></span>
                      Clear File
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {format === "card" && (
        <div
          className={`grid lg:grid-cols-6 gap-1 ${
            fileList?.length < maxImage && action !== "view" ? "mt-5" : ""
          } ${fileList?.length > 0 ? "p-2" : ""}`}
        >
          {fileList?.map((item, index) => (
            <div
              className="flex flex-col lg:col-span-2 xl:col-span-2"
              key={index}
            >
              <div
                className="card_row card_hoverable"
                style={{ flexDirection: "inherit" }}
              >
                <div>
                  <div
                    className="image card"
                    style={{ margin: "0.45rem", minWidth: "0px" }}
                  >
                    <div className="aspect-w-4 aspect-h-3">
                      <img
                        src={item.src}
                        onClick={(e) => handlePreviewClick(item)}
                        style={{ cursor: "pointer" }}
                        //className="h-80 w-72 object-cover rounded-t-xl"
                        className={`${
                          showDesc ? "h-80 w-72 object-cover rounded-t-xl" : ""
                        }`}
                      />
                    </div>
                    {showDesc && (
                      <div className="px-4 py-3 w-72">
                        <div className="flex">
                          <p className="text-sm text-gray-600 cursor-auto">
                            {item?.Description}
                          </p>
                        </div>
                      </div>
                    )}

                    {action !== "view" && (
                      <div>
                        <button
                          type="button"
                          className="btn btn_danger btn-icon btn_outlined uppercase absolute top-0 right-0 rtl:left-0 mt-2 rtl:ml-1 mr-1 cursor-pointer"
                        >
                          <span
                            className="la la-remove"
                            title="remove"
                            onClick={(e) => removeFileClick(e, index)}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {format === "row" && (
        <>
          <div
            className={`grid lg:grid-cols-1 gap-1 ${
              fileList?.length === maxImage ? "" : "mt-2"
            }`}
          >
            {dataList?.map((item, index) => (
              <div className="flex flex-col gap-y-2" key={index}>
                <div className="card card_row card_hoverable">
                  <div>
                    {item?.IsFile ? (
                      <>
                        <div className="p-3 flex items-center text-center lg:transform transition-transform duration-200">
                          <div>
                            <span
                              className="text-primary text-5xl leading-none la la-file-alt"
                              onClick={(e) => handlePreviewClick(item)}
                              style={{ cursor: "pointer" }}
                            ></span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="image" style={{ margin: "0.75rem" }}>
                        <div className="aspect-w-2 aspect-h-1">
                          <img
                            src={item.src}
                            onClick={(e) => handlePreviewClick(item)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="header w-full" style={{ marginLeft: "1rem" }}>
                    {item?.IsFile && <p className="mt-1">{item?.Name}</p>}
                    {item?.Description === "" || item?.Description === undefined
                      ? ""
                      : item?.Description}
                  </div>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn_danger btn-icon btn_outlined"
                    >
                      <span
                        className="la la-trash-alt"
                        title="remove"
                        onClick={(e) => removeFileClick(e, index)}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {fileList?.length > pageSize && (
            <div className="card p-1 mt-2">
              <Pagination
                page={currentPage}
                totalpage={Math.ceil(fileList?.length / pageSize)}
                columnpage={pageSize}
                onPreviousClick={goPreviousClick}
                onNextClick={goNextClick}
                onFirstPageClick={goFirstPage}
                onLastPageClick={goLastPage}
                onPageChange={(page) => setColumnpage(page)}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AttachmentForm;
