import { getToken, removeToken, verifyToken } from "@/app/audit/services/authService";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./ToastContext";

type User = {
  email: string;
  id: number;
  isAdmin: boolean;
};

type signInPayload = { token: string; user: User };

export const UserContext = createContext<{
  loading: boolean;
  token: string;
  signIn: (data: signInPayload) => void;
  getUserName: () => string;
  signOut: () => void;
  isAdmin: () => boolean;
  getUserEmail: () => string;
}>({
  loading: false,
  token: "",
  signIn: (data: signInPayload) => { },
  getUserName: () => "",
  signOut: () => { },
  isAdmin: () => false,
  getUserEmail: () => "",

});

export const useSession = () => {
  return useContext(UserContext);
};

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJyaWouc29qaXRyYUBjcmVzdGRhdGEuYWkiLCJpYXQiOjE3NTcwNjAwNzh9.rVAWYhRd7eRYF930taegb-UTTVOzCcTv6lwLU2zxenQ");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const { showToast } = useToast();
  // console.log("Hello", "AppContext");

  const fetchUser = async function () {
    try {
      const token = await getToken();
      if (token) {
        let data = await verifyToken(token);
        // console.log(data);
        setUser(data);
        // router.replace("/Home");
        setToken(token);
      }
    } catch (error: any) {
      showToast({
        type: "error",
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = (data: signInPayload) => {
    setToken(data.token);
    setUser(data.user);
  };

  const signOut = () => {
    removeToken()
    setToken("");
    setUser(null);
  };

  const getUserName = () => {
    return user
      ? user.email.split("@")[0].split(".")[0] +
      " " +
      user.email.split("@")[0].split(".")[1]
      : "";
  };

  const isAdmin = () => {
    return user?.isAdmin || false;
  };

  const getUserEmail = () => {
    return user ? user.email : ""
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ loading, token, signIn, getUserName, signOut, isAdmin, getUserEmail }}
    >
      {children}
    </UserContext.Provider>
  );
};
