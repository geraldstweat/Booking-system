// "use client";

// import { useState } from "react";
// import Link from "next/link";

// export default function LoginPage() {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     const res = await fetch("/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });
//     if (res.ok) {
//       const rdata = await res.json();
//       const data = rdata.data;
//       // ✅ Save token in localStorage
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("role", data.role);
//       localStorage.setItem("email", data.email);
//       // Redirect user
//       window.location.href = "/booking";
//     } else {
//       const data = await res.json();
//       setError(data.message || "Login failed");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-gray-800 p-6 rounded-2xl shadow-lg w-80 border border-gray-700"
//       >
//         <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-2 mb-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-2 mb-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

//         {/* Login button */}
//         <button
//           type="submit"
//           className="w-full bg-black text-white py-2 rounded hover:bg-gray-700 transition"
//         >
//           Login
//         </button>

//         {/* Back to Home button */}
//         <Link
//           href="/"
//           className="block w-full mt-3 bg-gray-700 text-white text-center py-2 rounded hover:bg-gray-600 transition"
//         >
//           Back to Home
//         </Link>

//         <p className="text-sm mt-4 text-center text-gray-400">
//           Don’t have an account?{" "}
//           <a href="/register" className="text-white hover:underline">
//             Register
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
interface LoginResponse {
  message: string;
  data: {
    id: string;
    email: string;
    role: string;
    token: string;
  };
}
interface ErrorResponse {
  message: string;
}
export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);

    if (res.ok) {
      const rdata: LoginResponse = await res.json();
      const data = rdata.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);
      window.location.href = "/booking";
    } else {
      const data: ErrorResponse = await res.json();
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Welcome Back
        </h1>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Login button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-5 h-5"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* Back to Home */}
        <Link
          href="/"
          className="block w-full mt-4 bg-gray-800 text-white text-center py-2 rounded-xl hover:bg-gray-700 transition"
        >
          Back to Home
        </Link>

        {/* Register link */}
        <p className="text-sm mt-4 text-center text-gray-400">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
