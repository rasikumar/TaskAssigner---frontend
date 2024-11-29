import { Route, Routes } from "react-router"; // Correct import from react-router-dom
import ProtectedRoute from "./components/protected/ProtectedRoute";
import Error from "./components/Error";

// Admin
import Dashboard from "./Pages/admin/Dashboard/Dashboard";
// import Manager from "./Pages/admin/Manager/Manager";
// import HumanResouce from "./Pages/admin/HumanResource/HumanResouce";
// import TeamLeader from "./Pages/admin/TeamLeader/TeamLeader";
// import Employee from "./Pages/admin/Employees/Employee";
import Tasks from "./Pages/admin/Tasks/Tasks";
import Tickets from "./Pages/admin/Tickets/Tickets";
import AdminLogin from "./components/auth/AdminLogin";
import AdminSidebars from "./components/AdminSidebar";
import Userverify from "./Pages/admin/user-verify/Userverify";
// import TeamList from "./Pages/admin/teams";
import TeamPage from "./Pages/admin/teams/[teamName]";
import RolePage from "./Pages/admin/roles/[roleName]";

// User
import UserSidebar from "./components/UserSidebar";
import UserLogin from "./components/auth/UserLogin";
import UserDashboard from "./Pages/user/Dashboard/Dashboard";
import UserManager from "./Pages/user/Manager/Manager";
import UserHumanResource from "./Pages/user/HumanResource/HumanResouce";
import UserTeamLeader from "./Pages/user/TeamLeader/TeamLeader";
import UserEmployee from "./Pages/user/Employees/Employee";
import UserTask from "./Pages/user/Tasks/Tasks";
import UserTicket from "./Pages/user/Tickets/Tickets";
import UsersVerify from "./Pages/user/user-verify/Userverify";
import MemberDetailPage from "./Pages/admin/people/[peopleName]";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        {/* Login Route */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Route for Dashboard */}
        {/* AdminRoute */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSidebars />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
                {/* Add dashboard overview content here */}
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="teams"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TeamList />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="teams/:teamName"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="teams/:teamName/:roleName"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <RolePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="teams/:teamName/:roleName/:memberName"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MemberDetailPage />
              </ProtectedRoute>
            }
          />
          {/* Relative Nested Route for /manager */}
          {/* <Route
            path="manager" // Relative path
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Manager />
              </ProtectedRoute>
            }
          />
          <Route
            path="human-resource" // Relative path
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <HumanResouce />
              </ProtectedRoute>
            }
          />
          <Route
            path="team-leader" // Relative path
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TeamLeader />
              </ProtectedRoute>
            }
          />
          <Route
            path="employee" // Relative path
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Employee />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="tasks" // Relative path
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="ticket" // Relative path
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Tickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="usermanagement" // Relative path
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Userverify />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* UserRoutes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["employee", "hr", "manager", "team lead"]}
            >
              <UserSidebar />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute
                allowedRoles={["employee", "hr", "manager", "team lead"]}
              >
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="manager"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "hr", "manager", "team lead"]}
              >
                <UserManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="human-resource"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "hr", "manager", "team lead"]}
              >
                <UserHumanResource />
              </ProtectedRoute>
            }
          />
          <Route
            path="team-leader"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "hr", "manager", "team lead"]}
              >
                <UserTeamLeader />
              </ProtectedRoute>
            }
          />
          <Route
            path="employees"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "hr", "manager", "team lead"]}
              >
                <UserEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="tasks"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "hr", "manager", "team lead"]}
              >
                <UserTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="ticket"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "hr", "manager", "team lead"]}
              >
                <UserTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="usermanagement"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "hr", "manager", "team lead"]}
              >
                <UsersVerify />
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
