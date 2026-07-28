import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import AddJob from "./pages/AddJob";
import JobDetails from "./pages/JobDetails";
import EditJob from "./pages/EditJob";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/jobs/new" element={<AddJob />} />
      <Route path="/add-job" element={<AddJob />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/jobs/edit/:id" element={<EditJob />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

    </Routes>
  );
}

export default App;