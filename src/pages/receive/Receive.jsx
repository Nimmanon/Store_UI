import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Receive = () => {

  const [action, setAction] = useState("list");
  const [dataSelected, setDataSelected] = useState();

  const [dataSearch, setDataSearch] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      document.title = "Receive";
      return () => (effectRan.current = true);
    }
  }, []);

  useEffect(() => {
    if (dataSelected === undefined || dataSelected === "") return;
    navigate("/receive/view/" + dataSelected?.Id);
  }, [dataSelected]);

  return (
    <div>
      <Outlet
        context={[setDataSelected, setAction, setDataSearch, dataSearch]}
      />
    </div>
  )
}

export default Receive
