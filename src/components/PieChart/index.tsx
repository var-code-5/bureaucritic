"use client"

import React from 'react'
import { Pie, PieChart as RechartsPieChart } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export interface FormData {
  form_title: string
  approved: number
  rejected: number
  draft: number
  total: number
}

interface PieChartProps {
  data?: FormData
}

const PieChart: React.FC<PieChartProps> = ({ data = {
  form_title: "No data",
  approved: 0,
  rejected: 0,
  draft: 0,
  total: 0
} }) => {
  // Calculate percentage for the tooltip display
  const total = data.approved + data.rejected + data.draft

  // Create chart data excluding the total field
  const chartData = [
    { status: "approved", value: data.approved, fill: "var(--primary)" },
    { status: "rejected", value: data.rejected, fill: "hsl(var(--primary-foreground))" },
    { status: "draft", value: data.draft, fill: "var(--background)" },
  ].filter(item => item.value > 0) // Only include non-zero values

  // Generate dynamic chart configuration
  const chartConfig: ChartConfig = {
    value: {
      label: "Count",
    },
    approved: {
      label: "Approved",
      color: "var(--primary)",
    },
    rejected: {
      label: "Rejected",
      color: "var(--primary-foreground)",
    },
    draft: {
      label: "Draft",
      color: "var(--background))",
    },
  }

  // Calculate percentage for display
  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  return (
    <div className="flex flex-col rounded-none border-2 border-background h-[90%] ">
        {total > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full "
          >
            <RechartsPieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent 
                    formatter={(value: any) => `${value} (${getPercentage(Number(value))}%)`}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="status"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                cornerRadius={4}
              />
            </RechartsPieChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-lg">No data available</p>
          </div>
        )}
    </div>
  )
}

export default PieChart