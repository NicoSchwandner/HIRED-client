import { useGetIssuesQuery } from "./issuesApiSlice"
import Issue from "./Issue"
import useAuth from "../../hooks/useAuth"
import PulseLoader from "react-spinners/PulseLoader"
import useTitle from "../../hooks/useTitle"
import { ISSUE_STATUS } from "../../config/issue_status"

const IssuesList = () => {
  useTitle("Issues - HIRED Issue Tracker")
  const { /*username,*/ userId, /*isDeveloper,*/ isSubmitter, isAdmin } =
    useAuth()
  const {
    data: issues,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetIssuesQuery("issuesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  let content

  if (isLoading) content = <PulseLoader color={"#FFF"} />

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
    // console.error(error);
    // console.error(error?.data);
    console.error(error?.data?.message)
  }

  if (isSuccess) {
    const { ids, entities } = issues

    let filteredIds
    if (isAdmin || isSubmitter) {
      filteredIds = [...ids]
    } else {
      filteredIds = ids.filter(
        (issueId) => entities[issueId].assignedTo._id === userId
      )
    }

    const sortedAndFilteredIds = filteredIds.slice().sort((a, b) => {
      if (entities[a].status === entities[b].status)
        return 0 // keep original order
      else if (entities[a].status === ISSUE_STATUS.done) {
        // b is 0 or 1
        return 1
      } else if (entities[a].status === ISSUE_STATUS.in_progress) {
        // b is 0 or 2
        return -1
      } else {
        // a is 0 or other
        // b is 0, 1 or 2 or other
        if (entities[b].status === ISSUE_STATUS.done) {
          return -1
        } else if (entities[b].status === ISSUE_STATUS.in_progress) {
          return 1
        } else {
          // b is 0 or other
          return 0
        }
      }
    })
    // sortedAndFilteredIds.forEach((id) =>
    //   console.log(`ID: ${id} Group: ${entities[id].status}`)
    // )

    const tableContent =
      ids?.length &&
      sortedAndFilteredIds.map((issueId) => (
        <Issue key={issueId} issueId={issueId} />
      ))

    content = (
      <table className="table table--issues">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th issue__title">
              Title
            </th>
            <th scope="col" className="table__th issue__status">
              Status
            </th>
            {/*<th scope="col" className="table__th issue__updated">
              Updated
            </th>*/}
            <th scope="col" className="table__th issue__type">
              Type
            </th>
            <th scope="col" className="table__th issue__created">
              Created
            </th>
            <th scope="col" className="table__th issue__username">
              Assigned to
            </th>
            <th scope="col" className="table__th issue__submitter">
              Submitter
            </th>
            <th scope="col" className="table__th issue__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    )
  }

  return content
}

export default IssuesList
