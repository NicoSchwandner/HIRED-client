import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { ROLES_NR2STR } from "../config/roles"

const DashFooter = () => {
  const { username, highestStatus } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onGoHomeClicked = () => navigate("/dash")

  let goHomeButton = null
  if (pathname !== "/dash") {
    goHomeButton = (
      <button
        className="dash-footer__button icon-button"
        title="Home"
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    )
  }

  const content = (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>
        Highest Status:{" "}
        {ROLES_NR2STR[highestStatus]
          ? ROLES_NR2STR[highestStatus]
          : highestStatus}
      </p>
    </footer>
  )

  return content
}

export default DashFooter
