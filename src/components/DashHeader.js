import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFileCirclePlus,
  faFileLines,
  // faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from "react-router-dom"

import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import useAuth from "../hooks/useAuth"
import ErrorMessage from "./ErrorMessage"

const DASH_REGEX = /^\/dash(\/)?$/
const ISSUES_REGEX = /^\/dash\/issues(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
  const { /*isDeveloper,*/ isSubmitter, isAdmin } = useAuth()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate("/")
  }, [isSuccess, navigate])

  const onNewIssueClicked = () => navigate("/dash/issues/new")
  const onNewUserClicked = () => navigate("/dash/users/new")
  const onIssuesClicked = () => navigate("/dash/issues")
  const onUsersClicked = () => navigate("/dash/users")

  const onLogoutClicked = () => sendLogout()

  let dashClass = null
  if (
    !DASH_REGEX.test(pathname) &&
    !ISSUES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small"
  }

  // const smallDashContainer =
  //   !DASH_REGEX.test(pathname) &&
  //   !ISSUES_REGEX.test(pathname) &&
  //   !USERS_REGEX.test(pathname)
  // const dashClass = smallDashContainer ? "dash-header__container--small" : null

  let issueButton = null
  if (!ISSUES_REGEX.test(pathname) && pathname.includes("/dash")) {
    issueButton = (
      <button className="icon-button" title="Issues" onClick={onIssuesClicked}>
        <FontAwesomeIcon icon={faFileLines} />
      </button>
    )
  }

  let newIssueButton = null
  if (isAdmin || isSubmitter) {
    if (ISSUES_REGEX.test(pathname)) {
      newIssueButton = (
        <button
          className="icon-button"
          title="New Issue"
          onClick={onNewIssueClicked}
        >
          <FontAwesomeIcon icon={faFileCirclePlus} />
        </button>
      )
    }
  }

  let userButton = null
  if (isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <button className="icon-button" title="Users" onClick={onUsersClicked}>
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      )
    }
  }

  let newUserButton = null
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className="icon-button"
        title="New User"
        onClick={onNewUserClicked}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    )
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={onLogoutClicked}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  )

  const errClass = isError ? "errmsg" : "offscreen"

  let buttonContent
  if (isLoading) {
    buttonContent = <p>Logging out...</p>
  } else {
    buttonContent = (
      <>
        {issueButton}
        {newIssueButton}
        {userButton}
        {newUserButton}
        {logoutButton}
      </>
    )
  }

  const content = (
    <>
      <ErrorMessage errMsg={error?.data?.message} errClass={errClass} />
      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to="/dash">
            <h1 className="dash-header__title">HIRED Issue Tracker</h1>
          </Link>
          <nav className="dash-header__nav">{buttonContent}</nav>
        </div>
      </header>
    </>
  )

  return content
}

export default DashHeader
