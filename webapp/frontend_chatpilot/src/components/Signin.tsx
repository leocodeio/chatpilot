import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signin } from "../functions/signin";
import { checkSignin } from "../functions/checkSignin";
import { motion } from "framer-motion";
import { slideIn } from "./utils/motion";
import { FaHome } from "react-icons/fa";
import { ToggleButton } from "../context/ThemeToggle";
import { StarsCanvas } from "./canvas";
import { Toaster ,toast} from "react-hot-toast";
const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  //check if user is already signed in using cookies
  useEffect(() => {
    const isSignedIn = checkSignin();
    if (isSignedIn) {
      navigate("/");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await signin(email, password);
      if (response.status === 200) {
        setEmail("");
        setPassword("");
        navigate("/");
        toast.success("Signed in successfully");
      }
    } catch (err: any) {
      console.log("Error during signin:", err);
      toast.error("Invalid email or password");
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
            Sign<span className="text-secondary">in</span>
          </h1>
          <Link
            to="/signup"
            className="text-secondary hover:text-purple-700 transition-colors mt-6 block text-center text-white dark:text-black hover:text-gray-500 dark:hover:text-gray-600"
          >
            Don't have an account? Sign up
          </Link>
          <form className="flex flex-col gap-6" onSubmit={handleSignin}>
            <div className="flex flex-col gap-2">
              <label className="text-white dark:text-black font-medium ">
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
                autoComplete="current-password"
                className="bg-gray-100 dark:bg-tertiary py-4 px-6 placeholder:text-gray-500 
                dark:placeholder:text-secondary text-black rounded-lg outline-none 
                border-none font-medium"
              />
            </div>
            <div className="w-full flex gap-4 items-center justify-start">
              <button
                type="submit"
                className="bg-secondary py-3 px-8 rounded-xl text-white 
              font-bold  shadow-primary  hover:bg-purple-700 transition-colors"
              >
                Sign in
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

export default Signin;
