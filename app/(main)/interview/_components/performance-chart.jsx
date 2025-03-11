"use client";

import { format } from 'date-fns';
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';

const PerformanceChart = ({ assessments }) => {

  const [chartData, setChartData] = useState([]);

  useEffect(() => { //use it as soon as we render this component
      if(assessments){
        const formattedData = assessments.map((assessment) => ({
          date: format(new Date(assessment.createdAt), "MMM dd"),
          score: assessment.quizScore,
        }));

        setChartData(formattedData);
      }
  }, [assessments]);//as soon as assessment changes(write logic inside it)
  
  return (
    <Card>
    <CardHeader>
      <CardTitle className="gradient-title text-3xl md:text-4xl">Performance Trend</CardTitle>
      <CardDescription>Your quiz score over time</CardDescription>
    </CardHeader>
    <CardContent>
      <div className='h-[300px]'>
      <ResponsiveContainer width={"100%"} height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]}/>
          <Tooltip content={({active, payload}) => {
            // if is active(i.e we hovering on it) and payload have something
            if(active && payload?.length){
              return (
                <div className='bg-background border rounded-lg p-2 shadow-md'>
                  <p className='text-sm font-medium'>
                    score: {payload[0].value}%
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {payload[0].payload.date}
                  </p>
                </div>
              );
            }
          }}/>
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          ></Line>
        </LineChart>
      </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>

  )
}

export default PerformanceChart;
