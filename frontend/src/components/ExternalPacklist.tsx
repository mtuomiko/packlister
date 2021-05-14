import { Typography } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";

const ExternalPacklist = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Typography component="h5">
        {id}
      </Typography>
    </div>
  );
};

export default ExternalPacklist;