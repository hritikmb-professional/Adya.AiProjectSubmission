import fs from "fs"
import mammoth from "mammoth"

// pdf-parse stable CommonJS usage
const pdfParse = require("pdf-parse")

export const parseResume = async (
  filePath: string,
  mimeType: string
): Promise<string> => {
  const buffer = fs.readFileSync(filePath)

  if (mimeType === "application/pdf") {
    const data = await pdfParse(buffer)
    return data.text
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }

  throw new Error("Unsupported file format")
}
