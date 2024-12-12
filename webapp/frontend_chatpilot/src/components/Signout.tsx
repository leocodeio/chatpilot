import { signout } from "../functions/signout";
import { useNavigate } from "react-router-dom";
import { Toaster,  toast } from "react-hot-toast";

const Signout = () => {
  const navigate = useNavigate();
  const handleSignout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signout();
      toast.success("signed out");
      navigate("/signin");
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    
    <div className="flex justify-center items-center h-screen">
      <Toaster />
        <button
    className="bg-red-500 text-white p-2 rounded-md"
    onClick={handleSignout}
    >
        Signout
      </button>
    </div>
  );
};

export default Signout;
