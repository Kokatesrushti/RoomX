import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [companyname, setCompanyname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(e) {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/register", {
        companyname,
        firstname,
        lastname,
        email,
        phone,
        password,
      });
      alert("Registered successfully");
    } catch (e) {
      alert("Failed to register");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <label
            className="flex items-start text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Company Name
          </label>
          <input
            type="text"
            placeholder="Company Name"
            value={companyname}
            onChange={(e) => setCompanyname(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
            required
          />
          <div className="mb-4"></div>
          <label
            className="flex items-start text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            First Name
          </label>
          <input
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
            required
          />
          <div className="mb-4"></div>
          <label
            className="flex items-start text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Last Name
          </label>
          <input
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
            required
          />
          <div className="mb-4"></div>
          <label
            className="flex items-start text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
            required
          />
          <div className="mb-4"></div>
          <label
            className="flex items-start text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Phone
          </label>
          <input
            type="number"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
            required
          />
          <div className="mb-4"></div>
          <label
            className="flex items-start text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
            required
          />
          <button className="bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-orange-300">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already have an account{" "}
            <Link className="text-black underline" to={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
