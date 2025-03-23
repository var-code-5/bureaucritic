'use client'
import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    setEmailError('');
    setPasswordError('');
    
    let isValid = true;
    
    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      isValid = false;
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }
    
    if (isValid) {
      console.log({ email, password });
      // Handle login logic here
    }
  };

  return (
    <div className="min-w-full min-h-screen bg-foreground flex items-center justify-center text-background">
      <div className="w-1/2 flex flex-col items-center">
        <h1 className="text-5xl font-bold">Sign in</h1>
        <form
          className="flex flex-col gap-4 mt-16 w-[70%]"
          onSubmit={handleSubmit}
        >
          <input
            className="bg-background text-foreground w-full h-12 px-4"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && (
            <span className="text-background text-sm">{emailError}</span>
          )}
          <input
            className="bg-background text-foreground w-full h-12 px-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
            <span className="text-background text-sm">{passwordError}</span>
          )}
          <button
            type="submit"
            className="bg-foreground text-primary border-2 border-primary w-1/3 h-12 mx-auto text-2xl font-bold font-inter cursor-pointer"
          >
            Begin
          </button>
        </form>
      </div>
    </div>
  );
}