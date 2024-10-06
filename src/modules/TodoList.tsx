import { Button, Checkbox, Input, message, Radio, Space, Table } from "antd";
import configApi from "../components/api/config";
import { useEffect, useState } from "react";
import IconEdit from "../components/icon/IconEdit";
import IconDelete from "../components/icon/IconDelete";

interface Task {
  id: string;
  name: string;
  status: boolean;
}
export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
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
    if (filter === "completed") return !task.status;
    if (filter === "incomplete") return task.status;
    return true;
  });

  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      const addedTask = await configApi.apiAddTask({
        name: newTask,
        status: false,
      });
      setTasks([...tasks, addedTask]);
      message.success("Công việc đã được thêm!");
      setNewTask("");
    } else {
      message.error("Vui lòng nhập công việc");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await configApi.apiDeleteTask(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
    message.success("Công việc đã được xóa!");
  };

  const handleStatus = async (record: Task) => {
    const updatedTask = { ...record, status: !record.status };
    await configApi.updatedTask({ ...record, status: !record.status });
    setTasks(
      tasks.map((task) =>
        task.id === record.id ? { ...task, status: updatedTask.status } : task
      )
    );
  };

  const columns = [
    {
      title: "Status",
      key: "status",
      render: (_: unknown, record: Task) => (
        <Checkbox
          checked={record.status}
          onChange={() => handleStatus(record)}
        />
      ),
      className: "w-[5%] text-center ",
    },
    {
      title: "Task",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Task) => (
        <span
          className={
            record.status
              ? "line-through text-gray-500 text-md font-semibold"
              : "text-black text-md font-semibold"
          }
        >
          {name}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      className: "w-[20%]",
      render: (_: unknown, record: Task) => (
        <span className="flex">
          <IconEdit />
          <IconDelete
            onClick={() => handleDeleteTask(record.id)}
            className="pl-1"
          />
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-2xl  mx-auto p-6 bg-slate-50 mt-5 rounded-lg shadow-lg">
      <h1 className="text-center text-2xl font-bold mb-3">TO DO LIST</h1>
      <div className="flex mb-5">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          className="mr-2"
        />
        <Button onClick={handleAddTask} type="primary">
          Add Task
        </Button>
      </div>
      <Space className="mb-2 flex justify-center">
        <Radio.Group onChange={(e) => setFilter(e.target.value)} value={filter}>
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="completed">Completed</Radio.Button>
          <Radio.Button value="incomplete">Incomplete</Radio.Button>
        </Radio.Group>
      </Space>

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
