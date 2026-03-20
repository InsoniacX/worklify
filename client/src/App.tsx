import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard, UserPage, UserForms } from "@/pages";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/users" element={<UserPage />} />
        <Route path="/dashboard/users/new" element={<UserForms />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
