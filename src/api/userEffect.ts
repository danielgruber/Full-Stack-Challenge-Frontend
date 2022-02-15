import React, { useEffect } from "react"
import User from "../model/User";
import commerceAPI from "./commerceAPI"

function useLoggedInUser() {
  const [user, setUser] = React.useState<User|null>(commerceAPI.user)

  useEffect(() => {
    commerceAPI.loginChange = () => {
      console.log("New User")
      console.log(user)
      console.log(commerceAPI.user)
      setUser(commerceAPI.user)
    }

    return () => { commerceAPI.loginChange = undefined }
  }, [])

  return user
}

export default useLoggedInUser
