import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user || !token) return;

    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [user, updateUser, clearUser, navigate]);
};
