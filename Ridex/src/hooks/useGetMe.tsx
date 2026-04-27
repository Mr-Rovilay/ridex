"use client";

import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetMe = (enabled: boolean) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!enabled) {
      return;
    }
    
    const getMe = async () => {
      try {
        const { data } = await axios.get("/api/user/me");
        dispatch(setUserData(data));
      } catch (error: any) {
        // 401 is expected when user is not logged in
        if (error.response?.status === 401) {
          dispatch(setUserData(null));
        } else {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    getMe();
  }, [dispatch, enabled]);
};

export default useGetMe;