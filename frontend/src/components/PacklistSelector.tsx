import { Card, CardHeader, createStyles, IconButton, List, ListItemSecondaryAction, makeStyles, MenuItem, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { FieldArray, FieldArrayRenderProps, useFormikContext } from "formik";
import React from "react";
import CreateNewPacklist from "./CreateNewPacklist";
import { UpdateStateInput } from "./LoggedIn";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: "relative",
      overflow: "auto",
      height: "100%",
    },
    subHeader: {
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

interface Props {
  packlistId: string;
  setPacklistId: React.Dispatch<React.SetStateAction<string>>;
}

const PacklistSelector = ({ packlistId, setPacklistId }: Props) => {
  const formikContext = useFormikContext<UpdateStateInput>();

  const changePacklist = (id: string) => {
    setPacklistId(id);
  };

  const removePacklist = (helpers: FieldArrayRenderProps, index: number) => {
    helpers.remove(index);
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card>
        <CardHeader
          title="Packlists"
          action={
            <CreateNewPacklist />
          }
        />
      </Card>
      <List disablePadding data-testid="packlist-list">
        <FieldArray name="packlists"
          render={(arrayHelpers) => (
            <>
              {formikContext.values.packlists.map((p, index) => (
                <MenuItem button key={p.id} onClick={() => changePacklist(p.id)} selected={packlistId === p.id}>
                  <Typography noWrap>
                    {p.name && p.name}
                    {!p.name && "New packlist"}
                  </Typography>
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => removePacklist(arrayHelpers, index)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </MenuItem>
              ))}
            </>
          )}
        />
      </List>
    </div>
  );
};

export default PacklistSelector;