import { useState, useEffect } from "react";
import { useAddNewIssueMutation } from "./issuesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewIssueForm = ({ users }) => {
  const [addNewIssue, { isLoading, isSuccess, isError, error }] =
    useAddNewIssueMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState(users[0].id);
  const [submitter, setSubmitter] = useState(users[0].id);
  // const [submitter, setSubmitter] = useState(currentUser.id);
  const [type, setType] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setSubmitter("");
      setType("");
      navigate("/dash/issues");
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onTypeChanged = (e) => setType(e.target.value);
  const onAssignedToChanged = (e) => setAssignedTo(e.target.value);
  const onSubmitterChanged = (e) => setSubmitter(e.target.value);

  const canSave =
    [title.length, assignedTo.length, submitter.length].every(Boolean) &&
    !isLoading;

  const onSaveIssueClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewIssue({
        title,
        description,
        assignedTo,
        submitter,
        type,
      });
    }
  };

  const userOptions = users.map((user) => {
    return (
      <option key={user.id} value={user.id} label={user.username}>
        {user.username}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";

  const validTitleClass = !Boolean(title.length)
    ? "form__input--incomplete"
    : "";

  const validAssignedToClass = !Boolean(assignedTo.length)
    ? "form__input--incomplete"
    : "";

  const validSubmitterClass = !Boolean(submitter.length)
    ? "form__input--incomplete"
    : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveIssueClicked}>
        <div className="form__title-row">
          <h2>New Issue</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
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
        <input
          className={"form__input"}
          id="description"
          name="description"
          type="text"
          autoComplete="off"
          value={description}
          onChange={onDescriptionChanged}
        />

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
        <input
          className={"form__input"}
          id="type"
          name="type"
          type="text"
          autoComplete="off"
          value={type}
          onChange={onTypeChanged}
        />
      </form>
    </>
  );

  return content;
};

export default NewIssueForm;
