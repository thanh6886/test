import { Button, Checkbox, Input, message, Radio, Table } from "antd";
import { useEffect, useState } from "react";
import configApi from "./config";

interface Task {
  id: string;
  name: string;
  status: boolean;
}
export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );

  useEffect(() => {
    const getAllTasks = async () => {
      const response = await configApi.apiGetAllTasks();
      setTasks(response);
    };
    getAllTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.status;
    if (filter === "incomplete") return !task.status;
    return true;
  });

  const handleAddTask = async () => {
    if (nTask.trim() === "") {
      alert("Hãy nhập tên công việc!");
      return;
    }
    const newTask = { name: nTask, status: false };
    const addedTask = await configApi.apiAddTask(newTask);
    setTasks([...tasks, addedTask]);
    message.success("Công việc đã được thêm!");
    setNewTask("");
  };

  const handleDeleteTask = async (taskId: string) => {
    await configApi.apiDeleteTask(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
    message.success("Công việc đã được xóa!");
  };

  const handleStatus = async (record: Task) => {
    const updatedTask = { ...record, status: !record.status };
    await configApi.updatedTask(updatedTask);
    setTasks(
      tasks.map((task) =>
        task.id === record.id ? { ...task, status: updatedTask.status } : task
      )
    );
  };

  const columns = [
    {
      title: "status",
      key: "status",
      render: (_: unknown, record: Task) => (
        <Checkbox
          checked={record.status}
          onChange={() => handleStatus(record)}
        />
      ),
    },
    {
      title: "Task",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Task) => (
        <span
          style={{ textDecoration: record.status ? "line-through" : "none" }}
        >
          {name}
        </span>
      ),
    },
    {
      title: "action",
      key: "action",
      render: (_: unknown, record: Task) => (
        <>
          <Button onClick={() => handleDeleteTask(record.id)} type="link">
            Xóa
          </Button>
          ,
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản lý công việc</h1>
      <Input
        value={nTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter new task"
      />
      <Button onClick={handleAddTask} type="primary">
        Add Task
      </Button>
      <Radio.Group onChange={(e) => setFilter(e.target.value)} value={filter}>
        <Radio.Button value="all">All</Radio.Button>
        <Radio.Button value="completed">Completed</Radio.Button>
        <Radio.Button value="incomplete">Incomplete</Radio.Button>
      </Radio.Group>

      <Table
        bordered
        columns={columns}
        dataSource={filteredTasks}
        rowKey="id"
        size="small"
        pagination={{
          showTotal: (total) => `Total ${total} items`,
        }}
      />
    </div>
  );
}
