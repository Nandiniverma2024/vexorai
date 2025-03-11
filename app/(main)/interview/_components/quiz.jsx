"use client"

import useFetch from '@/hooks/use-fetch';
import { useEffect, useState } from 'react';
import { generateQuiz, saveQuizResult } from '@/actions/interview';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { BarLoader } from 'react-spinners';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import QuizResult from '../../dashboard/_components/quiz-result';

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0); //currentQues is 0 bydefault
    const [answers, setAnswers] = useState([]);
    const [showExplanation, setShowExplanation] = useState(false);

    const {
        loading: generatingQuiz,
        fn: generateQuizFn,
        data: quizData,
    } = useFetch(generateQuiz); // we need to fetch the quiz data

    // Let's take other server action SaveQuiz result
    const {
        loading: savingResult,
        fn: saveQuizResultFn,
        data: resultData,
        setData: setResultData,
    } = useFetch(saveQuizResult);

    console.log(resultData);

    useEffect(() => {
        if(quizData){ //if something is changing in quiz data , then make all answers null initially
            setAnswers(new Array(quizData.length).fill(null));
        }
    }, [quizData]);

    const handleAnswer = (answer) => { //Take whatever the user's answer
        const newAnswers = [...answers]; // Create shallow copy of it
        newAnswers[currentQuestion] = answer; // update user answer by that (answer copy)
        setAnswers(newAnswers); // Then update the array back
    };

    const handleNext = () => {
        if(currentQuestion < quizData.length - 1){
            setCurrentQuestion(currentQuestion+1);
            setShowExplanation(false);
        }else{
            finishQuiz();
        }
    }

    const calculateScore = () => {
        let correct = 0;
        answers.forEach((answer, index) => { //Loop through all of the user answers
            if (answer === quizData[index].correctAnswer){ //if correct answer == answer 
                correct++; //Increase correct count
            }
        });
        return (correct / quizData.length)*100;
    };

    const finishQuiz = async () => {
        const score = calculateScore();

        try {
            await saveQuizResultFn(quizData, answers, score)
            toast.success("Quiz completed!");
        } catch (error) {
            toast.error(error.message || "Failed to save quiz results");
        }
    };

    const startNewQuiz = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setShowExplanation(false);
        generateQuizFn();
        setResultData(null);
    }

    if(generatingQuiz){
        return <BarLoader className='mt-4' width={"100%"} color="gray"/>;
    }

    // Show results if quiz is completed
    if(resultData){ //If resultData is there, return QuizResult component
        return(
            <div className='mx-2'>
                {/* send resultData in result , send a onStartNew prop where we trigger this startNewQuiz */}
                <QuizResult result={resultData} onStartNew={startNewQuiz}/>
            </div>
        )
    }

    if(!quizData){
        return (
            <Card className="mx-2">
                <CardHeader>
                    <CardTitle>Ready to test your knowledge</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground'>
                        This quiz contains 10 questions specific to your industry and skills. Take your time and choose the best answer for each question.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={generateQuizFn}>Start Quiz</Button>
                </CardFooter>
            </Card>
        );
    };

    // Now, make question = currentQuestion
    const question = quizData[currentQuestion];

    return (
        <Card className="mx-2">
            <CardHeader>
                <CardTitle>
                    Question {currentQuestion + 1} of {quizData.length}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className='text-lg font-medium'>{question.question}</p>
                {/* Render options from our question */}
                <RadioGroup 
                    className="space-y-2"
                    onValueChange={handleAnswer}
                    value={answers[currentQuestion]}// Value -> answers of currentQuestions
                >
                    {question.options.map((option, index) => {
                        return (
                            <div className="flex items-center space-x-2" key={index}>
                                <RadioGroupItem value={option} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`}>{option}</Label>
                            </div>
                        );
                    })}
                </RadioGroup>

                {/* Add explaination of answers */}
                {showExplanation && (
                    <div className='mt-4 p-4 bg-muted rounded-lg'>
                        <p className='font-medium'>Explanation:</p>
                        <p className='text-muted-foreground'>{question.explanation}</p>
                    </div>
                )}

            </CardContent>
            <CardFooter>
                {!showExplanation && ( // if explanation is not true
                    <Button
                        onClick={() => setShowExplanation(true)} //Button ke click karne pr setExplanation true ho jaygi
                        variant="outline"
                        disabled={!answers[currentQuestion]}
                    >
                        Show Explanation
                    </Button>
                )}

                <Button
                    onClick={handleNext} //Button ke click karne pr setExplanation true ho jaygi
                    className="ml-auto"
                    disabled={!answers[currentQuestion] || savingResult} //Result save karte time 
                    // ye button disable hona chahiye
                >
                    {/* Display a barloader, when we are saving our result */}
                    {savingResult && (
                        <Loader2 width={"100%"} color="gray" />
                    )}
                    {/* If current ques < last ques. ,show next ques. else show Finish Quiz */}
                    {currentQuestion < quizData.length-1 
                    ? "Next Question"
                    : "Finish Quiz"}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default Quiz
