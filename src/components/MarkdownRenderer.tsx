interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Convert markdown to HTML using a simple regex-based approach
  // This avoids MDX parsing issues with special characters
  const processMarkdown = (text: string): string => {
    return text
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-slate-800 mt-8 mb-4 flex items-center gap-2"><div class="w-1 h-6 bg-blue-500 rounded"></div>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-slate-700 mt-6 mb-3">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-medium text-slate-600 mt-4 mb-2">$1</h4>')
      
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<div class="relative bg-slate-900 rounded-lg p-4 mb-6 overflow-x-auto"><pre class="text-slate-100 text-sm">$1</pre></div>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      
      // Lists (simplified)
      .replace(/^- (.*$)/gm, '<li class="flex items-start gap-2 text-slate-700 mb-2"><div class="w-2 h-2 bg-blue-400 rounded-full mt-2.5 flex-shrink-0"></div><span>$1</span></li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="text-slate-700 mb-2 ml-4">$2</li>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-600">$1</em>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2">$1</a>')
      
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="my-8 border-t border-slate-200" />')
      
      // Paragraphs (convert double newlines to paragraphs)
      .replace(/\n\n/g, '</p><p class="text-slate-700 leading-relaxed mb-4">')
      
      // Handle emoji status indicators for list items
      .replace(/<li([^>]*)>([^<]*✅[^<]*)<\/span><\/li>/g, '<li$1><span class="inline-flex items-center gap-2"><span class="text-green-500">✅</span>$2</span></li>')
      .replace(/<li([^>]*)>([^<]*⭐[^<]*)<\/span><\/li>/g, '<li$1><span class="inline-flex items-center gap-2"><span class="text-red-500">⭐</span>$2</span></li>')
      .replace(/<li([^>]*)>([^<]*🟡[^<]*)<\/span><\/li>/g, '<li$1><span class="inline-flex items-center gap-2"><span class="text-yellow-500">🟡</span>$2</span></li>');
  };

  const processedContent = processMarkdown(content);

  return (
    <div className="prose prose-slate max-w-none">
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: processedContent }} 
      />
    </div>
  );
}