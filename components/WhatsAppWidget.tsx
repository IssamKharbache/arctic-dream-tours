"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "+358404121843";

const predefinedQuestions = [
  "I need help with your services",
  "What are your pricing options?",
  "How can I get started?",
  "I have a technical question",
  "I want to ask about an activity",
];

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const handleSendMessage = () => {
    const message = selectedQuestion || customMessage;
    if (!message.trim()) return;

    // Format WhatsApp URL with the message
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");

    // Close the dialog and reset form
    setIsOpen(false);
    setSelectedQuestion("");
    setCustomMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-4 left-4 z-50 rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 text-white shadow-lg"
          aria-label="Contact us on WhatsApp"
        >
          <FaWhatsapp className="h-24 w-24" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaWhatsapp className="h-5 w-5 text-green-500" />
            Contact us on WhatsApp
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Quick questions:</Label>
            <div className="mt-2 space-y-2">
              {predefinedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant={
                    selectedQuestion === question ? "default" : "outline"
                  }
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => {
                    setSelectedQuestion(question);
                    setCustomMessage("");
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Label htmlFor="custom-message" className="text-sm font-medium">
              Or write your own message:
            </Label>
            <Textarea
              id="custom-message"
              placeholder="Type your message here..."
              value={customMessage}
              onChange={(e) => {
                setCustomMessage(e.target.value);
                setSelectedQuestion("");
              }}
              className="mt-2 min-h-[80px]"
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!selectedQuestion && !customMessage.trim()}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
