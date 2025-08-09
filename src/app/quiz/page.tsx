"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuizQuestion {
  id: number;
  question: string;
  scenario: string;
  options: string[];
  correct: number;
  explanation: string;
  level: "beginner" | "intermediate" | "advanced";
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "A Deaf patient is trying to communicate about chest pain. Which ASL letter would you use to start spelling 'CHEST'?",
    scenario: "Emergency Department - Patient Communication",
    options: ["A", "B", "C", "D"],
    correct: 2,
    explanation: "The letter 'C' is used to start spelling 'CHEST'. In emergency situations, clear communication about pain location is crucial.",
    level: "beginner"
  },
  {
    id: 2,
    question: "When explaining a procedure to a Deaf patient, which letter would you use to start spelling 'MEDICINE'?",
    scenario: "Pharmacy Consultation",
    options: ["L", "M", "N", "O"],
    correct: 1,
    explanation: "The letter 'M' starts 'MEDICINE'. Medication discussions require precise communication to ensure patient safety.",
    level: "beginner"
  },
  {
    id: 3,
    question: "A patient needs to indicate they feel 'BETTER'. Which ASL letter sequence would start this word?",
    scenario: "Follow-up Appointment",
    options: ["B-E", "B-A", "C-E", "A-E"],
    correct: 0,
    explanation: "'BETTER' starts with B-E. Tracking patient improvement is essential for effective treatment planning.",
    level: "intermediate"
  },
  {
    id: 4,
    question: "In signing 'URGENT', which letter would be signed first?",
    scenario: "Triage Assessment",
    options: ["T", "U", "R", "G"],
    correct: 1,
    explanation: "'URGENT' begins with the letter 'U'. Communicating urgency levels helps prioritize patient care appropriately.",
    level: "intermediate"
  },
  {
    id: 5,
    question: "When a patient needs to spell 'X-RAY', which two letters would you expect to see first?",
    scenario: "Radiology Department",
    options: ["X-R", "R-A", "A-Y", "X-A"],
    correct: 0,
    explanation: "'X-RAY' starts with X-R. Clear communication about diagnostic procedures helps reduce patient anxiety.",
    level: "advanced"
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(quizQuestions.length).fill(false));

  const currentQ = quizQuestions[currentQuestion];

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

    if (selectedAnswer === currentQ.correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
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
                  {((score / quizQuestions.length) * 100).toFixed(0)}% Correct
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
            <Badge variant="outline" className={
              currentQ.level === "beginner" ? "bg-green-50 text-green-700" :
              currentQ.level === "intermediate" ? "bg-yellow-50 text-yellow-700" :
              "bg-red-50 text-red-700"
            }>
              {currentQ.level}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>Score: {score}/{currentQuestion + (showExplanation ? 1 : 0)}</span>
            </div>
            <Progress value={((currentQuestion + (showExplanation ? 1 : 0)) / quizQuestions.length) * 100} />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="text-sm text-blue-600 font-medium mb-2">
              {currentQ.scenario}
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    selectedAnswer === index
                      ? showExplanation
                        ? index === currentQ.correct
                          ? "default"
                          : "destructive"
                        : "default"
                      : showExplanation && index === currentQ.correct
                        ? "default"
                        : "outline"
                  }
                  className={`h-16 text-lg justify-start ${
                    showExplanation && index === currentQ.correct
                      ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-100"
                      : showExplanation && selectedAnswer === index && index !== currentQ.correct
                        ? "bg-red-100 border-red-300 text-red-800 hover:bg-red-100"
                        : ""
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                >
                  <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>

            {showExplanation && (
              <Alert className="mt-6">
                <AlertDescription>
                  <strong>Explanation:</strong> {currentQ.explanation}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0 || showExplanation}
              >
                Previous
              </Button>

              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                >
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
