import React from 'react';

interface MarkdownRendererProps {
    children: string;
}

export const MarkdownRenderer = ({ children }: MarkdownRendererProps) => {
    if (!children) return null;

    // Split by newlines to handle paragraphs and lists
    const lines = children.split('\n');
    const elements: React.ReactNode[] = [];

    let inList = false;
    let listItems: React.ReactNode[] = [];

    const parseLine = (text: string, key: string | number) => {
        // Bold: **text**
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

        return (
            <span key={key}>
                {parts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index}>{part.slice(2, -2)}</strong>;
                    } else if (part.startsWith('*') && part.endsWith('*')) {
                        return <em key={index}>{part.slice(1, -1)}</em>;
                    }
                    return part;
                })}
            </span>
        );
    };

    lines.forEach((line, index) => {
        // List item
        if (line.trim().startsWith('- ')) {
            if (!inList) {
                inList = true;
            }
            listItems.push(<li key={`li-${index}`}>{parseLine(line.trim().substring(2), index)}</li>);
        } else {
            // If we were in a list, close it
            if (inList) {
                elements.push(<ul key={`ul-${index}`} className="list-disc pl-5 mb-4">{listItems}</ul>);
                inList = false;
                listItems = [];
            }
            // Regular paragraph
            if (line.trim()) {
                elements.push(<p key={`p-${index}`} className="mb-2">{parseLine(line, index)}</p>);
            }
        }
    });

    // Flush remaining list
    if (inList) {
        elements.push(<ul key="ul-end" className="list-disc pl-5 mb-4">{listItems}</ul>);
    }

    return <div className="text-muted-foreground leading-relaxed text-sm break-words">{elements}</div>;
};
