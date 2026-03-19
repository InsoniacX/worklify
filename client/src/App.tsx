import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard, UserPage } from "@/pages";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/users" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
