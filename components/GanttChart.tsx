import React, { useState, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface GanttChartProps {
  viewMode: string;
}

const mockTasks = [
	{
		id: 'task-1',
		name: 'Bearing Replacement',
		workOrder: 'WO-001',
		startDate: '2025-01-15',
		endDate: '2025-01-17',
		progress: 65,
		assignee: 'John Smith',
		workCenter: 'MC-01',
		dependencies: ['task-3'],
	},
	{
		id: 'task-2',
		name: 'Panel Installation',
		workOrder: 'WO-002',
		startDate: '2025-01-20',
		endDate: '2025-01-25',
		progress: 0,
		assignee: 'Mike Johnson',
		workCenter: 'EC-02',
		dependencies: [],
	},
	{
		id: 'task-3',
		name: 'Flow Meter Cal',
		workOrder: 'WO-003',
		startDate: '2025-01-12',
		endDate: '2025-01-14',
		progress: 100,
		assignee: 'Sarah Davis',
		workCenter: 'IC-01',
		dependencies: [],
	},
	{
		id: 'task-4',
		name: 'Seal Inspection',
		workOrder: 'WO-001',
		startDate: '2025-01-18',
		endDate: '2025-01-19',
		progress: 0,
		assignee: 'John Smith',
		workCenter: 'MC-01',
		dependencies: ['task-1'],
	},
];

const generateTimelineData = (viewMode: string) => {
	const currentDate = new Date('2025-01-01');
	const timeline = [];

	if (viewMode === 'quarter') {
		// Generate 3 months with weeks
		for (let month = 0; month < 3; month++) {
			const monthDate = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth() + month,
				1
			);
			const monthName = monthDate.toLocaleDateString('en-US', {
				month: 'short',
			});

			// Get weeks in this month
			const weeksInMonth = Math.ceil(
				new Date(
					monthDate.getFullYear(),
					monthDate.getMonth() + 1,
					0
				).getDate() / 7
			);
			for (let week = 0; week < weeksInMonth; week++) {
				const weekStart = new Date(
					monthDate.getFullYear(),
					monthDate.getMonth(),
					week * 7 + 1
				);
				timeline.push({
					label: `${monthName} W${week + 1}`,
					date: weekStart.toISOString().split('T')[0],
					isWeekStart: week === 0,
					month: monthName,
				});
			}
		}
	}

	return timeline;
};

export function GanttChart({ viewMode }: GanttChartProps) {
	const [draggedTask, setDraggedTask] = useState<string | null>(null);
	const chartRef = useRef<HTMLDivElement>(null);

	const timeline = generateTimelineData(viewMode);
	const periodLabel =
		viewMode === 'quarter'
			? 'Q1 2025'
			: viewMode === 'half'
			? 'H1 2025'
			: '2025';

	const calculateTaskPosition = (startDate: string, endDate: string) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const timelineStart = new Date('2025-01-01');

		const startOffset = Math.floor(
			(start.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)
		);
		const duration =
			Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
			1;

		const cellWidth =
			viewMode === 'quarter' ? 60 : viewMode === 'half' ? 30 : 15;
		const startPosition = (startOffset / 7) * cellWidth; // Convert days to weeks
		const width = (duration / 7) * cellWidth;

		return { left: startPosition, width: Math.max(width, 20) };
	};

	const handleTaskDragStart = (taskId: string, e: React.DragEvent) => {
		setDraggedTask(taskId);
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleTaskDragEnd = () => {
		setDraggedTask(null);
	};

	const getTaskColor = (workOrder: string) => {
		const colors = {
			'WO-001': 'bg-blue-500',
			'WO-002': 'bg-red-500',
			'WO-003': 'bg-purple-500',
		};
		return colors[workOrder as keyof typeof colors] || 'bg-gray-500';
	};

	return (
		<div className="h-full flex flex-col overflow-hidden">
			{/* Chart Header */}
			<div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800 flex-shrink-0">
				<div className="flex items-center space-x-4">
					<h3 className="text-lg text-gray-900 dark:text-gray-100">
						Schedule Overview
					</h3>
					<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
						<Calendar className="w-4 h-4" />
						<span>{periodLabel}</span>
					</div>
				</div>

				<div className="flex items-center space-x-2">
					<Button variant="outline" size="sm">
						<ChevronLeft className="w-4 h-4" />
					</Button>
					<Button variant="outline" size="sm">
						<ChevronRight className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* Timeline Header */}
			<div
				className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-x-auto overflow-y-hidden"
				ref={chartRef}
				onScroll={(e) => {
					const scrollLeft = e.currentTarget.scrollLeft;
					if (chartRef.current) {
						const bodyElement = chartRef.current.nextElementSibling as HTMLElement;
						if (bodyElement) {
							bodyElement.scrollLeft = scrollLeft;
						}
					}
				}}
			>
				<div className="flex">
					{/* Task Names Column */}
					<div className="w-64 p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex-shrink-0">
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Task / Work Order
						</div>
					</div>

					{/* Timeline Grid Header */}
					<div className="flex">
						{timeline.map((period, index) => (
							<div
								key={index}
								className={`px-2 py-4 border-r border-gray-200 dark:border-gray-700 text-center min-w-[60px] flex-shrink-0 ${
									period.isWeekStart
										? 'border-l-2 border-l-blue-300 dark:border-l-blue-600 bg-blue-50 dark:bg-blue-900/20'
										: 'bg-white dark:bg-gray-800'
								}`}
							>
								<div className="text-xs text-gray-600 dark:text-gray-400">
									{period.label}
								</div>
								{period.isWeekStart && (
									<div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
										{period.month}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Chart Body */}
			<div
				className="flex-1 overflow-auto"
				onScroll={(e) => {
					const scrollLeft = e.currentTarget.scrollLeft;
					if (chartRef.current) {
						chartRef.current.scrollLeft = scrollLeft;
					}
				}}
			>
				<div className="flex">
					{/* Task Names */}
					<div className="w-64 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
						{mockTasks.map((task) => (
							<div
								key={task.id}
								className="p-4 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center"
							>
								<div className="flex-1">
									<div className="text-sm text-gray-900 dark:text-gray-100 truncate">
										{task.name}
									</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">
										{task.workOrder} • {task.assignee}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Timeline Grid */}
					<div
						className="relative"
						style={{ width: `${timeline.length * 60}px` }}
					>
						{/* Grid Background */}
						<div className="absolute inset-0">
							<div className="flex">
								{timeline.map((period, index) => (
									<div
										key={index}
										className={`w-[60px] border-r border-gray-100 dark:border-gray-700 flex-shrink-0 ${
											period.isWeekStart
												? 'border-l-2 border-l-blue-200 dark:border-l-blue-600'
												: ''
										}`}
										style={{ height: `${mockTasks.length * 64}px` }}
									/>
								))}
							</div>

							{/* Horizontal grid lines */}
							{mockTasks.map((_, index) => (
								<div
									key={index}
									className="absolute w-full border-b border-gray-100 dark:border-gray-700"
									style={{ top: `${(index + 1) * 64}px` }}
								/>
							))}
						</div>

						{/* Task Bars */}
						{mockTasks.map((task, index) => {
							const position = calculateTaskPosition(task.startDate, task.endDate);
							return (
								<div
									key={task.id}
									className={`absolute h-8 rounded-md cursor-move transition-all hover:shadow-md ${getTaskColor(
										task.workOrder
									)} ${
										draggedTask === task.id ? 'opacity-70 scale-105' : ''
									}`}
									style={{
										top: `${index * 64 + 16}px`,
										left: `${position.left}px`,
										width: `${position.width}px`,
									}}
									draggable
									onDragStart={(e) => handleTaskDragStart(task.id, e)}
									onDragEnd={handleTaskDragEnd}
								>
									<div className="h-full flex items-center px-2 text-white text-xs">
										<div className="flex-1 truncate">{task.name}</div>
										<div className="text-xs opacity-90">
											{task.progress}%
										</div>
									</div>

									{/* Progress Bar */}
									<div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-50 rounded-b-md">
										<div
											className="h-full bg-white rounded-b-md transition-all"
											style={{ width: `${task.progress}%` }}
										/>
									</div>
								</div>
							);
						})}

						{/* Dependency Lines */}
						{mockTasks.map((task) =>
							task.dependencies.map((depId) => {
								const depTask = mockTasks.find((t) => t.id === depId);
								if (!depTask) return null;

								const taskIndex = mockTasks.findIndex((t) => t.id === task.id);
								const depIndex = mockTasks.findIndex((t) => t.id === depId);
								const taskPos = calculateTaskPosition(task.startDate, task.endDate);
								const depPos = calculateTaskPosition(depTask.startDate, depTask.endDate);

								return (
									<svg
										key={`${task.id}-${depId}`}
										className="absolute pointer-events-none"
										style={{
											top: 0,
											left: 0,
											width: '100%',
											height: `${mockTasks.length * 64}px`,
										}}
									>
										<line
											x1={depPos.left + depPos.width}
											y1={depIndex * 64 + 32}
											x2={taskPos.left}
											y2={taskIndex * 64 + 32}
											stroke="#6366f1"
											strokeWidth="2"
											strokeDasharray="5,5"
											markerEnd="url(#arrowhead)"
										/>
										<defs>
											<marker
												id="arrowhead"
												markerWidth="10"
												markerHeight="7"
												refX="9"
												refY="3.5"
												orient="auto"
											>
												<polygon
													points="0 0, 10 3.5, 0 7"
													fill="#6366f1"
												/>
											</marker>
										</defs>
									</svg>
								);
							})
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
