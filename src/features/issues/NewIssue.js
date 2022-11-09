import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewIssueForm from "./NewIssueForm";

const NewIssue = () => {
  const users = useSelector(selectAllUsers);

  const content = users ? <NewIssueForm users={users} /> : <p>Loading...</p>;

  return content;
};

export default NewIssue;
