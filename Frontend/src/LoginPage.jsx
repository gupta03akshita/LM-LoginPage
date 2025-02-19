import React, { useState } from "react";
import SideImg from "./assets/SideImg.svg";
import Logo from "./assets/Logo.svg";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email !== "test@example.com" || password !== "password123") {
      setError("⚠️ Invalid password and username");
    } else {
      setError("");
      alert("Login successful!");
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-100">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-6 md:p-20 w-full md:w-1/2">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          <img src={Logo} className="h-10 mr-2" alt="Logo" />
          <p className="mt-3 text-black text-4xl font-extrabold">Login</p>
        </h1>
        <p className="text-gray-500 mt-2 mb-6 text-center">
          Let’s Drive Your School Transport into the Future!
        </p>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100"
        >
          <FcGoogle /> Sign in with Google
        </button>
        <div className="flex items-center my-4 w-full">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex justify-between items-center w-full mt-2">
          <label className="flex items-center text-gray-500">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="#" className="text-blue-500 text-sm">
            Forgot password?
          </a>
        </div>
        <button
          className="w-full bg-black text-white py-3 rounded-lg mt-4 hover:bg-gray-800"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="#" className="text-blue-500">
            Sign up
          </a>
        </p>
        <p className="text-sm text-gray-400 mt-6">
          India’s Trusted School Bus Partner Crafted with ❤️ by Rvalliplay
        </p>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex md:w-[826px] flex justify-center items-center">
        <img
          src={SideImg}
          alt="Illustration"
          className=" h-[737.6px] w-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
