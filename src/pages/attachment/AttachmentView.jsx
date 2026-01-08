import { useState, useEffect, useRef, Fragment } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";

const AttachmentView = ({ data, size = "normal" }) => {
  const [file, setFile] = useState();
  const effectRan = useRef(false);

  const {
    register,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
    getValues,
  } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    if (data === undefined || data?.length === 0) return;
    //console.log("Attachment data => ", data);

    //data?.map((item) => {
    APIService.getByName("Upload/GetFile", data.Name).then((res) => {
      if (res.status !== 200) return;

      if (res.data !== undefined) {
        const file = new File([res.data?.Data], res.data?.Name, {
          type: res.data?.Type,
        });
        file.Name = res.data?.Name;
        file.Description = data?.Remark;
        file.src = "data:" + res.data?.Type + ";base64," + res.data?.Data;
        file.action = "edit";

        //   setFileList((prevItem) => {
        //     return prevItem === null ? [file] : [file, ...prevItem];
        //   });
        setFile(file);
      }
    });
    //});
  }, [data]);

  const handlePreview = (file) => {
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

  return (
    <>
      <div className={`grid gap-3 p-2 ${size==="small" ? "lg:grid-cols-6" : "lg:grid-cols-3"}`}>
        <div>
          <img
            src={file?.src}
            onClick={(e) => handlePreview(file)}
            style={{ cursor: "pointer" }}
            title="preview"
          />
        </div>
        <div className={`${size==="small" ? "lg:col-span-5" : "lg:col-span-2"}`}>{file?.Description}</div>
      </div>
    </>
  );
};

export default AttachmentView;
