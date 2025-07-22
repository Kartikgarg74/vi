import { mistral } from "@ai-sdk/mistral"
import { generateText } from "ai"

// Set up environment variable for Mistral API key
process.env.MISTRAL_API_KEY = "siodUbXAHdYGqDHMJ9tle6oQ9wLB3Ljq"

export async function GET() {
  try {
    // Simple test to verify API key works
    const { text } = await generateText({
      model: mistral("mistral-small-latest"),
      prompt: "Say hello",
      maxTokens: 10,
    })

    return Response.json({
      success: true,
      message: "API key is working",
      text,
    })
  } catch (error) {
    console.error("Test API Error:", error)

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
