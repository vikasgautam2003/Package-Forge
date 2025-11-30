import { Rocket, Loader2, Send } from "lucide-react";

interface ChatInterfaceProps {
  jobId: string | null;
  status: string;
  onSubmit: (formData: FormData) => void;
}

export function ChatInterface({ jobId, status, onSubmit }: ChatInterfaceProps) {
  return (
    <div className="w-1/5 border-r border-gray-800 flex flex-col bg-black">
      <div className="p-4 border-b border-gray-800 font-bold flex items-center gap-2 text-blue-400">
        <Rocket size={18} /> ARCHITECT AI
      </div>

      <div className="flex-1 p-4 text-sm text-gray-400 overflow-y-auto">
        {jobId && (
          <div className="mb-4">
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 mb-2">
              <span className="text-green-500 font-bold">USER:</span>
              <br />
              Generating package...
            </div>
            <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800">
              <span className="text-blue-400 font-bold">AI:</span>
              <br />
              Blueprint received. Starting construction...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800">
        <form action={onSubmit} className="flex gap-2">
          <input
            name="prompt"
            placeholder="Describe your package..."
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
            disabled={status === "active"}
          />
          <button
            type="submit"
            disabled={status === "active"}
            className="bg-blue-600 hover:bg-blue-500 p-2 rounded text-white disabled:opacity-50"
          >
            {status === "active" ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}