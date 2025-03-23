"use client"

import React from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface FormData {
  form_title: string
  approved: number
  rejected: number
  draft: number
  total: number
}

interface FormLineGraphProps {
  data?: FormData[]
}

const FormLineGraph: React.FC<FormLineGraphProps> = ({ data = [] }) => {
  // Transform data to the format expected by the chart
  const chartData = data.map(form => ({
    name: form.form_title.length > 20 ? 
      form.form_title.substring(0, 3) + '...' + form.form_title.substring(form.form_title.length - 10) : 
      form.form_title,
    approved: form.approved,
    rejected: form.rejected,
    draft: form.draft,
    fullTitle: form.form_title // Keep full title for tooltip
  }))

  // Configure chart colors and labels
  const chartConfig = {
    approved: {
      label: "Approved",
      color: "var(--primary)",
    },
    rejected: {
      label: "Rejected",
      color: "hsl(var(--destructive))",
    },
    draft: {
      label: "Draft",
      color: "hsl(var(--muted-foreground))",
    },
  } satisfies ChartConfig

  return (
    <Card className="w-full border-0">
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 20,
              right: 20,
              top: 10,
              bottom: 20
            }}
            height={300}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              angle={-20}
              height={60}
              interval={0}
              tick={{ fontSize: 0 }}
            />
            <YAxis 
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={20}
            />
            <ChartTooltip 
              cursor={false} 
              content={
                <ChartTooltipContent 
                  labelFormatter={(label) => {
                    const item = chartData.find(item => item.name === label);
                    return item ? item.fullTitle : label;
                  }}
                />
              } 
            />
            <Line
              dataKey="approved"
              type="monotone"
              strokeWidth={5}
              stroke='var(--primary)'
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="rejected"
              type="monotone"
              strokeWidth={5}
              stroke='var(--background)'
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="draft"
              type="monotone"
              strokeWidth={5}
              stroke='var(--primary)'
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default FormLineGraph