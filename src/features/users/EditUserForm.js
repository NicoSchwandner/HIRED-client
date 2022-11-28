import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES, ROLES_NR2STR } from "../../config/roles"
import ErrorMessage from "../../components/ErrorMessage"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%.:_]{8,64}$/

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation()
  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteUserMutation()

  const navigate = useNavigate()

  const [username, setUsername] = useState(user.username)
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [validPassword, setValidPassword] = useState(false)
  const [checkedRoles, setCheckedRoles] = useState(user.roles)

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("")
      setPassword("")
      setCheckedRoles([])
      navigate("/dash/users")
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onUsernameChanged = (e) => setUsername(e.target.value)
  const onPasswordChanged = (e) => setPassword(e.target.value)
  const onCheckedRolesChanged = (role) => {
    // Remove role from array if role was checked before, add role, if it wasn't
    const updatedRoles = checkedRoles.includes(role)
      ? checkedRoles.filter((roleItem) => roleItem !== role)
      : [...checkedRoles, role]

    setCheckedRoles(updatedRoles)
  }

  const onSaveUserClicked = async (e) => {
    if (password) {
      await updateUser({
        id: user.id,
        username,
        password,
        roles: checkedRoles,
      })
    } else {
      await updateUser({
        id: user.id,
        username,
        roles: checkedRoles,
      })
    }
  }

  const onDeleteUserClicked = async (e) => {
    await deleteUser({ id: user.id })
  }

  const roleOptions = Object.values(ROLES).map((role) => {
    return (
      <div className="form__input--toggle-wrapper">
        <label key={role} className={"form__input--checkboxes"}>
          <input
            type="checkbox"
            className="form__checkbox"
            onChange={() => onCheckedRolesChanged(role)}
            checked={checkedRoles.includes(role)}
          />
          <span class="slider round"></span>
        </label>
        <span> {ROLES_NR2STR[role]}</span>
      </div>
    )
  })

  let canSave
  if (password) {
    canSave =
      [checkedRoles.length, validUsername, validPassword].every(Boolean) &&
      !isLoading
  } else {
    canSave = [checkedRoles.length, validUsername].every(Boolean) && !isLoading
  }

  const errClass = isError || isDelError ? "errmsg" : "offscreen"
  const validUserClass = !validUsername ? "form__input--incomplete" : ""
  const validPwdClass =
    password && !validPassword ? "form__input--incomplete" : ""
  const validRolesClass = !Boolean(checkedRoles.length)
    ? "form__input--incomplete"
    : ""

  const errContent = (error?.data?.message || delError?.data?.message) ?? ""

  const content = (
    <>
      <ErrorMessage errMsg={errContent} errClass={errClass} />

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit User</h2>
        </div>
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[empty = no change]</span>
          <span className="nowrap">[8-64 letters incl. !@#$%.:_]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />

        <legend className="form__label" htmlFor="roles">
          Assgined Roles:
        </legend>
        <div
          className={`form__input ${validRolesClass} form__input--roles-checkboxes`}
          id="rolesCheckboxes"
        >
          {roleOptions}
        </div>

        <div className="form__action-buttons">
          <button
            className="icon-button--action"
            title="Save"
            disabled={!canSave}
            onClick={onSaveUserClicked}
          >
            <FontAwesomeIcon icon={faSave} className="icon-button--icon" /> Save
          </button>
          <button
            className="icon-button--remove"
            title="Delete"
            onClick={onDeleteUserClicked}
          >
            <FontAwesomeIcon icon={faTrashCan} className="icon-button--icon" />{" "}
            Delete
          </button>
        </div>
      </form>
    </>
  )

  return content
}

export default EditUserForm
