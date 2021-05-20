import React from "react";
import { Button, Grid, IconButton, makeStyles, TextField, Typography } from "@material-ui/core";
import { AddCircle, Delete, Reorder } from "@material-ui/icons";
import { FieldArray, FieldArrayRenderProps, useFormikContext } from "formik";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Category, Packlist, UserItem } from "../types";
import PacklistFormItem from "./PacklistFormItem";

const useStyles = makeStyles((theme) => ({
  categoryContainer: {
    // margin: theme.spacing(1),
    // padding: theme.spacing(1, 0),
    // backgroundColor: "white",
    // border: "1px solid black",
    marginBottom: theme.spacing(2),
  },
  categoryNameInput: {
    fontWeight: "bold",
  },
}));

interface Props {
  category: Category;
  categoryIndex: number;
  categoryArrayHelpers: FieldArrayRenderProps;
  addCategoryItem: (helpers: FieldArrayRenderProps) => void;
}

export interface FormikFields {
  userItems: UserItem[];
  packlist: Packlist;
}

const PacklistFormCategory = ({ category, categoryIndex, categoryArrayHelpers, addCategoryItem }: Props) => {
  const formikContext = useFormikContext<FormikFields>();

  const classes = useStyles();

  return (
    <Draggable draggableId={category.internalId} index={categoryIndex}>
      {provided => (
        <div
          className={classes.categoryContainer}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Grid container spacing={0}>
            <Grid item xs={1}>
              <IconButton {...provided.dragHandleProps} size="small"><Reorder /></IconButton>
            </Grid>
            <Grid item xs={8}>
              <TextField
                name={`packlist.categories.${categoryIndex}.name`}
                placeholder="Category name"
                onChange={formikContext.handleChange}
                onBlur={formikContext.handleBlur}
                value={category.name}
                fullWidth
                InputProps={{ classes: { root: classes.categoryNameInput } }}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography>Weight (g)</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography>Quantity</Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                aria-label="delete" onClick={() => categoryArrayHelpers.remove(categoryIndex)}
                size="small"
              >
                <Delete />
              </IconButton>
            </Grid>
          </Grid>

          <Droppable droppableId={`itemDroppable-${categoryIndex}`} type="droppableItem">
            {itemDropProvided => (
              <div
                ref={itemDropProvided.innerRef}
                {...itemDropProvided.droppableProps}
              >
                <FieldArray name={`packlist.categories.${categoryIndex}.categoryItems`}
                  render={(itemArrayHelpers) => {
                    return (
                      <div>
                        <div>
                          {formikContext.values.packlist.categories[categoryIndex].categoryItems.map((item, itemIndex) => (
                            <PacklistFormItem
                              key={item.internalId}
                              item={item}
                              categoryIndex={categoryIndex}
                              itemIndex={itemIndex}
                              itemArrayHelpers={itemArrayHelpers}
                            />
                          ))}
                        </div>
                        <Grid container>
                          <Grid item xs={1}></Grid>
                          <Grid item xs={9}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => addCategoryItem(itemArrayHelpers)}
                              startIcon={<AddCircle />}
                            >Add item</Button>
                          </Grid>
                          <Grid item xs={1}>
                            <Typography>{formikContext.values.packlist.categories[categoryIndex].categoryItems.reduce(
                              (acc, val) => {
                                const qty = val.quantity;
                                const weight = formikContext.values.userItems.find(i => i.internalId === val.userItemId)?.weight || 0;
                                const res = qty * weight;
                                return acc + res;
                              }, 0)} g
                            </Typography>
                          </Grid>
                          <Grid item xs={1}></Grid>
                        </Grid>
                      </div>
                    );
                  }}
                />
                {itemDropProvided.placeholder}
              </div>
            )}
          </Droppable>

        </div>
      )}
    </Draggable>
  );
};

export default PacklistFormCategory;