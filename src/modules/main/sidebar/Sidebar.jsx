import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Menu from "../menu/Menu";
import { useSelector, useDispatch } from "react-redux";

import Tippy from "@tippyjs/react";
import { logoutUser } from "../../../store/reducers/auth";
//import logo from '../../../image/logo.jpg';

const Sidebar = ({ ActiveMenu }) => {
  const [IsOpen, setIsOpen] = useState();
  const [active, setActive] = useState();
  const [topicList, setTopicList] = useState([]);
  const [linkList, setLinkList] = useState([]);
  const [Menulist, setMenuList] = useState([]);

  const [MenuActive, setMenuActive] = useState("");
  const [MenuParent, setMenuParent] = useState("");
  const [MenuTopic, setMenuTopic] = useState(0);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const [user, setUsername] = useState();
  const [group, setGroup] = useState();
  const [name, setName] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [organize, setOrganize] = useState();

  const effectRan = useRef(false);

  //type=main,topic,link
  const menulist = [
    {
      Id: 10,
      Type: "main",
      Name: "/master",
      Description: "",
      Title: "Masters",
      Icon: "icon la la-cogs",
      Parents: 0,
      Seq: 20,
    },
    {
      Id: 20,
      Type: "main",
      Name: "/receive",
      Description: "",
      Title: "รับเข้า",
      Icon: "icon la la-file-upload",
      Parents: 0,
      Seq: 30,
    },
    {
      Id: 30,
      Type: "main",
      Name: "/issue",
      Description: "",
      Title: "จ่ายออก",
      Icon: "icon la la-people-carry",
      Parents: 0,
      Seq: 40,
    },
    // {
    //   Id: 40,
    //   Type: "main",
    //   Name: "/prepareorderlineas",
    //   Description: "",
    //   Title: "Prepare Check Status",
    //   Icon: "icon la la-chalkboard",
    //   Parents: 0,
    //   Seq: 50,
    // },
    // {
    //   Id: 600,
    //   Type: "main",
    //   Name: "/simple",
    //   Description: "",
    //   Title: "Simple",
    //   Icon: "icon la la-edit",
    //   Parents: 0,
    //   Seq: 700,
    // },
    //   {
    //   Id: 100,
    //   Type: "main",
    //   Name: "#",
    //   Description: "",
    //   Title: "Stock",
    //   Icon: "icon la la-box",
    //   Parents: 0,
    //   Seq: 100,
    // },
    {
      Id: 200,
      Type: "main",
      Name: "#",
      Description: "",
      Title: "Reports",
      Icon: "icon la la-chalkboard",
      Parents: 0,
      Seq: 200,
    },
    {
      Id: 500,
      Type: "topic",
      Name: "",
      Description: "",
      Title: "Reports",
      Icon: "",
      Parents: 200,
      Seq: 10,
    },
    {
      Id: 520,
      Type: "link",
      Name: "/reportreceive",
      Description: "",
      Title: "รายงานการรับ",
      Icon: "la la-layer-group",
      Parents: 200,
      Seq: 30,
      Topic: 500,
    },
    {
      Id: 530,
      Type: "link",
      Name: "/reportissue",
      Description: "",
      Title: "รายงานการจ่าย",
      Icon: "la la-layer-group",
      Parents: 200,
      Seq: 35,
      Topic: 500,
    },
    {
      Id: 540,
      Type: "link",
      Name: "/reportstock",
      Description: "",
      Title: "รายงาน สต๊อก",
      Icon: "la la-layer-group",
      Parents: 200,
      Seq: 40,
      Topic: 500,
    },
  ];

  const menuUserList = [
    {
      Id: 50,
      Type: "main",
      Name: "/activity",
      Description: "",
      Title: "กิจกรรม",
      Icon: "icon la la-people-carry",
      Parents: 0,
      Seq: 50,
    },
  ];

  useEffect(() => {
    if (effectRan.current == false) {
      setInitial();
      return () => (effectRan.current = true);
    }
  }, []);

  useEffect(() => {
    //console.log(MenuParent,MenuActive);
    if (group === undefined) return;

    //console.log("useEffect => ", group);
    if (group?.Name?.toLowerCase() === "user") {
      setMenuList(menuUserList);
    } else {
      setMenuList(menulist);
      setIsAdmin(true);
    }
    setActive(localStorage.getItem("_activeid"));
  }, [group]);

  useEffect(() => {
    //console.log(MenuParent,MenuActive);
    if (MenuActive !== "") {
      ActiveMenu(MenuParent, MenuActive);
      localStorage.setItem("_path", MenuParent);
      localStorage.setItem("_page", MenuActive);
    }
  }, [MenuActive]);

  useEffect(() => {
    //console.log(MenuParent,MenuActive);
    if (active !== "") {
      getParentActive();
    }
  }, [active]);

  const setInitial = () => {
    if (auth === undefined) return;
    //console.log('auth => ',auth);
    setUserId(atob(auth.Id));
    setGroup(JSON.parse(auth.Group));
    setName(atob(auth.Name).toUpperCase());
    setOrganize(JSON.parse(auth.Organize));
  };

  const initMenu = (parents, id) => {
    localStorage.setItem("_activeid", parents);
    setActive(parents);
    //setIsOpen(!IsOpen);

    let p = getParent(parents);
    setMenuParent(p);

    const chiden = Menulist.filter((x) => x.Parents == parents);
    if (chiden.length === 0) {
      setMenuActive(p);
      setIsOpen(false);
    } else {
      setIsOpen(id ? !IsOpen : true);
      const menu = Menulist.filter((x) => x.Id == id);
      menu.map((m) => setMenuActive(m.Title));
    }
  };

  const getParent = (parents) => {
    let result = "";
    const parent = Menulist.filter((x) => x.Id == parents);
    parent.map((p) => (result = p.Title));

    return result;
  };

  const getParentActive = () => {
    if (Menulist.length === 0) return;
    //console.log('getParentActive => ', Menulist);

    const topic = Menulist.filter(
      (x) => x.Type === "topic" && x.Parents === active
    );
    setTopicList(topic);
    const menu = Menulist.filter(
      (x) => x.Type === "link" && x.Parents === active
    );
    setLinkList(menu);

    Menulist.filter((x) => x.Parents === 0).map((menu) =>
      document.getElementById("link" + menu.Id)?.classList.remove("active")
    );

    const _active =
      MenuParent === "" ? localStorage.getItem("_activeid") : active;
    const link = document.getElementById("link" + _active);
    link?.classList.add("active");
  };

  const compare = (a, b) => {
    if (a.Parents === 100) {
      if (a.Seq < b.Seq) {
        return -1;
      }
      if (a.Seq > b.Seq) {
        return 1;
      }
    } else {
      if (a.Title < b.Title) {
        return -1;
      }
      if (a.Title > b.Title) {
        return 1;
      }
    }
    return 0;
  };

  const handleLogoutClick = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div>
      {/* Menu Bar menu-hidden */}
      {/* <aside className={`menu-bar menu-sticky menu-icon-only ${ShowMenu ? "" : "menu-hidden"}`} > */}
      <aside className="menu-bar menu-sticky menu-icon-only">
        <div className="menu-items">
          {/* {!organize && (
            <Link
              id={"link0"}
              to="/"
              className="link logo"
              onClick={(e) => {
                //e.preventDefault();
                initMenu(1);
              }}
            >
              <span className="icon la la-dashboard" />
            </Link>
          )} */}

          {Menulist?.filter((x) => x.Parents === 0).map((menu) => (
            <Tippy
              key={menu.Id}
              theme="light-border tooltip"
              offset={[0, 12]}
              arrow={false}
              placement="right"
              touch={["hold", 500]}
              interactive={true}
              allowHTML={true}
              animation="scale"
              content={<div className="tooltip">{menu.Title}</div>}
              appendTo={() => document.body}
            >
              <Link
                id={`link${menu.Id}`}
                key={menu.Id}
                to={menu.Name}
                className="link mt-5"
                onClick={(e) => {
                  //e.preventDefault();
                  initMenu(menu.Id);
                  // setActive(menu.id);
                  // setIsOpen(!IsOpen);
                }}
              >
                <span className={menu.Icon} />
                <span className="title">{menu.Title}</span>
              </Link>
            </Tippy>
          ))}
          <div className="menu_profile">
            <Tippy
              theme="light-border"
              offset={[0, 8]}
              maxWidth="none"
              arrow={false}
              placement="top"
              trigger="click"
              interactive={true}
              allowHTML={true}
              animation="shift-toward-extreme"
              onAfterUpdate={(instance) => { }}
              content={
                <div className="custom-dropdown-menu w-64">
                  <div className="p-5">
                    <h5 className="uppercase">{name}</h5>
                    <p>{organize ? organize?.Name : group?.Name}</p>
                  </div>
                  <hr />
                  <div className="p-5">
                    <a
                      href="/profile"
                      className="flex items-center text-normal hover:text-primary"
                    >
                      <span className="la la-address-book text-2xl leading-none ltr:mr-2 rtl:ml-2 mr-2" />
                      Profile
                    </a>
                    {isAdmin && (
                      <>
                        <a
                          href="/groupuser"
                          className="flex items-center text-normal hover:text-primary mt-3"
                        >
                          <span className="la la-server text-2xl leading-none ltr:mr-2 rtl:ml-2 mr-2" />
                          Group User
                        </a>
                        {/* <a
                          href="/level"
                          className="flex items-center text-normal hover:text-primary mt-3"
                        >
                          <span className="la la-layer-group text-2xl leading-none ltr:mr-2 rtl:ml-2 mr-2" />
                          Level
                        </a> */}
                        <a
                          href="/user"
                          className="flex items-center text-normal hover:text-primary mt-3"
                        >
                          <span className="la la-user-cog text-2xl leading-none ltr:mr-2 rtl:ml-2 mr-2" />
                          Manage User
                        </a>
                      </>
                    )}
                  </div>
                  <hr />
                  <div className="cursor-pointer p-5">
                    <a
                      onClick={handleLogoutClick}
                      className="flex items-center text-normal hover:text-primary"
                    >
                      <span className="la la-power-off text-2xl leading-none ltr:mr-2 rtl:ml-2 mr-2" />
                      Logout
                    </a>
                  </div>
                </div>
              }
              appendTo={() => document.body}
            >
              <label className="form-control-addon-within flex-row-reverse border-none">
                <Link to={"#"} className="link">
                  <span className="icon la la-gear" />
                  <span className="title">Profile</span>
                </Link>
              </label>
            </Tippy>
          </div>
        </div>

        {IsOpen && (
          <div className="menu-detail open animate__animated animate__fadeInLeft">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={(e) => {
                  setIsOpen(false);
                }}
                className="la la-arrow-circle-left text-4xl pb-2"
              ></button>
            </div>
            <hr />
            {topicList.map((element) => {
              return (
                <div key={element.Id}>
                  <h6 key={element.Id} className="uppercase">
                    {element.Title}
                  </h6>
                  <div
                    key={element.Id + element.Parents}
                    className="menu-detail-wrapper"
                  >
                    {linkList
                      .sort(compare)
                      .filter((x) => x.Topic === element.Id)
                      .map((e) => {
                        return <Menu {...e} key={e.Id} hideMenu={initMenu} />;
                      })}
                  </div>
                  <hr />
                </div>
              );
            })}
          </div>
        )}
      </aside>
    </div>
  );
};

export default Sidebar;
