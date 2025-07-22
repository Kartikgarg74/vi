import { mistral } from "@ai-sdk/mistral"
import { streamText } from "ai"
import { headers } from "next/headers"

export const maxDuration = 30

// Set up environment variable for Mistral API key
process.env.MISTRAL_API_KEY = "siodUbXAHdYGqDHMJ9tle6oQ9wLB3Ljq"

const SYSTEM_PROMPT = `You are a compassionate emotional wellness companion. Provide short, empathetic responses to help users with their emotional well-being. Keep responses concise and supportive.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const headersList = headers()
    const userIP = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"
    const sessionId = Buffer.from(`${userIP}-${userAgent}`).toString("base64").slice(0, 16)

    // Database operations removed for simplicity during debugging

    // Verify API key is set
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error("Mistral API key is not configured")
    }

    // Use the model with environment variable
    const result = streamText({
      model: mistral("mistral-small-latest"),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
      maxTokens: 300,
    })

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error("Stream error:", error)
        return error instanceof Error ? error.message : "An error occurred while processing your request."
      },
    })
  } catch (error) {
    console.error("API Route Error:", error)

    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
