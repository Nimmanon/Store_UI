import { useState, useEffect } from "react";
// import * as XLSX from 'xlsx';
// import Moment from 'moment';
import { Link, useOutletContext } from "react-router-dom";

import Breadcrumb from "../modules/main/breadcrumb/Breadcrumb";
import ExportExcel from "./ExportExcel";
//import DataFormat from './DataFormat';
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import moment from "moment";

const Panel = ({
  onAddNew,
  onAddImport,
  onSearchChange,
  showBreadcrumb = true,
  showAdd,
  showExport,
  showImport,
  showSearch,
  showHelp = false,
  listView,
  rowView,
  columnView,
  setViewStyle,
  headExport,
  data,
  home,
  title,
  showSection = true,
  page,
  typeExport,
  showSendMail = false,
  onSendMailClick,
  showPrint = false,
  onPrintClick,
  showDownload = false,
  onDownloadClick,
  tableName = "",
  name = "",
}) => {
  // console.log("Panel data:", data);
  const [ActivePath, ActivePage] = useOutletContext(); // <-- access context value
  const [search, setSearch] = useState("");
  const [activeButton, setActiveButton] = useState("");
  //const [fileName, setFileName] = useState('');

  const selectViewStyle = (val) => {
    setViewStyle(val);
    setActiveButton(val);
  };

  useEffect(() => {
    if (JSON.stringify(search) !== JSON.stringify(data)) {
      onSearchChange(search);
    }
  }, [search]);

  const handleHelpClick = () => {
    if (page === undefined || page === null) return;

    window.open("/help/preview?data=" + btoa(page), "_blank");
  };

  const handelSendMailClick = () => {
    onSendMailClick();
  };

  const handelPrintClick = () => {
    onPrintClick();
  };

  const handelDownloadClick = () => {
    onDownloadClick();
  };

  return (
    <>
      <section className="breadcrumb lg:flex justify-between">
        {showBreadcrumb && (
          <Breadcrumb home={home} title={title} showSection={showSection} />
        )}
        <div className="flex flex-wrap gap-2 items-center ml-auto mr-auto lg:mt-0">
          {/* Layout */}
          <div className="flex gap-x-2">
            {listView && (
              <button
                onClick={() => selectViewStyle("list")}
                className={`btn btn-icon btn-icon_large btn_outlined ${
                  activeButton === "list" || activeButton === ""
                    ? "btn_primary"
                    : "btn_secondary"
                }`}
              >
                <span className="la la-bars" />
              </button>
            )}
            {rowView && (
              <button
                onClick={() => selectViewStyle("row")}
                className={`btn btn-icon btn-icon_large btn_outlined ${
                  activeButton === "row" ? "btn_primary" : "btn_secondary"
                }`}
              >
                <span className="la la-list" />
              </button>
            )}
            {columnView && (
              <button
                onClick={() => selectViewStyle("column")}
                className={`btn btn-icon btn-icon_large btn_outlined ${
                  activeButton === "column" ? "btn_primary" : "btn_secondary"
                }`}
              >
                <span className="la la-th-large" />
              </button>
            )}
          </div>
          {/* Search */}
          {showSearch && (
            <div className="flex flex-auto items-center">
              <label className="form-control-addon-within rounded-full bg-yellow-100">
                <input
                  type="text"
                  className="form-control border-none bg-yellow-100"
                  placeholder="Search"
                  onChange={(e) => {
                    e.preventDefault();
                    setSearch(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-link bg-yellow-100 text-primary text-xl leading-none la la-search mr-4 ml-4"
                  onClick={(e) => {
                    e.preventDefault();
                    onSearchChange(search);
                  }}
                />
              </label>
            </div>
          )}
          {/* Button */}
          <div className="flex gap-x-2">
            {showAdd && (
              <button onClick={onAddNew} className="btn btn_primary uppercase">
                <span className="la la-plus-circle text-xl leading-none mr-1"></span>
                Add New
              </button>
            )}
            {showImport && (
              <button
                onClick={onAddImport}
                className="btn btn_primary uppercase"
              >
                <span className="la la-file-import text-xl leading-none mr-1"></span>
                Import New
              </button>
            )}
            {showExport &&
              (typeExport === "custom" ? (
                <ReactHtmlTableToExcel
                  id="table-xls-button"
                  className="btn btn_primary btn_outlined uppercase"
                  table={tableName}
                  filename={name + "_" + moment().format("YYYYMMDD_HHmmss")}
                  sheet="Sheet"
                  buttonText="Export Data"
                />
              ) : (
                <ExportExcel
                  headExport={headExport}
                  data={data}
                  name={name}
                  typeExport={typeExport}
                />
              ))}
            {showSendMail && (
              <button
                type="button"
                className="btn btn_secondary uppercase"
                onClick={handelSendMailClick}
                title="send mail"
              >
                <span className="la la-envelope text-xl leading-none mr-1" />
                Send Email
              </button>
            )}
            {showPrint && (
              <button
                type="button"
                className="btn btn_success uppercase"
                onClick={handelPrintClick}
                title="print"
              >
                <span className="la la-print text-xl leading-none mr-1" />
                Print
              </button>
            )}
            {showDownload && (
              <button
                type="button"
                className="btn btn_info uppercase"
                onClick={handelDownloadClick}
                title="download"
              >
                <span className="la la-download text-xl leading-none mr-1" />
                Download
              </button>
            )}
          </div>
          {showHelp && (
            <div>
              <Link
                id={name}
                key={name}
                to={""}
                className="link"
                title="help"
                onClick={handleHelpClick}
              >
                <span className="icon la la-question-circle text-4xl" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Panel;
