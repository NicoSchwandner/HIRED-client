import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const issuesAdapter = createEntityAdapter({});

const initialState = issuesAdapter.getInitialState();

export const issuesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIssues: builder.query({
      query: () => "/issues",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5, //[s], default 60s
      transformResponse: (responseData) => {
        const loadedIssues = responseData.map((issue) => {
          issue.id = issue._id;
          return issue;
        });
        return issuesAdapter.setAll(initialState, loadedIssues);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { tpe: "Issue", id: "LIST" },
            ...result.ids.map((id) => ({ type: "issue", id })),
          ];
        } else return [{ type: "Issue", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetIssuesQuery } = issuesApiSlice;

//returns the query result object
export const selectIssuesResult = issuesApiSlice.endpoints.getIssues.select();

//creates memoized selector
// Memoization:
// In computing, memoization or memoisation is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.
const selectIssuesData = createSelector(
  selectIssuesResult,
  (issueResult) => issueResult.data // normalized stae object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllIssues,
  selectById: selectIssueById,
  selectIds: selectIssueIds,
  // Pass in a selector that returns the issues slice of state
} = issuesAdapter.getSelectors(
  (state) => selectIssuesData(state) ?? initialState //if selectIssuesData(state) is null, then use initialState instead
);
