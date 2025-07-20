import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login/", {
        username,
        password,
      });
      console.log(response.data);
      if (response.data.status === "Success") {
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);
        setUsername("");
        setPassword("");
        navigate("/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error); // Log the error for debugging
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-blue-100 h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/3 flex flex-col justify-center items-center bg-blue-500 rounded-3xl p-6">
            <div className="p-6 bg-blue-100 rounded-2xl mb-6">
              <img src="landtlogo1.svg" alt="Logo" />
            </div>
            <div className="text-center text-white mt-6">
              <img src="computer 1.png" alt="Center Image" />
              <h4 className="mt-4 font-light">OUR VISION YOUR FUTURE</h4>
              <h6 className="opacity-70">Powered by Housys</h6>
            </div>
          </div>

          <div className="w-full md:w-2/3 flex justify-center items-center">
            <form
              className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md"
              onSubmit={handleLogin}
            >
              <div
                className="flex justify-between items-center mb-4 p-2 rounded-xl"
                style={{
                  background: "linear-gradient(to left, #E5F3FF 50%, #048AFB 50%)",
                  height: "30px",
                }}
              >
                <h5 className="text-white mx-3">Login</h5>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700"
                >
                  User Name
                </label>
                <input
                  type="text"
                  id="username"
                  className="mt-2 w-full px-4 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-2 w-full px-4 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-300"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
