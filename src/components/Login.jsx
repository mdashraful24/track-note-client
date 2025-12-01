import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { user, signInWithGoogle } = useContext(AuthContext);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle().then(async (res) => {
        if (res.user) {
          const userData = {
            uid: res.user.uid,
            email: res.user.email,
            name: res.user.displayName,
          };

          // Send user data to the backend
          try {
            const response = await axios.post(
              "https://track-note-ecru.vercel.app/users",
              userData
            );
            // console.log("Server response:", response.data);
            alert("Login successful!");

            // Reload the page after successful login
            window.location.reload();

          } catch (err) {
            console.error("Error sending user data to backend:", err);
          }
        }
      });
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    !user && (
      <div className="flex flex-col items-center justify-center min-h-[78vh] bg-gradient-to-b from-gray-50 to-gray-100 px-6">

        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome to TakeNote
          </h1>
          <p>
            Take & manage your notes. Sign in to begin tracking your notes.
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-6 group flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors relative overflow-hidden active:scale-[0.98]"
        >
          {/* subtle background shimmer */}
          <span
            className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out pointer-events-none"
          />
          <FcGoogle size={20} className="bg-white rounded-full" />
          <span className="font-medium">Sign in with Google</span>
        </button>
      </div>
    )
  );
};

export default Login;
