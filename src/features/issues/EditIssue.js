import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectIssueById } from "./issuesApiSlice"
import { selectAllUsers } from "../users/usersApiSlice"
import EditIssueForm from "./EditIssueForm"

const EditIssue = () => {
  const { id } = useParams()

  const issue = useSelector((state) => selectIssueById(state, id))
  const users = useSelector(selectAllUsers)

  const content =
    issue && users ? (
      <EditIssueForm issue={issue} users={users} />
    ) : (
      <p>Loading...</p>
    )

  return content
}

export default EditIssue
