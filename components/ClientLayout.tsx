// "use client";

// import { useEffect, useState } from "react";
// import NavigationWrapper from "./Navigation";

// export default function ClientLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [userRole, setUserRole] = useState<'ADMIN' | 'BROTHER' | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Get user from localStorage
//     const userStr = localStorage.getItem("user");
//     if (userStr) {
//       try {
//         const user = JSON.parse(userStr);
//         // Set the role from the user object
//         if (user.role === "ADMIN" || user.role === "BROTHER") {
//           setUserRole(user.role);
//         }
//       } catch (error) {
//         console.error("Failed to parse user data", error);
//       }
//     }
//     setIsLoading(false);
//   }, []);

//   // Show loading or nothing while checking role
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#135bec]"></div>
//       </div>
//     );
//   }

//   // If no user role found, maybe redirect to login or show nothing
//   if (!userRole) {
//     // You might want to redirect to login here
//     return (
//       <main className="min-h-screen">
//         {children}
//       </main>
//     );
//   }

//   return (
//     <>
//       <NavigationWrapper userRole={userRole} />
//       <main className="lg:mr-80 min-h-screen transition-all duration-300">
//         {children}
//       </main>
//     </>
//   );
// }