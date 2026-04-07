import { useToast } from "@/context/ToastContext";
import type { Comment, Activity, Task } from "@/types";
import { authFetch } from "@/utils/AuthFetch";
import { useEffect, useRef, useState } from "react";
import {
  MdCheckCircle,
  MdClose,
  MdDelete,
  MdEdit,
  MdGroup,
  MdSave,
  MdSend,
  MdTask,
} from "react-icons/md";
import Avatar from "./Avatar";

type Status = "todo" | "in progress" | "review" | "done";
type Priority = "low" | "medium" | "high";

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (updated: Task) => void;
  onDelete: (id: string) => void;
}

const statusColor: Record<Status, string> = {
  todo: "text-neutral-400 bg-neutral-900 border-neutral-800",
  "in progress": "text-blue-400 bg-blue-950 border-blue-900",
  review: "text-amber-400 bg-amber-950 border-amber-900",
  done: "text-teal-400 bg-teal-950 border-teal-900",
};

const priorityColor: Record<Priority, string> = {
  low: "text-teal-400 bg-teal-950 border-teal-900",
  medium: "text-amber-400 bg-amber-950 border-amber-900",
  high: "text-red-400 bg-red-950 border-red-900",
};

const actionIcon: Record<string, React.ReactNode> = {
  "created a task": <MdTask size={11} className="text-blue-400" />,
  "updated a task": <MdTask size={11} className="text-amber-400" />,
  "commented on a task": <MdSend size={11} className="text-neutral-400" />,
  "completed a task": <MdCheckCircle size={11} className="text-teal-400" />,
};

const TaskDetailPanel = ({
  task,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailPanelProps) => {
  const { showToast } = useToast();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const commenter = useRef<HTMLTextAreaElement>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"comments" | "activity">(
    "comments"
  );

  const [editForm, setEditForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: (task?.status || "todo") as Status,
    priority: (task?.priority || "medium") as Priority,
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
  });

  useEffect(() => {
    if (task) {
      setEditForm({
        title: task.title,
        description: task.description || "",
        status: task.status as Status,
        priority: task.priority as Priority,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      });
      setEditing(false);
    }
  }, [task?._id]);

  useEffect(() => {
    if (!task) return;
    fetchComments();
    fetchActivity();
  }, [task?._id]);

  const fetchComments = async () => {
    try {
      const res = await authFetch(
        `http://localhost:8080/api/task/${task!._id}/comments`
      );
      if (!res.ok) return;
      const data: Comment[] = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await authFetch(`http://localhost:8080/api/activity/my`);
      if (!res.ok) return;
      const data: Activity[] = await res.json();
      setActivities(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await authFetch(
        `http://localhost:8080/api/task/${task!._id}`,
        {
          method: "POST",
          body: JSON.stringify({
            ...editForm,
            dueDate: editForm.dueDate || null,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to Update Task");
      const updated = await res.json();
      onUpdate(updated);
      setEditing(false);
      showToast("Task Updated", "success");
    } catch (err) {
      showToast("Failed to Updated Task", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      setSending(true);
      const res = await authFetch(
        `http://localhost:8080/api/task/${task!._id}/comments`,
        {
          method: "POST",
          body: JSON.stringify({ content: comment }),
        }
      );
      if (!res.ok) throw new Error("Failed to Upload Comments");
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await authFetch(
        `http://localhost:8080/api/task/${task!._id}/comments/${id}`,
        {
          method: "DELETE",
        }
      );
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!task) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        style={{ backdropFilter: "blur(2px)" }}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-105 bg-[#0f0f0d] border-l border-neutral-900 z-50 flex flex-col overflow-hidden"
        style={{ animation: "slidePanel 0.25s ease-out" }}
      >
        <style>{`
          @keyframes slidePanel {
            from { transform: translateX(100%); }
            to   { transform: translateX(0); }
          }
        `}</style>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-900 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                statusColor[task.status as Status]
              }`}
            >
              {task.status}
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                priorityColor[task.priority as Priority]
              }`}
            >
              {task.priority}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing((prev) => !prev)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${
                editing
                  ? "border-blue-800 bg-blue-950 text-blue-400"
                  : "border-neutral-800 text-neutral-500 hover:bg-neutral-900"
              }`}
            >
              <MdEdit size={13} />
            </button>
            <button
              onClick={() => {
                onDelete(task._id);
                onClose();
              }}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-neutral-800 text-neutral-500 hover:border-red-900 hover:text-red-400 transition-colors"
            >
              <MdDelete size={13} />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-neutral-800 text-neutral-500 hover:bg-neutral-900 transition-colors"
            >
              <MdClose size={13} />
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Title */}
          {editing ? (
            <input
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              className="w-full bg-[#0a0a09] border border-neutral-800 rounded-lg px-3 py-2 text-[15px] font-medium text-neutral-100 focus:outline-none focus:border-blue-800 transition-colors mb-3"
            />
          ) : (
            <h2 className="text-[16px] font-medium text-neutral-100 mb-3">
              {task.title}
            </h2>
          )}

          {/* Description */}
          {editing ? (
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              placeholder="Add a description..."
              rows={3}
              className="w-full bg-[#0a0a09] border border-neutral-800 rounded-lg px-3 py-2 text-[13px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-blue-800 transition-colors resize-none mb-4"
            />
          ) : task.description ? (
            <p className="text-[13px] text-neutral-500 leading-relaxed mb-4">
              {task.description}
            </p>
          ) : (
            <p className="text-[13px] text-neutral-700 italic mb-4">
              No description
            </p>
          )}

          {/* Edit fields */}
          {editing && (
            <div className="flex flex-col gap-3 mb-4 p-3 bg-neutral-900/30 rounded-xl border border-neutral-900">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] tracking-widest uppercase text-neutral-700">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as Status,
                      })
                    }
                    className="bg-[#0a0a09] border border-neutral-800 rounded-lg px-2 py-1.5 text-[12px] text-neutral-400 focus:outline-none focus:border-blue-800"
                  >
                    <option value="todo">To do</option>
                    <option value="in progress">In progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] tracking-widest uppercase text-neutral-700">
                    Priority
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        priority: e.target.value as Priority,
                      })
                    }
                    className="bg-[#0a0a09] border border-neutral-800 rounded-lg px-2 py-1.5 text-[12px] text-neutral-400 focus:outline-none focus:border-blue-800"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-widest uppercase text-neutral-700">
                  Due date
                </label>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dueDate: e.target.value })
                  }
                  className="bg-[#0a0a09] border border-neutral-800 rounded-lg px-2 py-1.5 text-[12px] text-neutral-400 focus:outline-none focus:border-blue-800"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 text-[12px] hover:bg-blue-900 transition-colors disabled:opacity-50"
              >
                <MdSave size={13} />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          )}

          {/* Meta info */}
          <div className="flex flex-col gap-2 mb-5 pb-5 border-b border-neutral-900">
            {task.dueDate && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-700">Due date</span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {task.createdAt && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-700">Created</span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {(task.createdBy as any)?.name && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-700">Created by</span>
                <div className="flex items-center gap-1.5">
                  <Avatar
                    name={(task.createdBy as any).name}
                    picture={(task.createdBy as any).picture}
                    size="sm"
                  />
                  <span className="text-[11px] text-neutral-400">
                    {(task.createdBy as any).name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Assigned members */}
          {task.assignedTo &&
            Array.isArray(task.assignedTo) &&
            task.assignedTo.length > 0 && (
              <div className="mb-5 pb-5 border-b border-neutral-900">
                <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-700 mb-3 flex items-center gap-1.5">
                  <MdGroup size={12} /> Assigned to
                </p>
                <div className="flex flex-col gap-2">
                  {task.assignedTo.map((u: any) => (
                    <div key={u._id} className="flex items-center gap-2.5">
                      <Avatar
                        name={u.name || "?"}
                        picture={u.picture}
                        size="sm"
                      />
                      <div>
                        <p className="text-[12px] text-neutral-300">{u.name}</p>
                        <p className="text-[11px] text-neutral-600">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Tabs */}
          <div className="flex gap-1 mb-4">
            {(["comments", "activity"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-neutral-900 text-neutral-300 border border-neutral-800"
                    : "text-neutral-600 hover:text-neutral-400"
                }`}
              >
                {tab}
                {tab === "comments" && comments.length > 0 && (
                  <span className="ml-1.5 text-[10px] text-neutral-600">
                    {comments.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Comments tab */}
          {activeTab === "comments" && (
            <div className="flex flex-col gap-3">
              {comments.length === 0 ? (
                <p className="text-[12px] text-neutral-700">
                  No comments yet. Start the discussion!
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="flex gap-2.5">
                    <Avatar
                      name={c.user?.name || "?"}
                      picture={c.user?.picture}
                      size="sm"
                    />
                    <div className="flex-1 bg-neutral-900/50 rounded-xl px-3 py-2.5 border border-neutral-900">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-medium text-neutral-300">
                          {c.user?.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-neutral-700 font-mono">
                            {new Date(c.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {c.user?._id === currentUser._id && (
                            <button
                              onClick={() => handleDeleteComment(c._id)}
                              className="text-neutral-700 hover:text-red-400 transition-colors"
                            >
                              <MdDelete size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[12px] text-neutral-400 leading-relaxed">
                        {c.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Activity tab */}
          {activeTab === "activity" && (
            <div className="flex flex-col gap-3">
              {activities.length === 0 ? (
                <p className="text-[12px] text-neutral-700">No activity yet.</p>
              ) : (
                activities.map((a) => (
                  <div key={a._id} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                      {actionIcon[a.action] ?? (
                        <MdTask size={11} className="text-neutral-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[12px] text-neutral-400">
                        <span className="text-neutral-200 font-medium">
                          {(a.user as any)?.name}
                        </span>{" "}
                        {a.action}
                      </p>
                      <p className="text-[10px] text-neutral-700 font-mono mt-0.5">
                        {new Date(a.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── Comment input ── */}
        <div className="px-5 py-4 border-t border-neutral-900 shrink-0">
          <form onSubmit={handleComment} className="flex gap-2">
            <Avatar
              name={currentUser.name || "?"}
              picture={currentUser.picture}
              size="sm"
            />
            <div className="flex-1 flex gap-2">
              <textarea
                ref={commenter}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleComment(e as any);
                  }
                }}
                placeholder="Add a comment... (Enter to send)"
                rows={1}
                className="flex-1 bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[12px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-blue-800 transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={!comment.trim() || sending}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-950 border border-blue-800 text-blue-400 hover:bg-blue-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed self-end"
              >
                <MdSend size={13} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskDetailPanel;
