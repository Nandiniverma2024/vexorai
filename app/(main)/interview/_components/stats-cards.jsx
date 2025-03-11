import React from 'react'
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Brain, Trophy } from 'lucide-react';

const StatsCards = ({ assessments }) => {

  // Calculate average score
  const getAverageScore = () => {
    if(!assessments?.length) return 0; //Check if we have any assessment or not,if not, return 0
    const total = assessments.reduce( // if we have assessments
      (sum, assessment) => sum + assessment.quizScore,//Take each nd every assessment and add sum to it ,by-default sum is 0
      0
    );
    return (total / assessments.length).toFixed(1);//here we got %
  };

  // For latest assessment give 0th assessment
  const getLatestAssessment = () => {
    if(!assessments.length) return null;
    return assessments[0];
  };

  // For TotalQuestions => Take each nd every quiz and add question.length inside it
  const getTotalQuestions = () => {
    if(!assessments?.length) return 0;
    return assessments.reduce(
      (sum , assessment) => sum + assessment.questions.length,
      0
    );
  };

  return (
    <div className='grid gap-4 md:grid-cols-3'>
       <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="size-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageScore()}%</div>
            <p className="text-xs text-muted-foreground">
              Across all assessment
            </p>
          </CardContent>
        </Card>  

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Practiced</CardTitle>
            <Brain className="size-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalQuestions()}</div>
            <p className="text-xs text-muted-foreground">Total questions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
            <Trophy className="size-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getLatestAssessment()?.quizScore.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Most recent quiz</p>
          </CardContent>
        </Card>
    </div>
  )
}

export default StatsCards;
