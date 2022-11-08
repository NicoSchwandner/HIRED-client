import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5, //[s], default 60s
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { tpe: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "user", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetUsersQuery } = usersApiSlice;

//returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

//creates memoized selector
// Memoization:
// In computing, memoization or memoisation is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.
const selectUsersData = createSelector(
  selectUsersResult,
  (userResult) => userResult.data // normalized stae object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState //if selectUsersData(state) is null, then use initialState instead
);
