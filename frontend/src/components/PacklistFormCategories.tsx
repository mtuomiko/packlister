import { UpdateStateInput } from "./LoggedIn";
import FormTextField from "./FormTextField";
import { useFormContext, useFieldArray } from "react-hook-form";
// import { FormValues } from "./PacklistForm";
import PacklistFormItems from "./PacklistFormItems";

const PacklistFormCategories = ({ packlistIndex }: { packlistIndex: number }) => {
  const methods = useFormContext<UpdateStateInput>();
  const { fields } = useFieldArray({
    control: methods.control,
    name: `packlists.${packlistIndex}.categories` as "packlists.0.categories",
    // keyName: "id", default to "id", you can change the key name
  });

  return (
    <>
      {
        fields.map((category, index) => {
          return (
            <div key={category.id}>
              <FormTextField
                label="Category"
                name={`packlists.${packlistIndex}.categories.${index}.name` as const}
                defaultValue={category.name}
                variant="outlined"
              />
              <PacklistFormItems
                packlistIndex={packlistIndex}
                categoryIndex={index}
              />
            </div>
          );
        })
      }
    </>
  );
};

export default PacklistFormCategories;

// const useStyles = makeStyles((theme) => ({
//   categoryContainer: {
//     backgroundColor: theme.palette.background.default,
//     marginBottom: theme.spacing(2),
//   },
//   handleBox: {
//     display: "flex",
//     justifyContent: "flex-end",
//   },
//   categoryNameInput: {
//     fontWeight: "bold",
//   },
// }));

// interface Props {
//   packlistIndex: number;
//   category: Category;
//   categoryIndex: number;
//   categoryArrayHelpers: FieldArrayRenderProps;
// }

// const PacklistFormCategory = ({ packlistIndex, category, categoryIndex, categoryArrayHelpers }: Props) => {
//   const formikContext = useFormikContext<UpdateStateInput>();

//   const addCategoryItem = (helpers: FieldArrayRenderProps) => {
//     const newCategoryItem: CategoryItem = { internalId: nanoid(), userItemId: nanoid(), quantity: 0 };
//     // Adding a new item so the corresponding UserItem needs to created
//     const newUserItem: UserItem = {
//       internalId: newCategoryItem.userItemId,
//       name: "",
//       description: "",
//       weight: 0,
//       __typename: "UserItem",
//     };
//     helpers.push(newCategoryItem);
//     // New UserItem needs to pushed through setFieldValue since we don't have
//     // access to helpers of the UserItem arrays
//     const userItems = formikContext.values.userItems.concat(newUserItem);
//     formikContext.setFieldValue("userItems", userItems);
//   };

//   const classes = useStyles();

//   return (
//     <Draggable draggableId={category.internalId} index={categoryIndex}>
//       {provided => (
//         <div
//           className={classes.categoryContainer}
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//         >
//           <Grid container spacing={0}>
//             <Grid item xs={1}>
//               <Box className={classes.handleBox}>
//                 <IconButton {...provided.dragHandleProps} size="small"><Reorder /></IconButton>
//               </Box>
//             </Grid>
//             <Grid item xs={8}>
//               <FastField
//                 name={`packlists.${packlistIndex}.categories.${categoryIndex}.name`}
//                 placeholder="Category name"
//                 component={FormTextField}
//                 fullWidth
//                 InputProps={{ classes: { root: classes.categoryNameInput } }}
//               />
//             </Grid>
//             <Grid item xs={1}>
//               <Typography>Weight (g)</Typography>
//             </Grid>
//             <Grid item xs={1}>
//               <Typography>Quantity</Typography>
//             </Grid>
//             <Grid item xs={1}>
//               <IconButton
//                 aria-label="delete" onClick={() => categoryArrayHelpers.remove(categoryIndex)}
//                 size="small"
//               >
//                 <Delete />
//               </IconButton>
//             </Grid>
//           </Grid>
//           <FieldArray name={`packlists.${packlistIndex}.categories.${categoryIndex}.categoryItems`}
//             render={(itemArrayHelpers) => (
//               <div>
//                 <Droppable droppableId={`itemDroppable-${categoryIndex}`} type="droppableItem">
//                   {itemDropProvided => (
//                     <div
//                       ref={itemDropProvided.innerRef}
//                       {...itemDropProvided.droppableProps}
//                     >
//                       {formikContext.values.packlists[packlistIndex].categories[categoryIndex].categoryItems.map((item, itemIndex) => (
//                         <PacklistFormItem
//                           key={item.internalId}
//                           packlistIndex={packlistIndex}
//                           item={item}
//                           categoryIndex={categoryIndex}
//                           itemIndex={itemIndex}
//                           itemArrayHelpers={itemArrayHelpers}
//                         />
//                       ))}
//                       {itemDropProvided.placeholder}
//                     </div>
//                   )}
//                 </Droppable>
//                 <Grid container>
//                   <Grid item xs={1}></Grid>
//                   <Grid item xs={9}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       size="small"
//                       onClick={() => addCategoryItem(itemArrayHelpers)}
//                       startIcon={<AddCircle />}
//                     >Add item</Button>
//                   </Grid>
//                   <Grid item xs={1}>
//                     <Typography className={classes.categoryNameInput}>
//                       {formikContext.values.packlists[packlistIndex].categories[categoryIndex].categoryItems.reduce(
//                         (acc, val) => {
//                           const qty = val.quantity;
//                           const weight = formikContext.values.userItems.find(i => i.internalId === val.userItemId)?.weight || 0;
//                           const res = qty * weight;
//                           return acc + res;
//                         }, 0)} g
//                       </Typography>
//                   </Grid>
//                   <Grid item xs={1}></Grid>
//                 </Grid>
//               </div>
//             )}
//           />
//         </div>
//       )}
//     </Draggable>
//   );
// };

