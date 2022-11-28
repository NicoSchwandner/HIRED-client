import { useParams } from "react-router-dom"
import EditIssueForm from "./EditIssueForm"
import { useGetIssuesQuery } from "./issuesApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import useAuth from "../../hooks/useAuth"
import PulseLoader from "react-spinners/PulseLoader"
import useTitle from "../../hooks/useTitle"
import ErrorMessage from "../../components/ErrorMessage"

const EditIssue = () => {
  useTitle("Edit Issue - HIRED Issue Tracker")
  const { id } = useParams()

  const { userId, isSubmitter, isAdmin } = useAuth()

  const { issue } = useGetIssuesQuery("issuesList", {
    selectFromResult: ({ data }) => ({
      issue: data?.entities[id],
    }),
  })

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  })

  if (!issue || !users?.length)
    return (
      <p className="loading-animation-wrapper">
        <PulseLoader color={"var(--COLOR)"} className="loading-animation" />
      </p>
    )

  if (!isSubmitter && !isAdmin) {
    if (issue.assignedTo._id !== userId) {
      return <ErrorMessage errMsg="No access" errClass="errmsg" />
    }
  }

  const content = <EditIssueForm issue={issue} users={users} />

  return content
}

export default EditIssue
