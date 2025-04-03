"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts'
import { useTheme } from "next-themes"
import { formatCurrency } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUpIcon } from "lucide-react"
import { cn } from '@/lib/utils'

// Define the types of sales data
export type SalesOverviewType = 'REVENUE' | 'ORDERS' | 'CUSTOMERS';

interface SalesDataItem {
  month: string;
  value: number;
  target?: number;
}

interface SalesOverviewChartProps {
  data: {
    REVENUE?: SalesDataItem[];
    ORDERS?: SalesDataItem[];
    CUSTOMERS?: SalesDataItem[];
  };
  year: number;
}

const SalesOverviewChart = ({ data, year }: SalesOverviewChartProps) => {
  const [selectedType, setSelectedType] = useState<SalesOverviewType>('REVENUE');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Color settings for each data type
  const colorSettings = {
    REVENUE: {
      main: isDark ? '#34d399' : '#10b981', // emerald-400/500
      target: isDark ? '#fbbf24' : '#f59e0b', // amber-400/500
      title: 'Doanh Thu',
      tabClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      valueFormatter: (value: number) => formatCurrency(value),
      background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
    },
    ORDERS: {
      main: isDark ? '#60a5fa' : '#3b82f6', // blue-400/500
      target: isDark ? '#fbbf24' : '#f59e0b', // amber-400/500
      title: 'Đơn Hàng',
      tabClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      valueFormatter: (value: number) => Math.round(value).toLocaleString('vi-VN'),
      background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
    },
    CUSTOMERS: {
      main: isDark ? '#a78bfa' : '#8b5cf6', // violet-400/500
      target: isDark ? '#fbbf24' : '#f59e0b', // amber-400/500
      title: 'Khách Hàng',
      tabClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
      valueFormatter: (value: number) => Math.round(value).toLocaleString('vi-VN'),
      background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)'
    }
  };

  // Get the current data based on selected type - ensure it's an array
  const currentData = Array.isArray(data[selectedType]) ? data[selectedType] : [];
  
  // Calculate totals safely
  const totalValue = currentData.reduce((sum, item) => {
    return sum + (typeof item.value === 'number' ? item.value : 0);
  }, 0);
  
  const totalTarget = currentData.reduce((sum, item) => {
    return sum + (typeof item.target === 'number' ? item.target : 0);
  }, 0);
  
  const percentOfTarget = totalTarget ? (totalValue / totalTarget * 100).toFixed(1) : '0.0';
  const percentNum = parseFloat(percentOfTarget);
  
  // Function to handle tab change
  const handleTabChange = (value: string) => {
    setSelectedType(value as SalesOverviewType);
  };
  
  return (
    <Card className="col-span-1 md:col-span-2 overflow-hidden border border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-card/50 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-primary" />
              Biểu Đồ Hoạt Động {year}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-1">
              So sánh chỉ tiêu và thực tế theo tháng
            </CardDescription>
          </div>
          
          <Tabs value={selectedType} onValueChange={handleTabChange} className="w-full max-w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger 
                value="REVENUE" 
                className={selectedType === 'REVENUE' ? colorSettings.REVENUE.tabClass : ''}
              >
                Doanh Thu
              </TabsTrigger>
              <TabsTrigger 
                value="ORDERS" 
                className={selectedType === 'ORDERS' ? colorSettings.ORDERS.tabClass : ''}
              >
                Đơn Hàng
              </TabsTrigger>
              <TabsTrigger 
                value="CUSTOMERS" 
                className={selectedType === 'CUSTOMERS' ? colorSettings.CUSTOMERS.tabClass : ''}
              >
                Khách Hàng
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="px-1 pt-6">
        <div className="flex flex-col md:flex-row gap-4 px-4 mb-4">
          <div className="flex-1 rounded-lg p-4" style={{ backgroundColor: colorSettings[selectedType].background }}>
            <div className="text-sm font-medium text-muted-foreground">Tổng {colorSettings[selectedType].title}</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{colorSettings[selectedType].valueFormatter(totalValue)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Chỉ tiêu: {colorSettings[selectedType].valueFormatter(totalTarget)}</div>
          </div>
          
          <div className="flex-1 rounded-lg p-4" style={{ backgroundColor: colorSettings[selectedType].background }}>
            <div className="text-sm font-medium text-muted-foreground">Hoàn Thành Chỉ Tiêu</div>
            <div className="mt-1 text-2xl font-bold text-foreground flex items-center gap-1">
              <span className={cn(
                percentNum >= 100 ? 'text-emerald-600 dark:text-emerald-400' : 
                percentNum >= 75 ? 'text-amber-600 dark:text-amber-400' :
                'text-red-600 dark:text-red-400'
              )}>
                {percentOfTarget}%
              </span>
              <span className="text-xs text-muted-foreground mt-1">của mục tiêu</span>
            </div>
            <div className="w-full h-2 bg-muted/30 rounded-full mt-2">
              <div 
                className={cn(
                  "h-full rounded-full",
                  percentNum >= 100 ? 'bg-emerald-500 dark:bg-emerald-400' : 
                  percentNum >= 75 ? 'bg-amber-500 dark:bg-amber-400' :
                  'bg-red-500 dark:bg-red-400'
                )}
                style={{ 
                  width: `${Math.min(Number(percentOfTarget), 100)}%`
                }} 
              />
            </div>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={currentData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                vertical={false} 
              />
              <XAxis 
                dataKey="month" 
                tick={{ fill: isDark ? 'rgba(255,255,255,0.9)' : 'var(--foreground)', fontSize: 12 }}
                tickLine={{ stroke: isDark ? 'rgba(255,255,255,0.3)' : 'var(--border)' }}
                axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.3)' : 'var(--border)' }}
              />
              <YAxis
                tick={{ fill: isDark ? 'rgba(255,255,255,0.9)' : 'var(--foreground)', fontSize: 12 }}
                tickLine={{ stroke: isDark ? 'rgba(255,255,255,0.3)' : 'var(--border)' }}
                axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.3)' : 'var(--border)' }}
                tickFormatter={(value) => {
                  if (selectedType === 'REVENUE') {
                    return `${(value / 1000000).toFixed(0)}M`;
                  }
                  return value.toLocaleString('vi-VN');
                }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  color: 'var(--card-foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.2)'
                }}
                labelStyle={{ 
                  color: 'var(--foreground)', 
                  fontWeight: 'bold', 
                  marginBottom: '5px' 
                }}
                formatter={(value: number) => [
                  <span key="value">{colorSettings[selectedType].valueFormatter(value)}</span>, 
                  <span key="label">{selectedType === 'REVENUE' ? 'Doanh Thu' : selectedType === 'ORDERS' ? 'Đơn Hàng' : 'Khách Hàng'}</span>
                ]}
                cursor={{ 
                  stroke: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', 
                  strokeWidth: 1, 
                  strokeDasharray: '3 3' 
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => (
                  <span className="text-foreground text-xs font-medium">{value}</span>
                )}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                name={colorSettings[selectedType].title}
                stroke={colorSettings[selectedType].main} 
                strokeWidth={3}
                dot={{ 
                  r: 4, 
                  fill: colorSettings[selectedType].main,
                  strokeWidth: 0 
                }}
                activeDot={{ 
                  r: 6, 
                  fill: colorSettings[selectedType].main,
                  stroke: 'var(--background)',
                  strokeWidth: 2 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                name="Chỉ Tiêu"
                stroke={colorSettings[selectedType].target} 
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={{ 
                  r: 4, 
                  fill: colorSettings[selectedType].target,
                  strokeWidth: 0 
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesOverviewChart 