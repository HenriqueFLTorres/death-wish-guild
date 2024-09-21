import DOMPurify from "dompurify"
import parse from "html-react-parser"

const parseHTML = (content: string | null | undefined) => {
  if (content == null) return ""

  try {
    const sanitizedHtml = DOMPurify.sanitize(content)

    const parsedDescription = parse(sanitizedHtml)

    return parsedDescription
  } catch (error) {
    return content
  }
}

export { parseHTML }
