import { RxCross1 } from "react-icons/rx";


const Filter = ({category, setCategory, price, setPrice, rate, setRate, setIsSearching}) => {
    

    return ( 

        <div className="absolute md:top-10 top-20 text-black z-10 space-y-2 w-[320px] p-5 rounded-b-xl bg-gray-200">
            <RxCross1 onClick={()=> setIsSearching(false)} className="float-right hover:cursor-pointer" />

            <div>
                <p>Category</p>
                <select
                id="category"
                className="outline-none py-1.5 px-3 rounded border border-gray-500/40"
                onChange={(e) => setCategory(e.target.value)}
                defaultValue={category}
                >
                    <option value=""></option>
                    <option value="Earphone">Earphone</option>
                    <option value="Headphone">Headphone</option>
                    <option value="Watch">Watch</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Camera">Camera</option>
                    <option value="Accessories">Accessories</option>
                </select>
            </div>

            <div>
                <p>Maximum price</p>
                <input type="number" className="outline-none py-1.5 px-3 rounded border border-gray-500/40" onChange={(e)=> setPrice(e.target.value)} value={price}  />
            </div>

            <div>
                <p>Minimum Rate</p>
                <input onChange={(e)=> setRate(e.target.value)} value={rate} className="outline-none py-1.5 px-3 rounded border border-gray-500/40" type="number" />
            </div>
        </div>
     );
}
 
export default Filter;