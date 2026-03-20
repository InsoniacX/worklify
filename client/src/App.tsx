import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard, UserPage, UserInput, UserEdit } from "@/pages";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/users" element={<UserPage />} />
        <Route path="/dashboard/users/new" element={<UserInput />} />
        <Route path="/users/:id/edit" element={<UserEdit />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
