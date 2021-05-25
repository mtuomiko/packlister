import React from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { userStorageVar } from "../cache";

const Home = () => {
  const history = useHistory();

  const skipLogin = () => {
    userStorageVar({
      noLogin: true,
    });
  };

  return (
    <>
      <Button color="primary" variant="contained" onClick={() => history.push("/register")}>Register</Button>
      <Button color="primary" variant="contained" onClick={() => history.push("/login")}>Login</Button>
      <Button color="primary" variant="contained" onClick={skipLogin}>Skip login</Button>
    </>
  );
};

export default Home;