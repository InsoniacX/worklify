import { AppLayout } from "@/components";
import { useToast } from "@/context/ToastContext";
import type { Task } from "@/types";
import { authFetch } from "@/utils/AuthFetch";
import React, { useEffect, useState } from "react";
import { MdAdd, MdDelete } from "react-icons/md";

type Status = "todo" | "in progress" | "reviews" | "done";

const columns: { key: Status; label: String; color: String }[] = [
  {
    key: "todo",
    label: "To Do",
    color: "text-neutral-400 border-neutral-800",
  },
  {
    key: "in progress",
    label: "In Progress",
    color: "text-blue-400 border-blue-800",
  },
  {
    key: "reviews",
    label: "Review",
    color: "text-amber-400 border-amber-800",
  },
  {
    key: "done",
    label: "Done",
    color: "text-green-400 border-green-800",
  },
];

const priorityColor = {
  low: "text-teal-400 bg-teal-950 border-teal-900",
  medium: "text-amber-400 bg-amber-950 border-amber-900",
  high: "text-red-400 bg-red-950 border-red-900",
};

const TasksPage = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "todo",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await authFetch("http://localhost:8080/api/task/my");
        if (!response.ok) throw new Error("Failed to Fetch Data");
        const result = await response.json();
        setTasks(Array.isArray(result) ? result : result.data ?? []);
      } catch (err) {
        showToast("Failed to fetch tasks", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await authFetch("http://localhost:8080/api/task", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to create new Task");
      showToast("Task created Successfully", "success");
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        status: "todo",
      });
    } catch (err) {
      showToast("Failed to create Task", "error");
    }
  };

  const handleStatusChange = async (id: string, status: Status) => {
    try {
      const response = await authFetch(`http://localhost:8080/api/task/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t))
      );
      showToast("Task updated", "success");
    } catch (err) {
      showToast("Failed to update task", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await authFetch(`http://localhost:8080/api/task/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showToast("Task Deleted", "success");
    } catch (err) {
      showToast("Failed to delete task", "error");
    }
  };

  return (
    <AppLayout title="Tasks">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-[12px] text-neutral-600">
          {tasks.length} tasks total
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 text-[12px] hover:bg-blue-900 transition-colors"
        >
          <MdAdd size={14} /> New task
        </button>
      </div>

      {showForm && (
        <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-5 mb-5">
          <p className="text-[12px] font-medium text-neutral-300 mb-4">
            Create task
          </p>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-blue-800 transition-colors"
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              className="bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-blue-800 transition-colors resize-none"
            />
            <div className="flex gap-3">
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="flex-1 bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-400 focus:outline-none focus:border-blue-800 transition-colors"
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="flex-1 bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-400 focus:outline-none focus:border-blue-800 transition-colors"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-1.5 rounded-lg border border-neutral-800 text-neutral-500 text-[12px] hover:bg-neutral-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 text-[12px] hover:bg-blue-900 transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="flex flex-col gap-3">
              {/* Column header */}
              <div
                className={`flex items-center justify-between pb-2 border-b ${col.color}`}
              >
                <span className="text-[11px] font-medium tracking-widest uppercase">
                  {col.label}
                </span>
                <span className="text-[11px] font-mono">{colTasks.length}</span>
              </div>

              {/* Task cards */}
              {loading ? (
                <p className="text-[11px] text-neutral-700">Loading...</p>
              ) : colTasks.length === 0 ? (
                <p className="text-[11px] text-neutral-800">No tasks</p>
              ) : (
                colTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-3 flex flex-col gap-2"
                  >
                    <p className="text-[13px] text-neutral-200 font-medium">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[11px] text-neutral-600 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                          priorityColor[task.priority]
                        }`}
                      >
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-[10px] text-neutral-700 font-mono">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Status change */}
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value as Status)
                      }
                      className="bg-[#0a0a09] border border-neutral-900 rounded-lg px-2 py-1 text-[11px] text-neutral-500 focus:outline-none focus:border-blue-800 transition-colors"
                    >
                      {columns.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-400 transition-colors self-end"
                    >
                      <MdDelete size={12} /> Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default TasksPage;
