import { useGetIssuesQuery } from "./issuesApiSlice"
import Issue from "./Issue"
import useAuth from "../../hooks/useAuth"
import PulseLoader from "react-spinners/PulseLoader"
import useTitle from "../../hooks/useTitle"
import { ISSUE_STATUS_RANKING } from "../../config/issue_status"
import ErrorMessage from "../../components/ErrorMessage"

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

  if (isLoading)
    content = (
      <p className="loading-animation-wrapper">
        <PulseLoader color={"var(--COLOR)"} className="loading-animation" />
      </p>
    )

  if (isError) {
    content = <ErrorMessage errMsg={error?.data?.message} errClass="errmsg" />
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
        (issueId) =>
          entities[issueId].assignedTo._id === userId ||
          entities[issueId].submitter._id === userId
      )
    }

    const sortedAndFilteredIds = filteredIds.slice().sort((a, b) => {
      return (
        ISSUE_STATUS_RANKING[entities[a].status] -
        ISSUE_STATUS_RANKING[entities[b].status]
      )
    })

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
