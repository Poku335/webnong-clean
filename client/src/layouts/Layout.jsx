import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import MainNav from "../components/MainNav";
import useEcomStore from "../store/ecom-store";
import { currentUser } from "../api/auth";

const Layout = () => {
  const { token, setUser } = useEcomStore();

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const res = await currentUser(token);
          setUser(res.data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [token, setUser]);

  return (
    <div className="min-h-screen bg-secondary-50">
      <MainNav />
      <main className="container-custom py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
