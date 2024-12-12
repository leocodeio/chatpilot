import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { slideIn } from "./utils/motion";
import { StarsCanvas } from "./canvas";
import { useNavigate } from "react-router-dom";
import { checkSignin } from "../functions/checkSignin";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToggleButton } from "../context/ThemeToggle";
import { apiRecord } from "../constants/formats";
import fetchUserData from "../functions/fetchUser";
import { toast , Toaster } from "react-hot-toast";
const Profile = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [apiKeys, setApiKeys] = useState<apiRecord[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState("N/A");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isSignedIn = checkSignin();
    if (!isSignedIn) {
      navigate("/signin");
      return;
    }

    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        // console.log("debug log 1 at profile.tsx:", userData);
        if (userData.username) {
          setUsername(userData.username);
          setEmail(userData.email);
          if (userData.apiKeys && userData.apiKeys.length > 0) {
            setApiKeys(userData.apiKeys);
            setSelectedWebsite(userData.apiKeys[0].website_name.toString());
          }
        }
      } catch (error) {
        toast.error("Error loading user data. Please try again later");
        console.error("Error loading user data:", error);
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    // console.log("debug log 2: apikyes at profile", apiKeys);
  }, []);

  const handleWebsiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWebsite(event.target.value);
  };

  const selectedApiKey =
    apiKeys.find((api) => api.website_name === selectedWebsite)?.api_key ||
    "N/A";

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Toaster position="top-right" />
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-auto">
      <Toaster />
      <div className="h-screen w-screen flex flex-col items-center">
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className="flex-[0.75] bg-transparent p-8 rounded-2xl w-full max-w-md mt-20"
        >
          <h1 className="text-[30px] xs:text-[40px] sm:text-[50px] text-white dark:text-black font-black text-center mb-2">
            Pro<span className="text-secondary">file</span>
          </h1>
          <div className="flex justify-center items-center mb-8 gap-4">
            <Link
              to="/"
              className="text-white dark:text-black hover:text-secondary transition-colors"
            >
              <FaHome size={30} />
            </Link>
            <ToggleButton />
          </div>

          <div className="bg-gray-800/50 dark:bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-white dark:text-black font-medium">
                  Username
                </label>
                <div className="bg-gray-100 dark:bg-tertiary py-4 px-6 text-black rounded-lg">
                  {username}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white dark:text-black font-medium">
                  Email
                </label>
                <div className="bg-gray-100 dark:bg-tertiary py-4 px-6 text-black rounded-lg">
                  {email}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white dark:text-black font-medium">
                  Select Website
                </label>
                <select
                  className="bg-gray-100 dark:bg-tertiary py-4 px-6 text-black rounded-lg"
                  value={selectedWebsite}
                  onChange={handleWebsiteChange}
                >
                  <option value="N/A">N/A</option>
                  {apiKeys.map((api: apiRecord) => (
                    <option
                      key={api.website_name.toString()}
                      value={api.website_name.toString()}
                    >
                      {api.website_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white dark:text-black font-medium">
                  API Key
                </label>
                <div className="bg-gray-100 dark:bg-tertiary py-4 px-6 text-black rounded-lg">
                  {selectedApiKey ? selectedApiKey : "N/A"}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  to="/try"
                  className="text-white dark:text-black hover:text-black transition-colors w-full text-center bg-secondary py-4 px-6 rounded-lg hover:bg-secondary/80 hover:text-black"
                >
                  Create/Try an API key
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col items-center justify-center h-screen">
          <StarsCanvas />
        </div>
      </div>
    </div>
  );
};

export default Profile;
