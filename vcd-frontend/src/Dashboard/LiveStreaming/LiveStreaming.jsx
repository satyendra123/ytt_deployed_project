import Entry from '../DashboardImages/Frame14.png'
import Exit from '../DashboardImages/Frame15.png'
import TotalVehicle from '../DashboardImages/Frame16.png'
import CarVideo from '../DashboardImages/CarVideo.png'
import Registration from '../DashboardImages/Frame17.png'
const LiveStreaming = ({x}) =>{

    const gate1 = x?.gate1 || {};
    const gate2 = x?.gate2 || {};
    const gate3 = x?.gate3 || {};

    return (

        <div>
            <div className="flex justify-around">
            <h1 className="font-semibold">Gate-1</h1>
            <h1 className="font-semibold">Gate-2</h1>
            <h1 className="font-semibold">Gate-3</h1>
            </div>
             <div className="flex justify-between">
                    {/* Left Section */}
                    <div className="sm:col-span-5 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="shadow-md p-4 flex flex-col justify-center items-center rounded-lg gap-3" style={{ backgroundColor: '#A162F7' }}>
                            <img src={Entry} alt="Entry" className="rounded-full shadow-lg h-[50px] w-[50px]" />
                            <h2 className="text-white font-semibold text-[18.64px] leading-[24.27px]">Entry</h2>   
                            <h2 className="text-white font-semibold text-[18.64px] leading-[24.27px]">{gate1.total_entry||0}</h2>  
                        </div>

                        <div className="bg-white shadow-md p-4 flex flex-col justify-center items-center rounded-lg gap-3">
                            <img src={Exit} alt="Exit" className="rounded-full shadow-lg h-[50px] w-[50px]" />
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">Exit</h2>
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">{gate1.total_exit||0}</h2>      
                        </div>

                        <div className="bg-white shadow-md p-4 flex flex-col justify-center items-center rounded-lg gap-3">
                            <img src={TotalVehicle} alt="Total Vehicle" className="rounded-full shadow-lg h-[50px] w-[50px]" />
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">Vehicle Inside</h2>
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">{gate1.vehicles_inside||0}</h2>    
                        </div>

                        <div className="bg-white shadow-md p-4 flex flex-col justify-center items-center rounded-lg gap-3">
                            <img src={Registration} alt="Registration" className="rounded-full shadow-lg h-[50px] w-[50px]" />
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">Barrier Opened</h2>
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">{gate1.barrier_open_count||0}</h2>  
                        </div>
                    </div>

                    {/* Live streaming video Section */}
                    <div className="sm:col-span-5 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="shadow-md p-4 flex flex-col justify-center items-center rounded-lg gap-3" style={{ backgroundColor: '#A162F7' }}>
                            <img src={Entry} alt="Entry" className="rounded-full shadow-lg h-[50px] w-[50px]" />
                            <h2 className="text-white font-semibold text-[18.64px] leading-[24.27px]">Entry</h2>   
                            <h2 className="text-white font-semibold text-[18.64px] leading-[24.27px]">{gate2.total_entry||0}</h2>  
                        </div>

                        <div className="bg-white shadow-md p-4 flex flex-col justify-center items-center rounded-lg gap-3">
                            <img src={Exit} alt="Exit" className="rounded-full shadow-lg h-[50px] w-[50px]" />
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">Exit</h2>
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">{gate2.total_exit||0}</h2>      
                        </div>

                        <div className="bg-white shadow-md p-4 flex flex-col justify-center items-center rounded-lg gap-3">
                            <img src={TotalVehicle} alt="Total Vehicle" className="rounded-full shadow-lg h-[50px] w-[50px]" />
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">Vehicle Inside</h2>
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">{gate2.vehicles_inside||0}</h2>    
                        </div>

                        <div className="bg-white shadow-md p-4 flex flex-col justify-center items-center rounded-lg gap-3">
                            <img src={Registration} alt="Registration" className="rounded-full shadow-lg h-[50px] w-[50px]" />
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">Barrier Opened</h2>
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">{gate2.barrier_open_count||0}</h2>  
                        </div>
                    </div>

                    <div className="sm:col-span-5 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="shadow-md p-4 flex flex-col justify-center items-center rounded-lg gap-3" style={{ backgroundColor: '#A162F7' }}>
                            <img src={Entry} alt="Entry" className="rounded-full shadow-lg h-[50px] w-[50px]" />
                            <h2 className="text-white font-semibold text-[18.64px] leading-[24.27px]">Entry</h2>   
                            <h2 className="text-white font-semibold text-[18.64px] leading-[24.27px]">{gate3.total_entry||0}</h2>  
                        </div>

                        <div className="bg-white shadow-md p-4 flex flex-col justify-center items-center rounded-lg gap-3">
                            <img src={Exit} alt="Exit" className="rounded-full shadow-lg h-[50px] w-[50px]" />
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">Exit</h2>
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">{gate3.total_exit||0}</h2>      
                        </div>

                        <div className="bg-white shadow-md p-4 flex flex-col justify-center items-center rounded-lg gap-3">
                            <img src={TotalVehicle} alt="Total Vehicle" className="rounded-full shadow-lg h-[50px] w-[50px]" />
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">Vehicle Inside</h2>
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">{gate3.vehicles_inside||0}</h2>    
                        </div>

                        <div className="bg-white shadow-md p-4 flex flex-col justify-center items-center rounded-lg gap-3">
                            <img src={Registration} alt="Registration" className="rounded-full shadow-lg h-[50px] w-[50px]" />
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">Barrier Opened</h2>
                            <h2 className="font-semibold text-[18.64px] leading-[24.27px]">{gate3.barrier_open_count||0}</h2>  
                        </div>
                    </div> 
                </div>

        </div>
    )
}

export default LiveStreaming