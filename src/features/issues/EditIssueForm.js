import { useState, useEffect } from "react"
import {
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} from "./issuesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ISSUE_STATUS, ISSUE_STATUS_NR2STR } from "../../config/issue_status"
import { ISSUE_TYPE, ISSUE_TYPE_NR2STR } from "../../config/issue_type"
import useAuth from "../../hooks/useAuth"
import ErrorMessage from "../../components/ErrorMessage"

const EditIssueForm = ({ users, issue }) => {
  const { isSubmitter, isAdmin } = useAuth()

  const [updateIssue, { isLoading, isSuccess, isError, error }] =
    useUpdateIssueMutation()
  const [
    deleteIssue,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteIssueMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState(issue.title)
  const [description, setDescription] = useState(
    issue.description ? issue.description : ""
  )
  const [assignedTo, setAssignedTo] = useState(issue.assignedTo._id)
  const [submitter, setSubmitter] = useState(issue.submitter._id)
  const [type, setType] = useState(issue.type)
  const [status, setStatus] = useState(issue.status)

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("")
      setDescription("")
      setAssignedTo("")
      setSubmitter("")
      setType("")
      setStatus("")
      navigate("/dash/issues")
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onDescriptionChanged = (e) => setDescription(e.target.value)
  const onTypeChanged = (e) => setType(e.target.value)
  const onStatusChanged = (e) => setStatus(e.target.value)
  const onAssignedToChanged = (e) => setAssignedTo(e.target.value)
  const onSubmitterChanged = (e) => setSubmitter(e.target.value)

  const onSaveIssueClicked = async (e) => {
    if (canSave) {
      await updateIssue({
        id: issue.id,
        title,
        description,
        assignedTo,
        submitter,
        status: status.toString(),
        type: type.toString(),
      })
    }
  }

  const onDeleteIssueClicked = async (e) => {
    await deleteIssue({ id: issue.id })
  }

  const created = new Date(issue.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })
  const updated = new Date(issue.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })

  const userOptions = users.map((user) => {
    return (
      <option key={user.id} value={user.id} label={user.username}>
        {user.username}
      </option>
    )
  })

  const typeOptions = Object.values(ISSUE_TYPE).map((type) => {
    return (
      <option key={type} value={type} label={ISSUE_TYPE_NR2STR[type]}>
        {type}
      </option>
    )
  })

  const statusOptions = Object.values(ISSUE_STATUS).map((status) => {
    return (
      <option
        key={status.id}
        value={status.id}
        label={ISSUE_STATUS_NR2STR[status.id]}
      >
        {status.id}
      </option>
    )
  })

  const canSave =
    [
      title.length,
      assignedTo.length,
      submitter.length,
      type.toString().length,
      status.toString().length,
    ].every(Boolean) && !isLoading

  const errClass = isError || isDelError ? "errmsg" : "offscreen"

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

  const validStatusClass = !Boolean(status.toString().length)
    ? "form__input--incomplete"
    : ""

  const errContent = (error?.data?.message || delError?.data?.message) ?? ""

  let deleteButton = null
  if (isSubmitter || isAdmin) {
    deleteButton = (
      <button
        className="icon-button--remove"
        title="Delete"
        onClick={onDeleteIssueClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} /> Delete
      </button>
    )
  }

  const content = (
    <>
      <ErrorMessage errMsg={errContent} errClass={errClass} />

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Issue</h2>
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

        <p className="form__id">
          <label className="form__label">ID:</label> {issue.id}
        </p>

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

        {/* <div className="form__wrapper"> */}
        <div className="form__wrapper">
          <div className="form__wrapper--child">
            <label
              className="form__label form__label--wrapper"
              htmlFor="status"
            >
              Status:
            </label>
            <select
              className={`form__select ${validStatusClass}`}
              id="status"
              name="status"
              value={status}
              onChange={onStatusChanged}
            >
              {statusOptions}
            </select>
          </div>

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

        <div className="form__divider">
          <p className="form__created">
            <label className="form__label">Created:</label>
            <wbr />
            <p>{created}</p>
          </p>
          <p className="form__updated">
            <label className="form__label">Updated:</label>
            <wbr />
            <p>{updated}</p>
          </p>
        </div>
        {/* </div> */}

        <div className="form__action-buttons">
          <button
            className="icon-button--action"
            title="Save"
            disabled={!canSave}
            onClick={onSaveIssueClicked}
          >
            <FontAwesomeIcon icon={faSave} className="icon-button--icon" /> Save
          </button>
          {deleteButton}
        </div>
      </form>
    </>
  )

  return content
}

export default EditIssueForm
