import React, { useState, useRef } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';


// Import all images from a folder
const images = require.context('../Images/HuddleHeroes', true, /\.jpe?g$/);
const imageList = images.keys().map(image => images(image));

// MyHuddleHero component
const MyHuddleHero = ({ imageSrc = imageList[Math.floor(Math.random() * imageList.length)], children }) => {
  const [show, setShow] = useState(false);
  const overlayRef = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Image that triggers the popup */}
      <img
        className="myHuddleHero-icon"
        src={imageSrc}
        alt="MyHuddleHero Image"
        onClick={handleShow}
        style={{ cursor: 'pointer' }}
      />

      {/* Offcanvas component */}
      <Offcanvas show={show} onHide={handleClose} backdrop={false}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>MyHuddleHero</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Content of the popup */}
          {children}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Allows the offcanvas element to close automatically when the user clicks back into a league modal behind it */}
      {show && <div ref={overlayRef} onClick={handleClose} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1040, // Same as the offcanvas
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent
      }} />}
    </>
  );
};

export default MyHuddleHero;
