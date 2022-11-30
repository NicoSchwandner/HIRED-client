import { useState, useEffect } from "react"
import { useAddNewIssueMutation } from "./issuesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ISSUE_TYPE, ISSUE_TYPE_NR2STR } from "../../config/issue_type"
import useAuth from "../../hooks/useAuth"
import ErrorMessage from "../../components/ErrorMessage"

const NewIssueForm = ({ users }) => {
  const { userId } = useAuth()

  const [addNewIssue, { isLoading, isSuccess, isError, error }] =
    useAddNewIssueMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState(users[0].id)
  const [submitter, setSubmitter] = useState(userId ? userId : users[0].id)
  const [type, setType] = useState(ISSUE_TYPE.feature)

  useEffect(() => {
    if (isSuccess) {
      setTitle("")
      setDescription("")
      setAssignedTo("")
      setSubmitter("")
      setType("")
      navigate("/dash/issues")
    }
  }, [isSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onDescriptionChanged = (e) => setDescription(e.target.value)
  const onTypeChanged = (e) => setType(e.target.value)
  const onAssignedToChanged = (e) => setAssignedTo(e.target.value)
  const onSubmitterChanged = (e) => setSubmitter(e.target.value)

  const canSave =
    [
      title.length,
      assignedTo.length,
      submitter.length,
      type.toString().length,
    ].every(Boolean) && !isLoading

  const onSaveIssueClicked = async (e) => {
    e.preventDefault()
    if (canSave) {
      await addNewIssue({
        title,
        description,
        assignedTo,
        submitter,
        type: type.toString(),
      })
    }
  }

  const userOptions = users.map((user) => {
    return (
      <option value={user.id} label={user.username}>
        {user.username}
      </option>
    )
  })

  const typeOptions = Object.values(ISSUE_TYPE).map((type) => {
    return (
      <option value={type} label={ISSUE_TYPE_NR2STR[type]}>
        {ISSUE_TYPE_NR2STR[type]}
      </option>
    )
  })

  const errClass = isError ? "errmsg" : "offscreen"

  const validTitleClass = !Boolean(title.length)
    ? "form__input--incomplete"
    : ""

  const validAssignedToClass = !Boolean(assignedTo.length)
    ? "form__input--incomplete"
    : ""

  const validSubmitterClass = !Boolean(submitter.length)
    ? "form__input--incomplete"
    : ""

  const validTypeClass = !Boolean(type.toString().length)
    ? "form__input--incomplete"
    : ""

  const content = (
    <>
      <ErrorMessage errMsg={error?.data?.message} errClass={errClass} />

      <form className="form" onSubmit={onSaveIssueClicked}>
        <div className="form__title-row">
          <h2>New Issue</h2>
        </div>
        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="description">
          Description:
        </label>
        <textarea
          className={"form__input form__input--text"}
          id="description"
          name="description"
          type="text"
          autoComplete="off"
          value={description}
          onChange={onDescriptionChanged}
        />

        <div className="form__wrapper">
          <div className="form__wrapper--child">
            <label className="form__label form__label--wrapper" htmlFor="type">
              Type:
            </label>
            <select
              className={`form__select ${validTypeClass}`}
              id="type"
              name="type"
              value={type}
              onChange={onTypeChanged}
            >
              {typeOptions}
            </select>
          </div>
        </div>

        <div className="form__wrapper">
          <div className="form__wrapper--child">
            <label
              className="form__label form__label--wrapper"
              htmlFor="assignedTo"
            >
              Assgined to:
            </label>
            <select
              className={`form__select ${validAssignedToClass}`}
              id="assignedTo"
              name="assignedTo"
              value={assignedTo}
              onChange={onAssignedToChanged}
            >
              {userOptions}
            </select>
          </div>

          <div className="form__wrapper--child">
            <label
              className="form__label form__label--wrapper"
              htmlFor="submitter"
            >
              Submitter:
            </label>
            <select
              className={`form__select ${validSubmitterClass}`}
              id="submitter"
              name="submitter"
              value={submitter}
              onChange={onSubmitterChanged}
            >
              {userOptions}
            </select>
          </div>
        </div>

        <div className="form__action-buttons">
          <button
            className="icon-button--action"
            title="Save"
            disabled={!canSave}
          >
            <FontAwesomeIcon icon={faSave} className="icon-button--icon" /> Save
          </button>
        </div>
      </form>
    </>
  )

  return content
}

export default NewIssueForm
