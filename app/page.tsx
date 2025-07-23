"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, AlertCircle } from "lucide-react"

export default function EmotionalWellnessChatbot() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    onError: (error) => {
      console.error("Chat error details:", error)
      setErrorMessage(error.message || "Something went wrong. Please try again.")
    },
    onResponse: (response) => {
      console.log("Response received:", response.status)
      if (!response.ok) {
        setErrorMessage("Failed to get response from the server.")
      }
    },
    onFinish: (message) => {
      console.log("Message completed:", message)
      setErrorMessage(null) // Clear error on successful completion
      // Keep input focused after message is sent
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isLoading) {
      setIsTyping(true)
      setErrorMessage(null) // Clear error when starting new request
    } else {
      setIsTyping(false)
    }
  }, [isLoading])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setErrorMessage(null)
    handleSubmit(e)

    // Keep input focused after sending message
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
  }

  // Auto-focus input on component mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-25 via-yellow-25 to-orange-25">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="relative">
          {/* Feedback Button - Top Right */}
          <div className="absolute top-0 right-0 z-10">
            <Button
              onClick={() => window.open("https://forms.gle/TjygiEZanGDsSZ2K9", "_blank")}
              variant="outline"
              size="sm"
              className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 text-xs"
            >
              Share Feedback
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/vimukti-logo.jpeg" alt="Vimukti Logo" className="w-12 h-12 object-contain" />
              <h1 className="text-3xl font-light text-gray-700">VIMUKTI</h1>
            </div>

            {/* Calming Message */}
            <Card className="p-4 bg-amber-50/60 backdrop-blur-sm border border-amber-100/50 shadow-sm">
              <p className="text-base text-gray-600 leading-relaxed">
                Always here to listen — a <span className="font-medium text-amber-700">trusted space</span> for
                emotional self-growth, and genuine reflection.
              </p>
            </Card>
          </div>
        </div>

        {/* Error Display */}
        {(error || errorMessage) && (
          <Card className="mb-4 p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-red-600 text-sm">{errorMessage || error?.message || "An unexpected error occurred"}</p>
            </div>
          </Card>
        )}

        {/* Chat Container */}
        <Card className="h-[60vh] bg-amber-50/40 backdrop-blur-sm border border-amber-100/30 shadow-lg">
          <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                  <img src="/vimukti-logo.jpeg" alt="Vimukti" className="w-16 h-16 mx-auto mb-4 opacity-60" />
                  <p className="text-lg text-gray-600">How are you feeling today? I'm here to listen...</p>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900"
                        : "bg-white/80 shadow-sm text-gray-700 border border-amber-100/50"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/80 shadow-sm text-gray-700 border border-amber-100/50 p-4 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-6">
              <form onSubmit={handleFormSubmit} className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Share what's on your mind..."
                  className="flex-1 border-amber-200 focus:border-amber-300 focus:ring-amber-200 rounded-full px-6 py-3 text-lg bg-white/80"
                  disabled={isLoading}
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-900 rounded-full px-6 py-3 shadow-md transition-all duration-200"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-4 text-[10px] text-gray-400">
          <p>Your conversations are stored securely for research purposes to improve emotional wellness support.</p>
        </div>
      </div>
    </div>
  )
}
