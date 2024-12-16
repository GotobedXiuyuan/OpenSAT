import React, { useState } from 'react';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState(null);
  const [step, setStep] = useState(1);

  const userTypes = [
    { type: 'student', label: 'Student'},
    { type: 'parent', label: 'Parent'},
    { type: 'tutor', label: 'Tutor'}
  ];

  const handleNextStep = () => {
    if (step === 1 && email && password && password === confirmPassword) {
      setStep(2);
    }
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  return (
    <div style={{
      backgroundColor: '#6a11cb',
      background: 'linear-gradient(to right, #2575fc, #6a11cb)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '15px',
        padding: '30px',
        width: '400px',
        textAlign: 'center',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}>
        {step === 1 && (
          <>
            <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>
              Create Your Account
            </h1>
            
            <input 
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '5px',
                color: 'white'
              }}
            />
            
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '5px',
                color: 'white'
              }}
            />
            
            <input 
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '5px',
                color: 'white'
              }}
            />
            
            <button 
              onClick={handleNextStep}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Next
            </button>
          </>
        )}
        
        {step === 2 && (
          <>
            <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>
              Select Your Role
            </h1>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              {userTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => handleUserTypeSelect(type.type)}
                  style={{
                    flex: 1,
                    margin: '0 10px',
                    padding: '20px',
                    backgroundColor: userType === type.type 
                      ? 'rgba(255,255,255,0.3)' 
                      : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '40px', marginBottom: '10px' }}>
                    {type.icon}
                  </span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
            
            {userType && (
              <button 
                onClick={() => {}}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '20px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Create Account
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;