"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({
    content,
}: MarkdownRendererProps) {
    return (
        <div className="max-w-none text-sm leading-7 ">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    /* Paragraphs */
                    p: ({ children }) => (
                        <p className="mb-4 last:mb-0">
                            {children}
                        </p>
                    ),

                    /* Headings */
                    h1: ({ children }) => (
                        <h1 className="mb-4 mt-6 text-2xl font-bold text-gray-900">
                            {children}
                        </h1>
                    ),

                    h2: ({ children }) => (
                        <h2 className="mb-3 mt-5 text-xl font-bold text-gray-900">
                            {children}
                        </h2>
                    ),

                    h3: ({ children }) => (
                        <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900">
                            {children}
                        </h3>
                    ),

                    /* Bold */
                    strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                            {children}
                        </strong>
                    ),

                    /* Italic */
                    em: ({ children }) => (
                        <em className="italic">
                            {children}
                        </em>
                    ),

                    /* Unordered lists */
                    ul: ({ children }) => (
                        <ul className="mb-4 ml-6 list-disc space-y-1">
                            {children}
                        </ul>
                    ),

                    /* Ordered lists */
                    ol: ({ children }) => (
                        <ol className="mb-4 ml-6 list-decimal space-y-1">
                            {children}
                        </ol>
                    ),

                    /* List items */
                    li: ({ children }) => (
                        <li className="pl-1">
                            {children}
                        </li>
                    ),

                    /* Links */
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 underline hover:text-blue-800"
                        >
                            {children}
                        </a>
                    ),

                    /* Blockquotes */
                    blockquote: ({ children }) => (
                        <blockquote className="my-4 border-l-4 border-gray-300 pl-4 italic text-gray-600">
                            {children}
                        </blockquote>
                    ),

                    /* Tables */
                    table: ({ children }) => (
                        <div className="my-5 w-full overflow-x-auto rounded-lg border border-gray-200 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
                            <table className="w-full min-w-[600px] border-collapse">
                                {children}
                            </table>
                        </div>
                    ),

                    thead: ({ children }) => (
                        <thead className="bg-gray-100">
                            {children}
                        </thead>
                    ),

                    tbody: ({ children }) => (
                        <tbody>
                            {children}
                        </tbody>
                    ),

                    tr: ({ children }) => (
                        <tr className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                            {children}
                        </tr>
                    ),

                    th: ({ children }) => (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            {children}
                        </th>
                    ),

                    td: ({ children }) => (
                        <td className="px-4 py-3 text-sm text-gray-700">
                            {children}
                        </td>
                    ),

                    /* Horizontal rule */
                    hr: () => (
                        <hr className="my-6 border-gray-200" />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}