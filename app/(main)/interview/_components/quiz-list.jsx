"use client"; //since we are using hooks over here

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QuizResult from "../../dashboard/_components/quiz-result";


const QuizList = ({ assessments }) => {

  const router = useRouter();
  const[selectedQuiz, setSelctedQuiz] = useState(null);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="gradient-title text-3xl md:text-4xl">
              Recent Quizzes
            </CardTitle>
            <CardDescription>Review your past quiz performance</CardDescription>
          </div>

          <Button onClick={() => router.push("interview/mock")}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((assessment, i) => {
              return (
                <Card 
                  key={assessment.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelctedQuiz(assessment)}
                >
                  <CardHeader>
                    <CardTitle>Quiz{i + 1}</CardTitle>
                    <CardDescription className="flex justify-between w-full">
                      {/* 1.Sore of the quiz, 2.When that quiz was conducted */}
                      <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                      <div>
                        {format(
                          new Date(assessment.createdAt),
                          "MMMM dd, yyyy HH:mm"
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {assessment.improvementTip}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* dialog */}
      {/* open the dialog, when we have something inside the selectedQuiz */}
      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelctedQuiz(null)}> {/* when we close this, we will remove everything inside the selectedQuiz */}
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <QuizResult 
            result={selectedQuiz}
            onStartNew={() => router.push("/interview/mock")}
            hideStartNew //it is a flag, from quiz-result
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default QuizList;