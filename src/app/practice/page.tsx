"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HandDetection from "@/components/HandDetection";

export default function Practice() {
  const [cameraActive, setCameraActive] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [targetLetter, setTargetLetter] = useState<string>("A");
  const [practiceMode, setPracticeMode] = useState<"reference" | "blind">("reference");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const handlePrediction = (letter: string, confidence: number) => {
    setCurrentPrediction(letter);
    setConfidence(confidence);
  };

  const startCamera = () => {
    setCameraActive(true);
  };

  const stopCamera = () => {
    setCameraActive(false);
    setCurrentPrediction("");
    setConfidence(0);
  };

  const checkAnswer = () => {
    setAttempts(prev => prev + 1);
    if (currentPrediction === targetLetter && confidence > 70) {
      setScore(prev => prev + 1);
      // Move to next letter
      const nextLetter = String.fromCharCode(targetLetter.charCodeAt(0) + 1);
      if (nextLetter <= 'Z') {
        setTargetLetter(nextLetter);
      } else {
        // Completed all letters
        setTargetLetter("A");
      }
    }
  };

  const resetPractice = () => {
    setTargetLetter("A");
    setScore(0);
    setAttempts(0);
    setCurrentPrediction("");
    setConfidence(0);
  };

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
                <Button variant="default">Practice</Button>
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
          <h1 className="text-3xl font-bold text-slate-900 mb-4">AI-Powered ASL Practice</h1>
          <p className="text-lg text-slate-600">
            Practice your ASL alphabet with real-time camera feedback. Our AI will analyze your hand signs and provide instant feedback.
          </p>
        </div>

        <Tabs value={practiceMode} onValueChange={(value) => setPracticeMode(value as "reference" | "blind")}>
          <TabsList className="mb-6">
            <TabsTrigger value="reference">Reference Mode</TabsTrigger>
            <TabsTrigger value="blind">Blind Practice</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Camera and Detection Area */}
            <div className="lg:col-span-2">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Camera Practice
                    <div className="flex space-x-2">
                      {!cameraActive ? (
                        <Button onClick={startCamera}>
                          Start Camera
                        </Button>
                      ) : (
                        <Button onClick={stopCamera} variant="destructive">
                          Stop Camera
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative rounded-lg overflow-hidden bg-slate-100" style={{ aspectRatio: '4/3' }}>
                    {cameraActive ? (
                      <>
                        <HandDetection
                          onPrediction={handlePrediction}
                          isActive={cameraActive}
                          width={640}
                          height={480}
                        />

                        {/* Overlay for hand detection visualization */}
                        <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-lg">
                          <div className="text-sm font-medium">
                            Detected: <span className="font-bold text-green-400">{currentPrediction || "None"}</span>
                          </div>
                          <div className="text-xs mt-1">
                            Confidence: <span className={confidence > 70 ? "text-green-400" : confidence > 40 ? "text-yellow-400" : "text-red-400"}>
                              {confidence.toFixed(1)}%
                            </span>
                          </div>
                          {confidence > 70 && currentPrediction === targetLetter && (
                            <div className="text-xs mt-1 text-green-400 font-bold">
                              ✓ Correct!
                            </div>
                          )}
                        </div>

                        {/* Center guide overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="border-2 border-dashed border-white/50 rounded-lg w-80 h-60 flex items-center justify-center">
                            <span className="text-white/70 text-sm bg-black/30 px-2 py-1 rounded">
                              Position your hand here
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-96 flex items-center justify-center text-slate-500">
                        <div className="text-center">
                          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <p className="text-lg font-medium">Click "Start Camera" to begin practice</p>
                          <p className="text-sm text-slate-400 mt-2">Make sure to allow camera permissions</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Practice Control Panel */}
            <div className="space-y-6">
              {/* Current Challenge */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-4">
                      {targetLetter}
                    </div>
                    <p className="text-slate-600 mb-4">
                      Show the ASL sign for letter "{targetLetter}"
                    </p>

                    <TabsContent value="reference" className="mt-4">
                      <div className="bg-slate-100 h-32 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-slate-500 text-center">
                          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 6h8m-8 4h8m-8 4h8M5 6v12a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1z" />
                          </svg>
                          Reference image for "{targetLetter}"
                        </span>
                      </div>
                    </TabsContent>

                    <Button
                      onClick={checkAnswer}
                      className="w-full"
                      disabled={!cameraActive || confidence < 70 || currentPrediction !== targetLetter}
                    >
                      {!cameraActive
                        ? "Start Camera First"
                        : confidence < 70
                          ? `Need ${70 - Math.round(confidence)}% More Confidence`
                          : currentPrediction !== targetLetter
                            ? `Showing "${currentPrediction}" - Need "${targetLetter}"`
                            : "Correct! Click to Continue"
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Score and Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Practice Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Correct Signs:</span>
                      <span className="font-bold text-green-600">{score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Attempts:</span>
                      <span className="font-bold">{attempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="font-bold">
                        {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Letter:</span>
                      <span className="font-bold text-blue-600">{targetLetter}</span>
                    </div>
                    <Button onClick={resetPractice} variant="outline" className="w-full">
                      Reset Practice
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>1. Click "Start Camera" and allow permissions</p>
                    <p>2. Position your hand in the guide box</p>
                    <p>3. Form the ASL sign for the target letter</p>
                    <p>4. Wait for confidence to reach 70%+</p>
                    <p>5. Click the button when it turns green</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>

        {/* Tips Section */}
        <div className="mt-8">
          <Alert>
            <AlertDescription>
              <strong>Pro Tips:</strong> Ensure good lighting, keep your hand steady, and make clear, distinct signs.
              The AI works best when your entire hand is visible in the camera frame. Try to position your hand
              against a plain background for better detection accuracy.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
