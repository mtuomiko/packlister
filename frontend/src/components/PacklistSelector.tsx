import { Card, CardHeader, createStyles, IconButton, List, ListItemSecondaryAction, makeStyles, MenuItem, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React from "react";
import CreateNewPacklist from "./CreateNewPacklist";
import { UpdateStateInput } from "./LoggedIn";
import { useFormContext, useFieldArray } from "react-hook-form";

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
  packlistIndex: number;
  packlistId: string;
  setPacklistId: React.Dispatch<React.SetStateAction<string>>;
}

const PacklistSelector = ({ packlistIndex, packlistId, setPacklistId }: Props) => {
  const methods = useFormContext<UpdateStateInput>();
  const { fields, remove } = useFieldArray({
    control: methods.control,
    name: "packlists",
    keyName: "idx", // default to "id", you can change the key name
  });

  const changePacklist = (id: string) => {
    setPacklistId(id);
  };

  const removePacklist = (index: number) => {
    remove(index);
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
        {fields.map((packlist, index) => {
          return (
            <MenuItem
              button
              key={packlist.idx}
              onClick={() => changePacklist(packlist.id)}
              selected={index === packlistIndex}
            >
              <Typography noWrap>
                {packlist.name ? packlist.name : "New packlist"}
              </Typography>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removePacklist(index)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </MenuItem>
          );
        })}
      </List>
    </div>
  );
};


export default PacklistSelector;

// const PacklistSelector = ({ packlistId, setPacklistId }: Props) => {
//   const formikContext = useFormikContext<UpdateStateInput>();

//   const changePacklist = (id: string) => {
//     setPacklistId(id);
//   };

//   const removePacklist = (helpers: FieldArrayRenderProps, index: number) => {
//     helpers.remove(index);
//   };

//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <Card>
//         <CardHeader
//           title="Packlists"
//           action={
//             <CreateNewPacklist />
//           }
//         />
//       </Card>
//       <List disablePadding data-testid="packlist-list">
//         <FieldArray name="packlists"
//           render={(arrayHelpers) => (
//             <>
//               {formikContext.values.packlists.map((p, index) => (
//                 <MenuItem button key={p.id} onClick={() => changePacklist(p.id)} selected={packlistId === p.id}>
//                   <Typography noWrap>
//                     {p.name && p.name}
//                     {!p.name && "New packlist"}
//                   </Typography>
//                   <ListItemSecondaryAction>
//                     <IconButton
//                       edge="end"
//                       aria-label="delete"
//                       onClick={() => removePacklist(arrayHelpers, index)}>
//                       <Delete />
//                     </IconButton>
//                   </ListItemSecondaryAction>
//                 </MenuItem>
//               ))}
//             </>
//           )}
//         />
//       </List>
//     </div>
//   );
// };

// export default PacklistSelector;