import React from "react";
import "./FullScreenSpinner.css";

interface FullScreenSpinnerProps {
  loading: boolean;
}

const FullScreenSpinner: React.FC<FullScreenSpinnerProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="spinner-overlay">
      <div className="spinner" />
    </div>
  );
};

export default FullScreenSpinner;
