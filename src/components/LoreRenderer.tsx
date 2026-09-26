import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LoreRendererProps {
  content: string;
}

export const LoreRenderer: React.FC<LoreRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-accent-primary hover:prose-a:text-accent-secondary prose-strong:text-white transition-all">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
