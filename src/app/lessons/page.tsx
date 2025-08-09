import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const aslAlphabet = [
  { letter: 'A', medical_word: 'Allergy', description: 'Essential for documenting patient allergies' },
  { letter: 'B', medical_word: 'Blood', description: 'Critical in emergency and routine care' },
  { letter: 'C', medical_word: 'Care', description: 'Foundation of all healthcare interactions' },
  { letter: 'D', medical_word: 'Doctor', description: 'Professional identification' },
  { letter: 'E', medical_word: 'Emergency', description: 'Urgent situation communication' },
  { letter: 'F', medical_word: 'Family', description: 'Important for patient support systems' },
  { letter: 'G', medical_word: 'Good', description: 'Positive reinforcement and status updates' },
  { letter: 'H', medical_word: 'Help', description: 'Critical for assistance requests' },
  { letter: 'I', medical_word: 'Injection', description: 'Common medical procedure' },
  { letter: 'J', medical_word: 'Joint', description: 'Orthopedic and physical therapy' },
  { letter: 'K', medical_word: 'Kidney', description: 'Important organ system' },
  { letter: 'L', medical_word: 'Lung', description: 'Respiratory health communication' },
  { letter: 'M', medical_word: 'Medicine', description: 'Medication management' },
  { letter: 'N', medical_word: 'Nurse', description: 'Healthcare team identification' },
  { letter: 'O', medical_word: 'Okay', description: 'Confirmation and comfort' },
  { letter: 'P', medical_word: 'Pain', description: 'Essential for assessment' },
  { letter: 'Q', medical_word: 'Question', description: 'Encouraging patient inquiries' },
  { letter: 'R', medical_word: 'Rest', description: 'Recovery instructions' },
  { letter: 'S', medical_word: 'Surgery', description: 'Major procedure communication' },
  { letter: 'T', medical_word: 'Treatment', description: 'Care plan discussions' },
  { letter: 'U', medical_word: 'Urgent', description: 'Priority level communication' },
  { letter: 'V', medical_word: 'Vital', description: 'Signs and life-critical information' },
  { letter: 'W', medical_word: 'Water', description: 'Hydration and basic needs' },
  { letter: 'X', medical_word: 'X-ray', description: 'Diagnostic imaging' },
  { letter: 'Y', medical_word: 'Yes', description: 'Affirmative communication' },
  { letter: 'Z', medical_word: 'Zone', description: 'Area or location specification' }
];

export default function Lessons() {
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
          <h1 className="text-3xl font-bold text-slate-900 mb-4">ASL Alphabet for Healthcare</h1>
          <p className="text-lg text-slate-600 mb-6">
            Learn the American Sign Language alphabet with healthcare-focused vocabulary.
            Each letter is paired with a medical term to help you build practical skills for patient care.
          </p>

          {/* Progress Bar */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Overall Progress</span>
              <span className="text-sm text-slate-600">8/26 letters learned</span>
            </div>
            <Progress value={31} className="w-full" />
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {aslAlphabet.map((item, index) => (
            <Card key={item.letter} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl font-bold text-blue-600 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center">
                    {item.letter}
                  </div>
                  {index < 8 ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Learned
                    </Badge>
                  ) : index < 12 ? (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      In Progress
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Locked
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{item.medical_word}</CardTitle>
                <CardDescription className="text-sm">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* ASL Hand Sign Placeholder */}
                  <div className="bg-slate-100 h-32 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <div className="text-center text-slate-500">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 6h8m-8 4h8m-8 4h8M5 6v12a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1z" />
                      </svg>
                      <span className="text-xs">ASL Sign for "{item.letter}"</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={index < 8 ? "default" : index < 12 ? "secondary" : "outline"}
                    disabled={index >= 12}
                  >
                    {index < 8 ? "Review Lesson" : index < 12 ? "Start Lesson" : "Unlock"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Practice?</h2>
          <p className="text-slate-600 mb-6">
            Once you've learned a few letters, try our interactive camera practice to test your skills in real-time.
          </p>
          <div className="flex space-x-4">
            <Link href="/practice">
              <Button size="lg">
                Try Camera Practice
              </Button>
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
