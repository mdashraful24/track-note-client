import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { LogOut } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { user, logOut } = useContext(AuthContext);
  return (
    <nav className="bg-gray-900 text-white p-3 flex justify-between items-center">
      {/* Company Name */}
      <div className="text-xl font-bold cursor-none">FlowNotes</div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "User"}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-8 h-8" />
        )}
        <p className="hidden md:block">{user?.displayName}</p>
        {user && (
          <button
            onClick={logOut}
            className="group flex items-center gap-2 px-2 py-1 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 active:bg-red-800 transition-colors relative overflow-hidden active:scale-[0.98]"
          >
            {/* subtle background shimmer */}
            <span
              className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out pointer-events-none"
            />
            <span className="hidden md:block">Logout</span>
            <LogOut size={18} className="block md:hidden" />
          </button>
        )}
      </div>
    </nav>
  );
}
