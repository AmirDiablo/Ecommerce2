import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { RxCross1 } from "react-icons/rx";

const Reply = ({setIsReplying, commentId, productId}) => {
    const [text, setText] = useState('')
    const {userData} = useAppContext()

    const sendReply = async () => {
        try {
            const token = userData?.token
            const {data} = await axios.post("/api/product/comment/post-comment", {commentId, productId, text}, {headers: {Authorization: `Bearer ${token}`}})

            if(data.success) {
                toast.success(data.message)
                setText("")
                setIsReplying(false)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    return ( 
        <div className="w-screen h-max lg:w-[500px] space-y-5 bg-white rounded-t-xl lg:rounded-lg p-5 fixed bottom-0 lg:top-[50%] lg:-translate-y-[50%] left-0 right-0 lg:left-[50%] lg:-translate-x-[50%] z-50">
            <div className="flex items-center justify-between">
                <p>write a reply to this comment</p>
                <RxCross1 onClick={()=> setIsReplying(false)} className="hover:cursor-pointer" />
            </div>

            <textarea onChange={(e)=> setText(e.target.value)} value={text} placeholder="type..." className="border-[1px] w-[100%] h-[120px] border-gray-600/40 focus:outline-none resize-none px-5 py-2" />

            <button onClick={sendReply} className="bg-orange-500 text-white text-center px-5 py-2 block w-[100%]">Send reply</button>
        </div>
     );
}
 
export default Reply;