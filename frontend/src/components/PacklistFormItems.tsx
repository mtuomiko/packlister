import FormTextField from "./FormTextField";
import { UpdateStateInput } from "./LoggedIn";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import React, { useCallback } from "react";
import { TextField } from "@material-ui/core";
import PacklistFormItem from "./PacklistFormItem";
// import { FormValues } from "./PacklistForm";

const PacklistFormItems = ({ packlistIndex, categoryIndex }: {
  packlistIndex: number;
  categoryIndex: number;
}) => {
  const methods = useFormContext<UpdateStateInput>();

  const { fields, remove } = useFieldArray({
    control: methods.control,
    name: `packlists.${packlistIndex}.categories.${categoryIndex}.categoryItems` as "packlists.0.categories.0.categoryItems",
    // keyName: "id", default to "id", you can change the key name
  });

  // Create watchers
  // const categoryItems = methods.getValues(`packlists.${packlistIndex}.categories.${categoryIndex}.categoryItems`);
  const userItemWatcher = useWatch({ control: methods.control, name: "userItems" });
  // userItemWatcher.forEach((item, index) => {
  //   if (item === undefined) {
  //     remove(fields.findIndex(f => f))
  //   }
  // });

  fields.forEach((item, index) => {
    const correspondingUserItem = userItemWatcher.find(ui => ui.internalId === item.userItemId);
    if (!correspondingUserItem) {
      remove(index);
    }
  });

  // const handleRemove = useCallback(
  //   (index: number) => {
  //     remove(index);
  //   }, [remove]
  // );

  // const removeItem = (index: number) => {
  //   remove(index);
  // };

  // console.log("watched useritems", userItemWatcher);
  return (
    <>
      {fields.map((categoryItem, index) => {
        return (
          <PacklistFormItem key={categoryItem.id}
            packlistIndex={packlistIndex}
            categoryIndex={categoryIndex}
            categoryItem={categoryItem}
            index={index}
            // onRemove={handleRemove}
            remove={remove}
          />
        );
      })}
    </>
  );
};

export default PacklistFormItems;

// const useStyles = makeStyles((theme) => ({
//   itemContainer: {
//     backgroundColor: theme.palette.background.default,
//   },
//   handleBox: {
//     display: "flex",
//     justifyContent: "flex-end",
//   },
// }));

// interface Props {
//   packlistIndex: number;
//   item: CategoryItem;
//   categoryIndex: number;
//   itemIndex: number;
//   itemArrayHelpers: FieldArrayRenderProps;
// }

// const PacklistFormItem = ({ packlistIndex, item, categoryIndex, itemIndex, itemArrayHelpers }: Props) => {
//   const formikContext = useFormikContext<UpdateStateInput>();

//   // Find which UserItem this item refers to
//   const userItemIndex = formikContext.values.userItems.findIndex(i => i.internalId === item.userItemId);

//   const classes = useStyles();

//   return (
//     <Draggable key={item.internalId} draggableId={item.internalId} index={itemIndex}>
//       {provided => (
//         <div
//           className={classes.itemContainer}
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//         >
//           <Grid container spacing={0}>
//             <Grid item xs={1}>
//               <Box className={classes.handleBox}>
//                 <IconButton {...provided.dragHandleProps} size="small"><Reorder /></IconButton>
//               </Box>
//             </Grid>
//             <Grid item xs={4}>
//               <Box paddingLeft={1}>
//                 <FastField
//                   name={`userItems.${userItemIndex}.name`}
//                   size="small"
//                   component={FormTextField}
//                   placeholder="Name"
//                   fullWidth
//                 />
//               </Box>
//             </Grid>
//             <Grid item xs={4}>
//               <FastField
//                 name={`userItems.${userItemIndex}.description`}
//                 size="small"
//                 component={FormTextField}
//                 placeholder="Description"
//                 fullWidth
//               />
//             </Grid>
//             <Grid item xs={1}>
//               <FastField
//                 name={`userItems.${userItemIndex}.weight`}
//                 size="small"
//                 component={FormTextField}
//                 type="number"
//                 fullWidth
//               />
//             </Grid>
//             <Grid item xs={1}>
//               <FastField
//                 size="small"
//                 component={FormTextField}
//                 name={`packlists.${packlistIndex}.categories.${categoryIndex}.categoryItems.${itemIndex}.quantity`}
//                 type="number"
//                 fullWidth
//               />
//             </Grid>
//             <Grid item xs={1}>
//               <IconButton
//                 aria-label="delete" onClick={() => itemArrayHelpers.remove(itemIndex)}
//                 size="small">
//                 <Delete />
//               </IconButton>
//             </Grid>
//           </Grid>
//         </div>
//       )}
//     </Draggable>
//   );
// };

// export default PacklistFormItem;