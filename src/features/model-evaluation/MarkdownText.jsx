import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import {Typography} from "@mui/material";

export const MarkdownText = ({children, text}) => {
  const preprocessMarkdown = (text) => {
    if (!text) return "";
    return text.replace(/(#+\s)/g, "\n$1"); // Ensures headings start on a new line
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <Typography fontWeight={700} fontSize="1.1rem" gutterBottom {...props} />,
        h2: ({ node, ...props }) => <Typography fontWeight={700} fontSize="1.1rem" gutterBottom {...props} />,
        h3: ({ node, ...props }) => <Typography fontWeight={600} fontSize="1.1rem" gutterBottom {...props} />,
        h4: ({ node, ...props }) => <Typography fontWeight={600} fontSize="1rem" gutterBottom {...props} />,
        h5: ({ node, ...props }) => <Typography fontWeight={500} fontSize="1rem" gutterBottom {...props} />,
        h6: ({ node, ...props }) => <Typography fontWeight={400} fontSize="1rem" gutterBottom {...props} />,
      }}
    >
      {preprocessMarkdown(text || children)}
    </ReactMarkdown>
  )
}