'use client'

import { useAppDispatch, useAppSelector } from "@/store/redux/hook"
import { clearUserDetails, getUserDetails } from "@/store/slices/userSlice";
import { useEffect } from "react";

export default function UserDetails() {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.user.userDetails)
  console.log(userProfile);

  useEffect(() => {
    dispatch(getUserDetails())
  }, [dispatch])

  function handleDelete() {
    dispatch(clearUserDetails())
  }
  return (
    <div>
      {userProfile && (
        <div id={userProfile.id}>
          <div>{userProfile.phoneNumber}</div>
        </div>
      )}
      
      <button onClick={handleDelete}>Clear details</button>
    </div>
  )
}