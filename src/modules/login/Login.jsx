import { useEffect, useRef, useState } from "react";
import { loginUser, logoutUser } from "../../store/reducers/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Login = () => {
  const [cookies, setCookie] = useCookies(["Authentication"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const effectRan = useRef(false);

  useEffect(() => {
    //actual
    if (cookies?.Authentication === undefined) {
      window.location.replace("http://ap/data#/login");
    } else {
      autoLogin();
    }

    //test
    // autoLogin();
  }, [cookies]);

  const autoLogin = () => {
    // actual
    // const auth = cookies.Authentication;
    // const [user] = auth?.split('&').filter(x => x.includes('username'));
    // const [username] = user?.split('=').filter(x => !x.includes('username'));
    // const [pass] = auth?.split('&').filter(x => x.includes('password'));
    // const password = pass.replace("password=","");
    // const credentials = { "Username": username, "Password": atob(password) }/*btoa(password)*/
    // Submit(credentials);

    //test
    const username = "admin";
    const password = "123456";
    const credentials = { Username: username, Password: password };
    Submit(credentials);
  };

  const Submit = (credentials) => {
    APIService.Post("Auth/Login", credentials)
      .then((res) => {
        if (res.status === 200) {
          const data = {
            Id: res.data?.Id,
            Code: res.data?.Code,
            User: res.data?.Username,
            Type: res.data?.Type,
            Token: res.data?.Token,
            GroupId: res.data?.GroupId,
            Group: res.data?.Group,
            Name: res.data?.Name,
          };
          dispatch(loginUser(data));
          navigate("/");
        } else {
          dispatch(logoutUser());
          window.location.replace("http://ap/data#/login");
        }
      })
      .catch((err) => {
        dispatch(logoutUser());
        window.location.replace("http://ap/data#/login");
      });
  };

  return <>{cookies.Authentication && <div>Loading....</div>}</>;
};



export default Login;
