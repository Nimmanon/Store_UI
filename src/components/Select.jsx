import { useState, useEffect, useRef } from "react";
import ReactSelect, { components } from "react-select";

const Select = ({
  name,
  setValue,
  list,
  placeholder,
  onSelectItem,
  multi = false,
  disable = false,
  isSearchable = true,
  label,
  required = false,
  error = false,
  selectRef,
  defaultOptions,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [dataAllList, setDataAllList] = useState([]);
  const [defaultList, setDefaultList] = useState([]);
  //const [error, setError] = useState(required ? true : false);
  //const animatedComponents = makeAnimated();

  const customStyles = {
    control: (base, state) => ({
      ...base,
      //color: 'black',
      background: disable ? "#F5F5F5" : "#FEF9C3",
      // match with the menu
      borderRadius: state.isFocused ? "3px 3px 0 0" : 5,
      // Overwrittes the different states of border
      borderColor: error ? "red" : "",
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      //"&:hover": {
      // Overwrittes the different states of border
      //borderColor: state.isFocused ? "red" : "blue",
      //},
    }),
    menu: (base) => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  useEffect(() => {
    if (list?.length === 0) return;
    //console.log("select list => ", list);
    const options = list?.map((item) => ({
      value: item?.Id,
      label: item?.Name,
    }));
    setDataList(options);
    setDataAllList(options);
  }, [list]);

  useEffect(() => {
    if (defaultOptions === undefined) return;

    if (defaultOptions === null) {
      handleOnSelectItem(null);
    } else {
      const selected = defaultOptions?.map((item) => ({
        value: item?.Id,
        label: item?.Name,
      }));
      //console.log("select options => ", selected);
      setDefaultList(selected);
      handleOnSelectItem(selected);
    }
  }, [defaultOptions]);

  useEffect(() => {
    //console.log("select setValue => ", setValue);   
    if (setValue === undefined) return;

    if (setValue === null) {
      setSelectedOption(null);
    } else {
      const selected = {
        value: setValue?.Id,
        label: setValue?.Name,
      };
      //handleOnSelectItem(selected);
      setSelectedOption(selected);
    }
  }, [setValue]);

  const handleOnSelectItem = (values) => {
    if (values === undefined) return;
    //console.log("select handleOnSelectItem => ", values);
    setSelectedOption(values);

    if (multi) {
      let all = values?.filter((x) => x.label?.toLowerCase() === "all");

      let data = [];
      if (all?.length !== 0) {
        data = all?.map((item) => ({
          Id: item.value,
          Name: item.label,
        }));

        setDefaultList(all);
        setSelectedOption(all);
      } else {
        data = values?.map((item) => ({
          Id: item.value,
          Name: item.label,
        }));
      }
      //console.log("handleOnSelectItem =>",data);
      onSelectItem(data, name);
    } else {
      //console.log("handleOnSelectItem =>",values);
      let val =
        values === null ? null : { Id: values?.value, Name: values?.label };
      onSelectItem(val, name);
    }
  };

  const customComponents = {
    DropdownIndicator: (props) =>
      props.selectProps.isDisabled ? null : <components.DropdownIndicator {...props} />,
  };

  return (
    <div className="w-full">
      {label && <label>{`${label} ${required ? "*" : ""}`}</label>}
      <span
        className="d-inline-block"
        data-toggle="popover"
        data-trigger="focus"
        data-content="Please selecet"
      >
        <ReactSelect
          options={dataList}
          ref={selectRef}
          name={name}
          isMulti={multi}
          closeMenuOnSelect={true}
          isClearable={true}
          isDisabled={disable}
          classNamePrefix="select"
          isSearchable={isSearchable}
          onChange={handleOnSelectItem}
          allowSelectAll={true}
          placeholder={placeholder}
          styles={customStyles}
          defaultValue={multi && defaultList?.length !== 0 ? defaultList : null}
          value={selectedOption || null}
          menuPortalTarget={document.querySelector("body")}
          required={required}
          components={customComponents}
        />
      </span>
    </div>
  );
};

export default Select;
