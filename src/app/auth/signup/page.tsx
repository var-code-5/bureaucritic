"use client";
import React, { useState } from "react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [website, setWebsite] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Add state to control which step is visible
  const [currentStep, setCurrentStep] = useState(0);
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    }

    if (isValid) {
      console.log({ name, email, password, accountType, organisation, website });
      // Submit form data to server here
      // alert("Form submitted successfully!");
      window.location.href = "/dashboard/metrics";
    }
  };
  
  // Move to the next step if validation passes
  const goToNextStep = () => {
    let canProceed = true;
    
    // Validate current step
    if (currentStep === 0 && !name.trim()) {
      canProceed = false;
      alert("Please enter your name");
    } else if (currentStep === 1 && !accountType) {
      canProceed = false;
      alert("Please select an account type");
    } else if (currentStep === 2 && accountType === "admin" && !organisation.trim()) {
      canProceed = false;
      alert("Please enter your organization name");
    } else if (currentStep === 3 && accountType === "admin" && !website.trim()) {
      canProceed = false;
      alert("Please enter your organization website");
    } else if (currentStep === 4) {
      // Validate email and password
      setEmailError("");
      setPasswordError("");
      
      if (!validateEmail(email)) {
        setEmailError("Invalid email address");
        canProceed = false;
      }
      
      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters long");
        canProceed = false;
      }
      
      if (canProceed) {
        handleSubmit({ preventDefault: () => {} });
      }
    }
    
    if (canProceed && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Move to the previous step
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Determine if we should show organization and website steps based on account type
  const totalSteps = accountType === "admin" ? 5 : 3;
  
  // Get the actual step number for display
  const getDisplayStep = () => {
    if (accountType === "admin") {
      return currentStep + 1;
    } else if (accountType === "user" && currentStep > 1) {
      return currentStep - 1; // Skip org and website steps
    } else {
      return currentStep + 1;
    }
  };
  
  // Skip organization and website steps if the user is not an admin
  const shouldSkipStep = (step: number) => {
    return accountType === "user" && (step === 2 || step === 3);
  };
  
  // Adjust next button text based on current step
  const getNextButtonText = () => {
    return currentStep === 4 ? "Submit" : "Next";
  };

  return (
    <div className="relative w-full min-h-screen bg-foreground text-background font-inter flex items-center justify-center">
      {/* Step 1: Name */}
      <div className={`min-w-[40%] min-h-[60%] flex flex-col gap-20 ${currentStep === 0 ? "block" : "hidden"}`}>
        <h1 className="text-5xl text-center font-bold">
          Welcome! What's Your Name?
        </h1>
        <input
          className="bg-background text-foreground w-full h-12 px-4"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Step 2: Account Type */}
      <div className={`min-w-[40%] min-h-[60%] flex flex-col gap-20 ${currentStep === 1 ? "block" : "hidden"}`}>
        <h1 className="text-5xl text-center font-bold">
          Who are you representing?
        </h1>
        <div>
          <p
            className={`bg-background text-foreground w-full h-12 px-4 text-2xl text-center p-2 font-bold mb-8 ${
              accountType === "user"
                ? "text-foreground bg-primary"
                : ""
            }`}
            onClick={() => setAccountType(accountType === "user" ? "" : "user")}
          >
            User
          </p>
          <p
            className={`bg-background text-foreground w-full h-12 px-4 text-2xl text-center p-2 font-bold ${
              accountType === "admin"
                ? "text-foreground bg-primary "
                : ""
            }`}
            onClick={() =>
              setAccountType(accountType === "admin" ? "" : "admin")
            }
          >
            Admin
          </p>
        </div>
      </div>

      {/* Step 3: Organisation (Only for Admin) */}
      <div className={`min-w-[40%] min-h-[60%] flex flex-col gap-20 ${currentStep === 2 ? "block" : "hidden"}`}>
        <h1 className="text-5xl text-center font-bold">
          What is the Organization&apos;s called?
        </h1>
        <input
          className="bg-background text-foreground w-full h-12 px-4"
          type="text"
          placeholder="Organization"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
        />
      </div>

      {/* Step 4: Website (Only for Admin) */}
      <div className={`min-w-[40%] min-h-[60%] flex flex-col gap-20 ${currentStep === 3 ? "block" : "hidden"}`}>
        <h1 className="text-5xl text-center font-bold">
          Does the organization have a website?
        </h1>
        <input
          className="bg-background text-foreground w-full h-12 px-4"
          type="text"
          placeholder="www.website.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {/* Step 5: Login Details */}
      <div className={`min-w-[40%] min-h-[60%] flex flex-col gap-20 ${currentStep === 4 ? "block" : "hidden"}`}>
        <h1 className="text-5xl text-center font-bold">
          What are your login details?
        </h1>
        <div>
          <input
            className="bg-background text-foreground w-full h-12 px-4 mb-2"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && (
            <span className="text-red-500 text-sm block mb-4">{emailError}</span>
          )}
          <input
            className="bg-background text-foreground w-full h-12 px-4 mb-2 mt-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
            <span className="text-red-500 text-sm block">{passwordError}</span>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <p className="absolute bottom-8">
        {getDisplayStep()}/5
      </p>

      {/* Navigation buttons */}
      {currentStep > 0 && (
        <button
          type="button"
          onClick={goToPrevStep}
          className="absolute bottom-8 left-8 bg-foreground text-primary border-2 border-primary w-36 h-12 mx-auto text-2xl font-bold font-inter cursor-pointer"
        >
          Previous
        </button>
      )}

      <button
        type="button"
        onClick={goToNextStep}
        className="absolute bottom-8 right-8 bg-foreground text-primary border-2 border-primary w-36 h-12 mx-auto text-2xl font-bold font-inter cursor-pointer"
      >
        {getNextButtonText()}
      </button>
    </div>
  );
}