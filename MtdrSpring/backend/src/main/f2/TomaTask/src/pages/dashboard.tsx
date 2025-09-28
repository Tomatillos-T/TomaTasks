/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2022 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
/*
 * This is the application main React component. We're using "function"
 * components in this application. No "class" components should be used for
 * consistency.
 * @author  jean.de.lavarene@oracle.com
 */
import React, { useState, useEffect } from "react";
import NewItem from "../modules/task/components/newItem";
import API_LIST from "../API";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, TableBody, CircularProgress } from "@mui/material";

// Define the shape of a todo item
interface TodoItem {
  id: string;
  description: string;
  done: boolean;
  createdAt?: string;
}

export default function Dashboard() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isInserting, setInserting] = useState<boolean>(false);
  const [items, setItems] = useState<TodoItem[]>([]);
  const [error, setError] = useState<Error | null>(null);

  function deleteItem(deleteId: string) {
    fetch(API_LIST + "/" + deleteId, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return response;
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then(
        () => {
          const remainingItems = items.filter((item) => item.id !== deleteId);
          setItems(remainingItems);
        },
        (err) => {
          setError(err);
        }
      );
  }

  function toggleDone(
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
    description: string,
    done: boolean
  ) {
    event.preventDefault();
    modifyItem(id, description, done).then(
      () => {
        reloadOneItem(id);
      },
      (err) => {
        setError(err);
      }
    );
  }

  function reloadOneItem(id: string) {
    fetch(API_LIST + "/" + id)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then(
        (result: TodoItem) => {
          const items2 = items.map((x) =>
            x.id === id
              ? {
                  ...x,
                  description: result.description,
                  done: result.done,
                }
              : x
          );
          setItems(items2);
        },
        (err) => {
          setError(err);
        }
      );
  }

  function modifyItem(
    id: string,
    description: string,
    done: boolean
  ): Promise<Response> {
    const data = { description, done };
    return fetch(API_LIST + "/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        return response;
      } else {
        throw new Error("Something went wrong ...");
      }
    });
  }

  useEffect(() => {
    setLoading(true);
    fetch(API_LIST)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then(
        (result: TodoItem[]) => {
          setLoading(false);
          setItems(result);
        },
        (err) => {
          setLoading(false);
          setError(err);
        }
      );
  }, []);

  function addItem(text: string) {
    setInserting(true);
    const data = { description: text };

    fetch(API_LIST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response;
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then(
        (result) => {
          const id = result.headers.get("location") ?? "";
          const newItem: TodoItem = { id, description: text, done: false };
          setItems([newItem, ...items]);
          setInserting(false);
        },
        (err) => {
          setInserting(false);
          setError(err);
        }
      );
  }

  return (
    <div className="bg-neutral-500 ml-[600px] py-2 px-20 my-5 w-1/2 rounded-md">
      <h1>MY TODO LIST</h1>
      <NewItem addItem={addItem} isInserting={isInserting} />
      {error && <p>Error: {error.message}</p>}
      {isLoading && <CircularProgress />}
      {!isLoading && (
        <div id="maincontent">
          <table id="itemlistNotDone" className="itemlist">
            <TableBody>
              {items.map(
                (item) =>
                  !item.done && (
                    <tr key={item.id}>
                      <td className="description">{item.description}</td>
                      <td className="date">{item.createdAt}</td>
                      <td>
                        <Button
                          variant="contained"
                          className="DoneButton"
                          onClick={(event) =>
                            toggleDone(
                              event,
                              item.id,
                              item.description,
                              !item.done
                            )
                          }
                          size="small"
                        >
                          Done
                        </Button>
                      </td>
                    </tr>
                  )
              )}
            </TableBody>
          </table>
          <h2 id="donelist">Done items</h2>
          <table id="itemlistDone" className="itemlist">
            <TableBody>
              {items.map(
                (item) =>
                  item.done && (
                    <tr key={item.id}>
                      <td className="description">{item.description}</td>
                      <td className="date">{item.createdAt}</td>
                      <td>
                        <Button
                          variant="contained"
                          className="DoneButton"
                          onClick={(event) =>
                            toggleDone(
                              event,
                              item.id,
                              item.description,
                              !item.done
                            )
                          }
                          size="small"
                        >
                          Undo
                        </Button>
                      </td>
                      <td>
                        <Button
                          startIcon={<DeleteIcon />}
                          variant="contained"
                          className="DeleteButton"
                          onClick={() => deleteItem(item.id)}
                          size="small"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )
              )}
            </TableBody>
          </table>
        </div>
      )}
    </div>
  );
}
