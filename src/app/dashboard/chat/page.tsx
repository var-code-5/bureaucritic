'use client';
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

// Define TypeScript interfaces for better type safety
interface FormField {
  [key: string]: string | null;
}

interface FormStruct {
  formId: number;
  formTitle: string;
  formDescription: string;
  [key: string]: string | number | null;
}

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

interface ApiResponse {
  generation: string;
  form_struct?: FormStruct;
  user_id: number;
}

function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [formData, setFormData] = useState<FormStruct | null>(null);
  const [formValues, setFormValues] = useState<FormField>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, formData]);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Use environment variable for the API endpoint and token
      const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || 
        "https://57a3-2401-4900-60d7-93d7-e1cb-944d-4a73-713e.ngrok-free.app/ml/query";
      const apiToken = process.env.NEXT_PUBLIC_API_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRtdG9zYXJ2ZXNoQGdtYWlsLmNvbSIsImlkIjoxLCJicm93c2VyIjoiUG9zdG1hblJ1bnRpbWUvNy40My4wIiwidmVyc2lvbiI6MywiaWF0IjoxNzQyNzI5MzQ3LCJleHAiOjE3NDI5ODg1NDd9.N6KpKRcFj2Z11gjliuqNlKeW5MifUe1Ln9sFzk4n2v8";
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          query: input,
          user_id: 1,
        }),
      });

      if (response.ok) {
        // For development, uncomment the next line to test with dummy data
        // const data: ApiResponse = {
        //   "generation": "Here is the application form XIV:\n\n\"In accordance with section 45 of the Copyright Act, 1957 (14 of 1957), I hereby apply for registration of copyright and request that entries may be made in the Register of Copyrights.\"\n\nPlease note that this is a generic template and you may need to provide additional information and details as required by the specific application process.",
        //   "form_struct": {
        //     "formId": 1,
        //     "formTitle": "FORM XIV - APPLICATION FOR REGISTRATION OF COPYRIGHT [SEE RULE 70]",
        //     "formDescription": "\n    FORM XIV - APPLICATION FOR REGISTRATION OF COPYRIGHT\n    For applying to the Registrar of Copyrights, Copyright Office, New Delhi\n    for registration of copyright in accordance with section 45 of the Copyright Act, 1957 (14 of 1957).\n  ",
        //     "name": "Admin",
        //     "address": "",
        //     "nationality": "",
        //     "category": "",
        //     "work_title": "",
        //     "work_description": "",
        //     "work_class": "",
        //     "work_language": "",
        //     "author_name": "",
        //     "author_address": "",
        //     "publication_status": "",
        //     "publisher_details": "",
        //     "publication_year": "",
        //     "fee_payment_details": "",
        //     "declaration": "",
        //     "work_sample": ""
        //   },
        //   "user_id": 1
        // };
        
        const data: ApiResponse = await response.json();
        console.log(data);
        
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.generation || "I'm just a bot, but I'm here to help!", sender: "bot" },
        ]);
        
        if (data.form_struct) {
          // Initialize form values from the form structure
          const formMetaFields = ["formId", "formTitle", "formDescription"];
          
          // Convert the form_struct to a properly typed FormStruct
          const typedFormStruct = data.form_struct as FormStruct;
          setFormData(typedFormStruct);
          
          // Initialize form values with empty strings for each field
          const initialFormValues: FormField = {};
          
          Object.entries(typedFormStruct).forEach(([key, value]) => {
            if (!formMetaFields.includes(key)) {
              initialFormValues[key] = typeof value === 'string' ? value : '';
            }
          });
          
          setFormValues(initialFormValues);
        }
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Something went wrong. Please try again.", sender: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error connecting to the server.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Form Data:", formValues);
    
    // Add submission confirmation message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: "Form submitted successfully!", sender: "bot" },
    ]);
    
    // Clear form after submission
    setFormData(null);
    setFormValues({});
  };

  return (
    <div className="min-w-full h-screen bg-foreground flex items-end p-12 text-background">
      {/* Sidebar */}
      <div className="w-[20%] h-[90%]">
        <div className="w-full h-[40%] flex justify-between flex-col pb-12">
          <h1 className="text-6xl font-bold font-inter">Dashboard</h1>
          <p className="font-roboto-mono text-2xl">Chat with our bot.</p>
        </div>
        <div className="w-full h-[60%] border-y-2 border-l-2 border-background">
          <h3 className="text-4xl font-bold text-left pl-2 border-2 border-background py-2">
            Recent forms
          </h3>
          <p className="text-3xl text-left pl-2 border-2 border-background py-2 cursor-pointer">
            Form 1
          </p>
          <p className="text-3xl text-left pl-2 border-2 border-background py-2 cursor-pointer">
            Form 2
          </p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-[80%] h-[90%] border-2 border-background flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[60%] px-4 py-2 my-2 ${
                msg.sender === "user"
                  ? "bg-primary text-background self-end text-right rounded-lg rounded-tr-none" 
                  : "bg-background text-foreground self-start text-left rounded-lg rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="max-w-[60%] px-4 py-2 my-2 bg-background text-foreground self-start text-left rounded-lg rounded-tl-none">
              <span className="inline-block animate-pulse">Typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Render Form if Available */}
        {formData && (
          <div className="p-4 border-t-2 border-background bg-white text-black">
            <h2 className="text-2xl font-bold">{formData.formTitle || "Form"}</h2>
            <p className="text-sm text-gray-500 whitespace-pre-line">{formData.formDescription || "Please fill out this form"}</p>
            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              {Object.entries(formData)
                .filter(([key]) => !["formId", "formTitle", "formDescription"].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <label htmlFor={key} className="font-semibold capitalize">{key.replace(/_/g, " ")}</label>
                    {key === "work_description" || key === "declaration" ? (
                      <textarea
                        id={key}
                        value={formValues[key] || ""}
                        onChange={(e) => setFormValues(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={typeof value === 'string' ? value : ""}
                        className="border-2 border-gray-300 rounded-md p-2 min-h-24"
                      />
                    ) : (
                      <input
                        type="text"
                        id={key}
                        value={formValues[key] || ""}
                        onChange={(e) => handleInputChange(e, key)}
                        placeholder={typeof value === 'string' ? value : ""}
                        className="border-2 border-gray-300 rounded-md p-2"
                      />
                    )}
                  </div>
                ))}
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(null);
                    setFormValues({});
                  }}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Input Field */}
        <div className="p-4 flex items-center relative w-full">
          <input
            type="text"
            className="flex-1 p-4 text-black bg-white rounded-lg outline-none w-[90%]"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={isLoading}
          />
          <button 
            className="absolute right-8 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:opacity-90 disabled:opacity-50"
            onClick={handleSend}
            disabled={isLoading || input.trim() === ""}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;