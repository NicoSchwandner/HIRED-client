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
        status,
        type,
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
      <option key={status} value={status} label={ISSUE_STATUS_NR2STR[status]}>
        {status}
      </option>
    )
  })

  const canSave =
    [title.length, assignedTo.length, submitter.length].every(Boolean) &&
    !isLoading

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

  const errContent = (error?.data?.message || delError?.data?.message) ?? ""

  let deleteButton = null
  if (isSubmitter || isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteIssueClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    )
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Issue</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
              onClick={onSaveIssueClicked}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
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

        <label className="form__label" htmlFor="status">
          Status:
        </label>
        <select
          className={"form__select"}
          id="status"
          name="status"
          value={status}
          onChange={onStatusChanged}
        >
          {statusOptions}
        </select>

        <label className="form__label" htmlFor="assignedTo">
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

        <label className="form__label" htmlFor="submitter">
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

        <label className="form__label" htmlFor="type">
          Type:
        </label>
        <select
          className={"form__select"}
          id="type"
          name="type"
          value={type}
          onChange={onTypeChanged}
        >
          {typeOptions}
        </select>

        <div className="form__divider">
          <p className="form__created">
            Created:
            <br />
            {created}
          </p>
          <p className="form__updated">
            Updated:
            <br />
            {updated}
          </p>
        </div>
      </form>
    </>
  )

  return content
}

export default EditIssueForm
