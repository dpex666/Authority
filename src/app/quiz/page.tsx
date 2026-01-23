import { redirect } from "next/navigation";

export default function QuizPage({ searchParams }: { searchParams?: { [key: string]: string } }) {
  if (searchParams?.view === "summary") {
    redirect("/check/summary");
  }
  if (searchParams?.success === "1") {
    redirect("/check/summary?success=1");
  }
  redirect("/check/start");
}
