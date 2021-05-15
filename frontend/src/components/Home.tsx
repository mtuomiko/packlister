import { Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

const Home = () => {
  const history = useHistory();
  return (
    <>
      <Button variant='contained' onClick={() => history.push("/register")}>Register</Button>
      <Button variant='contained' onClick={() => history.push("/login")}>Login</Button>
    </>
  );
};

export default Home;