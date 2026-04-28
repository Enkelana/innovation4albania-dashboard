import { useState } from "react";
import { Bot, MessageSquare, Send, X } from "lucide-react";
import { useAiAssistant } from "@/hooks/use-dashboard-api";
import { useAuth } from "@/context/AuthContext";

export default function AiAssistantWidget() {
  const { user } = useAuth();
  const askAi = useAiAssistant(user);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("Cilat projekte kanë prioritet këtë javë?");

  const submit = async () => {
    const question = input.trim();
    if (!question || askAi.isPending) return;

    setMessages((current) => [...current, { role: "user", content: question }]);
    setInput("");

    try {
      const response = await askAi.mutateAsync(question);
      setMessages((current) => [...current, { role: "assistant", content: response.reply.content }]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "Asistenti AI nuk u përgjigj dot për momentin. Provo përsëri pas pak." },
      ]);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-background/20 backdrop-blur-[1px]" onClick={() => setOpen(false)} />
      )}

      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {open && (
          <div className="w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Bot className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Asistenti AI</div>
                  <div className="text-xs text-muted-foreground">Chat analitik për projektet dhe portofolin</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex h-[540px] flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-3 text-sm text-muted-foreground">
                    Bëj një pyetje për riskun, OKR, devijimet ose prioritetet e projekteve.
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={message.role === "assistant"
                      ? "mr-8 rounded-2xl rounded-tl-md border border-border bg-background px-4 py-3 text-sm text-foreground"
                      : "ml-8 rounded-2xl rounded-tr-md bg-accent px-4 py-3 text-sm text-accent-foreground"}
                  >
                    {message.content}
                  </div>
                ))}

                {askAi.isPending && (
                  <div className="mr-8 rounded-2xl rounded-tl-md border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    Asistenti po mendon...
                  </div>
                )}
              </div>

              <div className="border-t border-border bg-background/70 p-4">
                <div className="flex gap-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void submit();
                      }
                    }}
                    className="min-h-[92px] flex-1 resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
                    placeholder="Shkruaj pyetjen tënde..."
                  />
                  <button
                    type="button"
                    onClick={() => void submit()}
                    disabled={askAi.isPending}
                    className="inline-flex items-center gap-2 self-end rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity disabled:opacity-60"
                  >
                    <Send className="size-4" />
                    Dërgo
                  </button>
                </div>

                {askAi.data?.suggestedActions && askAi.data.suggestedActions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {askAi.data.suggestedActions.map((action) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => setInput(action)}
                        className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex items-center gap-3 rounded-full border border-border bg-accent px-4 py-3 text-sm font-medium text-accent-foreground shadow-2xl transition-transform hover:scale-[1.02]"
        >
          <div className="grid size-8 place-items-center rounded-full bg-accent-foreground/15">
            {open ? <X className="size-4" /> : <MessageSquare className="size-4" />}
          </div>
          <span>Asistenti AI</span>
        </button>
      </div>
    </>
  );
}

