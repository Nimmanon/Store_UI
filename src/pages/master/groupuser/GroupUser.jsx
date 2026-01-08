import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
const GroupUser = () => {
  const [action, setAction] = useState("list");
  const [dataSelected, setDataSelected] = useState();

  const [dataSearch, setDataSearch] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      document.title = "COP : GROUP USER";  
      return () => (effectRan.current = true);
    }
  }, []);

  useEffect(() => {
    if (dataSelected === undefined || dataSelected === "") return;

    // console.log("address =>",dataSelected);
    navigate("/groupuser/view/" + dataSelected?.Id);
  }, [dataSelected]);
  return (
    <div>
      <Outlet
        context={[setDataSelected, setAction, setDataSearch, dataSearch]}
      />
    </div>
  );
};

export default GroupUser