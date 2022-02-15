import React, { useEffect } from "react"
import commerceAPI from "./commerceAPI"

export function useIsLoggedIn() {
  const [loggedIn, setLoggedIn] = React.useState(commerceAPI.currentToken != null)

  useEffect(() => {
    commerceAPI.loginChange = () => {
      console.log("Login Changed")
      setLoggedIn(commerceAPI.currentToken != null)
    }
  }, []);

  return loggedIn;
}
