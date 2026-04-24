import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: number;
}

const notificationStyles = {
  success: {
    bg: "bg-success/15",
    border: "border-success/30",
    text: "text-success",
    icon: CheckCircle2,
  },
  error: {
    bg: "bg-destructive/15",
    border: "border-destructive/30",
    text: "text-destructive",
    icon: AlertCircle,
  },
  warning: {
    bg: "bg-warning/15",
    border: "border-warning/30",
    text: "text-warning",
    icon: AlertTriangle,
  },
  info: {
    bg: "bg-info/15",
    border: "border-info/30",
    text: "text-info",
    icon: Info,
  },
};

export const notificationStore = {
  listeners: new Set<(notifications: Notification[]) => void>(),
  notifications: [] as Notification[],
  
  subscribe: (listener: (notifications: Notification[]) => void) => {
    notificationStore.listeners.add(listener);
    listener(notificationStore.notifications);
    return () => notificationStore.listeners.delete(listener);
  },

  add: (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    notificationStore.notifications = [newNotification, ...notificationStore.notifications].slice(0, 5);
    notificationStore.listeners.forEach((listener) => listener(notificationStore.notifications));

    if (notification.type !== "error") {
      setTimeout(() => {
        notificationStore.remove(newNotification.id);
      }, 5000);
    }
  },

  remove: (id: string) => {
    notificationStore.notifications = notificationStore.notifications.filter((n) => n.id !== id);
    notificationStore.listeners.forEach((listener) => listener(notificationStore.notifications));
  },

  clear: () => {
    notificationStore.notifications = [];
    notificationStore.listeners.forEach((listener) => listener([]));
  },
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationStore.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
      {notifications.map((notification, idx) => {
        const style = notificationStyles[notification.type];
        const Icon = style.icon;

        return (
          <div
            key={notification.id}
            className={cn(
              "p-4 rounded-lg border backdrop-blur-sm animate-slide-in-up hover:shadow-glow transition-all pointer-events-auto cursor-default hover:scale-105",
              style.bg,
              style.border,
            )}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <Icon className={cn("size-5 mt-0.5 shrink-0 animate-bounce-gentle", style.text)} />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground">{notification.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => notificationStore.remove(notification.id)}
                className="ml-2 text-muted-foreground hover:text-foreground hover:bg-surface/50 transition-all rounded-md p-1 hover:scale-110"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
