import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"

const ErrorMessage = ({ errMsg, errRef, errClass, ariaLive }) => {
  return (
    <p
      ref={errRef}
      className={errClass}
      aria-live={ariaLive ? ariaLive : "none"}
    >
      <FontAwesomeIcon icon={faCircleExclamation} />
      {errMsg}
    </p>
  )
}

export default ErrorMessage
