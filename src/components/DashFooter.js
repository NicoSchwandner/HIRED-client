import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { ROLES_NR2STR } from "../config/roles"

const DashFooter = () => {
  const { username, roles } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onGoHomeClicked = () => navigate("/dash")

  let currentStatus = ""
  if (roles.length) {
    roles.forEach(buildRoleString)

    function buildRoleString(value, index, array) {
      currentStatus += ROLES_NR2STR[value] + ", "
    }

    currentStatus = currentStatus.slice(0, currentStatus.length - 2)
  } else {
    currentStatus = "undefined"
  }

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
      <p>Current Status: {currentStatus}</p>
    </footer>
  )

  return content
}

export default DashFooter
