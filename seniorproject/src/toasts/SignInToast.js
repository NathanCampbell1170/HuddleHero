import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';

function SignInToast() {
  const [show, setShow] = useState(true);

  const toggleShow = () => setShow(!show);

  

  return (
    <>
      
      <Toast show={show} onClose={toggleShow} style={{ position: 'fixed', top: 0, right: 0 }}>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
      </Toast>

      
      
    </>
  );
}

export default SignInToast;
