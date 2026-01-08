import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ใช้ธีม Snow ของ Quill

const Editor = (props) => {
  const {
    label,
    name,
    onChange,
    placeholder = "",
    required,
    value,
    error = false,
  } = props;

  const [content, setContent] = useState(value || ""); // ใช้ useState แทน value

  useEffect(() => {
    setContent(value || ""); // อัปเดตค่าเมื่อ value เปลี่ยน
  }, [value]);

  const handleChange = (val) => {
    setContent(val); // เก็บค่าใหม่ใน state
    if (onChange) {
      onChange(val); // ส่งค่าไปให้ parent component
    }
  };

  return (
    <>
      {label !== "" && <label>&nbsp;{`${label} ${required ? "*" : ""}`}</label>}
      <div className={`quill-container ${error ? "error" : ""}`}>
        <ReactQuill
          value={content} // ใช้ค่าใน state
          name={name}
          placeholder={placeholder}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default Editor;
