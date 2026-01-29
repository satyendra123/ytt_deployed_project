import React, { useState } from "react";
import Layout from "../Layout/Layout";
import Navbar from "../Dashboard/Navbar/Navbar";
import axios from "axios";
import boomStatic from "./SearchIcon/closebarrier.jpg"; // Default static image
import boomGif from "./SearchIcon/barriergif.gif"; // GIF animation

export const SearchCar = () => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [message1, setMessage1] = useState("Boom closed");
  const [message2, setMessage2] = useState("Boom closed");

  // Function to handle gate opening with GIF animation
  const openGate = async (gateNumber) => {
    try {
      if (gateNumber === 1) {
        setIsOpen1(true);
        setMessage1("Boom opened");
        setTimeout(() => {
          setIsOpen1(false);
          setMessage1("Boom closed");
        }, 10000);
      } else if (gateNumber === 2) {
        setIsOpen2(true);
        setMessage2("Boom opened");
        setTimeout(() => {
          setIsOpen2(false);
          setMessage2("Boom closed");
        }, 10000);
      }

      const endpoint = "http://192.168.1.128:8000/barrier_open/";
      const payload = { gate_number: gateNumber };
      await axios.post(endpoint, payload);
    } catch (error) {
      console.error("Error opening barrier:", error);
      alert("Error occurred while opening the barrier");
    }
  };

  return (
    <Layout>
      <Navbar data="Boom Barrier" />
      <div className="p-4 mt-5">
        <h1 className="font-semibold text-[24px] leading-[46.87px] text-center text-[#26272A] mb-2">
          Boom Barrier Controller
        </h1>

        {/* Gate control buttons */}
        <div className="flex justify-center items-center gap-10">
          {/* Gate 1 */}
          <div className="flex flex-col items-center">
            <div className="text-center font-semibold">Gate 1</div>
            <button
             type="button"
              className="text-white font-semibold rounded-lg"
              onClick={() => openGate(1)}
            >
              {/* Conditionally render static or GIF container for Gate 1 */}
              <div className="flex justify-center items-center w-full h-full md:w-[300px] md:h-[250px]">
                {isOpen1 ? (
                  // GIF inside the same container
                  <img
                    src={boomGif}
                    alt="Gate 1"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  // Static image inside the same container
                  <img
                    src={boomStatic}
                    alt="Gate 1"
                    className="object-contain w-full h-full"
                  />
                )}
              </div>
            </button>
            <p className="text-center">{message1}</p> {/* Adjusted margin-top */}
          </div>

          {/* Gate 2 */}
          <div className="flex flex-col items-center">
            <div className="text-center font-semibold">Gate 2</div>
            <button
              type="button"
              className="text-white font-semibold rounded-lg"
              onClick={() => openGate(2)}
            >
              {/* Conditionally render static or GIF container for Gate 2 */}
              <div className="flex justify-center items-center w-full h-full md:w-[300px] md:h-[250px]">
                {isOpen2 ? (
                  // GIF inside the same container
                  <img
                    src={boomGif}
                    alt="Gate 2"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  // Static image inside the same container
                  <img
                    src={boomStatic}
                    alt="Gate 2"
                    className="object-contain w-full h-full"
                  />
                )}
              </div>
            </button>
            <p className="text-center">{message2}</p> {/* Adjusted margin-top */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchCar;
