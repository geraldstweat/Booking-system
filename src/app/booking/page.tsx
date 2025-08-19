// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { motion } from "framer-motion";
// import {
//   Calendar,
//   Clock,
//   User,
//   CheckCircle,
//   XCircle,
//   Settings,
// } from "lucide-react";

// interface Booking {
//   _id: string;
//   resource: { name: string };
//   start_time: string;
//   end_time: string;
//   user: { email: string };
//   status: string;
// }

// interface Resource {
//   _id: string;
//   name: string;
//   slots: string[];
// }

// const Section: React.FC<{
//   title: React.ReactNode;
//   children: React.ReactNode;
// }> = ({ title, children }) => (
//   <motion.section
//     initial={{ opacity: 0, y: 24 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.35 }}
//     className="bg-gray-800/60 border border-gray-700 rounded-2xl shadow-xl p-6"
//   >
//     <h2 className="text-2xl md:text-3xl font-bold mb-5 flex items-center gap-2">
//       {title}
//     </h2>
//     {children}
//   </motion.section>
// );

// // ========= Tabs =========
// export function UnderlineTabs({ activeTab, setActiveTab }: any) {
//   const tabs = [
//     { id: "create", label: "Booking Creation" },
//     { id: "manage", label: "Booking Management" },
//     { id: "availability", label: "Availability & Scheduling" },
//   ];

//   return (
//     <div className="sticky top-0 z-20 backdrop-blur bg-gray-900/85 border-b border-gray-700">
//       <div className="max-w-6xl mx-auto flex justify-center gap-10 py-4">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`relative text-sm md:text-base lg:text-lg font-semibold transition-colors ${
//               activeTab === tab.id
//                 ? "text-white"
//                 : "text-gray-400 hover:text-gray-200"
//             }`}
//           >
//             {tab.label}
//             {activeTab === tab.id && (
//               <motion.div
//                 layoutId="underline"
//                 className="absolute left-0 right-0 -bottom-[4px] h-[3px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
//                 transition={{ type: "spring", stiffness: 420, damping: 28 }}
//               />
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
// export default function BookingSystem() {
//   const [activeTab, setActiveTab] = useState<
//     "create" | "manage" | "availability"
//   >("create");
//   const [myBookings, setMyBookings] = useState<Booking[]>([]);
//   const [allBookings, setAllBookings] = useState<Booking[]>([]);
//   const [resources, setResources] = useState<Resource[]>([]);
//   const [range, setRange] = useState<"daily" | "weekly">("daily");
//   const [message, setMessage] = useState("");
//   const [token, setToken] = useState<string | null>(null);
//   const [role, setRole] = useState<"customer" | "admin" | null>(null);
//   const tz = useMemo(
//     () => Intl.DateTimeFormat().resolvedOptions().timeZone,
//     []
//   );
//   useEffect(() => {
//     setToken(localStorage.getItem("token"));
//     setRole(
//       (localStorage.getItem("role") as "customer" | "admin") || "customer"
//     );
//   }, []);

//   // Load resources
//   useEffect(() => {
//     const loadResources = async () => {
//       try {
//         const res = await fetch("/api/resources/available", {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         const data = await res.json();
//         setResources(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     if (token) loadResources();
//   }, [token]);
//   // Load bookings if admin
//   useEffect(() => {
//     const loadBookings = async () => {
//       try {
//         const res = await fetch(
//           `/api/bookings?role=${role}&email=${localStorage.getItem("email")}`,
//           {
//             headers: { Authorization: token ? `Bearer ${token}` : "" },
//           }
//         );
//         const data = await res.json();
//         if (role === "admin") setAllBookings(data);
//         else setMyBookings(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     if (token) loadBookings();
//   }, [role, token]);

//   // Admin update booking
//   const handleAdminUpdate = async (id: string, status: string) => {
//     await fetch(`/api/bookings/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//       body: JSON.stringify({ status }),
//     });
//   };

//   // Customer cancel booking
//   const handleCancel = async (id: string) => {
//     await fetch(`/api/bookings/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: token ? `Bearer ${token}` : "" },
//     });
//     setMyBookings(myBookings.filter((b) => b._id !== id));
//   };

//   // ✅ Handle Customer Booking
//   const handleBook = async (resourceId: string, slot: string) => {
//     const res = await fetch("api/bookings", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//       body: JSON.stringify({ resourceId, slot }),
//     });
//     const data = await res.json();
//     if (res.ok) {
//       setMyBookings([...myBookings, data]);
//       setMessage("✅ Booking confirmed!");
//     } else {
//       setMessage(`❌ ${data.message}`);
//     }
//   };

//   // ✅ Handle Admin Booking Creation
//   const handleAdminCreate = async (
//     resourceId: string,
//     start_time: string,
//     end_time: string,
//     userEmail: string
//   ) => {
//     const res = await fetch("/api/bookings/admin", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//       body: JSON.stringify({
//         resourceId,
//         start_time,
//         end_time,
//         userEmail,
//       }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       setAllBookings([...allBookings, data]);
//       setMessage("✅ Booking created!");
//     } else {
//       setMessage(`❌ ${data.message}`);
//     }
//   };
//   // return (
//   //   <div className="p-6 min-h-screen bg-gray-900 text-white">
//   //     {/* Tabs */}
//   //     <UnderlineTabs activeTab={activeTab} setActiveTab={setActiveTab} />

//   //     {/* Booking Creation Page */}
//   //     {activeTab === "create" && (
//   //       <div>
//   //         <h2 className="text-2xl font-bold mb-6">Booking Creation</h2>

//   //         {/* RESOURCE LIST */}
//   //         <div className="mb-8">
//   //           <h3 className="text-xl font-semibold mb-3">
//   //             📦 Available Resources
//   //           </h3>
//   //           {resources.length > 0 ? (
//   //             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//   //               {resources.map((res) => (
//   //                 <li
//   //                   key={res._id}
//   //                   className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
//   //                 >
//   //                   <p className="font-semibold">{res.name}</p>
//   //                   <p className="text-sm text-gray-400">
//   //                     {res.description || "No description"}
//   //                   </p>

//   //                   {/* CUSTOMER BOOKING FORM */}
//   //                   {role === "customer" && (
//   //                     <form
//   //                       onSubmit={(e) => {
//   //                         e.preventDefault();
//   //                         const formData = new FormData(e.currentTarget);
//   //                         const start_time = formData.get(
//   //                           "start_time"
//   //                         ) as string;
//   //                         const end_time = formData.get("end_time") as string;

//   //                         handleBook(res._id, start_time, end_time);
//   //                         e.currentTarget.reset();
//   //                       }}
//   //                       className="mt-4 space-y-2"
//   //                     >
//   //                       <input
//   //                         type="datetime-local"
//   //                         name="start_time"
//   //                         className="bg-gray-700 p-2 rounded w-full"
//   //                         required
//   //                       />
//   //                       <input
//   //                         type="datetime-local"
//   //                         name="end_time"
//   //                         className="bg-gray-700 p-2 rounded w-full"
//   //                         required
//   //                       />
//   //                       <button
//   //                         type="submit"
//   //                         className="bg-blue-600 px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition"
//   //                       >
//   //                         📅 Book
//   //                       </button>
//   //                     </form>
//   //                   )}
//   //                 </li>
//   //               ))}
//   //             </ul>
//   //           ) : (
//   //             <p className="text-gray-400 italic">No resources available</p>
//   //           )}
//   //         </div>

//   //         {/* ADMIN VIEW */}
//   //         {role === "admin" && (
//   //           <form
//   //             onSubmit={(e) => {
//   //               e.preventDefault();
//   //               const formData = new FormData(e.currentTarget);

//   //               const resourceId = formData.get("resourceId") as string;
//   //               const start_time = formData.get("start_time") as string;
//   //               const end_time = formData.get("end_time") as string;
//   //               const userEmail = formData.get("userEmail") as string;

//   //               handleAdminCreate({
//   //                 resourceId,
//   //                 start_time,
//   //                 end_time,
//   //                 userEmail,
//   //               });
//   //               e.currentTarget.reset();
//   //             }}
//   //             className="max-w-lg bg-gray-800 p-6 rounded-lg shadow space-y-4"
//   //           >
//   //             <h3 className="text-xl font-semibold">➕ Admin Create Booking</h3>

//   //             {/* Resource Select */}
//   //             <select
//   //               name="resourceId"
//   //               className="bg-gray-700 p-2 rounded w-full"
//   //               required
//   //             >
//   //               <option value="">Select Resource</option>
//   //               {resources.map((res) => (
//   //                 <option key={res._id} value={res._id}>
//   //                   {res.name}
//   //                 </option>
//   //               ))}
//   //             </select>

//   //             {/* Start / End Time */}
//   //             <input
//   //               type="datetime-local"
//   //               name="start_time"
//   //               className="bg-gray-700 p-2 rounded w-full"
//   //               required
//   //             />
//   //             <input
//   //               type="datetime-local"
//   //               name="end_time"
//   //               className="bg-gray-700 p-2 rounded w-full"
//   //               required
//   //             />

//   //             {/* User Email */}
//   //             <input
//   //               type="email"
//   //               name="userEmail"
//   //               placeholder="User Email"
//   //               className="bg-gray-700 p-2 rounded w-full"
//   //               required
//   //             />

//   //             <button
//   //               type="submit"
//   //               className="bg-green-600 px-4 py-2 rounded-lg w-full hover:bg-green-700 transition"
//   //             >
//   //               ✅ Create Booking
//   //             </button>
//   //           </form>
//   //         )}
//   //       </div>
//   //     )}

//   //     {/* Booking Management Page */}
//   //     {/* Admin View */}
//   //     {role === "admin" &&
//   //       allBookings.map((b) => (
//   //         <div key={b._id} className="p-4 bg-gray-700 rounded mt-2">
//   //           <p>
//   //             {b.resource.name} — {b.user.email}
//   //           </p>
//   //           <p className="text-sm text-gray-400">
//   //             {new Date(b.start_time).toLocaleString()} →{" "}
//   //             {new Date(b.end_time).toLocaleString()}
//   //           </p>
//   //           <select
//   //             value={b.status}
//   //             onChange={(e) => handleAdminUpdate(b._id, e.target.value)}
//   //             className="bg-gray-800 p-2 rounded mt-2"
//   //           >
//   //             <option value="confirmed">Confirmed</option>
//   //             <option value="canceled">Canceled</option>
//   //           </select>
//   //         </div>
//   //       ))}

//   //     {/* Customer View */}
//   //     {role === "customer" &&
//   //       myBookings.map((b) => {
//   //         const now = new Date();
//   //         const startTime = new Date(b.start_time);
//   //         const cutoff = new Date(startTime);
//   //         cutoff.setHours(cutoff.getHours() - 24);
//   //         const canCancel = now < cutoff;

//   //         return (
//   //           <div
//   //             key={b._id}
//   //             className="p-4 bg-gray-700 rounded mt-2 flex justify-between items-center"
//   //           >
//   //             <div>
//   //               <p>{b.resource.name}</p>
//   //               <p className="text-sm text-gray-400">
//   //                 {startTime.toLocaleString()} →{" "}
//   //                 {new Date(b.end_time).toLocaleString()}
//   //               </p>
//   //               <p>Status: {b.status}</p>
//   //             </div>
//   //             {canCancel ? (
//   //               <button
//   //                 onClick={() => handleCancel(b._id)}
//   //                 className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
//   //               >
//   //                 Cancel
//   //               </button>
//   //             ) : (
//   //               <p className="text-gray-400 text-sm">Too late to cancel</p>
//   //             )}
//   //           </div>
//   //         );
//   //       })}

//   //     {/* Availability & Scheduling Page */}
//   //     {activeTab === "availability" && (
//   //       <div>
//   //         <h2 className="text-2xl font-bold mb-6">Availability & Scheduling</h2>

//   //         {resources.map((r) => (
//   //           <div key={r._id} className="mb-8 p-4 bg-gray-800 rounded-lg shadow">
//   //             <p className="text-xl font-semibold mb-2">{r.name}</p>

//   //             {/* Render available times */}
//   //             <div className="flex flex-wrap gap-2">
//   //               {r.availability?.length > 0 ? (
//   //                 r.availability.map(
//   //                   (a: {
//   //                     start_time: string;
//   //                     end_time: string;
//   //                     booked: boolean;
//   //                   }) => (
//   //                     <button
//   //                       key={`${a.start_time}-${a.end_time}`}
//   //                       disabled={a.booked}
//   //                       className={`px-3 py-2 rounded ${
//   //                         a.booked
//   //                           ? "bg-red-600 cursor-not-allowed opacity-50"
//   //                           : "bg-green-600 hover:bg-green-700 transition"
//   //                       }`}
//   //                     >
//   //                       {new Date(a.start_time).toLocaleString([], {
//   //                         dateStyle: "short",
//   //                         timeStyle: "short",
//   //                       })}{" "}
//   //                       →{" "}
//   //                       {new Date(a.end_time).toLocaleString([], {
//   //                         timeStyle: "short",
//   //                       })}
//   //                     </button>
//   //                   )
//   //                 )
//   //               ) : (
//   //                 <p className="text-gray-400 italic">
//   //                   No availability defined
//   //                 </p>
//   //               )}
//   //             </div>
//   //           </div>
//   //         ))}

//   //         {/* Admin: configure open hours / blackout dates */}
//   //         {role === "admin" && (
//   //           <div className="mt-10 bg-gray-900 p-6 rounded-lg shadow space-y-4">
//   //             <h3 className="text-xl font-semibold">
//   //               ⚙️ Configure Availability
//   //             </h3>
//   //             <form
//   //               onSubmit={(e) => {
//   //                 e.preventDefault();
//   //                 const formData = new FormData(e.currentTarget);

//   //                 const openHour = formData.get("openHour") as string;
//   //                 const closeHour = formData.get("closeHour") as string;
//   //                 const blackoutDate = formData.get("blackoutDate") as string;

//   //                 handleSetAvailability({ openHour, closeHour, blackoutDate });
//   //                 e.currentTarget.reset();
//   //               }}
//   //               className="space-y-3"
//   //             >
//   //               <div className="flex gap-2">
//   //                 <input
//   //                   type="time"
//   //                   name="openHour"
//   //                   className="bg-gray-700 p-2 rounded w-full"
//   //                   required
//   //                 />
//   //                 <input
//   //                   type="time"
//   //                   name="closeHour"
//   //                   className="bg-gray-700 p-2 rounded w-full"
//   //                   required
//   //                 />
//   //               </div>

//   //               <input
//   //                 type="date"
//   //                 name="blackoutDate"
//   //                 className="bg-gray-700 p-2 rounded w-full"
//   //               />

//   //               <button
//   //                 type="submit"
//   //                 className="bg-blue-600 px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition"
//   //               >
//   //                 Save Availability
//   //               </button>
//   //             </form>
//   //           </div>
//   //         )}
//   //       </div>
//   //     )}

//   //     {message && <p className="mt-6 text-center text-gray-300">{message}</p>}
//   //   </div>
//   // );
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
//       {/* Tabs */}
//       <UnderlineTabs activeTab={activeTab} setActiveTab={setActiveTab} />

//       <div className="max-w-6xl mx-auto p-6 space-y-8">
//         {/* Booking Creation */}
//         {activeTab === "create" && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
//               <Calendar className="w-6 h-6 text-blue-400" /> Booking Creation
//             </h2>

//             {resources.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {resources.map((res) => (
//                   <motion.div
//                     key={res._id}
//                     whileHover={{ scale: 1.02 }}
//                     className="p-6 bg-gray-800/60 rounded-2xl shadow-xl border border-gray-700 backdrop-blur"
//                   >
//                     <h3 className="text-xl font-semibold">{res.name}</h3>
//                     <p className="text-sm text-gray-400 mb-4">
//                       {res.description || "No description available"}
//                     </p>

//                     {/* Example customer booking form */}
//                     {role === "customer" && (
//                       <form className="space-y-3">
//                         <div className="flex gap-2">
//                           <input
//                             type="datetime-local"
//                             name="start_time"
//                             className="flex-1 bg-gray-700 rounded-lg p-2"
//                             required
//                           />
//                           <input
//                             type="datetime-local"
//                             name="end_time"
//                             className="flex-1 bg-gray-700 rounded-lg p-2"
//                             required
//                           />
//                         </div>
//                         <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-2 rounded-xl font-semibold hover:opacity-90 transition">
//                           Book Now
//                         </button>
//                       </form>
//                     )}
//                   </motion.div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-400 italic">No resources available</p>
//             )}
//           </motion.div>
//         )}

//         {/* Booking Management */}
//         {activeTab === "manage" && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
//               <User className="w-6 h-6 text-purple-400" /> Booking Management
//             </h2>

//             {role === "admin"
//               ? allBookings.map((b) => (
//                   <div
//                     key={b._id}
//                     className="p-5 bg-gray-800/60 rounded-xl mb-3 shadow border border-gray-700"
//                   >
//                     <p className="font-semibold">{b.resource.name}</p>
//                     <p className="text-sm text-gray-400">
//                       {new Date(b.start_time).toLocaleString()} →{" "}
//                       {new Date(b.end_time).toLocaleString()}
//                     </p>
//                     <select className="mt-2 bg-gray-700 rounded p-2">
//                       <option value="confirmed">Confirmed</option>
//                       <option value="canceled">Canceled</option>
//                     </select>
//                   </div>
//                 ))
//               : myBookings.map((b) => (
//                   <div
//                     key={b._id}
//                     className="p-5 bg-gray-800/60 rounded-xl mb-3 shadow border border-gray-700 flex justify-between items-center"
//                   >
//                     <div>
//                       <p className="font-semibold">{b.resource.name}</p>
//                       <p className="text-sm text-gray-400">
//                         {new Date(b.start_time).toLocaleString()} →{" "}
//                         {new Date(b.end_time).toLocaleString()}
//                       </p>
//                       <p>Status: {b.status}</p>
//                     </div>
//                     <button className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 transition">
//                       Cancel
//                     </button>
//                   </div>
//                 ))}
//           </motion.div>
//         )}

//         {/* Availability */}
//         {activeTab === "availability" && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
//               <Clock className="w-6 h-6 text-green-400" /> Availability &
//               Scheduling
//             </h2>

//             {resources.map((r) => (
//               <div
//                 key={r._id}
//                 className="p-6 bg-gray-800/60 rounded-xl shadow mb-6 border border-gray-700"
//               >
//                 <h3 className="text-xl font-semibold mb-3">{r.name}</h3>
//                 <div className="flex flex-wrap gap-3">
//                   {r.availability?.length ? (
//                     r.availability.map((a) => (
//                       <button
//                         key={`${a.start_time}-${a.end_time}`}
//                         disabled={a.booked}
//                         className={`px-4 py-2 rounded-lg shadow transition ${
//                           a.booked
//                             ? "bg-red-600/60 text-gray-300 cursor-not-allowed"
//                             : "bg-green-600 hover:bg-green-700"
//                         }`}
//                       >
//                         {new Date(a.start_time).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}{" "}
//                         →{" "}
//                         {new Date(a.end_time).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </button>
//                     ))
//                   ) : (
//                     <p className="text-gray-400 italic">
//                       No availability defined
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}

//             {role === "admin" && (
//               <div className="bg-gray-900/80 rounded-xl p-6 border border-gray-700 shadow space-y-4">
//                 <h3 className="text-xl font-semibold flex items-center gap-2">
//                   <Settings className="w-5 h-5 text-blue-400" /> Configure
//                   Availability
//                 </h3>
//                 <form className="space-y-3">
//                   <div className="flex gap-2">
//                     <input
//                       type="time"
//                       name="openHour"
//                       className="bg-gray-700 p-2 rounded flex-1"
//                       required
//                     />
//                     <input
//                       type="time"
//                       name="closeHour"
//                       className="bg-gray-700 p-2 rounded flex-1"
//                       required
//                     />
//                   </div>
//                   <input
//                     type="date"
//                     name="blackoutDate"
//                     className="bg-gray-700 p-2 rounded w-full"
//                   />
//                   <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-2 rounded-lg font-semibold hover:opacity-90 transition">
//                     Save Availability
//                   </button>
//                 </form>
//               </div>
//             )}
//           </motion.div>
//         )}

//         {/* Feedback Message */}
//         {message && (
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center text-gray-200 bg-gray-800/60 p-3 rounded-lg shadow"
//           >
//             {message.startsWith("✅") ? (
//               <span className="flex items-center justify-center gap-2 text-green-400">
//                 <CheckCircle className="w-5 h-5" /> {message}
//               </span>
//             ) : (
//               <span className="flex items-center justify-center gap-2 text-red-400">
//                 <XCircle className="w-5 h-5" /> {message}
//               </span>
//             )}
//           </motion.p>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Settings,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

// ========= Types =========
interface Booking {
  _id: string;
  resource: { _id?: string; name: string };
  start_time: string; // ISO
  end_time: string; // ISO
  user: { email: string };
  status: "confirmed" | "canceled" | string;
}

interface AvailabilitySlot {
  start_time: string; // ISO
  end_time: string; // ISO
  booked: boolean;
}

interface Resource {
  _id: string;
  name: string;
  description?: string;
  slots?: string[]; // optional legacy
  availability?: AvailabilitySlot[];
}

// ========= UI Helpers =========
const Section: React.FC<{
  title: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="bg-gray-800/60 border border-gray-700 rounded-2xl shadow-xl p-6"
  >
    <h2 className="text-2xl md:text-3xl font-bold mb-5 flex items-center gap-2">
      {title}
    </h2>
    {children}
  </motion.section>
);

// ========= Tabs =========
export function UnderlineTabs({ activeTab, setActiveTab }: any) {
  const tabs = [
    { id: "create", label: "Booking Creation" },
    { id: "manage", label: "Booking Management" },
    { id: "availability", label: "Availability & Scheduling" },
  ];

  return (
    <div className="sticky top-0 z-20 backdrop-blur bg-gray-900/85 border-b border-gray-700">
      <div className="max-w-6xl mx-auto flex justify-center gap-10 py-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative text-sm md:text-base lg:text-lg font-semibold transition-colors ${
              activeTab === tab.id
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="underline"
                className="absolute left-0 right-0 -bottom-[4px] h-[3px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ========= Main Component =========
export default function BookingSystem() {
  const [activeTab, setActiveTab] = useState<
    "create" | "manage" | "availability"
  >("create");

  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [message, setMessage] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"customer" | "admin" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState<Booking[]>([]);
  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch("/api/bookings?status=pending");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    };
    fetchRequests();
  }, []);
  // Timezone note (purely for display)
  const tz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(
      (localStorage.getItem("role") as "customer" | "admin") || "customer"
    );
  }, []);

  // Load resources
  useEffect(() => {
    const loadResources = async () => {
      try {
        const res = await fetch("/api/resources/available", {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        setResources(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadResources();
  }, [token]);

  // Load bookings
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const email = localStorage.getItem("email") || "";
        const res = await fetch(
          `/api/bookings?role=${role || "customer"}&email=${email}`,
          { headers: { Authorization: token ? `Bearer ${token}` : "" } }
        );
        const data = await res.json();
        if (role === "admin") setAllBookings(data || []);
        else setMyBookings(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadBookings();
  }, [role, token]);

  // ======== Booking Creation (fixed to use start_time & end_time) ========
  const handleBook = async (
    resourceId: string,
    start_time_input: string,
    end_time_input: string
  ) => {
    // Client-side validation
    if (!start_time_input || !end_time_input) {
      return setMessage("❌ Please provide both start and end time.");
    }

    const startISO = new Date(start_time_input).toISOString();
    const endISO = new Date(end_time_input).toISOString();

    if (isNaN(Date.parse(startISO)) || isNaN(Date.parse(endISO))) {
      return setMessage("❌ Invalid date/time format.");
    }
    if (new Date(endISO) <= new Date(startISO)) {
      return setMessage("❌ End time must be after start time.");
    }
    if (new Date(startISO).getTime() < Date.now() - 60_000) {
      return setMessage("❌ Start time cannot be in the past.");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          resourceId,
          start_time: startISO,
          end_time: endISO,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMyBookings((prev) => [...prev, data]);
        setMessage("✅ Booking confirmed!");
      } else {
        setMessage(`❌ ${data?.message || "Failed to create booking."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error while creating booking.");
    } finally {
      setLoading(false);
    }
  };
  const handleCustomerRequest = async (
    resourceId: string,
    start_time: string,
    end_time: string
  ) => {
    const email = localStorage.getItem("email") || "";
    const res = await fetch(`/api/bookings?email=${email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resourceId,
        start_time,
        end_time,
      }),
    });

    if (res.ok) {
      alert("Booking request sent! Awaiting admin approval.");
    }
  };
  const handleApprove = async (id: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    });
  };

  async function handleReject(id: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject" }),
    });
  }
  // Admin: create booking for a user (positional args, fixed caller)
  const handleAdminCreate = async (
    resourceId: string,
    start_time_input: string,
    end_time_input: string,
    userEmail: string
  ) => {
    const startISO = new Date(start_time_input).toISOString();
    const endISO = new Date(end_time_input).toISOString();

    if (new Date(endISO) <= new Date(startISO)) {
      return setMessage("❌ End time must be after start time.");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/bookings/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          resourceId,
          start_time: startISO,
          end_time: endISO,
          userEmail,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAllBookings((prev) => [...prev, data]);
        setMessage("✅ Booking created!");
      } else {
        setMessage(`❌ ${data?.message || "Failed to create booking."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error while creating booking.");
    } finally {
      setLoading(false);
    }
  };

  // Admin: update status
  const handleAdminUpdate = async (id: string, status: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status }),
      });
      setAllBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
      setMessage("✅ Booking updated!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update booking.");
    }
  };

  // Customer: cancel with 24h cutoff
  const handleCancel = async (id: string, start_time: string) => {
    const cutoff = new Date(start_time).getTime() - 24 * 60 * 60 * 1000;
    if (Date.now() > cutoff) {
      return setMessage("❌ Cannot cancel less than 24h before the booking.");
    }

    try {
      await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setMyBookings((prev) => prev.filter((b) => b._id !== id));
      setMessage("✅ Booking canceled.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to cancel booking.");
    }
  };

  // Availability config (avoid undefined ref)
  const handleSetAvailability = async (payload: {
    openHour: string;
    closeHour: string;
    blackoutDate?: string;
  }) => {
    try {
      await fetch("/api/resources/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });
      setMessage("✅ Availability saved.");
    } catch (e) {
      console.error(e);
      setMessage("❌ Failed to save availability.");
    }
  };

  // Preset quick-pick helper for creation page (next 3 slots of 30m)
  const buildQuickPicks = (n = 3) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + ((30 - (now.getMinutes() % 30)) % 30));
    const picks: { start: string; end: string; label: string }[] = [];
    for (let i = 0; i < n; i++) {
      const start = new Date(now.getTime() + i * 30 * 60 * 1000);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      picks.push({
        start: start.toISOString(),
        end: end.toISOString(),
        label: `${start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} → ${end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      });
    }
    return picks;
  };

  const quickPicks = useMemo(() => buildQuickPicks(4), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Tabs */}
      <UnderlineTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* ===== Booking Creation (fixed requirements) ===== */}
        {activeTab === "create" && (
          <Section
            title={
              <>
                <Calendar className="w-6 h-6 text-blue-400" /> Booking Creation
                <span className="ml-3 text-sm text-gray-400 font-normal">
                  (Timezone: {tz})
                </span>
              </>
            }
          >
            {resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((res) => (
                  <motion.div
                    key={res._id}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-gray-800/60 rounded-2xl shadow-xl border border-gray-700 backdrop-blur"
                  >
                    <h3 className="text-xl font-semibold">{res.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {res.description || "No description available."}
                    </p>

                    {/* Quick picks */}
                    <div className="mb-3 flex flex-wrap gap-2">
                      {quickPicks.map((p) => (
                        <button
                          key={p.start}
                          onClick={() =>
                            handleCustomerRequest(res._id, p.start, p.end)
                          }
                          className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    {/* Customer booking form (uses start_time & end_time) */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget as HTMLFormElement;
                        const start_time =
                          (new FormData(form).get("start_time") as string) ||
                          "";
                        const end_time =
                          (new FormData(form).get("end_time") as string) || "";
                        handleBook(res._id, start_time, end_time);
                        form.reset();
                      }}
                      className="mt-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-400">Start</label>
                          <input
                            type="datetime-local"
                            name="start_time"
                            className="mt-1 bg-gray-700 p-2 rounded w-full"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">End</label>
                          <input
                            type="datetime-local"
                            name="end_time"
                            className="mt-1 bg-gray-700 p-2 rounded w-full"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
                      >
                        Book Now
                      </button>
                    </form>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No resources available</p>
            )}

            {/* Admin-only create area */}
            {role === "admin" && (
              <div className="mt-8">
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  Ensure the booking does not overlap an existing slot.
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const resourceId = (fd.get("resourceId") as string) || "";
                    const start_time = (fd.get("start_time") as string) || "";
                    const end_time = (fd.get("end_time") as string) || "";
                    const userEmail = (fd.get("userEmail") as string) || "";
                    handleAdminCreate(
                      resourceId,
                      start_time,
                      end_time,
                      userEmail
                    ); // ✅ positional args
                    (e.currentTarget as HTMLFormElement).reset();
                  }}
                  className="max-w-2xl bg-gray-900/70 p-6 rounded-2xl border border-gray-700 shadow space-y-4"
                >
                  <h3 className="text-xl font-semibold">
                    ➕ Admin Create Booking
                  </h3>
                  <select
                    name="resourceId"
                    className="bg-gray-700 p-2 rounded w-full"
                    required
                  >
                    <option value="">Select Resource</option>
                    {resources.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="datetime-local"
                      name="start_time"
                      className="bg-gray-700 p-2 rounded w-full"
                      required
                    />
                    <input
                      type="datetime-local"
                      name="end_time"
                      className="bg-gray-700 p-2 rounded w-full"
                      required
                    />
                  </div>
                  <input
                    type="email"
                    name="userEmail"
                    placeholder="User Email"
                    className="bg-gray-700 p-2 rounded w-full"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-600 px-4 py-2 rounded-lg w-full hover:bg-green-700 transition"
                  >
                    ✅ Create Booking
                  </button>
                </form>
              </div>
            )}
            {role === "admin" && (
              <Section title="Pending Requests">
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <div
                      key={req._id}
                      className="p-4 bg-gray-700 rounded-xl mb-2"
                    >
                      <p>
                        <b>User:</b> {req.userEmail}
                      </p>
                      <p>
                        <b>Resource:</b> {req.resourceId}
                      </p>
                      <p>
                        {req.start_time} → {req.end_time}
                      </p>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleApprove(req._id)}
                          className="bg-green-600 px-3 py-1 rounded"
                        >
                          ✅ Accept
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          className="bg-red-600 px-3 py-1 rounded"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No pending requests</p>
                )}
              </Section>
            )}
          </Section>
        )}

        {/* ===== Booking Management ===== */}
        {activeTab === "manage" && (
          <Section
            title={
              <>
                <User className="w-6 h-6 text-purple-400" /> Booking Management
              </>
            }
          >
            {role === "admin" ? (
              <div className="space-y-3">
                {allBookings.map((b) => (
                  <div
                    key={b._id}
                    className="p-5 bg-gray-800/60 rounded-xl shadow border border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div>
                      <p className="font-semibold">{b.resource.name}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(b.start_time).toLocaleString()} →{" "}
                        {new Date(b.end_time).toLocaleString()}
                      </p>
                    </div>
                    {/* <select
                        value={b.status}
                        onChange={(e) => handleAdminUpdate(b._id, e.target.value)}
                        className="bg-gray-700 rounded p-2"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="canceled">Canceled</option>
                      </select> */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {myBookings.map((b) => {
                  const start = new Date(b.start_time);
                  const cutoff = new Date(
                    start.getTime() - 24 * 60 * 60 * 1000
                  );
                  const canCancel = Date.now() < cutoff.getTime();
                  return (
                    <div
                      key={b._id}
                      className="p-5 bg-gray-800/60 rounded-xl shadow border border-gray-700 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold">{b.resource.name}</p>
                        <p className="text-sm text-gray-400">
                          {start.toLocaleString()} →{" "}
                          {new Date(b.end_time).toLocaleString()}
                        </p>
                        <p className="text-sm">Status: {b.status}</p>
                      </div>
                      {canCancel ? (
                        <button
                          onClick={() => handleCancel(b._id, b.start_time)}
                          className="bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition"
                        >
                          Cancel
                        </button>
                      ) : (
                        <p className="text-gray-400 text-sm">
                          Too late to cancel
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        )}

        {/* ===== Availability & Scheduling ===== */}
        {activeTab === "availability" && (
          <Section
            title={
              <>
                <Clock className="w-6 h-6 text-green-400" /> Availability &
                Scheduling
              </>
            }
          >
            {resources.map((r) => (
              <div
                key={r._id}
                className="mb-6 p-5 bg-gray-900/60 border border-gray-700 rounded-xl"
              >
                <h3 className="text-xl font-semibold mb-3">{r.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {r.availability?.length ? (
                    r.availability.map((a) => (
                      <button
                        key={`${a.start_time}-${a.end_time}`}
                        disabled={a.booked}
                        className={`px-3 py-2 rounded ${
                          a.booked
                            ? "bg-red-600/60 cursor-not-allowed opacity-60"
                            : "bg-green-600 hover:bg-green-700 transition"
                        }`}
                        title={a.booked ? "Booked" : "Available"}
                      >
                        {new Date(a.start_time).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}{" "}
                        →{" "}
                        {new Date(a.end_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">
                      No availability defined
                    </p>
                  )}
                </div>
              </div>
            ))}

            {role === "admin" && (
              <div className="mt-6 bg-gray-900/80 p-6 rounded-xl border border-gray-700 shadow space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" /> Configure
                  Availability
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const openHour = (fd.get("openHour") as string) || "";
                    const closeHour = (fd.get("closeHour") as string) || "";
                    const blackoutDate =
                      (fd.get("blackoutDate") as string) || undefined;
                    handleSetAvailability({
                      openHour,
                      closeHour,
                      blackoutDate,
                    });
                    (e.currentTarget as HTMLFormElement).reset();
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="time"
                      name="openHour"
                      className="bg-gray-700 p-2 rounded w-full"
                      required
                    />
                    <input
                      type="time"
                      name="closeHour"
                      className="bg-gray-700 p-2 rounded w-full"
                      required
                    />
                  </div>
                  <input
                    type="date"
                    name="blackoutDate"
                    className="bg-gray-700 p-2 rounded w-full"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Save Availability
                  </button>
                </form>
              </div>
            )}
          </Section>
        )}

        {/* Global feedback */}
        {message && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-center text-gray-200 bg-gray-800/60 p-3 rounded-lg shadow flex items-center justify-center gap-2">
              {message.startsWith("✅") ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400" /> {message}
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" /> {message}
                </>
              )}
            </p>
          </motion.div>
        )}

        {loading && (
          <div className="flex items-center justify-center text-gray-300 gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
