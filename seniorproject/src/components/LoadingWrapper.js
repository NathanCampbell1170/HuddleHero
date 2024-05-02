import { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { useLocation } from "react-router-dom"; // Import useLocation

function LoadingWrapper({ children }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // Get the current location

  useEffect(() => {
    setLoading(true); // Set loading to true when the location changes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location]); // Add location dependency here

  if (loading) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  } else {
    return children;
  }
}

export default LoadingWrapper;
