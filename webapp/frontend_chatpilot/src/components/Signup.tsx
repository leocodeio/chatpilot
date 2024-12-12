import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../functions/signup";
import { checkSignin } from "../functions/checkSignin";
import { motion } from "framer-motion";
import { slideIn } from "./utils/motion";
import { FaHome } from "react-icons/fa";
import { ToggleButton } from "../context/ThemeToggle";
import { StarsCanvas } from "./canvas";
import { Toaster , toast } from "react-hot-toast";
const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const isSignedIn = checkSignin();
    if (isSignedIn) {
      navigate("/");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await signup(username, email, password);
      if (response.status === 201) {
        toast.success("Account created successfully. Sign in to continue.");
        setUsername("");
        setEmail("");
        setPassword("");
        navigate("/signin");
      }
    } catch (error: any) {
      toast.error("An error occurred. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <Toaster />
      <div className="h-screen w-screen flex flex-col items-center">
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className="flex-[0.75] bg-transparent p-8 rounded-2xl w-full max-w-md"
        >
          <h1 className="text-[30px] xs:text-[40px] sm:text-[50px] text-white dark:text-black font-black text-center mb-8">
            Sign<span className="text-secondary">up</span>
          </h1>
          <Link
            to="/signin"
            className="text-secondary   hover:text-purple-700 transition-colors mt-6 block text-center text-white dark:text-black hover:text-gray-500 dark:hover:text-gray-600"
          >
            Already have an account? Sign in
          </Link>
          <form className="flex flex-col gap-6" onSubmit={handleSignup}>
            <div className="flex flex-col gap-2">
              <label className="text-white dark:text-black font-medium">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className="bg-gray-100 dark:bg-tertiary py-4 px-6 placeholder:text-gray-500 
                dark:placeholder:text-secondary text-black rounded-lg outline-none 
                border-none font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white dark:text-black font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="bg-gray-100 dark:bg-tertiary py-4 px-6 placeholder:text-gray-500 
                dark:placeholder:text-secondary text-black rounded-lg outline-none 
                border-none font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white dark:text-black font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="new-password"
                className="bg-gray-100 dark:bg-tertiary py-4 px-6 placeholder:text-gray-500 
                dark:placeholder:text-secondary text-black rounded-lg outline-none 
                border-none font-medium"
              />
            </div>
            <div className="w-full flex gap-4 items-center justify-start">
              <button
                type="submit"
                className="bg-secondary py-3 px-8 rounded-xl text-white 
                font-bold hover:bg-purple-700 transition-colors"
              >
                Sign up
              </button>
              <ToggleButton />
              <Link to="/">
                <FaHome size={30} className="text-white dark:text-black" />
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
      <StarsCanvas />
    </div>
  );
};

export default Signup;
