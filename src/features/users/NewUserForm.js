import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES, ROLES_NR2STR } from "../../config/roles"
import useTitle from "../../hooks/useTitle"
import ErrorMessage from "../../components/ErrorMessage"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%.:_]{8,64}$/

const NewUserForm = () => {
  useTitle("Create User - HIRED Issue Tracker")

  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation()

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [validPassword, setValidPassword] = useState(false)
  const [checkedRoles, setCheckedRoles] = useState([ROLES.Developer])

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    if (isSuccess) {
      setUsername("")
      setPassword("")
      setCheckedRoles([])
      navigate("/dash/users")
    }
  }, [isSuccess, navigate])

  const onUsernameChanged = (e) => setUsername(e.target.value)
  const onPasswordChanged = (e) => setPassword(e.target.value)
  const onCheckedRolesChanged = (role) => {
    // Remove role from array if role was checked before, add role, if it wasn't
    const updatedRoles = checkedRoles.includes(role)
      ? checkedRoles.filter((roleItem) => roleItem !== role)
      : [...checkedRoles, role]

    setCheckedRoles(updatedRoles)
  }

  const canSave =
    [checkedRoles.length, validUsername, validPassword].every(Boolean) &&
    !isLoading

  const onSaveUserClicked = async (e) => {
    e.preventDefault()
    if (canSave) {
      await addNewUser({ username, password, roles: checkedRoles })
    }
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

  const errClass = isError ? "errmsg" : "offscreen"
  const validUserClass = !validUsername ? "form__input--incomplete" : ""
  const validPwdClass = !validPassword ? "form__input--incomplete" : ""
  const validRolesClass = !Boolean(checkedRoles.length)
    ? "form__input--incomplete"
    : ""

  const content = (
    <>
      <ErrorMessage errMsg={error?.data?.message} errClass={errClass} />

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>New User</h2>
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
          Password:{" "}
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
        </div>
      </form>
    </>
  )

  return content
}

export default NewUserForm
