import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoginPage from './LoginPage'

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      fetchUser(token);
    }
  }, [location]);

  const fetchUser = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return <div>{user ? <h1>Welcome, {user.name}!</h1> : <LoginPage />}</div>;
}

export default App;
