import React from "react";
import Breadcrumb from "../modules/main/breadcrumb/Breadcrumb";

const FormTitle = ({ home, title, showSection }) => {
  // const [ActivePath, ActivePage] = useOutletContext(); // <-- access context value
  return (
    <div>
      <section className="breadcrumb lg:flex justify-between">
        <Breadcrumb home={home} title={title} showSection={showSection} />
      </section>
    </div>
  );
};

export default FormTitle;
