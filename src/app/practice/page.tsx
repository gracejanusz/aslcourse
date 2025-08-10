"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

import Link from "next/link";
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
  // RL backend base URL
  const API = "http://10.52.206.87:8000/";

  // --- RL state ---
  const [masteryMap, setMasteryMap] = useState<Record<string, number>>(
    Object.fromEntries("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => [l, 0]))
  );
  const [recentHistory, setRecentHistory] = useState<string[]>([]);
  const stateKeyRef = useRef<string>("A:0");
  const [lastAction, setLastAction] = useState<string>("practice_current");

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

  useEffect(() => {
    getNextFromRL("A");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rewardFromAttempt = (isCorrect: boolean) => (isCorrect ? 1 : -1);

  async function getNextFromRL(currentLetter: string) {
    const masteryLevel = masteryMap[currentLetter] || 0;

    const res = await fetch(`${API}/alphabet/next`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_letter: currentLetter,
        mastery_level: masteryLevel,
        mastery_map: masteryMap,
        recent_history: recentHistory.slice(-5),
      }),
    });
    if (!res.ok) {
      console.error("alphabet/next failed");
      return;
    }
    const data = await res.json();
    stateKeyRef.current = data.state_key;
    setLastAction(data.action); // remember what the agent chose
    const nextLetter = data?.target?.letter ?? currentLetter;

    setTargetLetter(nextLetter);
  }

  function moveToNextLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const idx = alphabet.indexOf(targetLetter);
    const next = idx < alphabet.length - 1 ? alphabet[idx + 1] : targetLetter;
    setTargetLetter(next);
  }

  async function sendFeedbackToRL({
    prevLetter,
    nextMastery,
    reward,
  }: {
    prevLetter: string;
    nextMastery: number;
    reward: number;
  }) {
    await fetch(`${API}/alphabet/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        state_key: stateKeyRef.current,
        action: lastAction || "practice_current",
        reward,
        next_state: { letter: prevLetter, mastery_level: nextMastery },
      }),
    });
  }

  // --- Shared updater used by both auto-check and manual RL next buttons ---
  const applyAttemptAndAdvance = async (isCorrect: boolean) => {
    setAttempts((a) => a + 1);
    if (isCorrect) setScore((s) => s + 1);

    const prevLetter = targetLetter;
    const prevMastery = masteryMap[prevLetter] || 0;
    const nextMastery = isCorrect ? Math.min(2, prevMastery + 1) : prevMastery;

    setMasteryMap((m) => ({ ...m, [prevLetter]: nextMastery }));
    setRecentHistory((h) => [...h, prevLetter].slice(-8));

    const reward = rewardFromAttempt(isCorrect);
    await sendFeedbackToRL({ prevLetter, nextMastery, reward });
    await getNextFromRL(prevLetter);
  };

  // Triggered by the main "Check Answer" button using live model prediction
  const checkAnswer = async () => {
    const isCorrect = currentPrediction === targetLetter && confidence > 70;
    await applyAttemptAndAdvance(isCorrect);
  };

  // --- NEW: explicit RL-next buttons ---
  const nextRLCorrect = async () => {
    await applyAttemptAndAdvance(true);
  };

  const nextRLIncorrect = async () => {
    await applyAttemptAndAdvance(false);
  };

  const resetPractice = () => {
    setTargetLetter("A");
    setScore(0);
    setAttempts(0);
    setCurrentPrediction("");
    setConfidence(0);
    setMasteryMap(
      Object.fromEntries("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => [l, 0]))
    );
    setRecentHistory([]);
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
                        <Button onClick={startCamera}>Start Camera</Button>
                      ) : (
                        <Button onClick={stopCamera} variant="destructive">
                          Stop Camera
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative rounded-lg overflow-hidden bg-slate-100" style={{ aspectRatio: "4/3" }}>
                    {cameraActive ? (
                      <>
                        <HandDetection onPrediction={handlePrediction} isActive={cameraActive} width={640} height={480} />

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
                            <div className="text-xs mt-1 text-green-400 font-bold">✓ Correct!</div>
                          )}
                        </div>

                        {/* Center guide overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="border-2 border-dashed border-white/50 rounded-lg w-80 h-60 flex items-center justify-center">
                            <span className="text-white/70 text-sm bg-black/30 px-2 py-1 rounded">Position your hand here</span>
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
                    <div className="text-6xl font-bold text-blue-600 mb-4">{targetLetter}</div>
                    <p className="text-slate-600 mb-4">Show the ASL sign for letter "{targetLetter}"</p>

                    <TabsContent value="reference" className="mt-4">
                    <div className="relative bg-slate-100 rounded-lg overflow-hidden w-full" style={{ aspectRatio: "4 / 3" }}>
                    <Image
                      key={targetLetter} // reset on letter change so onError re-runs if needed
                      src={`/asl_letters/${targetLetter}.webp`}
                      alt={`ASL reference for letter ${targetLetter}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                      onError={(e) => {
                        // Optional: fall back to PNG or hide if webp missing
                        const img = e.currentTarget as unknown as HTMLImageElement & { src: string };
                        if (!img.src.endsWith(".png")) {
                          img.src = `/asl_letters/${targetLetter}.png`;
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Reference image for “{targetLetter}”
                  </p>
                </TabsContent>


                    {/* Main check button using the live detector */}
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
                        : "Correct! Click to Continue"}
                    </Button>

                    {/* Optional manual next/skip */}
                    <Button onClick={moveToNextLetter} variant="secondary" className="w-full mt-2">
                      Next Letter
                    </Button>

                    {/* Existing RL next without feedback (kept for parity) */}
                    <Button onClick={() => getNextFromRL(targetLetter)} variant="outline" className="w-full mt-2">
                      Next (RL)
                    </Button>

                    {/* NEW: Explicit RL feedback shortcuts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <Button onClick={nextRLCorrect} className="w-full">Next (RL) — Correct</Button>
                      <Button onClick={nextRLIncorrect} variant="destructive" className="w-full">
                        Next (RL) — Incorrect
                      </Button>
                    </div>

                    <div className="mt-4 text-sm text-slate-600 text-left">
                      <div>
                        <strong>Mastery Level:</strong>{" "}
                        {masteryMap[targetLetter] === 0 && "Unseen"}
                        {masteryMap[targetLetter] === 1 && "Practicing"}
                        {masteryMap[targetLetter] === 2 && "Mastered"}
                      </div>
                      <div>
                        <strong>Recent Letters:</strong> {recentHistory.join(", ") || "None"}
                      </div>
                      <div>
                        <strong>Last RL Action:</strong> {lastAction || "N/A"}
                      </div>
                    </div>
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
                      <span className="font-bold">{attempts > 0 ? Math.round((score / attempts) * 100) : 0}%</span>
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