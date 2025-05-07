import React, { useEffect } from "react";
import { message } from "antd";
import { userService } from "../_services/user.service";
import { accountService } from "../_services/account.service";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "./DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import { SetUser, ReloadUser } from "../redux/usersSlice";

function ProtectedRoute(props) {
  const navigate = useNavigate();
  //const [userData, setUserData] = useState(null);
  const { user, reloadUser } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      const response = await userService.getMyInfo();
      if (response.success) {
        //setUserData(response.data);
        dispatch(SetUser(response.data));
      } else {
        message.error(response.message);
        accountService.logout();
        navigate("/login");
      }
      dispatch(ReloadUser(false));
    } catch (error) {
      accountService.logout();
      navigate("/login");
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (accountService.isLogged()) {
      //if (!userData) {
      if (!user) {
        getData();
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (reloadUser) {
      getData();
    }
  }, [reloadUser]);
  return (
    user && (
      <div>
        <DefaultLayout user={user}>{props.children}</DefaultLayout>
      </div>
    )
  );
}

export default ProtectedRoute;
