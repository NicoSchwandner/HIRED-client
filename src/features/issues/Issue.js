import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { useGetIssuesQuery } from "./issuesApiSlice"
import { memo } from "react"

import { ISSUE_STATUS_NR2STR } from "../../config/issue_status"
import { ISSUE_TYPE_NR2STR } from "../../config/issue_type"

const Issue = ({ issueId }) => {
  const { issue } = useGetIssuesQuery("issuesList", {
    selectFromResult: ({ data }) => ({
      issue: data?.entities[issueId],
    }),
  })

  const navigate = useNavigate()

  if (issue) {
    const created = new Date(issue.createdAt).toLocaleString("en-us", {
      day: "numeric",
      month: "long",
    })

    const updated = new Date(issue.updatedAt).toLocaleString("en-us", {
      day: "numeric",
      month: "long",
    })

    const handleEdit = () => navigate(`/dash/issues/${issueId}`)

    return (
      <tr className="table__row issue">
        <td className={"table__cell issue__status"}>
          {" "}
          <span className="issue__status">
            {ISSUE_STATUS_NR2STR[issue.status]
              ? ISSUE_STATUS_NR2STR[issue.status]
              : issue.status}
          </span>
        </td>
        <td className={"table__cell issue__created"}>{created}</td>
        <td className={"table__cell issue__updated"}>{updated}</td>
        <td className={"table__cell issue__title"}>
          {issue.title ? issue.title : ""}
        </td>
        <td className={"table__cell issue__type"}>
          {ISSUE_TYPE_NR2STR[issue.type]
            ? ISSUE_TYPE_NR2STR[issue.type]
            : issue.type}
        </td>
        <td className={"table__cell issue__username"}>
          {issue.assignedTo?.username ? issue.assignedTo?.username : ""}
        </td>
        <td className={"table__cell issue__submitter"}>
          {issue.submitter?.username ? issue.submitter?.username : ""}
        </td>

        <td className={"table__cell"}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    )
  } else return null
}

const memoizedIssue = memo(Issue)

export default memoizedIssue

// "_id": "636525f93db6b9f498551978",
// "title": "Second issue: revise user stories",
// "submitter": "63651ae3e055ff440b848926",
// "status": 0,
// "createdAt": "2022-11-04T14:47:21.163Z",
// "updatedAt": "2022-11-04T14:50:26.993Z",
// "__v": 0,
// "assignedTo": "63651ae3e055ff440b848926"
