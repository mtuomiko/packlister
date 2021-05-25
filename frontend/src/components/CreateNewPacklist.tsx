import { useMutation } from "@apollo/client";
import { Button } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import React from "react";
import { CREATE_PACKLIST } from "../graphql/mutations";

const CreateNewPacklist = () => {
  const [createPacklist] = useMutation<
    {
      createPacklist: {
        id: string;
      };
    },
    {
      name: string;
    }
  >(CREATE_PACKLIST);

  const submit = async () => {
    try {
      await createPacklist({
        variables: { name: "" }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Button
        onClick={submit}
        size="small"
        color="primary"
        startIcon={<AddCircle />}
      >Add new</Button>
    </>
  );
};

export default CreateNewPacklist;