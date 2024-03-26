import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from '../Firebase-config';
import Alert from 'react-bootstrap/Alert';
import "../styles/ResetPassword.css"

function ResetPassword() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const oobCode = params.get('oobCode');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if the oobCode is valid
    verifyPasswordResetCode(auth, oobCode)
      .then(() => {
        // Valid code, show the password reset form
      })
      .catch(() => {
        setError('Invalid or expired action code');
      });
  }, [oobCode]);

  const resetPassword = event => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    confirmPasswordReset(auth, oobCode, newPassword)
      .then(() => {
        setSuccess(true);
        window.location.href = "/";
      })
      .catch(() => {
        setError('Error resetting password');
      });
  };

  if (error === 'Invalid or expired action code') {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (error === 'Invalid or expired action code') {
    return <Alert variant="danger">{error}</Alert>;
  }
  
  if (success) {
    return (
      <div className="reset-success">
        <h1>Password Reset Successful</h1>
        <p>You can now log in with your new password.</p>
      </div>
    );
  }
  
  return (
    <div className="reset-container">
      <h1>Reset your Password</h1>
      <div className="reset-form-container">
        <form action="">
          {error && (
            <Alert variant="warning">{error}</Alert>
          )}
          <div className="reset-inputs">
            <label htmlFor="newPassword">
              New Password:
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              placeholder="Enter new password"
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <label htmlFor="confirmPassword">
              Confirm New Password:
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm new password"
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          <div className="reset-button">
            <button onClick={resetPassword}>
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}

export default ResetPassword;
