import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import moment from "moment";

const ExportExcel = ({
  data,
  headExport,
  name,
  mini = false,
  showExportDate = false,
}) => {
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setFileName(name + "_" + moment().format("YYYY-MM-DD_HH:mm:ss"));
  }, [name]);
 
  const handleOnExport = () => {
    if (headExport) {
      // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
      let exportData = data?.map((item) => {
        return selectColumn(item);
      });
  
      if (showExportDate) {
        // สร้างฟังก์ชันสำหรับแปลงวันที่ให้อยู่ในรูปแบบ dd/MM/yyyy HH:mm
        const formatDate = (date) => {
          const options = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          };
          return new Intl.DateTimeFormat("en-GB", options).format(date);
        };
  
        // ดึงวันที่และเวลาในรูปแบบที่ต้องการ
        const currentDateTime = formatDate(new Date());
  
        // สร้าง Worksheet ว่าง
        const worksheet = XLSX.utils.json_to_sheet([]);
  
        // เพิ่มวันที่ใน Row 1
        XLSX.utils.sheet_add_aoa(
          worksheet,
          [[`Export Date: ${currentDateTime}`]],
          { origin: "A1" }
        );
  
        // Merge Cell สำหรับแถววันที่
        worksheet["!merges"] = [
          {
            s: { r: 0, c: 0 },
            e: { r: 0, c: Object.keys(exportData[0]).length - 1 },
          }, // Merge ตั้งแต่ A1 ถึงคอลัมน์สุดท้าย
        ];
  
        // กำหนดฟอนต์สำหรับแถววันที่
        worksheet["A1"].s = {
          font: { sz: 12, bold: true }, // ขนาดตัวอักษร
        };
  
        // เพิ่มหัวข้อคอลัมน์ใน Row 2
        const headerRow = Object.keys(exportData[0]);
  
        // เพิ่มหัวคอลัมน์ใน Row 2 และกำหนดฟอนต์
        XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: "A2" });
  
        // กำหนดฟอนต์สำหรับหัวข้อคอลัมน์
        headerRow.forEach((header, index) => {
          const cellAddress = XLSX.utils.encode_cell({ r: 1, c: index });
          worksheet[cellAddress].s = {
            font: {
              sz: 12, // ขนาดตัวอักษร
              bold: true, // ตัวหนา
            },
          };
        });
  
        // เพิ่มข้อมูลจริงใน Row 3 เป็นต้นไป
        XLSX.utils.sheet_add_json(worksheet, exportData, {
          origin: "A3",
          skipHeader: true,
        });
  
        // กำหนดฟอนต์สำหรับข้อมูลในแถวที่เหลือ
        exportData.forEach((rowData, rowIndex) => {
          Object.keys(rowData).forEach((key, colIndex) => {
            const cellAddress = XLSX.utils.encode_cell({
              r: rowIndex + 2,
              c: colIndex,
            });
            worksheet[cellAddress].s = {
              font: {
                sz: 10, // ขนาดตัวอักษร
              },
            };
          });
        });
  
        // สร้าง Workbook และเพิ่ม Worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
        // บันทึกไฟล์ Excel
        XLSX.writeFile(workbook, fileName + ".xlsx");
      } else {
        const worksheet = XLSX.utils.json_to_sheet(exportData);
  
        // กำหนดฟอนต์สำหรับข้อมูลใน worksheet
        exportData.forEach((rowData, rowIndex) => {
          Object.keys(rowData).forEach((key, colIndex) => {
            const cellAddress = XLSX.utils.encode_cell({
              r: rowIndex + 1,
              c: colIndex,
            });
            worksheet[cellAddress].s = {
              font: {
                sz: 10, // ขนาดตัวอักษร
              },
            };
          });
        });
  
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, fileName + ".xlsx");
      }
    }
  };  

  const selectColumn = (item) => {
    const container = {};
    headExport
      .filter((x) => x.export === true)
      .forEach((val) => {
        // console.log("val=>", val);
        let data = val.key.includes(".")
          ? item[val.key.split(".")[0]] === null
            ? null
            : item[val.key.split(".")[0]][val.key.split(".")[1]]
          : val.type === "object"
          ? item[val.key][val.sort]
          : item[val.key];

        // console.log("item[val.sort]=>",item[val.sort]);
        // console.log("item[val.key]=>",item[val.key]);
        // console.log("selectColumn=>",data);

        // หาก type เป็น 'object' และ data เป็น object ให้ดึงค่าเฉพาะ 'Name'
        // if (val.type === "object" && typeof data === "object" && data !== null) {
        //   data = data.Name || ""; // ดึงค่า 'Name' หรือใช้ค่าตั้งต้นถ้าไม่มี
        // } else if (typeof data === "object" && data !== null) {
        //   data = JSON.stringify(data); // แปลงเป็น string ถ้าไม่ใช่ type 'object'
        // }

        container[val.label] = setFormat(data, val.format, val.digit, val.text);
      });
    return container;
  };

  const setFormat = (data, format, digit, text) => {
    if (data === undefined) return;
    //console.log("FormatCase => ", data, format, digit)
    switch (format) {
      case "number":
        let dg = isNaN(digit)
          ? data?.toString()?.includes(".")
            ? 2
            : 0
          : digit;
        return Number(
          Number(data)?.toLocaleString(undefined, {
            minimumFractionDigits: dg,
            maximumFractionDigits: dg,
            useGrouping: false,
          })
        );
        break;
      case "textonum":
        return !isNaN(data)
          ? Number(
              Number(data)?.toLocaleString(undefined, {
                minimumFractionDigits: digit,
                maximumFractionDigits: digit,
                useGrouping: false,
              })
            )
          : data;
        break;
      case "string":
        return data;
        break;
      case "datetime":
        return data === null ? "" : moment(data).format("DD/MM/YYYY HH:mm:ss");
        break;
      case "date":
        return data === null ? "" : moment(data).format("DD/MM/YYYY");
        break;
      case "shotdate":
        return data === null ? "" : moment(data).format("DD-MMM-YY");
        break;
      case "shotdatetime":
        return data === null ? null : moment(data).format("DD-MMM-YY HH:mm");
        break;
      case "shotdatetime2":
        return data === null ? null : moment(data).format("DD/MM/YY HH:mm");
        break;
      case "tag":
        return data;
        break;
      case "status":
        return data === true ? text.split(",")[0] : text.split(",")[1];
        break;
      case "warning":
        return data;
        break;
      case "progress":
        //0:before,1:process,2:complete,3:void
        return data?.Name;
        break;
    }
  };

  return (
    <div>
      {mini && (
        <button
          type="submit"
          className="btn btn_info ml-1"
          onClick={handleOnExport}
          title="Export excel"
        >
          <span className="la la-file-excel text-base leading-none" />
        </button>
      )}
      {!mini && (
        <button
          onClick={handleOnExport}
          className="btn btn_primary btn_outlined uppercase"
        >
          <span className="la la-file-alt text-xl leading-none"></span>
          Export Data
        </button>
      )}
    </div>
  );
};

export default ExportExcel;
