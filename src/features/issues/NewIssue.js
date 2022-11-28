import NewIssueForm from "./NewIssueForm"
import { useGetUsersQuery } from "../users/usersApiSlice"
import PulseLoader from "react-spinners/PulseLoader"
import useTitle from "../../hooks/useTitle"

const NewIssue = () => {
  useTitle("Create Issue - HIRED Issue Tracker")
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  })

  if (!users?.length)
    return (
      <p className="loading-animation-wrapper">
        <PulseLoader color={"var(--COLOR)"} className="loading-animation" />
      </p>
    )

  const content = <NewIssueForm users={users} />

  return content
}

export default NewIssue
