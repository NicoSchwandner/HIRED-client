import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Public from "./components/Public"
import Login from "./features/auth/Login"
import DashLayout from "./components/DashLayout"
import Welcome from "./features/auth/Welcome"
import IssuesList from "./features/issues/IssuesList"
import UsersList from "./features/users/UsersList"
import EditUser from "./features/users/EditUser"
import NewUserForm from "./features/users/NewUserForm"
import EditIssue from "./features/issues/EditIssue"
import NewIssue from "./features/issues/NewIssue"
import Prefetch from "./features/auth/Prefetch"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import { ROLES } from "./config/roles"
import useTitle from "./hooks/useTitle"

function App() {
  useTitle("HIRED Issue Tracker")

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="issues">
                  <Route index element={<IssuesList />} />
                  <Route
                    element={
                      <RequireAuth
                        allowedRoles={[ROLES.Admin, ROLES.Submitter]}
                      />
                    }
                  >
                    <Route path=":id" element={<EditIssue />} />
                    <Route path="new" element={<NewIssue />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        {/* End Protected routes */}
      </Route>
    </Routes>
  )
}

export default App
