import { useSelector } from "react-redux"
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from "jwt-decode"
import { ROLES } from "../config/roles"

const useAuth = () => {
  const token = useSelector(selectCurrentToken)
  let isSubmitter = false
  let isAdmin = false
  let isDeveloper = true
  let highestStatus = ROLES.Developer

  if (token) {
    const decoded = jwtDecode(token)
    const { username, userId, roles } = decoded.UserInfo

    isDeveloper = roles.includes(ROLES.Developer)
    isSubmitter = roles.includes(ROLES.Submitter)
    isAdmin = roles.includes(ROLES.Admin)

    if (isDeveloper) highestStatus = ROLES.Developer
    if (isSubmitter) highestStatus = ROLES.Submitter
    if (isAdmin) highestStatus = ROLES.Admin

    return {
      username,
      userId,
      roles,
      isDeveloper,
      isSubmitter,
      isAdmin,
      highestStatus,
    }
  }

  return {
    username: "",
    userId: null,
    roles: [],
    isDeveloper,
    isSubmitter,
    isAdmin,
    highestStatus,
  }
}

export default useAuth
