import React, { useEffect } from "react";
import { accountService } from "../_services/account.service";
import { useNavigate } from "react-router-dom";

function PublicRoute(props) {
  const navigate = useNavigate();
  useEffect(() => {
    if (accountService.isLogged()) {
      navigate("/");
    }
  }, []);
  return <div>{props.children}</div>;
}

export default PublicRoute;
