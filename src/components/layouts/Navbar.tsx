
import { IoIosNotificationsOutline } from "react-icons/io";


export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 py-6 bg-sidebar border-b border-gray-300 fixed z-40 w-full">
        <div>     
             <h1 className="text-xl font-semibold ">Logo Here</h1>
</div>
<div className="flex gap-5 items-center ">
    {/* <Bell className="mr-4 cursor-pointer" /> */}
<IoIosNotificationsOutline color="gray"  className="w-5.5 h-5.5" />

    <img src="/public/assets/profile.png" alt="" className="w-5.5 h-5.5 object-cover" />
      {/* <User className="cursor-pointer" /> */}
</div>
      
    </div>
  );
}
