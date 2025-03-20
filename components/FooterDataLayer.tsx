// 'use client'
// import React, { useState, useEffect, useRef, FC } from 'react'
// import CountUp from 'react-countup'
// import styled from 'styled-components'

// // ==================== 类型定义 ====================
// interface Theme {
//   primary: string
//   secondary: string
//   bg: string
//   surface: string
//   text: string
//   accent: string
// }

// interface CalendarDay {
//   date: string
//   count: number
// }

// interface FooterData {
//   calendar: CalendarDay[]
//   visits: number[]
//   totalVisits: number
// }

// interface DotProps {
//   intensity: number
//   title: string
// }

// // ==================== 主题配置 ====================
// const theme: Theme = {
//   primary: '#6366f1',
//   secondary: '#4f46e5',
//   bg: '#f8fafc',
//   surface: '#ffffff',
//   text: '#1e293b',
//   accent: '#10b981'
// }

// // ==================== 主组件 ====================
// interface FooterDataLayerProps {
//   data: FooterData
// }

// export const FooterDataLayer: FC<FooterDataLayerProps> = ({ data }) => {
//   return (
//     <DataContainer>
//       <CalendarGrid data={data.calendar} />
//       <MiniLineChart data={data.visits} />
//       <VisitCounter total={data.totalVisits} />
//     </DataContainer>
//   )
// }

// // ==================== 子组件 ====================
// interface CalendarGridProps {
//   data: CalendarDay[]
// }

// const CalendarGrid: FC<CalendarGridProps> = ({ data }) => {
//   return (
//     <CalendarContainer>
//       <h3>最近30天更新频率</h3>
//       <Grid>
//         {data.map((day, index) => (
//           <Dot
//             key={index}
//             intensity={day.count}
//             title={`${day.date}: ${day.count}次更新`}
//           />
//         ))}
//       </Grid>
//     </CalendarContainer>
//   )
// }

// interface MiniLineChartProps {
//   data: number[]
// }

// const MiniLineChart: FC<MiniLineChartProps> = ({ data }) => {
//   const points = generatePath(data)
//   const maxY = Math.max(...data)

//   return (
//     <ChartContainer>
//       <h3>近7日访问趋势</h3>
//       <svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet">
//         <path
//           d="M 0 45 H 100 M 0 30 H 100 M 0 15 H 100"
//           className="grid-line"
//         />
//         <path
//           d={points}
//           fill={`rgba(99, 102, 241, 0.1)`}
//           stroke={theme.primary}
//           strokeWidth="1.5"
//           strokeLinejoin="round"
//           strokeLinecap="round"
//         />
//         {data.map((value, i) => (
//           <circle
//             key={i}
//             cx={(i * 100) / (data.length - 1)}
//             cy={38 - (value / maxY) * 35}
//             r="2.5"
//           />
//         ))}
//       </svg>
//     </ChartContainer>
//   )
// }

// interface VisitCounterProps {
//   total: number
// }

// const VisitCounter: FC<VisitCounterProps> = ({ total }) => {
//   const [isMounted, setIsMounted] = useState<boolean>(false)
//   const [isVisible, setIsVisible] = useState<boolean>(false)
//   const counterRef = useRef<HTMLDivElement>(null)

//   useEffect(() => setIsMounted(true), [])

//   return (
//     <CounterContainer ref={counterRef}>
//       <h3>总访问量</h3>
//       <div>
//         <span className="base-count">{total.toLocaleString()}</span>
//         {isMounted && isVisible && (
//           <CountUp
//             className="animated-count"
//             start={0}
//             end={total}
//             duration={2.5}
//             separator=","
//           />
//         )}
//       </div>
//     </CounterContainer>
//   )
// }

// // ==================== 工具函数 ====================
// function generateCalendarData(): CalendarDay[] {
//   return Array.from({ length: 30 }, (_, i) => {
//     const date = new Date()
//     date.setDate(date.getDate() - i)
//     return {
//       date: date.toISOString().split('T'),
//       count: Math.floor(Math.random() * 4)
//     }
//   }).reverse()
// }

// function generateVisitsData(): number[] {
//   return Array.from({ length: 7 }, (_, i) =>
//     Math.floor(Math.random() * 1000 + 200)
//   )
// }

// function generatePath(data: number[]): string {
//   const max = Math.max(...data) || 1
//   return data
//     .map((value, i) => {
//       const x = (i * 100) / (data.length - 1)
//       const y = 45 - (value / max) * 35
//       return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
//     })
//     .join(' ')
// }

// // ==================== 样式组件 ====================
// const DataContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 1.5rem;
//   padding: 2rem;
//   background: ${theme.bg};
//   max-width: 1200px;
//   margin: 0 auto;
//   box-sizing: border-box;
//   min-height: 280px;
//   position: relative;
//   z-index: 10;

//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//     gap: 1rem;
//     padding: 1rem;
//   }

//   > * {
//     background: ${theme.surface};
//     border-radius: 12px;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
//     padding: 1.5rem;
//     transition: transform 0.2s;

//     &:hover {
//       transform: translateY(-2px);
//     }
//   }
// `

// const CalendarContainer = styled.div`
//   h3 {
//     color: ${theme.text};
//     font-size: 0.95rem;
//     font-weight: 600;
//     margin-bottom: 1.25rem;
//   }
// `

// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(7, 1fr);
//   gap: 5px;
// `

// const Dot = styled.div<DotProps>`
//   width: 16px;
//   height: 16px;
//   border-radius: 4px;
//   background: ${props => `rgba(99, 102, 241, ${0.2 + props.intensity * 0.2})`};
//   position: relative;

//   &:hover::after {
//     content: attr(title);
//     position: absolute;
//     bottom: 120%;
//     left: 50%;
//     transform: translateX(-50%);
//     background: ${theme.text};
//     color: white;
//     padding: 4px 8px;
//     border-radius: 4px;
//     font-size: 0.75rem;
//     white-space: nowrap;
//   }
// `

// const ChartContainer = styled.div`
//   h3 {
//     color: ${theme.text};
//     font-size: 0.95rem;
//     font-weight: 600;
//     margin-bottom: 1.5rem;
//   }

//   svg {
//     width: 100%;
//     height: 100px;
//     overflow: visible;

//     path {
//       filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.1));
//     }

//     circle {
//       fill: ${theme.primary};
//       transition: r 0.2s;

//       &:hover {
//         r: 4;
//       }
//     }

//     .grid-line {
//       stroke: #e2e8f0;
//       stroke-width: 0.5;
//     }
//   }
// `

// const CounterContainer = styled.div`
//   font-size: 2.25rem;
//   color: ${theme.secondary};
//   font-weight: 600;

//   h3 {
//     color: ${theme.text};
//     font-size: 0.95rem;
//     margin-bottom: 0.75rem;
//   }

//   div {
//     font-family: 'SF Mono', monospace;
//     letter-spacing: -0.025em;
//   }
// `