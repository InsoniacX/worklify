import { AppLayout } from "@/components";
import { useToast } from "@/context/ToastContext";
import type { Team } from "@/types";
import { authFetch } from "@/utils/AuthFetch";
import React, { useEffect, useState } from "react";
import { MdAdd, MdClose, MdDelete, MdGroup, MdPersonAdd } from "react-icons/md";

const TeamsPage = () => {
  const { showToast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Team | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = selected?.members.some(
    (m) => (m.user as any)._id === currentUser._id && m.role === "owner"
  );

  const fetchMyTeams = async () => {
    try {
      setLoading(true);

      const response = await authFetch("http://localhost:8080/api/team/my");
      if (!response.ok) throw new Error("Failed to Fetch Teams");
      const data = await response.json();
      setTeams(data);
    } catch (err) {
      showToast("Failed to Fetch Teams", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await authFetch("http://localhost:8080/api/team", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to create new Teams");
      showToast("Team Created", "success");
      setShowForm(false);
      setForm({ name: "", description: "" });
      fetchMyTeams();
    } catch (err) {
      showToast("Failed to create Team", "error");
    }
  };

  const handleAddMember = async (teamId: string) => {
    try {
      console.log(newMemberEmail);
      const response = await authFetch(
        `http://localhost:8080/api/team/${teamId}/members`,
        {
          method: "POST",
          body: JSON.stringify({ email: newMemberEmail }),
        }
      );
      console.log(response.body);
      if (!response.ok) throw new Error("Failed to Add new Member");
      showToast("Member Added", "success");
      setNewMemberEmail("");
      fetchMyTeams();
    } catch (err) {
      showToast("Failed to Add new Member", "error");
    }
  };

  const handleRemoveMember = async (teamId: string, userId: string) => {
    try {
      const response = await authFetch(
        `http://localhost:8080/api/team/${teamId}/members/${userId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to remove member");
      showToast("Member removed", "success");
      fetchMyTeams();
      // Update selected team state too
      setSelected((prev) =>
        prev
          ? {
              ...prev,
              members: prev.members.filter(
                (m) => (m.user as any)._id !== userId
              ),
            }
          : null
      );
    } catch {
      showToast("Failed to remove member", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await authFetch(`http://localhost:8080/api/team/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to Delete thisTeam");
      showToast("Team Deleted", "success");
      setSelected(null);
      fetchMyTeams();
    } catch (err) {
      showToast("Failed to Delete this Team", "error");
    }
  };

  const handleUpdateRole = async (
    teamId: string,
    userId: string,
    role: string
  ) => {
    try {
      const response = await authFetch(
        `http://localhost:8080/api/team/${teamId}/members/${userId}/role`,
        {
          method: "PATCH",
          body: JSON.stringify({ role }),
        }
      );
      if (!response.ok) throw new Error("Failed to update role");
      showToast("Role updated", "success");
      fetchMyTeams();
      // Update selected team state
      setSelected((prev) =>
        prev
          ? {
              ...prev,
              members: prev.members.map((m) =>
                (m.user as any)._id === userId ? { ...m, role: role as any } : m
              ),
            }
          : null
      );
    } catch {
      showToast("Failed to update role", "error");
    }
  };

  const roleColor = {
    owner: "text-amber-400 bg-amber-950 border-amber-900",
    admin: "text-blue-400 bg-blue-950 border-blue-900",
    member: "text-neutral-400 bg-neutral-950 border-neutral-800",
  };

  return (
    <AppLayout title="Teams">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[12px] text-neutral-600">{teams.length} teams</p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 text-[12px] hover:bg-blue-900 transition-colors"
        >
          <MdAdd size={14} /> New team
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-5 mb-5">
          <p className="text-[12px] font-medium text-neutral-300 mb-4">
            Create team
          </p>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Team name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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

      <div className="grid grid-cols-3 gap-4">
        {/* Team list */}
        <div className="col-span-1 flex flex-col gap-3">
          {loading ? (
            <p className="text-[12px] text-neutral-700">Loading...</p>
          ) : teams.length === 0 ? (
            <p className="text-[12px] text-neutral-700">No teams yet.</p>
          ) : (
            teams.map((team) => (
              <button
                key={team._id}
                onClick={() => setSelected(team)}
                className={`text-left bg-[#0f0f0d] border rounded-xl p-4 transition-colors ${
                  selected?._id === team._id
                    ? "border-blue-900"
                    : "border-neutral-900 hover:border-neutral-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MdGroup size={14} className="text-blue-400 shrink-0" />
                  <p className="text-[13px] font-medium text-neutral-200">
                    {team.name}
                  </p>
                </div>
                {team.description && (
                  <p className="text-[11px] text-neutral-600 line-clamp-1">
                    {team.description}
                  </p>
                )}
                <p className="text-[11px] text-neutral-700 mt-2">
                  {team.members.length} member
                  {team.members.length !== 1 ? "s" : ""}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Team detail */}
        <div className="col-span-2">
          {!selected ? (
            <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-8 flex items-center justify-center h-full">
              <p className="text-[12px] text-neutral-700">
                Select a team to view details
              </p>
            </div>
          ) : (
            <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-5">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[16px] font-medium text-neutral-100">
                    {selected.name}
                  </p>
                  {selected.description && (
                    <p className="text-[12px] text-neutral-600 mt-0.5">
                      {selected.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(selected._id)}
                  className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-400 transition-colors"
                >
                  <MdDelete size={13} /> Delete team
                </button>
              </div>

              {/* Members */}
              <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-3">
                Members
              </p>
              <div className="flex flex-col gap-2 mb-4">
                {selected.members.map((m) => (
                  <div
                    key={(m.user as any)._id}
                    className="flex items-center gap-3 py-2 border-b border-neutral-900 last:border-none"
                  >
                    {(m.user as any).picture ? (
                      <img
                        src={(m.user as any).picture}
                        className="w-7 h-7 rounded-full object-cover border border-neutral-800"
                        alt=""
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center text-[10px] font-medium shrink-0">
                        {(m.user as any).name?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-[12px] text-neutral-300">
                        {(m.user as any).name}
                      </p>
                      <p className="text-[11px] text-neutral-600">
                        {(m.user as any).email}
                      </p>
                    </div>

                    {/* Role — editable if current user is owner and member is not owner */}
                    {isOwner && m.role !== "owner" ? (
                      <select
                        value={m.role}
                        onChange={(e) =>
                          handleUpdateRole(
                            selected._id,
                            (m.user as any)._id,
                            e.target.value
                          )
                        }
                        className="bg-[#0a0a09] border border-neutral-800 rounded-lg px-2 py-1 text-[11px] text-neutral-400 focus:outline-none focus:border-blue-800 transition-colors"
                      >
                        <option value="member">member</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                          roleColor[m.role]
                        }`}
                      >
                        {m.role}
                      </span>
                    )}

                    {/* Remove button — only for owner, not on owner member */}
                    {isOwner && m.role !== "owner" && (
                      <button
                        onClick={() =>
                          handleRemoveMember(selected._id, (m.user as any)._id)
                        }
                        className="text-neutral-700 hover:text-red-400 transition-colors"
                      >
                        <MdClose size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add member */}
              <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-2">
                Add member
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Member email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="flex-1 bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-blue-800 transition-colors"
                />
                <button
                  onClick={() => handleAddMember(selected._id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 text-[12px] hover:bg-blue-900 transition-colors"
                >
                  <MdPersonAdd size={13} /> Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default TeamsPage;
