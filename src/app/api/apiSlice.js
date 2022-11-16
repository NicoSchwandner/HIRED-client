import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setCredentials } from "../../features/auth/authSlice"

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://hired-issue-tracker-api.onrender.com"
      : "http://localhost:3500",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token

    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) {
    console.log("Sending refresh token")

    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions)

    if (refreshResult?.data) {
      // store updated access token
      api.dispatch(setCredentials({ ...refreshResult.data }))

      // retry initial query with updated access token
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (result?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired. "
      }
      return refreshResult
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  // baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  tagTypes: ["Issue", "User"],
  endpoints: (builder) => ({}),
})
