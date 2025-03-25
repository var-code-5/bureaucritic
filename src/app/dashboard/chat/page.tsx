"use client";
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

interface FieldValidations {
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
  options?: string[];
  maxSize?: number;
  fileTypes?: string[];
  customMessage?: string;
}

interface FormField {
  id: number;
  label: string;
  description: string;
  type: string; // "TEXT", "TEXTAREA", "SELECT", "CHECKBOX", "FILE", "NUMBER"
  required: boolean;
  validations: FieldValidations;
  order: number;
  value: string;
}

interface Form {
  id: number;
  title: string;
  description: string;
  fields: FormField[];
}

interface ChatMessage {
  text: string;
  sender: "user" | "bot";
  formLink?: boolean;
}

interface ChatApiResponse {
  type: "chat";
  message: string;
  user_id?: number;
}

interface FormApiResponse {
  type: "form";
  form: Form;
  message: string;
  user_id?: number;
}

interface FormValues {
  [key: string]: string;
}

type ApiResponse = ChatApiResponse | FormApiResponse;

function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [formData, setFormData] = useState<Form | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

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

    const newMessages: ChatMessage[] = [
      ...messages,
      { text: input, sender: "user" },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Use environment variable for the API endpoint and token
      const apiEndpoint =
        process.env.NEXT_PUBLIC_API_ENDPOINT ||
        "http://localhost:4000/ml/query";
      const apiToken =
        process.env.NEXT_PUBLIC_API_TOKEN ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRtdG9zYXJ2ZXNoQGdtYWlsLmNvbSIsImlkIjoxLCJicm93c2VyIjoiUG9zdG1hblJ1bnRpbWUvNy40My4wIiwidmVyc2lvbiI6MywiaWF0IjoxNzQyNzI5MzQ3LCJleHAiOjE3NDI5ODg1NDd9.N6KpKRcFj2Z11gjliuqNlKeW5MifUe1Ln9sFzk4n2v8";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          query: input,
        }),
      });

      if (response.ok) {
        const data: ApiResponse = await response.json();
        console.log(data);

        if (data.type === "chat") {
          // Handle chat response
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: data.message || "I'm just a bot, but I'm here to help!",
              sender: "bot",
            },
          ]);
        } else if (data.type === "form") {
          // Handle form response
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: data.message || "I'm just a bot, but I'm here to help!",
              sender: "bot",
            },
            {
              text: "Open Form",
              sender: "bot",
              formLink: true,
            },
          ]);

          // Process form data
          if (data.form) {
            setFormData(data.form);

            // Initialize form values from the fields
            const initialFormValues: FormValues = {};

            data.form.fields.forEach((field) => {
              initialFormValues[field.label] = field.value || "";
            });

            setFormValues(initialFormValues);
          }
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

  const FormLink = ({ onClick }: { onClick: () => void }) => {
    return (
      <Button
        variant="link"
        className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 hover:underline"
        onClick={onClick}
      >
        Open Form
      </Button>
    );
  };
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: string
  ) => {
    const newValue = e.target.value;
    setFormValues((prev) => ({ ...prev, [field]: newValue }));

    // Validate this field immediately if we've already attempted to submit
    if (attemptedSubmit) {
      validateField(field, newValue);
    }
  };

  const validateField = (fieldName: string, value: string) => {
    if (!formData) return;

    const field = formData.fields.find((f) => f.label === fieldName);
    if (!field) return;

    let errorMessage = "";

    if (field.required && !value) {
      errorMessage = "This field is required";
    } else if (field.type === "TEXT" || field.type === "TEXTAREA") {
      if (
        field.validations?.minLength &&
        value.length < field.validations.minLength
      ) {
        errorMessage = `Minimum length is ${field.validations.minLength} characters`;
      } else if (
        field.validations?.maxLength &&
        value.length > field.validations.maxLength
      ) {
        errorMessage = `Maximum length is ${field.validations.maxLength} characters`;
      }
    } else if (field.type === "NUMBER") {
      const numValue = Number(value);
      if (field.validations?.min && numValue < field.validations.min) {
        errorMessage = `Minimum value is ${field.validations.min}`;
      } else if (field.validations?.max && numValue > field.validations.max) {
        errorMessage = `Maximum value is ${field.validations.max}`;
      }
    } else if (field.type === "FILE") {
      // File validation would need more work with actual file objects
      if (!value && field.required) {
        errorMessage = "Please select a file";
      }
    } else if (field.type === "SELECT" && field.required && !value) {
      errorMessage = "Please select an option";
    } else if (
      field.type === "CHECKBOX" &&
      field.required &&
      value !== "true"
    ) {
      errorMessage = "This checkbox is required";
    }

    setFormErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData) return false;

    let isValid = true;
    const errors: Record<string, string> = {};

    formData.fields.forEach((field) => {
      const value = formValues[field.label] || "";

      if (field.required && !value) {
        isValid = false;
        errors[field.label] = "This field is required";
      } else if (field.type === "TEXT" || field.type === "TEXTAREA") {
        if (
          field.validations?.minLength &&
          value.length < field.validations.minLength
        ) {
          isValid = false;
          errors[
            field.label
          ] = `Minimum length is ${field.validations.minLength} characters`;
        } else if (
          field.validations?.maxLength &&
          value.length > field.validations.maxLength
        ) {
          isValid = false;
          errors[
            field.label
          ] = `Maximum length is ${field.validations.maxLength} characters`;
        }
      } else if (field.type === "NUMBER") {
        const numValue = Number(value);
        if (
          value &&
          field.validations?.min &&
          numValue < field.validations.min
        ) {
          isValid = false;
          errors[field.label] = `Minimum value is ${field.validations.min}`;
        } else if (
          value &&
          field.validations?.max &&
          numValue > field.validations.max
        ) {
          isValid = false;
          errors[field.label] = `Maximum value is ${field.validations.max}`;
        }
      } else if (field.type === "SELECT" && field.required && !value) {
        isValid = false;
        errors[field.label] = "Please select an option";
      } else if (
        field.type === "CHECKBOX" &&
        field.required &&
        value !== "true"
      ) {
        isValid = false;
        errors[field.label] = "This checkbox is required";
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!validateForm()) {
      // Scroll to the first error field
      const firstErrorField = document.querySelector(".border-red-500");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    console.log("Submitted Form Data:", formValues);

    try {
      // Use environment variable for the API endpoint and token
      const apiEndpoint =
        process.env.NEXT_PUBLIC_API_ENDPOINT ||
        "http://localhost:4000/ml/submit-form-ai";
      const apiToken =
        process.env.NEXT_PUBLIC_API_TOKEN ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRtdG9zYXJ2ZXNoQGdtYWlsLmNvbSIsImlkIjoxLCJicm93c2VyIjoiUG9zdG1hblJ1bnRpbWUvNy40My4wIiwidmVyc2lvbiI6MywiaWF0IjoxNzQyNzI5MzQ3LCJleHAiOjE3NDI5ODg1NDd9.N6KpKRcFj2Z11gjliuqNlKeW5MifUe1Ln9sFzk4n2v8";

      // Prepare fields with values for submission
      const fieldsWithValues = formData?.fields.map((field) => ({
        ...field,
        value: formValues[field.label] || "",
      }));

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          form_id: formData?.id,
          fields: fieldsWithValues,
          user_id: 1,
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
          {
            text: "Failed to submit the form. Please try again.",
            sender: "bot",
          },
        ]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Error submitting the form. Please try again later.",
          sender: "bot",
        },
      ]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(null);
    setFormValues({});
    setFormErrors({});
    setAttemptedSubmit(false);
  };
  const renderFormField = (field: FormField, hasError: boolean) => {
    const errorClass = hasError
      ? "border-red-500 focus-visible:ring-red-500"
      : "";

    switch (field.type) {
      case "TEXTAREA":
        return (
          <Textarea
            id={field.label}
            value={formValues[field.label] || ""}
            onChange={(e) => handleInputChange(e, field.label)}
            placeholder={field.description}
            className={`min-h-24 ${errorClass}`}
            required={field.required}
            minLength={field.validations?.minLength}
            maxLength={field.validations?.maxLength}
          />
        );

      case "SELECT":
        return (
          <select
            id={field.label}
            value={formValues[field.label] || ""}
            onChange={(e) => handleInputChange(e, field.label)}
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errorClass}`}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.validations.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "CHECKBOX":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.label}
              checked={formValues[field.label] === "true"}
              onChange={(e) =>
                handleInputChange(
                  {
                    target: { value: e.target.checked ? "true" : "false" },
                  } as React.ChangeEvent<HTMLInputElement>,
                  field.label
                )
              }
              className={`h-4 w-4 ${errorClass}`}
              required={field.required}
            />
            <label htmlFor={field.label} className="text-sm font-medium">
              I agree
            </label>
          </div>
        );

      case "FILE":
        return (
          <Input
            type="file"
            id={field.label}
            onChange={(e) => {
              const fileInput = e.target as HTMLInputElement;
              const fileName = fileInput.files?.[0]?.name || "";
              handleInputChange(
                {
                  target: { value: fileName },
                } as React.ChangeEvent<HTMLInputElement>,
                field.label
              );
            }}
            className={errorClass}
            required={field.required}
            accept={field.validations.fileTypes
              ?.map((type) => `.${type}`)
              .join(",")}
          />
        );

      case "NUMBER":
        return (
          <Input
            type="number"
            id={field.label}
            value={formValues[field.label] || ""}
            onChange={(e) => handleInputChange(e, field.label)}
            placeholder={field.description}
            className={errorClass}
            required={field.required}
            min={field.validations?.min}
            max={field.validations?.max}
          />
        );

      case "TEXT":
      default:
        return (
          <Input
            type="text"
            id={field.label}
            value={formValues[field.label] || ""}
            onChange={(e) => handleInputChange(e, field.label)}
            placeholder={field.description}
            className={errorClass}
            required={field.required}
            minLength={field.validations?.minLength}
            maxLength={field.validations?.maxLength}
          />
        );
    }
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
              {msg.formLink ? (
                <FormLink onClick={() => setIsModalOpen(true)} />
              ) : (
                msg.text
              )}
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
            <DialogTitle className="text-4xl">
              {formData?.title || "Form"}
            </DialogTitle>
            <DialogDescription className="whitespace-pre-line">
              {formData?.description || "Please fill out this form"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <form onSubmit={handleFormSubmit} className="space-y-6 py-4">
              {formData?.fields
                .sort((a, b) => a.order - b.order)
                .map((field) => {
                  const hasError = !!formErrors[field.label];

                  return (
                    <div key={field.id} className="grid gap-2 mb-4">
                      <Label
                        htmlFor={field.label}
                        className="font-semibold capitalize"
                      >
                        {field.label.replace(/_/g, " ")}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground -mt-1">
                        {field.description}
                      </p>

                      {renderFormField(field, hasError)}

                      {hasError && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors[field.label]}
                        </p>
                      )}
                    </div>
                  );
                })}
            </form>
          </ScrollArea>

          <DialogFooter className="sm:justify-between">
            <Button
              variant="destructive"
              type="button"
              onClick={closeModal}
              className="bg-foreground"
            >
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
