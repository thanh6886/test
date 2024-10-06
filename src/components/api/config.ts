import axios from "axios";
interface InewTask {
  name: string;
  status: boolean;
}
const API_URL = "http://localhost:3000/tasks";
const configApi = {
  async apiGetAllTasks() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error("Không thể lấy danh sách công việc: " + error);
    }
  },
  async apiAddTask(newTask: InewTask) {
    try {
      const response = await axios.post(API_URL, newTask, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Không thể thêm công việc: " + error);
    }
  },
  async apiDeleteTask(taskId: string) {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
    } catch (error) {
      throw new Error("Không thể xóa công việc: " + error);
    }
  },
  async updatedTask(newTask: { id: string; name: string; status: boolean }) {
    try {
      const response = await axios.patch(
        `http://localhost:3000/tasks/${newTask.id}`,
        { status: newTask.status }
      );
      return response.data;
    } catch (error) {
      throw new Error("Không thể xóa công việc: " + error);
    }
  },
};
export default configApi;
