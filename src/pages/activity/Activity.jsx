import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Activity = () => {
  const [action, setAction] = useState("list");
  const [dataSelected, setDataSelected] = useState();

  const [dataSearch, setDataSearch] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      document.title = "Activity";
      let current = new Date();

      let item = {};
      item.Year = current?.getFullYear();
      item.Month = current?.getMonth() + 1;      
      setDataSearch(item);      
      return () => (effectRan.current = true);
    }
  }, []);

  useEffect(() => {
    if (dataSelected === undefined || dataSelected === "") return;
    navigate("/activity/view/" + dataSelected?.Id);
  }, [dataSelected]);

  return (
    <div>
      <Outlet
        context={[setDataSelected, setAction, setDataSearch, dataSearch]}
      />
    </div>
  );
};

export default Activity;
