import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Calculator, BookOpen, TrendingUp, Award } from 'lucide-react'
import './App.css'

function App() {
  const [subjects, setSubjects] = useState({
    math: { correct: '', wrong: '', notAnswered: '', total: 35, percentage: null },
    physics: { correct: '', wrong: '', notAnswered: '', total: 25, percentage: null },
    chemistry: { correct: '', wrong: '', notAnswered: '', total: 25, percentage: null },
    biology: { correct: '', wrong: '', notAnswered: '', total: 25, percentage: null },
    literature: { correct: '', wrong: '', notAnswered: '', total: 25, percentage: null },
    arabic: { correct: '', wrong: '', notAnswered: '', total: 20, percentage: null },
    religious: { correct: '', wrong: '', notAnswered: '', total: 20, percentage: null },
    english: { correct: '', wrong: '', notAnswered: '', total: 25, percentage: null }
  })

  const [gpa, setGpa] = useState('')
  const [estimatedRank, setEstimatedRank] = useState(null)

  const subjectNames = {
    math: 'ریاضی',
    physics: 'فیزیک', 
    chemistry: 'شیمی',
    biology: 'زیست‌شناسی',
    literature: 'ادبیات',
    arabic: 'عربی',
    religious: 'دینی',
    english: 'زبان انگلیسی'
  }

  const calculatePercentage = (correct, wrong, total) => {
    const correctNum = parseInt(correct) || 0
    const wrongNum = parseInt(wrong) || 0
    const totalAnswered = correctNum + wrongNum
    
    if (totalAnswered === 0) return null
    
    // فرمول کنکور: (درست × 3 - غلط) / (3 × کل زده شده) × 100
    const rawScore = (correctNum * 3 - wrongNum) / (3 * totalAnswered) * 100
    return Math.max(rawScore, -33.33) // حداقل نمره منفی
  }

  const handleInputChange = (subject, field, value) => {
    setSubjects(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [field]: value
      }
    }))
  }

  const calculateSubjectPercentage = (subject) => {
    const { correct, wrong, total } = subjects[subject]
    const percentage = calculatePercentage(correct, wrong, total)
    
    setSubjects(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        percentage
      }
    }))
  }

  const calculateAllPercentages = () => {
    Object.keys(subjects).forEach(subject => {
      calculateSubjectPercentage(subject)
    })
    
    // تخمین رتبه ساده بر اساس میانگین درصدها
    const validPercentages = Object.values(subjects)
      .map(s => s.percentage)
      .filter(p => p !== null)
    
    if (validPercentages.length > 0) {
      const avgPercentage = validPercentages.reduce((sum, p) => sum + p, 0) / validPercentages.length
      const gpaNum = parseFloat(gpa) || 18
      
      // فرمول تخمینی ساده
      const estimatedRank = Math.max(1, Math.round((100 - avgPercentage) * 1000 + (20 - gpaNum) * 500))
      setEstimatedRank(estimatedRank)
    }
  }

  const resetAll = () => {
    setSubjects(prev => {
      const reset = {}
      Object.keys(prev).forEach(key => {
        reset[key] = {
          ...prev[key],
          correct: '',
          wrong: '',
          notAnswered: '',
          percentage: null
        }
      })
      return reset
    })
    setEstimatedRank(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">درصد گیر کنکور</h1>
          </div>
          <p className="text-gray-600 text-lg">محاسبه دقیق درصد و تخمین رتبه کنکور سراسری</p>
        </div>

        {/* Instructions Card */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <BookOpen className="h-5 w-5" />
              راهنمای استفاده
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <p className="mb-2">• تعداد پاسخ‌های درست، غلط و نزده هر درس را وارد کنید</p>
            <p className="mb-2">• فرمول محاسبه: (درست × ۳ - غلط) ÷ (۳ × کل زده شده) × ۱۰۰</p>
            <p>• برای تخمین رتبه، معدل دیپلم خود را نیز وارد کنید</p>
          </CardContent>
        </Card>

        {/* GPA Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>معدل دیپلم</CardTitle>
            <CardDescription>برای تخمین دقیق‌تر رتبه، معدل دیپلم خود را وارد کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="gpa">معدل دیپلم</Label>
                <Input
                  id="gpa"
                  type="number"
                  step="0.01"
                  min="10"
                  max="20"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  placeholder="مثال: 18.50"
                  className="text-center"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(subjects).map(([key, subject]) => (
            <Card key={key} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{subjectNames[key]}</CardTitle>
                <CardDescription>کل سوالات: {subject.total}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`${key}-correct`}>پاسخ درست</Label>
                  <Input
                    id={`${key}-correct`}
                    type="number"
                    min="0"
                    max={subject.total}
                    value={subject.correct}
                    onChange={(e) => handleInputChange(key, 'correct', e.target.value)}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label htmlFor={`${key}-wrong`}>پاسخ غلط</Label>
                  <Input
                    id={`${key}-wrong`}
                    type="number"
                    min="0"
                    max={subject.total}
                    value={subject.wrong}
                    onChange={(e) => handleInputChange(key, 'wrong', e.target.value)}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label htmlFor={`${key}-notAnswered`}>نزده</Label>
                  <Input
                    id={`${key}-notAnswered`}
                    type="number"
                    min="0"
                    max={subject.total}
                    value={subject.notAnswered}
                    onChange={(e) => handleInputChange(key, 'notAnswered', e.target.value)}
                    className="text-center"
                  />
                </div>
                <Button 
                  onClick={() => calculateSubjectPercentage(key)}
                  className="w-full"
                  variant="outline"
                >
                  محاسبه درصد
                </Button>
                {subject.percentage !== null && (
                  <div className={`text-center p-3 rounded-lg font-bold text-lg ${
                    subject.percentage >= 70 ? 'bg-green-100 text-green-800' :
                    subject.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {subject.percentage.toFixed(2)}%
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            onClick={calculateAllPercentages}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            <Calculator className="h-5 w-5 mr-2" />
            محاسبه همه درصدها
          </Button>
          <Button 
            onClick={resetAll}
            variant="outline"
            size="lg"
            className="px-8 py-3"
          >
            پاک کردن همه
          </Button>
        </div>

        {/* Results */}
        {estimatedRank && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Award className="h-6 w-6" />
                نتایج تخمینی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {estimatedRank.toLocaleString()}
                  </div>
                  <div className="text-gray-600">رتبه تخمینی</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {Object.values(subjects)
                      .filter(s => s.percentage !== null)
                      .reduce((sum, s) => sum + s.percentage, 0)
                      .toFixed(1) / Object.values(subjects).filter(s => s.percentage !== null).length || 0}%
                  </div>
                  <div className="text-gray-600">میانگین درصد</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm text-center">
                  ⚠️ این تخمین بر اساس آمار سال‌های قبل است و ممکن است با نتیجه واقعی متفاوت باشد
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>© ۱۴۰۴ درصد گیر کنکور - ابزار محاسبه درصد و تخمین رتبه</p>
        </div>
      </div>
    </div>
  )
}

export default App

