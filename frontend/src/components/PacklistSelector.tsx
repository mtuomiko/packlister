import { Box, Button, Typography } from "@material-ui/core";
import React from "react";
import { Packlist } from "../types";
import { AddCircle } from "@material-ui/icons";

const PacklistSelector = ({ packlists, setCurrentPacklistId }: {
  packlists: Packlist[];
  setCurrentPacklistId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography component="h1">Choose packlist</Typography>
      <Box display="flex" flexDirection="column">
        {packlists.map(p => (
          <Button key={p.id} onClick={() => setCurrentPacklistId(p.id)}>{p.name}</Button>
        ))}
      </Box>
      <Button
        size="small"
        variant="contained"
        color="primary"
        startIcon={<AddCircle />}
      >Create new</Button>
    </Box>
  );
};

export default PacklistSelector;