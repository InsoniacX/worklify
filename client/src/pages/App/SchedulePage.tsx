import { useEffect, useState } from "react";
import { AppLayout } from "@/components";
import { authFetch } from "@/utils/AuthFetch";
import { useToast } from "@/context/ToastContext";
import type { Schedule, Team } from "@/types";
import {
  MdAdd,
  MdDelete,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
} from "react-icons/md";

const typeColor: Record<string, string> = {
  meeting: "bg-blue-950 border-blue-900 text-blue-400",
  deadline: "bg-red-950 border-red-900 text-red-400",
  reminder: "bg-amber-950 border-amber-900 text-amber-400",
  event: "bg-teal-950 border-teal-900 text-teal-400",
};

const typeDot: Record<string, string> = {
  meeting: "bg-blue-400",
  deadline: "bg-red-400",
  reminder: "bg-amber-400",
  event: "bg-teal-400",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SchedulePage = () => {
  const { showToast } = useToast();
  const today = new Date();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selected, setSelected] = useState<Date | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "event",
    team: "",
  });

  // ── Fetch schedules ───────────────────────────────────────────────────────
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await authFetch("http://localhost:8080/api/schedule");
      if (!response.ok) throw new Error("Failed to fetch schedules");
      const data = await response.json();
      setSchedules(data);
    } catch {
      showToast("Failed to fetch schedules", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch teams ───────────────────────────────────────────────────────────
  const fetchTeams = async () => {
    try {
      const response = await authFetch("http://localhost:8080/api/team/my");
      if (!response.ok) return;
      const data = await response.json();
      setTeams(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchTeams();
  }, []);

  // ── Handle create ─────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await authFetch("http://localhost:8080/api/schedule", {
        method: "POST",
        body: JSON.stringify({ ...form, team: form.team || null }),
      });
      if (!response.ok) throw new Error("Failed to create schedule");
      showToast("Schedule created", "success");
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        type: "event",
        team: "",
      });
      fetchSchedules();
    } catch {
      showToast("Failed to create schedule", "error");
    }
  };

  // ── Handle delete ─────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      const response = await authFetch(
        `http://localhost:8080/api/schedule/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete");
      showToast("Schedule deleted", "success");
      setSchedules((prev) => prev.filter((s) => s._id !== id));
    } catch {
      showToast("Failed to delete schedule", "error");
    }
  };

  // ── Calendar helpers ──────────────────────────────────────────────────────
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const getSchedulesForDay = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return schedules.filter(
      (s) => new Date(s.date).toDateString() === date.toDateString()
    );
  };

  const selectedSchedules = selected
    ? schedules.filter(
        (s) => new Date(s.date).toDateString() === selected.toDateString()
      )
    : [];

  // Pre-fill date when clicking a calendar day
  const handleDayClick = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelected(date);
    // Pre-fill form date
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    setForm((prev) => ({ ...prev, date: `${yyyy}-${mm}-${dd}` }));
  };

  return (
    <AppLayout title="Schedule">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <p className="text-[12px] text-neutral-600">
            {schedules.length} events total
          </p>
          {/* Legend */}
          <div className="flex items-center gap-3">
            {Object.entries(typeDot).map(([type, dot]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-[11px] text-neutral-600 capitalize">
                  {type}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 text-[12px] hover:bg-blue-900 transition-colors"
        >
          {showForm ? <MdClose size={14} /> : <MdAdd size={14} />}
          {showForm ? "Cancel" : "New event"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-5 mb-5">
          <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-4">
            New event
          </p>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            {/* Title */}
            <input
              type="text"
              placeholder="Event title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-blue-800 transition-colors"
            />

            {/* Description */}
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              className="bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-blue-800 transition-colors resize-none"
            />

            {/* Date & time */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-widest uppercase text-neutral-700">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-400 focus:outline-none focus:border-blue-800 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-widest uppercase text-neutral-700">
                  Start
                </label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm({ ...form, startTime: e.target.value })
                  }
                  required
                  className="bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-400 focus:outline-none focus:border-blue-800 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-widest uppercase text-neutral-700">
                  End
                </label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) =>
                    setForm({ ...form, endTime: e.target.value })
                  }
                  required
                  className="bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-400 focus:outline-none focus:border-blue-800 transition-colors"
                />
              </div>
            </div>

            {/* Type & team */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-widest uppercase text-neutral-700">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-400 focus:outline-none focus:border-blue-800 transition-colors"
                >
                  <option value="event">Event</option>
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-widest uppercase text-neutral-700">
                  Team (optional)
                </label>
                <select
                  value={form.team}
                  onChange={(e) => setForm({ ...form, team: e.target.value })}
                  className="bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-400 focus:outline-none focus:border-blue-800 transition-colors"
                >
                  <option value="">Personal</option>
                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-1">
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
                Create event
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* ── Calendar ── */}
        <div className="col-span-2 bg-[#0f0f0d] border border-neutral-900 rounded-xl p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[14px] font-medium text-neutral-200">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                      1
                    )
                  )
                }
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-neutral-900 text-neutral-500 hover:bg-neutral-900 transition-colors"
              >
                <MdChevronLeft size={14} />
              </button>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(today.getFullYear(), today.getMonth(), 1)
                  )
                }
                className="text-[11px] text-neutral-600 hover:text-neutral-300 px-2 py-1 rounded-lg hover:bg-neutral-900 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                      1
                    )
                  )
                }
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-neutral-900 text-neutral-500 hover:bg-neutral-900 transition-colors"
              >
                <MdChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <p
                key={d}
                className="text-[10px] font-medium text-neutral-700 text-center tracking-widest uppercase py-1"
              >
                {d}
              </p>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const daySchedules = getSchedulesForDay(day);
              const thisDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              );
              const isToday = thisDate.toDateString() === today.toDateString();
              const isSelected =
                selected?.toDateString() === thisDate.toDateString();

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-start p-1 transition-colors ${
                    isSelected
                      ? "bg-blue-950 border border-blue-900"
                      : isToday
                      ? "bg-neutral-900 border border-neutral-700"
                      : "hover:bg-neutral-900"
                  }`}
                >
                  <span
                    className={`text-[11px] font-medium ${
                      isToday
                        ? "text-blue-400"
                        : isSelected
                        ? "text-blue-300"
                        : "text-neutral-400"
                    }`}
                  >
                    {day}
                  </span>
                  {daySchedules.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {daySchedules.slice(0, 3).map((s) => (
                        <span
                          key={s._id}
                          className={`w-1 h-1 rounded-full ${typeDot[s.type]}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Selected day events ── */}
        <div
          className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-5 overflow-y-auto"
          style={{ maxHeight: "420px" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600">
              {selected
                ? selected.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  })
                : "Select a day"}
            </p>
            {selected && (
              <button
                onClick={() => {
                  setShowForm(true);
                }}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                + Add
              </button>
            )}
          </div>

          {!selected ? (
            <p className="text-[12px] text-neutral-700">
              Click a day to see events
            </p>
          ) : loading ? (
            <p className="text-[12px] text-neutral-700">Loading...</p>
          ) : selectedSchedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <p className="text-[12px] text-neutral-700">No events this day</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                + Create one
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedSchedules.map((s) => (
                <div
                  key={s._id}
                  className={`border rounded-xl p-3 ${typeColor[s.type]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-medium leading-tight">
                      {s.title}
                    </p>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <MdDelete size={13} />
                    </button>
                  </div>
                  {s.description && (
                    <p className="text-[11px] opacity-60 mt-1 line-clamp-2">
                      {s.description}
                    </p>
                  )}
                  <p className="text-[11px] opacity-70 font-mono mt-2">
                    {s.startTime} — {s.endTime}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] opacity-60 uppercase tracking-widest">
                      {s.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default SchedulePage;
