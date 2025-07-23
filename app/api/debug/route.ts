export async function GET() {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? "Present" : "Missing",
      mistralApiKey: process.env.MISTRAL_API_KEY ? "Present" : "Missing",
    }

    // Test database connection
    let dbTest = null
    try {
      if (process.env.DATABASE_URL) {
        const { neon } = await import("@neondatabase/serverless")
        const sql = neon(process.env.DATABASE_URL)

        const result = await sql`SELECT COUNT(*) as count FROM conversations`
        dbTest = {
          status: "Connected",
          totalConversations: result[0]?.count || 0,
        }
      }
    } catch (dbError) {
      dbTest = {
        status: "Failed",
        error: dbError instanceof Error ? dbError.message : "Unknown error",
      }
    }

    return Response.json({
      ...debugInfo,
      database: dbTest,
    })
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
