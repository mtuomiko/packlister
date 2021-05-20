import { Box, Grid, IconButton, makeStyles, TextField } from "@material-ui/core";
import { Delete, Reorder } from "@material-ui/icons";
import { FieldArrayRenderProps, useFormikContext } from "formik";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { CategoryItem } from "../types";
import { FormikFields } from "./PacklistFormCategory";

const useStyles = makeStyles((theme) => ({
  itemContainer: {
    // margin: theme.spacing(1, 0),
    // padding: theme.spacing(1),
    // backgroundColor: "white",
    // border: "1px solid black",
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
  const formikContext = useFormikContext<FormikFields>();
  const userItem = formikContext.values.userItems.find(i => i.internalId === item.userItemId);

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
                  size="small"
                  value={userItem?.name}
                  placeholder="Name"
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <TextField
                size="small"
                value={userItem?.description}
                placeholder="Description"
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                size="small"
                type="number"
                value={userItem?.weight}
                fullWidth
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