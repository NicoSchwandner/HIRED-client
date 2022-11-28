import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { selectCurrentToken } from "./authSlice"
import { useRefreshMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import PulseLoader from "react-spinners/PulseLoader"

import React from "react"

const PersistLogin = () => {
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)
  const effectRan = useRef(false)

  const [trueSuccess, setTrueSuccess] = useState(false)

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation()

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token")
        try {
          // const response =
          await refresh()
          // const { accessToken } = response.data
          setTrueSuccess(true)
        } catch (err) {
          console.log(err)
        }
      }

      if (!token && persist) verifyRefreshToken()
    }

    return () => {
      effectRan.current = true
    }
    // eslint-disable-next-line
  }, [])

  let content

  if (!persist) {
    console.log("No persist")
    content = <Outlet />
  } else if (isLoading) {
    console.log("Loading")
    content = (
      <p className="loading-animation-wrapper">
        <PulseLoader color={"var(--COLOR)"} className="loading-animation" />
      </p>
    )
  } else if (isError) {
    console.log("Error")
    content = (
      <p className="errmsg">
        {`${error?.data?.message} - `}
        <Link to="/login">Please login again</Link>.
      </p>
    )
  } else if (isSuccess && trueSuccess) {
    console.log("Success")
    content = <Outlet />
  } else if (token && isUninitialized) {
    console.log("Token exists and uninitialized")
    console.log(isUninitialized)
    content = <Outlet />
  }

  return content
}

export default PersistLogin
