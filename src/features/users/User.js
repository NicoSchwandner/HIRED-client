import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

import { useSelector } from "react-redux"
import { selectUserById } from "./usersApiSlice"

import { ROLES_NR2STR } from "../../config/roles"

const User = ({ userId }) => {
  const user = useSelector((state) => selectUserById(state, userId))

  const navigate = useNavigate()

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`)

    // const userRolesString = user.roles.toString().replaceAll(",", ", ");

    const userRolesString = user.roles
      .map((role) => {
        return ROLES_NR2STR[role] ? ROLES_NR2STR[role] : role
      })
      .toString()
      .replaceAll(",", ", ")

    const cellStatus = user.active ? "" : "table__cell--inactive"

    return (
      <tr className="table__row user">
        <td className={`table__cell ${cellStatus}`}>{user.username}</td>
        <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
        <td className={`table__cell ${cellStatus}`}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    )
  } else return null
}

export default User
