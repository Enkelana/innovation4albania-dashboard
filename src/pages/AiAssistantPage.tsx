import { useState } from "react";
import { useAiAssistant } from "@/hooks/use-dashboard-api";
import { useAuth } from "@/context/AuthContext";

export default function AiAssistantPage() {
  const { user } = useAuth();
  const askAi = useAiAssistant(user);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("Cilat projekte kanë prioritet këtë javë?");

  const submit = async () => {
    const question = input.trim();
    if (!question) return;
    setMessages((current) => [...current, { role: "user", content: question }]);
    setInput("");
    const response = await askAi.mutateAsync(question);
    setMessages((current) => [...current, { role: "assistant", content: response.reply.content }]);
  };

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1200px] mx-auto">
      <div>
        <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Asistenti AI</div>
        <h1 className="font-display text-3xl font-medium mt-1">Chat analitik për portofolin</h1>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5 shadow-elev space-y-4">
        <div className="space-y-3 min-h-[320px]">
          {messages.length === 0 && <div className="text-sm text-muted-foreground">Bëj një pyetje për riskun, OKR, devijimet ose prioritetet e projekteve.</div>}
          {messages.map((message, index) => (
            <div key={index} className={`rounded-md px-4 py-3 text-sm ${message.role === "assistant" ? "bg-surface-elevated border border-border" : "bg-accent text-accent-foreground ml-auto max-w-[80%]"}`}>
              {message.content}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[88px] flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Shkruaj pyetjen tënde..." />
          <button onClick={() => void submit()} disabled={askAi.isPending} className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium self-end disabled:opacity-60">Dërgo</button>
        </div>

        {askAi.data?.suggestedActions && (
          <div className="flex flex-wrap gap-2">
            {askAi.data.suggestedActions.map((action) => (
              <button key={action} onClick={() => setInput(action)} className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-foreground">{action}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

