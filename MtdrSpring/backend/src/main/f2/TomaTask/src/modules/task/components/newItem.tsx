/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2022 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
/*
 * Component that supports creating a new todo item.
 * @author
 */

import React, { useState } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import Button from "@mui/material/Button";

// ---- Props typing ----
interface NewItemProps {
  addItem: (item: string) => void;
  isInserting: boolean;
}

const NewItem: React.FC<NewItemProps> = ({ addItem, isInserting }) => {
  const [item, setItem] = useState<string>("");

  function handleSubmit(
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>
  ) {
    if (!item.trim()) {
      return;
    }
    addItem(item);
    setItem("");
    e.preventDefault();
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setItem(e.target.value);
  }

  return (
    <div id="newinputform">
      <form>
        <input
          className="text-black"
          id="newiteminput"
          placeholder="New item"
          type="text"
          autoComplete="off"
          value={item}
          onChange={handleChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit(event);
            }
          }}
        />
        <span>&nbsp;&nbsp;</span>
        <Button
          className="AddButton"
          variant="contained"
          disabled={isInserting}
          onClick={!isInserting ? handleSubmit : undefined}
          size="small"
        >
          {isInserting ? "Adding…" : "Add"}
        </Button>
      </form>
    </div>
  );
};

export default NewItem;
