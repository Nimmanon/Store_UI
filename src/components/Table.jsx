// import { useState, useEffect, useRef } from "react";
// import Pagination from "./Pagination";
// import loading from "../image/loading2.gif";
// // import moment from 'moment';
// import Format from "./Format";
import { useState, useEffect, useRef } from "react";
import Pagination from "./Pagination";
import loading from "../assets/image/loading2.gif";
import Format from "./Format";


//let PageSize = 10;

//const Table = React.forwardRef(({ data, column,actionClick }, ref) => {
const Table = ({
  subTable,
  data,
  column,
  actionClick,
  tableStyle,
  isLoading,
  showPagging = false,
  showPaggingButton = true,
  checkClick,
  radioClick,
  showSammary = false,
  dataTotal,
  allCheckClick,
  showCard = true,
  selectedRowClick,
  showSelectedRow = false,
  rowSelected,
  pageSize = 10,
  showCheckAll = true
}) => {
  const [columnpage, setColumnpage] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  //sort
  const [sortReverse, setSortReverse] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [totalList, setTotalList] = useState([]);

  //select row
  const [active, setActive] = useState();

  const [PageSize, setPageSize] = useState(pageSize);

  useEffect(() => {
    setColumnpage(PageSize);
  }, [PageSize]);

  useEffect(() => {
    //if (data.length === 0) return;
    if (JSON.stringify(dataList) !== JSON.stringify(data)) {
      getData();
      //console.log("Table effect data => ", data);
      if (showSammary) setTotalList(SummaryColumn(data, column, dataTotal));
    }
    // if (showSammary)
    //     setTotalList(SummaryColumn(data, column));
    //console.log("showSammary =>", column.length);
  }, [data]);

  useEffect(() => {
    getData();
  }, [columnpage]);

  useEffect(() => {
    getData();
  }, [currentPage]);

  const getData = () => {
    if (showPagging === true) {
      if (data?.length == 0) {
        setDataList([]);
      } else {
        const list = data?.slice(
          (currentPage - 1) * columnpage,
          (currentPage - 1) * columnpage + columnpage
        );
        setDataList(list);
      }
    } else {
      setDataList(data);
    }
  };

  const goPreviousClick = () => {
    if (currentPage == 1) return;
    setCurrentPage(currentPage - 1);
  };

  const goNextClick = () => {
    if (Math.ceil(data?.length / columnpage) == currentPage) return;
    setCurrentPage(currentPage + 1);
  };

  const goFirstPage = () => {
    setCurrentPage(1);
  };

  const goLastPage = () => {
    setCurrentPage(Math.ceil(data?.length / columnpage));
  };

  const sortOrders = (item) => {
    //his.sortIcon = this.sortReverse == true ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc';
    //console.log("table sortOrder => ",data, item);
    setSortReverse(!sortReverse);
    let type = item?.type === undefined ? "string" : item.type;
    data?.sort(dynamicSort(item, type));
    getData();
  };

  const dynamicSort = (item, type) => {
    let sortOrder = -1;
    let property = "";

    if (type === "object") {
      property = item.sort;

      if (sortReverse) {
        sortOrder = 1;
      }

      return function (a, b) {
        a = a[item.key] === null ? null : a[item.key][property];
        b = b[item.key] === null ? null : b[item.key][property];

        let result = a < b ? -1 : a > b ? 1 : 0;
        return result * sortOrder;
      };
    } else {
      property = item.key;

      if (sortReverse) {
        sortOrder = 1;
      }

      return function (a, b) {
        //console.log("sort => ", a);
        let result =
          a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
      };
    }
  };

  const handleAllCheckClick = (e) => {
    allCheckClick(e);
  };

  const handleSelectedRow = (data, index) => {
    // console.log("tablecomponents selectrow data =>",data);
    // console.log("tablecomponents selectrow data =>",index);
    setActive(index);
    if (showSelectedRow) selectedRowClick(data, index);
  };

  useEffect(() => {
    //console.log("rowSelected => ", rowSelected);
    setActive(rowSelected);
  }, [rowSelected]);

  // useEffect(() => {
  //   console.log("active => ", active);
  // }, [active]);

  return (
    <div>
      {tableStyle === "list" && (
        <div className={`${showCard ? "card p-2" : "p-2"}`}>
          <div className="overflow-x-auto">
            <table className="table table-auto w-full">
              {/* table_striped */}
              <thead>
                <tr>
                  {column.map((item, index) => (
                    <TableHeadItem
                      key={index}
                      item={item}
                      clickSort={(x) => sortOrders(item)}
                      allClick={handleAllCheckClick}
                      data={dataList}
                      showCheckAll={showCheckAll}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataList?.length === 0
                  ? !isLoading && (
                    <tr>
                      <td
                        className="text-center font-semibold"
                        colSpan={column.length}
                      >
                        <strong className="text-red-500">
                          Data not found !!!
                        </strong>
                      </td>
                    </tr>
                  )
                  : dataList?.map((item, index) => (
                    <TableRow
                      eventClick={actionClick}
                      eventCheckClick={checkClick}
                      eventRadioClick={radioClick}
                      subTable={subTable}
                      key={index}
                      item={item}
                      column={column}
                      index={index}
                      active={active === index}
                      onSelectedRow={() => handleSelectedRow(item, index)}
                    />
                  ))}
              </tbody>
              {isLoading && (
                <tfoot>
                  <tr>
                    <td colSpan={column.length}>
                      <div className="flex justify-center">
                        <img src={loading} alt="loading..." />
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
              {showSammary && (
                <thead>
                  <tr>
                    {column.map((item, index) => (
                      <TableSummary key={index} item={item} data={totalList} />
                    ))}
                  </tr>
                </thead>
              )}
            </table>
          </div>
        </div>
      )}
      {tableStyle === "row" && (
        <div className="flex flex-col gap-y-5">
          <div className="card card_row card_hoverable">
            <div>
              <div className="image">
                <div className="aspect-w-4 aspect-h-3">
                  <img src="assets/images/potato.jpg" />
                </div>
                <div className="badge badge_outlined badge_secondary uppercase absolute top-0 right-0 rtl:left-0 mt-2 mr-2 rtl:ml-2">
                  Draft
                </div>
              </div>
            </div>
            <div className="header">
              <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h5>
              <p>
                Nunc et tincidunt tortor. Integer pellentesque bibendum neque,
                ultricies semper neque vulputate congue. Nunc fringilla mi sed
                nisi finibus vulputate. Nunc eu risus velit.
              </p>
            </div>
            <div className="body">
              <h6 className="uppercase">Views</h6>
              <p>100</p>
              <h6 className="uppercase mt-4 lg:mt-auto">Date Created</h6>
              <p>December 15, 2019</p>
            </div>
            <div className="actions">
              <div className="dropdown -ml-3 rtl:-mr-3 lg:ml-auto lg:rtl:mr-auto">
                <button className="btn-link" data-toggle="dropdown-menu">
                  <span className="la la-ellipsis-v text-4xl leading-none" />
                </button>
                <div className="dropdown-menu">
                  <a href="#">Dropdown Action</a>
                  <a href="#">Link</a>
                  <hr />
                  <a href="#">Something Else</a>
                </div>
              </div>
              <a
                href="#"
                className="btn btn-icon btn_outlined btn_secondary mt-auto ml-auto rtl:mr-auto lg:ml-0 lg:rtl:mr-0"
              >
                <span className="la la-pen-fancy" />
              </a>
              <a
                href="#"
                className="btn btn-icon btn_outlined btn_danger lg:mt-2 ml-2 rtl:mr-2 lg:ml-0 lg:rtl:mr-0"
              >
                <span className="la la-trash-alt" />
              </a>
            </div>
          </div>
        </div>
      )}
      {showPagging && (
        <div>
          <Pagination
            page={currentPage}
            totalpage={Math.ceil(data?.length / columnpage)}
            columnpage={columnpage}
            onPreviousClick={goPreviousClick}
            onNextClick={goNextClick}
            onFirstPageClick={goFirstPage}
            onLastPageClick={goLastPage}
            onPageChange={(page) => setColumnpage(page)}
            showColumnpage={showPaggingButton}
          />
        </div>
      )}
    </div>
  );
};

const TableHeadItem = ({ item, clickSort, allClick, data, showCheckAll }) => {
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    if (item?.key !== "check") return;
    // console.log("check data =>", data);

    if (data?.length === 0) {
      setCheckAll(false);
    } else {
      let checkall = data?.some((x) => x.Check === false);
      setCheckAll(!checkall);
    }
  }, [data]);

  return (
    <th
      style={{ textAlign: item.align, cursor: "pointer" }}
      className={`uppercase ${item.label?.toLowerCase() === "remark" ||
        item.label?.toLowerCase() === "reason"
        ? "width-15"
        : ""
        }`}
      onClick={() => clickSort(item)}
      title={item.title}
    >
      {item.key === "check" && showCheckAll ? (
        <label className="custom-checkbox">
          <input
            type="checkbox"
            name="check"
            //value={checkAll}
            checked={checkAll}
            onChange={(e) => {
              setCheckAll(!checkAll);
              allClick(!checkAll);
            }}
          />
          <span></span>
        </label>
      ) : (
        item.label === "obj" ? "select" : item.label
      )}
    </th>
  );
};

const TableRow = ({
  subTable,
  item,
  column,
  eventClick,
  eventCheckClick,
  eventRadioClick,
  index,
  active,
  onSelectedRow,
}) => {
  return (
    <>
      <tr
        key={index}
        className={`${index % 2 === 0 ? "even" : "odd"} ${active ? "hoverTable" : ""
          }`}
        onClick={onSelectedRow}
      >
        {column?.map((col, index) => {
          return (
            <td
              className={`cursor-pointer align-top ${col.align === "center" ? "text-center" : `text-${col.align}`
                } ${col.key !== "button" ? (subTable ? `align-top` : ``) : ``}`}
              key={index}
            >
              <ActionCase
                buttonClick={eventClick}
                checkClick={eventCheckClick}
                radioClick={eventRadioClick}
                item={item}
                column={col}
              />
            </td>
          );
        })}
      </tr>
    </>
  );
};

const TableSummary = ({ item, data }) => {
  return (
    <>
      <th
        style={{ textAlign: item.align, color: "#0284c7", paddingRight: 4 }}
        className="uppercase"
      >
        {item.total
          ? data[item.key]?.toLocaleString(undefined, {
            minimumFractionDigits: item.digit,
            maximumFractionDigits: item.digit,
          })
          : ""}
      </th>
    </>
  );
};

const ActionCase = ({ item, column, buttonClick, checkClick, radioClick }) => {
  let col = column.key.toLowerCase();
  let type = column?.type === undefined ? "string" : column.type;

  switch (col) {
    case "button":
      {
        return column.action.map((Item, index) => {
          switch (Item.event) {
            case "add":
              //console.log("edit => ",item[Item.display])
              return (
                (Item.display === true || item[Item.display] === false) && (
                  <span key={index}>
                    <button
                      type="button"
                      className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
                      title={`${Item.event}`}
                      onClick={() => buttonClick(Item.event, item)}
                    >
                      <span className="la la-plus-square" />
                    </button>
                  </span>
                )
              );
              break;
            case "edit":
              //console.log("edit => ",Item.display, item[Item.display])
              return (
                (Item.display === true || item[Item.display] === false) && (
                  <span key={index}>
                    <button
                      type="button"
                      className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
                      title={`${Item.event}`}
                      onClick={() => buttonClick(Item.event, item)}
                    >
                      <span className="la la-pen-fancy" />
                    </button>
                  </span>
                )
              );
              break;
            case "view":
              return (
                <span key={index}>
                  <button
                    type="button"
                    className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
                    title={`${Item.event}`}
                    onClick={() => buttonClick(Item.event, item)}
                  >
                    <span className="la la-window-restore" />
                  </button>
                </span>
              );
              break;
            case "print":
              return (
                <span key={index}>
                  <button
                    type="button"
                    className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
                    title={`${Item.event}`}
                    onClick={() => buttonClick(Item.event, item)}
                  >
                    <span className="la la-print" />
                  </button>
                </span>
              );
              break;
            case "delete":
              //console.log("delete => ",Item.display,item[Item.display])
              return (
                (Item.display === true || item[Item.display] === false) && (
                  <span key={index}>
                    <button
                      type="button"
                      className="btn btn-icon btn_outlined btn_danger mr-1 cursor-pointer"
                      title={`${Item.event}`}
                      onClick={() => buttonClick(Item.event, item)}
                    >
                      <span className="la la-trash-alt" />
                    </button>
                  </span>
                )
              );
              break;
            case "export":
              return (
                <span key={index}>
                  <button
                    type="button"
                    className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
                    title={`${Item.event}`}
                    onClick={() => buttonClick(Item.event, item)}
                  >
                    <span className="la la-file-alt text-xl leading-none" />
                  </button>
                </span>
              );
              break;

            case "receive":
              return (
                <span key={index} className="inline-block mr-2">
                  <button
                    type="button"
                    className="btn btn_outlined btn_primary cursor-pointer px-2 py-1 whitespace-nowrap"
                    title="รับเข้า"
                    onClick={() => buttonClick(Item.event, item)}
                  >
                    รับเข้า
                  </button>
                </span>
              );

            case "issue":
              return (
                <span key={index} className="inline-block mr-2">
                  <button
                    type="button"
                    className="btn btn_outlined btn_primary cursor-pointer px-2 py-1 whitespace-nowrap"
                    title="จ่ายออก"
                    onClick={() => buttonClick(Item.event, item)}
                  >
                    จ่ายออก
                  </button>
                </span>
              );
              // case "issue":
              //   return (
              //     <span key={index}>
              //       <button
              //         type="button"
              //         className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
              //         title={`${Item.event}`}
              //         onClick={() => buttonClick(Item.event, item)}
              //       >
              //         <span className="la la-upload text-xl leading-none" />
              //       </button>
              //     </span>
              //   );
              break;
            // case "receive":
            //   return (
            //     <span key={index}>
            //       <button
            //         type="button"
            //         className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
            //         title={`${Item.event}`}
            //         onClick={() => buttonClick(Item.event, item)}
            //       >
            //         <span className="la la-download text-xl leading-none" />
            //       </button>
            //     </span>
            //   );
            //   break;

            // case "receive":
            //   return (
            //     <span key={index}>
            //       <button
            //         type="button"
            //         className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
            //         title="รับเข้า"
            //         onClick={() => buttonClick(Item.event, item)}
            //       >
            //         รับเข้า
            //       </button>
            //     </span>
            //   );

          }

          //return (
          //Item.display === true &&
          // item[column.display] === true &&
          // <span key={index}>
          //     <button
          //         className={`btn btn-icon btn_outlined
          //                 ${Item.event === 'delete' ? 'btn_danger' : 'btn_primary'} mr-1 cursor-pointer`}
          //         title={`${Item.event}`}
          //         onClick={() => buttonClick(Item.event, item)}
          //     >
          //         <span className={`la
          //             ${Item.event === 'edit' ? 'la-pen-fancy' :
          //                 Item.event === 'delete' ? 'la-trash-alt' :
          //                     Item.event === 'print' ? 'la-print' :
          //                         Item.event === 'view' ? 'la-window-restore' : ''}
          //             `} />
          //     </button>
          //     {/* </span> */}
          //     {/* } */}
          // </span>
          //);
        });
      }
      break;
    case "check":
      {
        //console.log("table check => ", checked, checkItem);
        return (
          // item.display && (
          <label className="custom-checkbox">
            <input
              type="checkbox"
              name="check"
              checked={item?.Check}
              onChange={() => {
                checkClick(item);
              }}
            />
            <span></span>
          </label>
          // )
        );
      }
      break;
    case "radio":
      {
        return (
          <label className="custom-radio">
            <input
              type="radio"
              name="radio"
              checked={item?.Checked}
              //value={item.Id}
              //className="custom-control-input"
              onChange={() => radioClick(item)}
            />
            <span></span>
          </label>
        );
      }
      break;
    default:
      return (
        <>
          {/* {column.key.includes(".") ? (
            <Format
              data={
                item[column.key.split(".")[0]] === null
                  ? null
                  : item[column.key.split(".")[0]][column.key.split(".")[1]]
              }
              format={column.format}
              digit={column.digit}
              text={column.text}
            />
          ) : (
            <Format
              data={item[column.key]}
              format={column.format}
              digit={column.digit}
              text={column.text}
            />
          )} */}
          {/* 
          {console.log(
            "table data => ",
            type === "object"
              ? item[column.key] === null
                ? null
                : item[column.key][column.sort]
              : column.key + "-" + item[column.key]
          )} */}

          <Format
            data={
              type === "object"
                ? item[column.key] === null
                  ? null
                  : column.format === "string"
                    ? item[column.key][column.sort]
                    : item[column.key]
                : item[column.key]
            }
            format={column.format}
            digit={column.digit}
            text={column.text}
          />

          {column?.description && <p>{item[column.description]}</p>}
        </>
      );
      break;
  }
};

const SummaryColumn = (data, column, dataTotal) => {
  let col = column.filter((x) => x.total === true);
  const datalist = dataTotal === undefined ? data : dataTotal;
  const output = datalist.reduce((acc, item) => {
    Object.keys(item).forEach((key) => {
      let sum = col.some((x) => x.key === key);
      if (sum) acc[key] = (acc[key] || 0) + item[key];
    });
    acc.ClientName = "Total";
    return acc;
  }, {});
  return output;
};

const ButtonCase = () => { };
export default Table;
