'use client';
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (formData) {
      setIsModalOpen(true);
    }
  }, [formData]);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    field: string
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Form Data:", formValues);

    try {
      // Use environment variable for the API endpoint and token
      const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || 
        "https://57a3-2401-4900-60d7-93d7-e1cb-944d-4a73-713e.ngrok-free.app/ml/submit-form-ai";
      const apiToken = process.env.NEXT_PUBLIC_API_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRtdG9zYXJ2ZXNoQGdtYWlsLmNvbSIsImlkIjoxLCJicm93c2VyIjoiUG9zdG1hblJ1bnRpbWUvNy40My4wIiwidmVyc2lvbiI6MywiaWF0IjoxNzQyNzI5MzQ3LCJleHAiOjE3NDI5ODg1NDd9.N6KpKRcFj2Z11gjliuqNlKeW5MifUe1Ln9sFzk4n2v8";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          form_struct: { ...formData, ...formValues },
          user_id: 1
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Form submission response:", data);

        // Add submission confirmation message
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Form submitted successfully!", sender: "bot" },
        ]);
        
        // Close the modal after successful submission
        closeModal();
      } else {
        console.error("Failed to submit form:", response.statusText);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Failed to submit the form. Please try again.", sender: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error submitting the form. Please try again later.", sender: "bot" },
      ]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
                  ? "bg-primary text-foreground self-end text-right rounded-lg rounded-tr-none" 
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

      {/* Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-4xl font-inter">
          <DialogHeader>
            <DialogTitle className="text-4xl">{formData?.formTitle || "Form"}</DialogTitle>
            <DialogDescription className="whitespace-pre-line">
              {formData?.formDescription || "Please fill out this form"}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
              {formData && 
                Object.entries(formData)
                  .filter(([key]) => !["formId", "formTitle", "formDescription"].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="grid gap-2">
                      <Label htmlFor={key} className="font-semibold capitalize">
                        {key.replace(/_/g, " ")}
                      </Label>
                      {key === "work_description" || key === "declaration" ? (
                        <Textarea
                          id={key}
                          value={formValues[key] || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(e, key)}
                          placeholder={typeof value === 'string' ? value : ""}
                          className="min-h-24"
                        />
                      ) : (
                        <Input
                          type="text"
                          id={key}
                          value={formValues[key] || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(e, key)}
                          placeholder={typeof value === 'string' ? value : ""}
                        />
                      )}
                    </div>
                  ))
              }
            </form>
          </ScrollArea>
          
          <DialogFooter className="sm:justify-between">
            <Button variant="destructive" type="button" onClick={closeModal} className="bg-foreground">
              Cancel
            </Button>
            <Button type="submit" onClick={handleFormSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Chat;