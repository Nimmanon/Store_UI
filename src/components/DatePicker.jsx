import { useState, useEffect, Fragment } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePicker = (props) => {
  const {
    placeholder,
    format,
    value,
    error,
    required = false,
    readOnly = false,
    onChange,
    showLabel = false,
    label = "",
    isAddon=false
  } = props;

  const [dateSelected, setDateSelected] = useState();
  const [years, setYears] = useState([]);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    getYear();
  }, []);

  const getYear = () => {
    var currentYear = new Date().getFullYear(),
      years = [];
    var startYear = 2013;
    while (startYear <= currentYear) {
      years.push(startYear++);
    }
    setYears(years);
  };

  useEffect(() => {    
    setDateSelected(value);
  }, [value]);

  // useEffect(() => {
  //     console.log('error=> ',error);
  // }, [error]);

  const setDate = (value) => {
    setDateSelected(value);
    onChange(value);
  };

  return (
    <>
      {label && <label>&nbsp;{`${label} ${required ? "*" : ""}`}</label>}
      <ReactDatePicker
        showIcon
        selected={dateSelected}
        onChange={(date) => setDate(date)}
        isClearable
        dateFormat={format}
        wrapperClassName="date_picker full-width"
        className={`form-control ${error ? "is-invalid" : ""} 
                  ${readOnly ? "readOnly" : "bg-yellow-100"}
                  ${isAddon ? "input-addon-radius" : ""}
                  `}
        placeholderText={placeholder}
        required={required}
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div
            style={{
              margin: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              <i className="las la-angle-left uppercase text-xl mr-5"></i>
            </button>
            <select
              value={date.getFullYear()}
              onChange={({ target: { value } }) => changeYear(value)}
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              className="ml-2"
              value={months[date.getMonth()]}
              onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
              }
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              <i className="las la-angle-right uppercase text-xl ml-5"></i>
            </button>
          </div>
        )}
      />
    </>
  );
};

export default DatePicker;
