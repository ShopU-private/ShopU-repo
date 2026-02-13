'use client';

import { useAppDispatch, useAppSelector } from '@shopu/redux-toolkit/hook';
import { clearUserDetails, getUserDetails } from '@shopu/redux-toolkit/userSlice';
import { useEffect } from 'react';

export default function CheckSlice() {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(state => state.user.userDetails);
  console.log(userProfile);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  function handleDelete() {
    dispatch(clearUserDetails());
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
  );
}
