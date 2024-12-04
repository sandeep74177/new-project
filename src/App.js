
import React, { useState, useEffect } from "react";

const PlaceholderIcon = "https://via.placeholder.com/38";
const ErrorIcon = "https://via.placeholder.com/38/FF0000/FFFFFF?text=Error";
const SpinnerIcon = "https://via.placeholder.com/38/CCCCCC/FFFFFF?text=Loading";

const ImageGallery = ({ name, count, images }) => {
  const [imageStatus, setImageStatus] = useState(
    images.map((img) => ({
      ...img,
      retries: 0,
      loading: !img.ready && !img.error,
    }))
  );

  useEffect(() => {
    const retryImageLoad = (index) => {
      if (imageStatus[index].retries >= 3) return; 

      const timer = setTimeout(() => {
        setImageStatus((prevStatus) =>
          prevStatus.map((img, i) =>
            i === index
              ? {
                  ...img,
                  retries: img.retries + 1,
                  error: Math.random() < 0.5, 
                  loading: false,
                  ready: Math.random() > 0.5, 
                }
              : img
          )
        );
      }, 5000);

      return () => clearTimeout(timer); 
    };

    imageStatus.forEach((img, index) => {
      if (img.loading) retryImageLoad(index);
    });
  }, [imageStatus]);

  const renderImage = (img, index) => {
    if (img.loading) {
      return <img src={SpinnerIcon} alt="Loading" />;
    }
    if (img.error) {
      return <img src={ErrorIcon} alt="Error" />;
    }
    if (img.ready) {
      return <img src={img.url} alt={`Image ${index + 1}`} />;
    }
    return <img src={PlaceholderIcon} alt="Placeholder" />;
  };

  const renderTooltip = (img) => {
    if (img.loading) return "Loading...";
    if (img.error) return `Error occurred. Retries: ${img.retries}`;
    if (img.ready) return "Image loaded successfully";
    return "Placeholder";
  };

  return (
    <div className="gallery-container">
      <div className="content">
        <div className="gallery">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="gallery-item"
              title={renderTooltip(imageStatus[i] || {})}
            >
              {renderImage(imageStatus[i] || {}, i)}
            </div>
          ))}
        </div>
        <div className="text">
          <h2>{name}</h2>
          <p>3+ offline centers</p>
        </div>
      </div>
    </div>
  );
};

const images = [
  { url: "https://via.placeholder.com/38/0000FF", ready: true, error: false },
  { url: "https://via.placeholder.com/38/008000", ready: false, error: true },
  { url: "https://via.placeholder.com/38/FFA500", ready: true, error: false },
];

export default function App() {
  return <ImageGallery name="Explorin Academy" count={4} images={images} />;
}
