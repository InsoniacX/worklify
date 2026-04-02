import { AppLayout, Avatar } from "@/components";
import type { Activity, Schedule, Task } from "@/types";
import { authFetch } from "@/utils/AuthFetch";
import { useEffect, useState } from "react";
import {
  MdCalendarMonth,
  MdCheckCircle,
  MdGroup,
  MdTask,
} from "react-icons/md";

const actionIcon: Record<string, React.ReactNode> = {
  "Created a Task": <MdTask size={13} className="text-blue-400" />,
  "Updated a Task": <MdTask size={13} className="text-amber-400" />,
  "Deleted a Task": <MdTask size={13} className="text-red-400" />,
  "Created a Team": <MdGroup size={13} className="text-teal-400" />,
  "Added a member to Team": <MdGroup size={13} className="text-blue-400" />,
  "Deleted a member to Team": <MdGroup size={13} className="text-red-400" />, // ← both cases
};
const Homepage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [activities, setActivities] = useState<Activity[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [todaySchedule, setTodaySchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actRes, taskRes, schedRes] = await Promise.allSettled([
          authFetch("http://localhost:8080/api/activity/my"),
          authFetch("http://localhost:8080/api/task/my"),
          authFetch("http://localhost:8080/api/schedule"),
        ]);

        if (actRes.status === "fulfilled" && actRes.value.ok) {
          const data = await actRes.value.json();
          setActivities(data);
        }

        if (taskRes.status === "fulfilled" && taskRes.value.ok) {
          const data = await taskRes.value.json();
          setMyTasks(data);
        }

        if (schedRes.status === "fulfilled" && schedRes.value.ok) {
          const data = await schedRes.value.json();
          const today = new Date().toDateString();
          setTodaySchedules(
            data.filter(
              (s: Schedule) => new Date(s.date).toDateString() === today
            )
          );
        }
      } catch (err) {
        console.error("fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const priorityColor = {
    low: "text-teal-400 bg-teal-950 border-teal-900",
    medium: "text-amber-400 bg-amber-950 border-amber-900",
    high: "text-red-400 bg-red-950 border-red-900",
  };

  const scheduleTypeColor = {
    meeting: "text-blue-400 bg-blue-950 border-blue-900",
    deadline: "text-red-400 bg-red-950 border-red-900",
    reminder: "text-amber-400 bg-red-950 border-red-900",
    event: "text-teal-400 bg-teal-950 border-red-900",
  };

  return (
    <AppLayout
      title={`Good ${
        new Date().getHours() < 12
          ? "morning"
          : new Date().getHours() < 18
          ? "afternoon"
          : new Date().getHours() < 21
          ? "evening"
          : "night"
      }, ${user.name?.split(" ")[0] || "there"} 👋`}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-[#0f0f0d] border border-neutral-900 rounded-xl p-5">
          <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-4">
            Activity feed
          </p>
          {loading ? (
            <p className="text-[12px] text-neutral-700">Loading...</p>
          ) : activities.length === 0 ? (
            <p className="text-[12px] text-neutral-700">
              No recent activity yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {activities.map((activity) => (
                <div key={activity._id} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                    {actionIcon[activity.action] ?? (
                      <MdTask size={13} className="text-neutral-500" />
                    )}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                    <Avatar
                      name={(activity.user as any)?.name}
                      picture={activity.user?.picture}
                      size="sm"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] text-neutral-300">
                      <span className="font-medium text-neutral-100">
                        {(activity.user as any)?.name || "Someone"}
                      </span>{" "}
                      {activity.action}
                      {activity.meta?.taskTitle && (
                        <span className="text-neutral-500">
                          {" "}
                          — {activity.meta.taskTitle}
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-neutral-700 mt-0.5 font-mono">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-5">
            <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-3">
              My tasks
            </p>
            {loading ? (
              <p className="text-[12px] text-neutral-700">Loading...</p>
            ) : myTasks.length === 0 ? (
              <p className="text-[12px] text-neutral-700">
                No tasks in progress.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {myTasks.slice(0, 5).map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between gap-2 py-1.5 border-b border-neutral-900 last:border-none"
                  >
                    <p className="text-[12px] text-neutral-300 truncate flex-1">
                      {task.title}
                    </p>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        priorityColor[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-5">
            <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-3">
              Today
            </p>
            {loading ? (
              <p className="text-[12px] text-neutral-700">Loading...</p>
            ) : todaySchedule.length === 0 ? (
              <p className="text-[12px] text-neutral-700">
                Nothing scheduled today.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {todaySchedule.map((s) => (
                  <div
                    key={s._id}
                    className="flex items-start gap-3 py-1.5 border-b border-neutral-900 last:border-none"
                  >
                    <MdCalendarMonth
                      size={13}
                      className="text-neutral-600 shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-[12px] text-neutral-300">{s.title}</p>
                      <p className="text-[11px] text-neutral-600 font-mono">
                        {s.startTime} — {s.endTime}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ml-auto shrink-0 ${
                        scheduleTypeColor[s.type]
                      }`}
                    >
                      {s.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Homepage;
