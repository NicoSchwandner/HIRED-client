import { useGetIssuesQuery } from "./issuesApiSlice"
import Issue from "./Issue"
import useAuth from "../../hooks/useAuth"
import PulseLoader from "react-spinners/PulseLoader"
import useTitle from "../../hooks/useTitle"

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

    const tableContent =
      ids?.length &&
      filteredIds.map((issueId) => <Issue key={issueId} issueId={issueId} />)

    content = (
      <table className="table table--issues">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th issue__status">
              Status
            </th>
            <th scope="col" className="table__th issue__created">
              Created
            </th>
            <th scope="col" className="table__th issue__updated">
              Updated
            </th>
            <th scope="col" className="table__th issue__title">
              Title
            </th>
            <th scope="col" className="table__th issue__type">
              Type
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

  // title: {
  //   type: String,
  //   required: true,
  // },
  // description: {
  //   type: String,
  //   required: false,
  // },
  // assignedTo: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: false,
  // },
  // submitter: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  // type: {
  //   type: Number,
  //   required: false,
  // },
  // status: {
  //   type: Number,
  //   required: false,
  //   default: 0,
  // },

  return content
}

export default IssuesList
