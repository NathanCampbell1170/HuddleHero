import React, { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';

// MyHuddleHero component
const MyHuddleHero = ({ imageSrc, children }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Image that triggers the popup */}
      <img
        src={imageSrc}
        alt="MyHuddleHero Image"
        onClick={handleShow}
        style={{ cursor: 'pointer' }}
      />

      {/* Offcanvas component */}
      <Offcanvas show={show} onHide={handleClose} scroll ={true} backdrop={true}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>MyHuddleHero</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Content of the popup */}
          {children}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MyHuddleHero;
