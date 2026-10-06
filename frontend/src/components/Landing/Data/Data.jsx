import {
  Search,
  MoonStar,
  ShieldCheck,
  KeyRound,
  CircleUserRound,
  RefreshCw,
} from "lucide-react";

export const navItems = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
];

export const features = [
  {
    Icon: Search,
    tone: "blue",
    title: "Search, filter, and sort",
    body: "Find anything by title or description, then filter by All, Pending, or Completed and sort newest, oldest, or completed first.",
  },
  {
    Icon: MoonStar,
    tone: "yellow",
    title: "Light and dark, your call",
    body: "Switch themes once in settings and Taskly keeps that choice on your account.",
  },
  {
    Icon: CircleUserRound,
    tone: "green",
    title: "A profile that's yours",
    body: "Set your name, choose a username, and add a photo so the workspace feels like yours.",
  },
  {
    Icon: ShieldCheck,
    tone: "red",
    title: "Signed in safely",
    body: "Sessions run on access and refresh tokens behind the scenes, not a password sitting in your browser.",
  },
  {
    Icon: KeyRound,
    tone: "blue",
    title: "Never locked out",
    body: "Forgot your password? A six-digit code sent to your email gets you back in.",
  },
  {
    Icon: RefreshCw,
    tone: "green",
    title: "Follows you between devices",
    body: "Your list lives on your account, not one browser, so it's the same list wherever you sign in.",
  },
];

export const steps = [
  {
    title: "Create your account",
    body: "Add your name, email, username, and a password of at least eight characters.",
  },
  {
    title: "Confirm your email",
    body: "Enter the six-digit code we send you, or ask for a new one.",
  },
  {
    title: "Add what's on your plate",
    body: "Start today's list and check things off as the day goes.",
  },
];

export const previewTasks = [
  { label: "Send the invoice to Ardent", meta: "9:10", done: true },
  { label: "Review Priya's pull request", meta: "11:40", done: true },
  { label: "Write the handover doc", meta: "Today", done: false },
  { label: "Book the team offsite", meta: "Thu", done: false },
];

export const previewFilters = ["All", "Pending", "Completed"];