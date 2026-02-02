import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
)

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
})

export type LLMResumeResult = {
  name: string
  email: string
  phone: string
  skills: string[]
  matchedSkills: string[]
  missingSkills: string[]
  matchScore: number
  summary: string
}

/**
 * Safely extract JSON from LLM output
 */
const extractJSON = (text: string): any => {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) {
    throw new Error("No JSON object found in LLM response")
  }
  return JSON.parse(match[0])
}

export const analyzeResumeWithLLM = async (
  resumeText: string,
  jobDescription: string
): Promise<LLMResumeResult> => {
  const prompt = `
You are an AI recruitment assistant.

IMPORTANT RULES:
- Respond with ONLY valid JSON
- Do NOT include markdown
- Do NOT include explanations
- Do NOT include text outside JSON

JSON schema:
{
  "name": string,
  "email": string,
  "phone": string,
  "skills": string[],
  "matchedSkills": string[],
  "missingSkills": string[],
  "matchScore": number,
  "summary": string
}

Resume:
"""${resumeText}"""

Job Description:
"""${jobDescription}"""
`

  const result = await model.generateContent(prompt)
  const rawText = result.response.text()

  try {
    return extractJSON(rawText)
  } catch (err) {
    console.error("RAW LLM OUTPUT:\n", rawText)
    throw new Error("LLM returned invalid JSON")
  }
}
