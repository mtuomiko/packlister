import React from "react";
import { Card, CardHeader, createStyles, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles } from "@material-ui/core";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";

import { UpdateStateInput } from "./LoggedIn";
import { Delete, Reorder } from "@material-ui/icons";

const useStyles = makeStyles(theme =>
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

const UserItemsForm = ({ packlistIndex }: { packlistIndex: number }) => {
  const methods = useFormContext<UpdateStateInput>();
  const classes = useStyles();

  const { fields, remove } = useFieldArray({
    control: methods.control,
    name: "userItems"
    // keyName: "id", default to "id", you can change the key name
  });

  const removeUserItem = (index: number) => {
    remove(index);
  };

  return (
    <>
      <div className={classes.root}>
        <Card>
          <CardHeader
            title="Your items"
          />
        </Card>
        <List disablePadding dense>
          {
            fields.map((userItem, index) => {
              return (
                <Controller
                  key={userItem.id}
                  control={methods.control}
                  name={`userItems.${index}.name` as const}
                  render={({ field: { value } }) => (
                    <ListItem key={userItem.id}>
                      <IconButton edge="start">
                        <Reorder />
                      </IconButton>
                      <ListItemText
                        primary={value}
                      // secondary={
                      //   <>
                      //     <Typography
                      //       display="inline"
                      //       variant="body2"
                      //       component="span"
                      //     >
                      //       {`${item.weight} g`}
                      //     </Typography>
                      //     {item.description && ` - ${item.description}`}
                      //   </>
                      // }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => removeUserItem(index)}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )}
                />

              );
            })
          }
        </List>
      </div>
    </>
  );
};

export default UserItemsForm;

// const UserItemsForm = () => {
//   const formikContext = useFormikContext<UpdateStateInput>();

//   const removeItem = (helpers: FieldArrayRenderProps, index: number) => {

//     const userItem = formikContext.values.userItems[index];
//     // const categories = formikContext.values?.packlist?.categories;

//     const packlists = formikContext.values.packlists;
//     const newPacklists = packlists.map(packlist => {
//       const { categories, ...packlistOthers } = packlist;
//       const newCategories = categories.map(category => {
//         const { categoryItems, ...categoryOthers } = category;
//         const newCategoryItems = categoryItems.filter(i => i.userItemId !== userItem.internalId);
//         return {
//           ...categoryOthers,
//           categoryItems: newCategoryItems,
//         };
//       });
//       return {
//         ...packlistOthers,
//         categories: newCategories,
//       };
//     });

//     formikContext.setFieldValue("packlists", newPacklists);
//     // if (categories) {
//     //   const newCategories = categories.map(c => {
//     //     const { categoryItems, ...rest } = c;
//     //     const newCategoryItems = categoryItems.filter(i => i.userItemId !== userItem.internalId);
//     //     return {
//     //       ...rest,
//     //       categoryItems: newCategoryItems,
//     //     };
//     //   });

//     //   formikContext.setFieldValue("packlist.categories", newCategories);
//     // }

//     helpers.remove(index);
//   };

//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <Card>
//         <CardHeader
//           title="Your items"
//         />
//       </Card>
//       <List disablePadding dense>
//         <FieldArray name="userItems"
//           render={(arrayHelpers) => (
//             <>
//               {formikContext.values.userItems.map((item, index) => (
//                 <ListItem key={item.internalId} alignItems="flex-start">
//                   <IconButton edge="start" aria-label="drag">
//                     <Reorder />
//                   </IconButton>
//                   <ListItemText
//                     primary={item.name}
//                     secondary={
//                       <>
//                         <Typography
//                           display="inline"
//                           variant="body2"
//                           component="span"
//                         >
//                           {`${item.weight} g`}
//                         </Typography>
//                         {item.description && ` - ${item.description}`}
//                       </>
//                     }
//                   />
//                   <ListItemSecondaryAction>
//                     <IconButton
//                       edge="end"
//                       aria-label="delete"
//                       onClick={() => removeItem(arrayHelpers, index)}>
//                       <Delete />
//                     </IconButton>
//                   </ListItemSecondaryAction>
//                 </ListItem>
//               ))}
//             </>
//           )}
//         />
//       </List>
//     </div>
//   );
// };

// export default UserItemsForm;