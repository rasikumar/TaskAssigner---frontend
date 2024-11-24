import { Route, Routes } from "react-router"; // Correct import from react-router-dom
import Login from "./components/auth/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import Manager from "./Pages/Manager/Manager";
import Error from "./components/Error";
import HumanResouce from "./Pages/HumanResource/HumanResouce";
import TeamLeader from "./Pages/TeamLeader/TeamLeader";
import Employee from "./Pages/Employees/Employee";
import Tasks from "./Pages/Tasks/Tasks";
import { Ticket } from "lucide-react";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <div>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Route for Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Sidebar />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute>
                <Dashboard />
                {/* Add dashboard overview content here */}
              </ProtectedRoute>
            }
          />
          {/* Relative Nested Route for /manager */}
          <Route
            path="manager" // Relative path
            element={
              <ProtectedRoute>
                <Manager />
              </ProtectedRoute>
            }
          />
          <Route
            path="human-resource" // Relative path
            element={
              <ProtectedRoute>
                <HumanResouce />
              </ProtectedRoute>
            }
          />
          <Route
            path="team-leader" // Relative path
            element={
              <ProtectedRoute>
                <TeamLeader />
              </ProtectedRoute>
            }
          />
          <Route
            path="employee" // Relative path
            element={
              <ProtectedRoute>
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="tasks" // Relative path
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="ticket" // Relative path
            element={
              <ProtectedRoute>
                <Ticket />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all Route for 404 */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};

export default App;
