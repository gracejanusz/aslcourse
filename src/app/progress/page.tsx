"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - in a real app, this would come from a database
const progressData = {
  overall: {
    lettersLearned: 8,
    totalLetters: 26,
    practiceHours: 12.5,
    quizzesCompleted: 3,
    averageAccuracy: 78
  },
  letterProgress: [
    { letter: 'A', status: 'mastered', accuracy: 95, practiceTime: 45 },
    { letter: 'B', status: 'mastered', accuracy: 88, practiceTime: 52 },
    { letter: 'C', status: 'mastered', accuracy: 92, practiceTime: 38 },
    { letter: 'D', status: 'mastered', accuracy: 85, practiceTime: 47 },
    { letter: 'E', status: 'learning', accuracy: 75, practiceTime: 33 },
    { letter: 'F', status: 'learning', accuracy: 68, practiceTime: 28 },
    { letter: 'G', status: 'learning', accuracy: 72, practiceTime: 31 },
    { letter: 'H', status: 'learning', accuracy: 65, practiceTime: 25 },
    { letter: 'I', status: 'not_started', accuracy: 0, practiceTime: 0 },
  ],
  recentSessions: [
    { date: '2025-01-08', type: 'Practice', duration: 25, accuracy: 82, lettersWorked: ['E', 'F', 'G'] },
    { date: '2025-01-07', type: 'Quiz', duration: 15, score: '4/5', topic: 'Healthcare Basics' },
    { date: '2025-01-06', type: 'Practice', duration: 30, accuracy: 75, lettersWorked: ['D', 'E', 'F'] },
    { date: '2025-01-05', type: 'Lesson', duration: 20, topic: 'Letters A-D Review' },
    { date: '2025-01-04', type: 'Practice', duration: 35, accuracy: 88, lettersWorked: ['A', 'B', 'C'] },
  ],
  achievements: [
    { id: 1, title: 'First Steps', description: 'Complete your first lesson', earned: true, date: '2025-01-02' },
    { id: 2, title: 'Practice Makes Perfect', description: 'Complete 10 practice sessions', earned: true, date: '2025-01-05' },
    { id: 3, title: 'Quiz Master', description: 'Score 80% or higher on a quiz', earned: true, date: '2025-01-07' },
    { id: 4, title: 'Letter Expert', description: 'Master 5 letters', earned: false },
    { id: 5, title: 'Consistency Champion', description: 'Practice for 7 days in a row', earned: false },
    { id: 6, title: 'Healthcare Hero', description: 'Complete all healthcare scenarios', earned: false },
  ]
};

export default function Progress() {
  const masteredLetters = progressData.letterProgress.filter(l => l.status === 'mastered').length;
  const learningLetters = progressData.letterProgress.filter(l => l.status === 'learning').length;

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
                <Button variant="ghost">Quiz</Button>
              </Link>
              <Link href="/progress">
                <Button variant="default">Progress</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Your Learning Progress</h1>
          <p className="text-lg text-slate-600">
            Track your ASL learning journey and see how you're improving over time.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Letters Learned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {progressData.overall.lettersLearned}/{progressData.overall.totalLetters}
              </div>
              <ProgressBar value={(progressData.overall.lettersLearned / progressData.overall.totalLetters) * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Practice Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {progressData.overall.practiceHours}
              </div>
              <p className="text-sm text-slate-600">Total time spent practicing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quiz Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {progressData.overall.averageAccuracy}%
              </div>
              <p className="text-sm text-slate-600">Average across all quizzes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quizzes Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {progressData.overall.quizzesCompleted}
              </div>
              <p className="text-sm text-slate-600">Knowledge assessments taken</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="letters" className="space-y-6">
          <TabsList>
            <TabsTrigger value="letters">Letter Progress</TabsTrigger>
            <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="letters">
            <Card>
              <CardHeader>
                <CardTitle>ASL Alphabet Progress</CardTitle>
                <CardDescription>
                  Your progress on each letter of the ASL alphabet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {progressData.letterProgress.map((letter) => (
                    <div key={letter.letter} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold text-blue-600">
                          {letter.letter}
                        </div>
                        <Badge
                          variant={
                            letter.status === 'mastered' ? 'default' :
                            letter.status === 'learning' ? 'secondary' : 'outline'
                          }
                          className={
                            letter.status === 'mastered' ? 'bg-green-100 text-green-800' :
                            letter.status === 'learning' ? 'bg-yellow-100 text-yellow-800' : ''
                          }
                        >
                          {letter.status === 'mastered' ? 'Mastered' :
                           letter.status === 'learning' ? 'Learning' : 'Not Started'}
                        </Badge>
                      </div>

                      {letter.status !== 'not_started' && (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Accuracy</span>
                              <span className="font-medium">{letter.accuracy}%</span>
                            </div>
                            <ProgressBar value={letter.accuracy} className="h-2" />

                            <div className="flex justify-between text-sm text-slate-600">
                              <span>Practice Time</span>
                              <span>{letter.practiceTime} min</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{masteredLetters}</div>
                    <div className="text-sm text-green-700">Mastered</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-600">{learningLetters}</div>
                    <div className="text-sm text-yellow-700">In Progress</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-slate-600">
                      {26 - masteredLetters - learningLetters}
                    </div>
                    <div className="text-sm text-slate-700">Not Started</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Learning Sessions</CardTitle>
                <CardDescription>
                  Your latest practice sessions, quizzes, and lessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.recentSessions.map((session, index) => (
                    <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={
                            session.type === 'Practice' ? 'default' :
                            session.type === 'Quiz' ? 'secondary' : 'outline'
                          }>
                            {session.type}
                          </Badge>
                          <span className="text-sm text-slate-600">{session.date}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="font-medium">
                            {session.type === 'Practice' && `Letters: ${session.lettersWorked?.join(', ')}`}
                            {session.type === 'Quiz' && `Score: ${session.score} - ${session.topic}`}
                            {session.type === 'Lesson' && session.topic}
                          </div>

                          <div className="text-sm text-slate-600">
                            Duration: {session.duration} minutes
                            {session.accuracy && ` • Accuracy: ${session.accuracy}%`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Milestones</CardTitle>
                <CardDescription>
                  Track your accomplishments and unlock new badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {progressData.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`border rounded-lg p-4 ${
                        achievement.earned ? 'bg-blue-50 border-blue-200' : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.earned ? 'bg-blue-100' : 'bg-slate-200'
                        }`}>
                          {achievement.earned ? (
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                        </div>

                        {achievement.earned && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Earned
                          </Badge>
                        )}
                      </div>

                      <div>
                        <h3 className={`font-semibold mb-1 ${
                          achievement.earned ? 'text-slate-900' : 'text-slate-500'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${
                          achievement.earned ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          {achievement.description}
                        </p>

                        {achievement.earned && achievement.date && (
                          <p className="text-xs text-blue-600 mt-2">
                            Earned on {achievement.date}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Continue Learning CTA */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Keep Up the Great Work!
          </h2>
          <p className="text-slate-600 mb-6">
            You're making excellent progress. Continue practicing to improve your ASL skills and better serve your patients.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/practice">
              <Button size="lg">
                Continue Practicing
              </Button>
            </Link>
            <Link href="/lessons">
              <Button size="lg" variant="outline">
                Next Lesson
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
