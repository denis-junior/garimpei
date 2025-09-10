import React from "react";
const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="leap-frog">
        <div className="leap-frog__dot"></div>
        <div className="leap-frog__dot"></div>
        <div className="leap-frog__dot"></div>
      </div>
    </div>
  );
};

export default Loader;
