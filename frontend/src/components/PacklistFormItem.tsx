import { Box, Grid, IconButton, makeStyles, TextField } from "@material-ui/core";
import { Delete, Reorder } from "@material-ui/icons";
import { FieldArrayRenderProps, useFormikContext } from "formik";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { CategoryItem } from "../types";
import { UpdateStateInput } from "./LoggedIn";

const useStyles = makeStyles((theme) => ({
  itemContainer: {
    backgroundColor: theme.palette.background.default,
  },
  handleBox: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

interface Props {
  item: CategoryItem;
  categoryIndex: number;
  itemIndex: number;
  itemArrayHelpers: FieldArrayRenderProps;
}

const PacklistFormItem = ({ item, categoryIndex, itemIndex, itemArrayHelpers }: Props) => {
  const formikContext = useFormikContext<UpdateStateInput>();

  // Find which UserItem this item refers to
  const userItemIndex = formikContext.values.userItems.findIndex(i => i.internalId === item.userItemId);
  const userItem = formikContext.values.userItems[userItemIndex];

  const classes = useStyles();

  return (
    <Draggable key={item.internalId} draggableId={item.internalId} index={itemIndex}>
      {provided => (
        <div
          className={classes.itemContainer}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Grid container spacing={0}>
            <Grid item xs={1}>
              <Box className={classes.handleBox}>
                <IconButton {...provided.dragHandleProps} size="small"><Reorder /></IconButton>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box paddingLeft={1}>
                <TextField
                  name={`userItems.${userItemIndex}.name`}
                  size="small"
                  value={userItem.name}
                  placeholder="Name"
                  fullWidth
                  onChange={formikContext.handleChange}
                  onBlur={formikContext.handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <TextField
                name={`userItems.${userItemIndex}.description`}
                size="small"
                value={userItem?.description}
                placeholder="Description"
                fullWidth
                onChange={formikContext.handleChange}
                onBlur={formikContext.handleBlur}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                name={`userItems.${userItemIndex}.weight`}
                size="small"
                type="number"
                value={userItem?.weight}
                fullWidth
                onChange={formikContext.handleChange}
                onBlur={formikContext.handleBlur}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                size="small"
                name={`packlist.categories.${categoryIndex}.categoryItems.${itemIndex}.quantity`}
                type="number"
                onChange={formikContext.handleChange}
                onBlur={formikContext.handleBlur}
                value={item.quantity}
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton
                aria-label="delete" onClick={() => itemArrayHelpers.remove(itemIndex)}
                size="small">
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </div>
      )}
    </Draggable>
  );
};

export default PacklistFormItem;