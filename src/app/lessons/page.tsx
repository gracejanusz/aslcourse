import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Lesson = {
  id: "alphabet" | "medical";
  title: string;
  subtitle: string;
  description: string;
  learned: number;
  total: number;
  cta: string;
  href: string;
  badge?: string;
};

const lessons: Lesson[] = [
  {
    id: "alphabet",
    title: "ASL Alphabet",
    subtitle: "A–Z Fingerspelling",
    description:
      "Master the American Sign Language alphabet with guided demos and practice for each letter.",
    learned: 8, // replace with real progress
    total: 26,
    cta: "Open Alphabet Lesson",
    href: "/lessons/alphabet",
    badge: "Core"
  },
  {
    id: "medical",
    title: "Healthcare Terms",
    subtitle: "Clinical Vocabulary",
    description:
      "Learn high-value medical signs like Allergy, Blood, Help, Nurse, Pain, X-ray, and more.",
    learned: 5, // replace with real progress
    total: 24,  // adjust to your actual term count
    cta: "Open Medical Terms Lesson",
    href: "/lessons/medical",
    badge: "Applied"
  }
];

export default function Lessons() {
  // overall progress (simple aggregate)
  const totalLearned = lessons.reduce((s, l) => s + l.learned, 0);
  const totalItems = lessons.reduce((s, l) => s + l.total, 0);
  const overallPct = Math.round((totalLearned / totalItems) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation Header */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900">
                Hands<span className="text-blue-600">In</span>
              </h1>
              <Badge variant="secondary" className="ml-3">
                Healthcare ASL Training
              </Badge>
            </Link>
            <div className="flex space-x-4">
              <Link href="/lessons">
                <Button variant="default">Lessons</Button>
              </Link>
              <Link href="/practice">
                <Button variant="ghost">Practice</Button>
              </Link>
              <Link href="/quiz">
                <Button variant="ghost">Quiz</Button>
              </Link>
              <Link href="/progress">
                <Button variant="ghost">Progress</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Lessons</h1>
          <p className="text-lg text-slate-600 mb-6">
            Learn the ASL alphabet first, then apply your skills with high-value healthcare vocabulary.
          </p>

          {/* Overall Progress */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Overall Progress</span>
              <span className="text-sm text-slate-600">
                {totalLearned}/{totalItems} items learned
              </span>
            </div>
            <Progress value={overallPct} className="w-full" />
          </div>
        </div>

        {/* Lessons Grid (just two cards now) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((l) => {
            const pct = Math.round((l.learned / l.total) * 100);
            const status =
              pct === 0 ? "Not started" : pct < 100 ? "In progress" : "Completed";

            return (
              <Card key={l.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <CardTitle className="text-xl">{l.title}</CardTitle>
                      <CardDescription className="text-sm">{l.subtitle}</CardDescription>
                    </div>
                    {l.badge && (
                      <Badge variant="secondary" className="whitespace-nowrap">
                        {l.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-600">{l.description}</p>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{status}</span>
                      <span className="text-sm text-slate-600">
                        {l.learned}/{l.total}
                      </span>
                    </div>
                    <Progress value={pct} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link href={l.href}>
                      <Button className="w-full">{l.cta}</Button>
                    </Link>
                    {/* Secondary actions */}
                    {l.id === "alphabet" ? (
                      <Link href="/practice?mode=alphabet">
                        <Button className="w-full" variant="outline">
                          Practice
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/practice?mode=medical">
                        <Button className="w-full" variant="outline">
                          Practice
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Practice?</h2>
          <p className="text-slate-600 mb-6">
            Start with the alphabet or jump into healthcare terms, then try our interactive camera practice.
          </p>
          <div className="flex space-x-4">
            <Link href="/practice">
              <Button size="lg">Try Camera Practice</Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline">
                Take a Quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
