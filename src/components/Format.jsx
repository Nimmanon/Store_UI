import moment from "moment";
import React from "react";
import { useEffect } from "react";

const Format = ({ data, format, digit, text }) => {
  useEffect(() => {
    if (data === undefined || data === "" || data === null) return;
    //console.log("Data Format => ", data, " format => ", format);
  }, [data]);

  switch (format) {
    case "number":
      return data?.toLocaleString(undefined, {
        minimumFractionDigits: digit,
        maximumFractionDigits: digit,
      });
      break;
    case "textonum":
      return !isNaN(data)
        ? Number(data)?.toLocaleString(undefined, {
          minimumFractionDigits: digit,
          maximumFractionDigits: digit,
        })
        : data;
      break;
    case "string":
      return <span style={{ whiteSpace: "pre-line" }}>{data}</span>;
      break;
    case "datetime":
      return data === null ? null : moment(data).format("DD/MM/YYYY HH:mm:ss");
      break;
    case "date":
      return data === null ? null : moment(data).format("DD/MM/YYYY");
      break;
    case "date2":
      return data === null ? null : moment(data).format("DD/MM/YY");
      break;
    case "shotdate":
      return data === null ? null : moment(data).format("DD-MMM-YY");
      break;
    case "shotdatetime":
      return data === null ? null : moment(data).format("DD-MMM-YY HH:mm");
      break;
    case "shotdatetime2":
      return data === null ? null : moment(data).format("DD/MM/YY HH:mm");
      break;
    case "tag":
      return (
        <div
          className={`badge ${["voided", "disapproved", "ยกเลิก", "ไม่อนุมัติ"]?.includes(
            data?.toLowerCase()
          )
            ? "badge_danger"
            : "badge_info"
            }`}
        >
          {data}
        </div>
      );
      break;
    case "status":
      return (
        <div
          className={`badge ${data === true ? "badge_info" : "badge_warning"}`}
        >
          {data === true ? text.split(",")[0] : text.split(",")[1]}
        </div>
      );
      break;

    //aging
    case "aging": {
      // console.log("ROW:", data);
      const aging = Number(data ?? 3);
      let cls = "badge_secondary"; // ค่าเริ่มต้น
      if (aging >= 1 && aging <= 3) {
        cls = "badge_success"; // เขียว
      } else if (aging >= 4 && aging <= 6) {
        cls = "badge_warning"; // เหลือง
      } else if (aging >= 7) {
        cls = "badge_danger"; // แดง
      }

      return (
        <div className={`badge ${cls}`}>
          {aging}  วัน
        </div>
      );
    }
      break;

    case "statusmat": {
      const statusText = data ?? ""; // ป้องกัน undefined
      //console.log("statusText =>", statusText);

      let cls = ""; // เริ่มต้นยังไม่กำหนดสี

      if (statusText?.includes("ติด MAT")) {
        cls = "badge_danger"; // สีแดง
      } else if (statusText?.includes("MAT ครบ")) {
        cls = "badge_warning"; // สีเหลือง
      } else {
        cls = "badge_success"; // สีเขียว (เฉพาะกรณีอื่น)
      }

      return (
        <div className={`badge ${cls}`}>
          {statusText}
        </div>
      );
    }
      break;

    // // status
    // case "statusmat": {
    //   const statusText = data; // ดึงข้อความสถานะ
    //   console.log("statusText =>", statusText)
    //   let cls = "badge_success"; // ค่าเริ่มต้นสีเขียว
    //   if (statusText.includes("ติด MAT")) {
    //     cls = "badge_danger"; // สีแดง
    //   } else if (statusText.includes("MAT ครบ")) {
    //     cls = "badge_warning"; // สีเหลือง
    //   }

    //   return (
    //     <div className={`badge ${cls}`}>
    //       {statusText}
    //     </div>
    //   );
    // }
    //   break;

    case "multistatus":
      return (
        <div
          className={`badge ${Number(data?.Value) === 1 //complete
            ? "badge_primary"
            : Number(data?.Value) === 2 //waiting
              ? "badge_warning"
              : Number(data?.Value) === 3 //error
                ? "badge_danger"
                : "badge_danger"
            }`}
        >
          {data?.Name}
        </div>
      );
      break;
    case "warning":
      return <div className={`badge badge_danger`}>{text}</div>;
      break;
    case "piority":
      return (
        <div
          className={`badge ${data.toLowerCase() === "low"
            ? "badge_info"
            : data.toLowerCase() === "medium"
              ? "badge_warning"
              : "badge_danger"
            }`}
        >
          {data}
        </div>
      );
      break;
    case "category":
      return (
        <div
          className={`badge ${data === 0
            ? "badge_warning"
            : data === 1
              ? "badge_success"
              : "badge_info"
            }`}
        >
          {data === 0
            ? text.split(",")[0]
            : data === 1
              ? text.split(",")[1]
              : text.split(",")[2]}
        </div>
      );
      break;
    case "progress":
      //0:before,1:process,2:complete,3:void
      return (
        <div
          className={`badge ${data?.Progress === 0 //open
            ? "badge_secondary"
            : data?.Progress === 1 //waiting
              ? "badge_warning"
              : data?.Progress === 2 //in progress
                ? "badge_primary"
                : data?.Progress === 3 //wait confirm
                  ? "badge_info"
                  : data?.Progress === 4 //complete
                    ? "badge_success"
                    : "badge_danger"
            }`}
        >
          {data?.Name}
        </div>
      );
      break;
    case "boolean":
      return data?.toLocaleString();
      break;
  }
};

export default Format;
