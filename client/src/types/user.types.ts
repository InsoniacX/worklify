export interface User {
    _id: string;
    name: string;
    email: string;
    address: string;
    picture: string;
    role: "admin" | "user";
    __v: number;
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: "todo" | "in progress" | "review" | "done";
    priority: "low" | "medium" | "high";
    dueDate: string | null;
    assignedTo: User[];
    createdBy: User;
    team: Team | null;
    createdAt: string;
    updatedAt: string;
}

export interface Team {
  _id: string;
  name: string;
  description: string;
  members: { user: User; role: "owner" | "admin" | "member" }[];
  createdBy: User;
  createdAt: string;
}

export interface Schedule {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "meeting" | "deadline" | "reminder" | "event";
  user: string;
  team: string | null;
}

export interface Notification {
  _id:       string;
  message:   string;
  type:      "task" | "team" | "schedule" | "system";
  read:      boolean;
  user:      string;
  link:      string | null;
  createdAt: string;
}

export interface Activity {
  _id:       string;
  action:    string;
  user:      User;
  team:      string | null;
  task:      string | null;
  meta:      Record<string, any>;
  createdAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  user: { _id: string; name: string; picture: string; };
  createdAt: string;
  meta?: Record<string, any>;
}