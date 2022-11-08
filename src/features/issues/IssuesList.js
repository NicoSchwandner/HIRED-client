import { useGetIssuesQuery } from "./issuesApiSlice";
import Issue from "./Issue";

const IssuesList = () => {
  const {
    data: issues,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetIssuesQuery();

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
    // console.error(error);
    // console.error(error?.data);
    console.error(error?.data?.message);
  }

  if (isSuccess) {
    const { ids } = issues;

    const tableContent = ids?.length
      ? ids.map((issueId) => <Issue key={issueId} issueId={issueId} />)
      : null;

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
    );
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

  return content;
};

export default IssuesList;
