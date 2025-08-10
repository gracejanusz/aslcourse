"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuizQuestion {
  id: number;
  question: string;
  scenario: string;
  options: string[]; // Each option can be a single letter (e.g., "A") or a sequence like "B-E"
  correct: number; // index into options
  explanation: string;
  level: "beginner" | "intermediate" | "advanced";
}

// NOTE ON IMAGES
// Place your images under public/asl_letters (recommended to match this code) or public/asl letters (with a space).
// Files should be named exactly by the uppercase letter, e.g., A.webp, B.webp, ... Z.webp.
// If you use `public/asl letters`, switch IMG_BASE to "/asl%20letters" or rename the folder to `asl_letters`.
const IMG_BASE = "/asl_letters"; // change to "/asl%20letters" if you keep the space in the directory name

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "A Deaf patient is trying to communicate about chest pain. Which ASL letter would you use to start spelling 'CHEST'?",
    scenario: "Emergency Department - Patient Communication",
    options: ["A", "B", "C", "D"],
    correct: 2,
    explanation:
      "The letter 'C' is used to start spelling 'CHEST'. In emergency situations, clear communication about pain location is crucial.",
    level: "beginner",
  },
  {
    id: 2,
    question:
      "When explaining a procedure to a Deaf patient, which letter would you use to start spelling 'MEDICINE'?",
    scenario: "Pharmacy Consultation",
    options: ["L", "M", "N", "O"],
    correct: 1,
    explanation:
      "The letter 'M' starts 'MEDICINE'. Medication discussions require precise communication to ensure patient safety.",
    level: "beginner",
  },
  {
    id: 3,
    question: "A patient needs to indicate they feel 'BETTER'. Which ASL letter sequence would start this word?",
    scenario: "Follow-up Appointment",
    options: ["B-E", "B-A", "C-E", "A-E"],
    correct: 0,
    explanation:
      "'BETTER' starts with B-E. Tracking patient improvement is essential for effective treatment planning.",
    level: "intermediate",
  },
  {
    id: 4,
    question: "In signing 'URGENT', which letter would be signed first?",
    scenario: "Triage Assessment",
    options: ["T", "U", "R", "G"],
    correct: 1,
    explanation:
      "'URGENT' begins with the letter 'U'. Communicating urgency levels helps prioritize patient care appropriately.",
    level: "intermediate",
  },
  {
    id: 5,
    question: "When a patient needs to spell 'X-RAY', which two letters would you expect to see first?",
    scenario: "Radiology Department",
    options: ["X-R", "R-A", "A-Y", "X-A"],
    correct: 0,
    explanation:
      "'X-RAY' starts with X-R. Clear communication about diagnostic procedures helps reduce patient anxiety.",
    level: "advanced",
  },
];

// ---------- Randomized options (stable per question) ----------
const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

// Simple seeded PRNG so options don't change on every re-render
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickDistinct<T>(rng: () => number, pool: T[], count: number, exclude: Set<T> = new Set()) {
  const out: T[] = [];
  const seen = new Set<T>(exclude);
  while (out.length < count && seen.size < pool.length) {
    const candidate = pool[Math.floor(rng() * pool.length)];
    if (!seen.has(candidate)) {
      seen.add(candidate);
      out.push(candidate);
    }
  }
  return out;
}

function makeDistractorsFor(option: string, seed: number): string[] {
  const rng = mulberry32(seed);
  if (option.includes("-")) {
    // Pair like "B-E": generate other random pairs not equal to correct
    const correctPair = option.split("-").map((s) => s.trim().toUpperCase());
    const excludePairStr = new Set<string>([option.toUpperCase()]);
    const distractors: string[] = [];
    while (distractors.length < 3) {
      const [a] = pickDistinct(rng, ALPHABET, 1);
      const [b] = pickDistinct(rng, ALPHABET, 1);
      const pair = `${a}-${b}`;
      if (!excludePairStr.has(pair)) {
        excludePairStr.add(pair);
        distractors.push(pair);
      }
    }
    return distractors;
  } else {
    // Single letter: pick 3 other letters
    const exclude = new Set<string>([option.toUpperCase()]);
    return pickDistinct(mulberry32(seed), ALPHABET, 3, exclude);
  }
}

function buildOptionsForQuestion(q: QuizQuestion) {
  // Use the original correct option as the answer key
  const correctOption = q.options[q.correct];
  const seed = 1000 + q.id; // stable per question
  const distractors = makeDistractorsFor(correctOption, seed);
  // Combine and shuffle in a stable way
  const combined = [correctOption, ...distractors];
  const rng = mulberry32(seed + 7);
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  const correctIndex = combined.findIndex((o) => o.toUpperCase() === correctOption.toUpperCase());
  return { options: combined, correctIndex };
}

function parseLetters(option: string): string[] {
  // Supports single letters ("A") and sequences like "B-E" or "X-R".
  return option
    .split("-")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
}

function letterToSrc(letter: string): string {
  return `${IMG_BASE}/${letter}.webp`;
}

function OptionImageGroup({ letters, size = 120 }: { letters: string[]; size?: number }) {
  const ratio = letters.length > 1 ? 0.9 : 1; // slightly smaller when showing pair
  const width = Math.round(size * ratio);
  const height = Math.round(size * ratio);
  return (
    <div className={`flex items-center justify-center ${letters.length > 1 ? "space-x-3" : ""}`}>
      {letters.map((ltr) => (
        <div key={ltr} className="flex flex-col items-center">
          <Image
            src={letterToSrc(ltr)}
            alt={`ASL letter`}
            width={width}
            height={height}
            className="rounded-xl border shadow-sm bg-white object-contain"
          />
          {/* Removed textual label to avoid showing image names */}
        </div>
      ))}
    </div>
  );
}

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(quizQuestions.length).fill(false)
  );

  const currentQ = quizQuestions[currentQuestion];
  const { options: renderOptions, correctIndex } = useMemo(
    () => buildOptionsForQuestion(currentQ),
    [currentQ]
  );

  const progressValue = useMemo(() => {
    return ((currentQuestion + (showExplanation ? 1 : 0)) / quizQuestions.length) * 100;
  }, [currentQuestion, showExplanation]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowExplanation(true);
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (selectedAnswer === correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
    setAnsweredQuestions(new Array(quizQuestions.length).fill(false));
  };

  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (quizCompleted) {
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
                  <Button variant="ghost">Lessons</Button>
                </Link>
                <Link href="/practice">
                  <Button variant="ghost">Practice</Button>
                </Link>
                <Link href="/quiz">
                  <Button variant="default">Quiz</Button>
                </Link>
                <Link href="/progress">
                  <Button variant="ghost">Progress</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Quiz Complete!</CardTitle>
              <CardDescription className="text-lg">
                Great work on completing the ASL Healthcare Quiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className={`text-6xl font-bold ${getScoreColor()}`}>
                  {score}/{quizQuestions.length}
                </div>
                <div className="text-xl text-slate-600">
                  {( (score / quizQuestions.length) * 100 ).toFixed(0)}% Correct
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Performance Breakdown:</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-green-600 font-bold text-lg">{score}</div>
                      <div className="text-slate-600">Correct</div>
                    </div>
                    <div>
                      <div className="text-red-600 font-bold text-lg">{quizQuestions.length - score}</div>
                      <div className="text-slate-600">Incorrect</div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-bold text-lg">{quizQuestions.length}</div>
                      <div className="text-slate-600">Total</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button onClick={resetQuiz} size="lg">
                    Retake Quiz
                  </Button>
                  <Link href="/practice">
                    <Button size="lg" variant="outline">
                      Practice More
                    </Button>
                  </Link>
                  <Link href="/lessons">
                    <Button size="lg" variant="ghost">
                      Review Lessons
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <Button variant="ghost">Lessons</Button>
              </Link>
              <Link href="/practice">
                <Button variant="ghost">Practice</Button>
              </Link>
              <Link href="/quiz">
                <Button variant="default">Quiz</Button>
              </Link>
              <Link href="/progress">
                <Button variant="ghost">Progress</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-slate-900">ASL Healthcare Quiz</h1>
            <Badge
              variant="outline"
              className={
                currentQ.level === "beginner"
                  ? "bg-green-50 text-green-700"
                  : currentQ.level === "intermediate"
                  ? "bg-yellow-50 text-yellow-700"
                  : "bg-red-50 text-red-700"
              }
            >
              {currentQ.level}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <span>
                Score: {score}/{currentQuestion + (showExplanation ? 1 : 0)}
              </span>
            </div>
            <Progress value={progressValue} />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="text-sm text-blue-600 font-medium mb-2">{currentQ.scenario}</div>
            <CardTitle className="text-xl leading-relaxed">{currentQ.question}</CardTitle>
            <CardDescription className="mt-2 text-slate-600">
              Choose the correct ASL sign image below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderOptions.map((option, index) => {
                const letters = parseLetters(option);
                const isSelected = selectedAnswer === index;
                const isCorrect = index === correctIndex;
                const showAsCorrect = showExplanation && isCorrect;
                const showAsWrong = showExplanation && isSelected && !isCorrect;

                return (
                  <button
                    key={`${currentQ.id}-${index}-${option}`}
                    type="button"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={
                      `group relative w-full rounded-2xl border p-4 transition ` +
                      (showAsCorrect
                        ? "border-green-400 bg-green-50"
                        : showAsWrong
                        ? "border-red-400 bg-red-50"
                        : isSelected
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300")
                    }
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center justify-center py-2">
                      <OptionImageGroup letters={letters} size={140} />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white text-sm font-bold text-slate-700">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {/* Removed letters text to avoid showing image names */}
                      <span aria-hidden className="text-sm text-slate-600 invisible select-none">
                        placeholder
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <Alert className="mt-6">
                <AlertDescription>
                  <strong>Explanation:</strong> {currentQ.explanation}
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0 || showExplanation}
              >
                Previous
              </Button>

              {!showExplanation ? (
                <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quiz Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 space-y-1">
              <p>• Consider the healthcare context when selecting answers</p>
              <p>• Think about how clear communication impacts patient care</p>
              <p>• Remember that ASL fingerspelling follows the English alphabet order</p>
              <p>• Focus on the first letters of medical terms</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
