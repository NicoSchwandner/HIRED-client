import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link } from "react-router-dom"
import { useGetUsersQuery } from "./usersApiSlice"
import { memo } from "react"

import { ROLES_NR2STR } from "../../config/roles"

const User = ({ userId }) => {
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  })

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
        <td className={`table__cell ${cellStatus}`}>
          <Link to={`/dash/users/${userId}`}>{user.username}</Link>
        </td>
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

const memoizedUser = memo(User)

export default memoizedUser
