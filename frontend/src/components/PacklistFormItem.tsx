import { IconButton, TextField } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React, { useCallback, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CategoryItem } from "../types";
import FormTextField from "./FormTextField";
import { UpdateStateInput } from "./LoggedIn";

const PacklistFormItem = ({ packlistIndex, categoryIndex, categoryItem, index, remove }: {
  packlistIndex: number;
  categoryIndex: number;
  categoryItem: CategoryItem;
  index: number;
  // onRemove: (index: number) => void;
  remove: (index?: number | number[] | undefined) => void;
}) => {
  const methods = useFormContext<UpdateStateInput>();

  const userItems = methods.getValues("userItems");
  const userItemIndex = userItems.findIndex(ui => ui.internalId === categoryItem.userItemId);
  const userItem = userItems[userItemIndex];
  // const userItemWatcher = useWatch({ control: methods.control, name: `userItems.${userItemIndex}` as const });

  // const handleItemRemoval = useCallback(() => {
  //   onRemove(index);
  // }, [onRemove, index]);

  // if (userItemWatcher === undefined) {
  //   remove(index);
  // }

  // useEffect(() => {
  //   console.log(userItemWatcher);
  //   if (userItemWatcher === undefined) {
  //     remove(index);
  //   }
  // }, []);

  return (
    <div>
      <TextField
        defaultValue={userItem?.name}
        onChange={e => {
          methods.setValue(`userItems.${userItemIndex}.name` as "userItems.0.name", e.target.value);
        }}
      />
      <TextField
        defaultValue={userItem?.description}
        onChange={e => {
          methods.setValue(`userItems.${userItemIndex}.description` as "userItems.0.description", e.target.value);
        }}
      />
      {/* <FormTextField
        name={`packlists.${packlistIndex}.categories.${categoryIndex}.categoryItems.${index}.internalId`}
        defaultValue={userItem?.name}
      /> */}
      {/* <TextField
        // name={`packlists.${packlistIndex}.categories.${categoryIndex}.categoryItems.${index}.quantity`}
        defaultValue={userItem?.description}
      /> */}
      <FormTextField
        name={`packlists.${packlistIndex}.categories.${categoryIndex}.categoryItems.${index}.quantity`}
        defaultValue={categoryItem.quantity}
        type="number"
      />
      <IconButton
        aria-label="delete" onClick={() => remove(index)}
        size="small">
        <Delete />
      </IconButton>
    </div>
  );

};

export default PacklistFormItem;