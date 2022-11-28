import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User"
import PulseLoader from "react-spinners/PulseLoader"
import useTitle from "../../hooks/useTitle"
import ErrorMessage from "../../components/ErrorMessage"

const UsersList = () => {
  useTitle("Users - HIRED Issue Tracker")

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchonMountOrArgChange: true,
  })

  let content

  if (isLoading) content = <PulseLoader color={"#FFF"} />

  if (isError) {
    content = <ErrorMessage errMsg={error?.data?.message} errClass="errmsg" />
    // console.error(error);
    // console.error(error?.data);
    console.error(error?.data?.message)
  }

  if (isSuccess) {
    const { ids } = users

    const tableContent =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />)

    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
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

export default UsersList
