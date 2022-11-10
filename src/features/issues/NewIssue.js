import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewIssueForm from "./NewIssueForm";

const NewIssue = () => {
  const users = useSelector(selectAllUsers);

  if (!users?.length)
    return (
      <p>
        Currently not available - Did not receive user data or no users exist
      </p>
    );

  const content = <NewIssueForm users={users} />;

  return content;
};

export default NewIssue;
