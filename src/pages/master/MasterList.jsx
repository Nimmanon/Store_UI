import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FormTitle from "../../components/FormTitle.jsx";

const MasterList = () => {
  const effectRan = useRef(false);
  const [topicList, setTopicList] = useState();
  const [pageList, setPageList] = useState();
  const [menuActive, setMenuActive] = useState();

  const navigate = useNavigate();

  const menulist = [
    {
      Id: 110,
      Type: "topic",
      Name: "",
      Description: "",
      Title: "Masters",
      Icon: "",
      Parents: 10,
      Seq: 10,
    },
    // {
    //   Id: 115,
    //   Type: "link",
    //   Name: "/employee",
    //   Description: "",
    //   Title: "Employee",
    //   Icon: "la la-id-card text-5xl",
    //   Parents: 10,
    //   Seq: 10,
    //   Topic: 110,
    // },
    // {
    //   Id: 120,
    //   Type: "link",
    //   Name: "/area",
    //   Description: "",
    //   Title: "Area",
    //   Icon: "la la-building text-5xl",
    //   Parents: 10,
    //   Seq: 20,
    //   Topic: 110,
    // },
    // {
    //   Id: 125,
    //   Type: "link",
    //   Name: "/group",
    //   Description: "",
    //   Title: "Group",
    //   Icon: "la la-file-alt text-5xl",
    //   Parents: 10,
    //   Seq: 25,
    //   Topic: 110,
    // },
    // {
    //   Id: 136,
    //   Type: "link",
    //   Name: "/itemstatus",
    //   Description: "",
    //   Title: "ItemStatus",
    //   Icon: "la la-city text-5xl",
    //   Parents: 10,
    //   Seq: 26,
    //   Topic: 110,
    // },
    {
      Id: 137,
      Type: "link",
      Name: "/location",
      Description: "",
      Title: "Location",
      Icon: "la la-images text-5xl",
      Parents: 10,
      Seq: 27,
      Topic: 110,
    },
    // {
    //   Id: 140,
    //   Type: "link",
    //   Name: "/unit",
    //   Description: "",
    //   Title: "Unit",
    //   Icon: "la la-landmark text-5xl",
    //   Parents: 10,
    //   Seq: 30,
    //   Topic: 110,
    // },
    // {
    //   Id: 150,
    //   Type: "link",
    //   Name: "/warehouse",
    //   Description: "",
    //   Title: "Wrehouse",
    //   Icon: "la la-balance-scale text-5xl",
    //   Parents: 10,
    //   Seq: 40,
    //   Topic: 110,
    // },
    // {
    //   Id: 160,
    //   Type: "link",
    //   Name: "/indicator",
    //   Description: "",
    //   Title: "ตัวชี้วัดด้านผลลัพธ์",
    //   Icon: "la la-dashboard text-5xl",
    //   Parents: 10,
    //   Seq: 50,
    //   Topic: 110,
    // },  
    // {
    //   Id: 200,
    //   Type: "link",
    //   Name: "/setting",
    //   Description: "",
    //   Title: "ตั้งค่า",
    //   Icon: "la la-tools text-5xl",
    //   Parents: 10,
    //   Seq: 200,
    //   Topic: 110,
    // },   
  ];

  useEffect(() => {
    if (effectRan.current == false) {
      setData();
      return () => (effectRan.current = true);
    }
  }, []);

  useEffect(() => {
    if (menuActive === undefined) return;
    localStorage.setItem("_activeid", menuActive.Parents);
    const [parent] = topicList.filter((x) => x.Id === menuActive.Topic);
    localStorage.setItem("_path", parent.Title);
    localStorage.setItem("_page", menuActive.Title);
    navigate(menuActive.Name);
  }, [menuActive]);

  const compare = (a, b) => {
    if (a.Seq < b.Seq) {
      return -1;
    }
    if (a.Seq > b.Seq) {
      return 1;
    }
  };

  const setData = () => {
    if (menulist?.length === 0) return;

    const topic = menulist.filter((x) => x.Type === "topic");
    setTopicList(topic);

    const menu = menulist.filter((x) => x.Type === "link");
    setPageList(menu);
  };

  return (
    <>
      <h2>Master Data</h2>
      <div className="grid lg:grid-cols-1 gap-3 mt-3">
        {topicList !== undefined &&
          topicList !== null &&
          topicList?.length > 0 &&
          topicList?.map((item, index) => {
            {
              return (
                <div key={index}>
                  <div className="grid lg:grid-cols-7 md:grid-cols-4 gap-5 ml-3 mr-4 mt-5">
                    {pageList
                      .sort(compare)
                      .filter((x) => x.Topic === item.Id)
                      .map((m, mi) => {
                        return (
                          <div
                            className="link cursor-pointer text-center outline-div"
                            onClick={(e) => {
                              setMenuActive(m);
                            }}
                            key={m.Id}
                          >
                            <div className="uppercase mt-3 mb-5">
                              <h4>
                                <span className={m.Icon} />
                                <div>{m.Title}</div>
                              </h4>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            }
          })}
      </div>
    </>
  );
};

export default MasterList;
