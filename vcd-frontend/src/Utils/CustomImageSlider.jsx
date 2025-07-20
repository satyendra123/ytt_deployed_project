
import React, { useState } from 'react';

function CustomImageSlider() {
  const images = [
    "https://via.placeholder.com/600x400?text=Image+1",
    "https://via.placeholder.com/600x400?text=Image+2",
    "https://via.placeholder.com/600x400?text=Image+3"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % images.length;
      console.log('Next Index:', newIndex);  // Debugging line
      return newIndex;
    });
  };
  
  const prevImage = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + images.length) % images.length;
      console.log('Previous Index:', newIndex);  // Debugging line
      return newIndex;
    });
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-64 object-cover rounded-lg"
      />
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
      >
        &#10094;
      </button>
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
      >
        &#10095;
      </button>
    </div>
  );
}

export default CustomImageSlider;
