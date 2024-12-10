import React, { useEffect, useState } from "react";
import { Button, TextInput } from "flowbite-react";
import axios from "axios";

const ToDoList = () => {
  const [arrTask, setArrTask] = useState([]);

  const [inputTaskName, setInputTaskName] = useState({
    taskName: null,
  });

  const getAllTask = () => {
    axios({
      url: "https://svcy.myclass.vn/api/ToDoList/GetAllTask",
      method: "GET",
    })
      .then((response) => {
        console.log("response get AllTask: ", response.data);
        setArrTask(response.data);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  };

  useEffect(() => {
    getAllTask();
  }, []);

  const renderArrTask = () => {
    // task nào chưa xong ở trên, đã xong ở dưới
    const arrTaskSort = arrTask.sort((laterTask, previousTask) => {
      return laterTask.status === previousTask.status
        ? 0
        : laterTask.status
        ? 1
        : -1;
    });

    return arrTaskSort?.map((item, index) => {
      if (item.status) {
        return (
          <div key={index} className="taskComplete">
            <p>{item.taskName}</p>
            <div className="flex gap-2">
              <Button
                color="warning"
                onClick={() => {
                  handleUpdateTask(item.taskName, "reject");
                }}
              >
                Reject
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  handleUpdateTask(item.taskName, "delete");
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      } else {
        return (
          <div key={index} className="taskPending">
            <p>{item.taskName}</p>
            <div className="flex gap-2">
              <Button
                color="success"
                onClick={() => {
                  handleUpdateTask(item.taskName, "done");
                }}
              >
                Complete
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  handleUpdateTask(item.taskName, "delete");
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      }
    });
  };

  const handleChangeInput = (e) => {
    setInputTaskName({ taskName: e.target.value });
  };

  const handleAddTask = () => {
    axios({
      url: "https://svcy.myclass.vn/api/ToDoList/AddTask",
      method: "POST",
      data: inputTaskName,
    })
      .then((response) => {
        console.log("response add Task: ", response.data);
        getAllTask();
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  };

  // HANDLE UPDATETASK GỒM: DELETE, DONE , REJECT TASK
  const handleUpdateTask = (taskName, update) => {
    axios({
      url: `https://svcy.myclass.vn/api/ToDoList/${update}Task?taskName=${taskName}`,
      method: update === "delete" ? "DELETE" : "PUT",
    })
      .then((response) => {
        console.log("response update Task: ", response.data);
        getAllTask();
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  };

  return (
    <div className="ToDoList">
      <h1 className="title">ToDo List</h1>
      <div className="addTask">
        <TextInput
          id="taskName"
          name="taskName"
          placeholder="Enter new todo"
          className="w-full"
          onChange={handleChangeInput}
        />
        <Button color="blue" onClick={handleAddTask}>
          Add
        </Button>
      </div>
      <div className="renderAPI">{renderArrTask()}</div>
    </div>
  );
};

export default ToDoList;
