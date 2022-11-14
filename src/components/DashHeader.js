import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from "react-router-dom"

import { useSendLogoutMutation } from "../features/auth/authApiSlice"

const DASH_REGEX = /^\dash(\/)?$/
const ISSUES_REGEX = /^\dash\/issues(\/)?$/
const USERS_REGEX = /^\dash\/users(\/)?$/

const DashHeader = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate("/")
  }, [isSuccess, navigate])

  const onLogoutClicked = () => sendLogout()

  if (isLoading) return <p>Logging Out...</p>

  if (isError) return <p>Error: {error.data?.message}</p>

  const smallDashContainer =
    !DASH_REGEX.test(pathname) &&
    !ISSUES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  const dashClass = smallDashContainer ? "dash-header__container--small" : null

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={onLogoutClicked}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  )

  const content = (
    <header className="dash-header">
      <div className={`dash-header__container ${dashClass}`}>
        <Link to="/dash">
          <h1 className="dash-header__title">HIRED Issue Tracker</h1>
        </Link>
        <nav className="dash-header__nav">
          {/* add more nav buttons later */}
          {logoutButton}
        </nav>
      </div>
    </header>
  )

  return content
}

export default DashHeader
