import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import axios from "axios";

const Signout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const signout = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found!");
        setIsLoggedIn(false);
        navigate("/");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/signout/",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          setIsLoggedIn(false);
          navigate("/");
        }
      } catch (error) {
        console.error("Error signing out:", error.response?.data || error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          navigate("/");
        }
      }
    };

    signout();
  }, [navigate, setIsLoggedIn]);

  return null;
};

export default Signout;
