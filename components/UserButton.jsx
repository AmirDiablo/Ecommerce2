import { IoMdSettings } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { BsCart3 } from "react-icons/bs";
import { useAppContext } from "@/context/AppContext";

const UserButton = ({setIsOpen}) => {
    const {userData, setUserData, router} = useAppContext()

    const logout = ()=> {
        localStorage.clear("user")
        setUserData(false)
        setIsOpen(false)
    }

    return ( 
        <div className="fixed text-[13px] top-16 right-10 w-64 bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4 z-50 text-black">
            <div className="flex items-center gap-3">
                <img src={userData?.imageUrl} alt="avatar" className="w-10 rounded-full object-cover" />
                <div>
                    <p className="font-[600]">{userData?.name}</p>
                    <p className="text-black/60">{userData?.email}</p>
                </div>
            </div>

            <div className="flex flex-col *:ml-3 gap-3 *:flex *:items-center *:gap-3 *:cursor-pointer *:text-black/70">
                <div><IoMdSettings /> <p>Manage account</p></div>
                <div onClick={()=> router.push("/cart")}><BsCart3 /> <p>Cart</p></div>
                <div onClick={()=> router.push("/my-orders")}><BsBoxSeam /> <p>My orders</p></div>
                <div onClick={logout}><HiOutlineLogout /> <p>Log out</p></div>
            </div>

        </div>
     );
}
 
export default UserButton;