import ErrorIcon from "@mui/icons-material/Error"

const ErrorMessage = ({ errMsg, errRef, errClass, ariaLive }) => {
  return (
    <p
      ref={errRef}
      className={errClass}
      aria-live={ariaLive ? ariaLive : "none"}
    >
      <ErrorIcon />
      {errMsg}
    </p>
  )
}

export default ErrorMessage
