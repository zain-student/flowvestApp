export type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  status: "scheduled" | "sent" | "read";
  priority: "high" | "medium" | "low";
  scheduledAt: string;
  senderName: string;
  recipientName: string;
};

export const dummyNotifications: Notification[] = [
  {
    id: 1,
    title: "Payout Reminder",
    message: "Your payout is due tomorrow",
    type: "payout_reminder",
    status: "scheduled",
    priority: "high",
    scheduledAt: "2026-01-20T10:00:00Z",
    senderName: "Subyal Ahmed",
    recipientName: "Zain ul Abideen",
  },
  {
    id: 2,
    title: "Payout Reminder",
    message: "Your payout is due tomorrow",
    type: "payout_reminder",
    status: "sent",
    priority: "medium",
    scheduledAt: "2026-01-19T10:00:00Z",
    senderName: "Subyal Ahmed",
    recipientName: "Super Administrator",
  },
  {
    id: 3,
    title: "Payout Reminder",
    message: "Your payout is due tomorrow",
    type: "payout_reminder",
    status: "read",
    priority: "low",
    scheduledAt: "2026-01-18T10:00:00Z",
    senderName: "Subyal Ahmed",
    recipientName: "Test User",
  },
];
