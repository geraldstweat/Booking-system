// "use client";

// import { useState } from "react";
// import Link from "next/link";

// export default function RegisterPage() {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [success, setSuccess] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const res = await fetch("/api/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password}),
//     });

//     if (res.ok) {
//       setSuccess("Account created! You can now login.");
//     } else {
//       const data = await res.json();
//       setError(data.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//       <form
//         onSubmit={handleRegister}
//         className="bg-gray-800 p-6 rounded-2xl shadow-lg w-80 border border-gray-700"
//       >
//         <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

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

//         {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
//         {success && <p className="text-green-400 text-sm mb-2">{success}</p>}

//         {/* Register button */}
//         <button
//           type="submit"
//           className="w-full bg-black text-white py-2 rounded hover:bg-gray-700 transition"
//         >
//           Register
//         </button>

//         {/* Back to Home button */}
//         <Link
//           href="/"
//           className="block w-full mt-3 bg-gray-700 text-white text-center py-2 rounded hover:bg-gray-600 transition"
//         >
//           Back to Home
//         </Link>

//         <p className="text-sm mt-4 text-center text-gray-400">
//           Already have an account?{" "}
//           <a href="/login" className="text-white hover:underline">
//             Login
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess("🎉 Account created! You can now login.");
      setEmail("");
      setPassword("");
    } else {
      const data = await res.json();
      setError(data.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <form
        onSubmit={handleRegister}
        className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
          Create Account
        </h1>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
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

        {/* Feedback */}
        {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-3 text-center">{success}</p>}

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500"
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-5 h-5"></span>
              Creating...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Register
            </>
          )}
        </button>

        {/* Back to Home */}
        <Link
          href="/"
          className="block w-full mt-4 bg-gray-800 text-white text-center py-2 rounded-xl hover:bg-gray-700 transition"
        >
          Back to Home
        </Link>

        {/* Already have account */}
        <p className="text-sm mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-green-400 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}