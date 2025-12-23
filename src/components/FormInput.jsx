import React, { forwardRef } from "react";

const FormInput = (props) => {
  const {
    label,
    name,
    type,
    register,
    required,
    error,
    pattern,
    min,
    max,
    minLength,
    maxLength,
    onChange,
    onFocus,
    onKeyDown,
    onInput,
    placeholder,
    readonly = false,
    showErrMsg = true,
    value,
    inputRef,
    inputMode = "text",
  } = props;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onKeyDown(e, name, e?.target?.value);
    }
  };

  return (
    <div className="w-full">
      {label && <label>{`${label} ${required ? "*" : ""}`}</label>}
      {type === "range" ? (
        <div>
          <div className="grid lg:grid-cols-6 gap-3 mt-2">
            <div className="flex flex-col lg:col-span-5 xl:col-span-5 card p-1">
              <input
                {...register(name, {
                  required,
                  min: min,
                  max: max,
                })}
                type={type}
                className={`custom-slider ${error ? "is-invalid" : ""}`}
                style={{ width: "100%", verticalAlign: "middle" }}
                defaultValue={value}
                onChange={onChange}
                onInput={onInput}
                inputMode={inputMode}
              />
            </div>
            <div className="flex flex-col lg:col-span-1 xl:col-span-1 p-1">
              <label style={{ textAlign: "center", fontWeight: "bold" }}>
                {value} %{" "}
              </label>
            </div>
          </div>
        </div>
      ) : inputRef !== undefined && inputRef !== null ? (
        <input
          {...register(name, {
            required,
            pattern:
              pattern == "email"
                ? /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                : pattern == "phone"
                  ? /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
                  : "",
            minLength: minLength,
            maxLength: maxLength,
            min: min,
            max: max,
          })}
          autoComplete="off"
          min={min}
          type={type}
          className={`form-control  ${error ? "is-invalid" : ""} ${readonly ? "readOnly" : "bg-yellow-100"
            }`}
          placeholder={
            placeholder === undefined ? `Input ` + label : placeholder
          }
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          onInput={onInput}
          readOnly={readonly}
          step="any"
          value={value}
          ref={inputRef}
          inputMode={inputMode}
        />
      ) : (
        <input
          {...register(name, {
            required,
            pattern:
              pattern == "email"
                ? /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                : pattern == "phone"
                  ? /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
                  : "",
            minLength: minLength,
            maxLength: maxLength,
            min: min,
            max: max,
          })}
          autoComplete="off"
          min={min}
          type={type}
          className={`form-control  ${error ? "is-invalid" : ""} ${readonly ? "readOnly" : "bg-yellow-100"
            }`}
          placeholder={
            placeholder === undefined ? `Input ` + label : placeholder
          }
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          onInput={onInput}
          readOnly={readonly}
          step="any"
          value={value}
          inputMode={inputMode}
        />
      )}
      {showErrMsg && (
        <>
          {error?.type == "required" && (
            <small className="block mt-2 invalid-feedback">
              {label} is required
            </small>
          )}
          {error?.type == "pattern" && (
            <small className="block mt-2 invalid-feedback">
              {label} pattern incorrect
            </small>
          )}
          {error?.type == "minLength" && (
            <small className="block mt-2 invalid-feedback">
              {label} mininum {minLength} digit
            </small>
          )}
          {error?.type == "maxLength" && (
            <small className="block mt-2 invalid-feedback">
              {label} maxinum {maxLength} digit
            </small>
          )}
          {error?.type == "min" && (
            <small className="block mt-2 invalid-feedback">
              {label} equal to or greater than {min}{" "}
            </small>
          )}
          {error?.type == "max" && (
            <small className="block mt-2 invalid-feedback">
              {label} equal to or less than {max}
            </small>
          )}
        </>
      )}
    </div>
  );
};

export default FormInput;
