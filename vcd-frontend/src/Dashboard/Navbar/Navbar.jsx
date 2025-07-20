import {useState} from 'react'
import deleteIcon from './NavbarImages/delete.png'
const Navbar = ({data}) =>{
    const [menuOpen, setMenuOpen] = useState(false)

    const handleclick = () =>{
        setMenuOpen(!menuOpen)
    }

    return (

        <div>
            <nav
                className="flex justify-between items-center px-4 py-4 shadow-md" style={{ backgroundColor: '#FFFFFF' }}
            >
                <div>
                    <h1 className="text-lg font-bold">{data}</h1>
                </div>
                <div classname="relative">
                    <img src="./profile.png" alt="Profile" className="h-10 w-10 rounded-full"onClick={handleclick}/>
                </div>

                {menuOpen && (
              <div className="absolute right-2 top-[70px] w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="flex pl-2">
              <img src={deleteIcon} alt="" className=" mt-2 h-5 w-5" />
              <p className="px-4 py-2 text-gray-700">Satyendra</p>
              </div>
              <hr />
              <div className="flex pl-2">
              <img src={deleteIcon} alt="" className=" mt-2 h-5 w-5" />
              <p className="px-4 py-2 text-gray-700">Logout</p>
              </div>
            </div>
              )}

            </nav>
        </div>
    )
}

export default Navbar