import { TrendingUp, User } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const mockTechnicians = [
	{
		id: 1,
		name: 'John Smith',
		role: 'Mechanical',
		workload: [85, 92, 78, 95, 88, 76, 82, 90, 85, 79, 88, 93],
	},
	{
		id: 2,
		name: 'Mike Johnson',
		role: 'Electrical',
		workload: [70, 75, 85, 68, 92, 88, 75, 80, 85, 72, 78, 85],
	},
	{
		id: 3,
		name: 'Sarah Davis',
		role: 'Instrumentation',
		workload: [95, 88, 82, 90, 85, 78, 92, 87, 83, 89, 91, 86],
	},
	{
		id: 4,
		name: 'Tom Wilson',
		role: 'Mechanical',
		workload: [65, 72, 68, 75, 70, 88, 82, 76, 79, 73, 77, 81],
	},
	{
		id: 5,
		name: 'Lisa Chen',
		role: 'Electrical',
		workload: [88, 85, 90, 82, 87, 91, 84, 89, 86, 92, 88, 85],
	},
];

const weekLabels = [
	'W1',
	'W2',
	'W3',
	'W4',
	'W5',
	'W6',
	'W7',
	'W8',
	'W9',
	'W10',
	'W11',
	'W12',
];

const getUtilizationColor = (percentage: number) => {
	if (percentage >= 90) return 'bg-red-500';
	if (percentage >= 80) return 'bg-orange-400';
	if (percentage >= 70) return 'bg-yellow-400';
	if (percentage >= 60) return 'bg-green-400';
	return 'bg-green-300';
};

const getUtilizationLabel = (percentage: number) => {
	if (percentage >= 90) return 'Overloaded';
	if (percentage >= 80) return 'High';
	if (percentage >= 70) return 'Optimal';
	if (percentage >= 60) return 'Medium';
	return 'Low';
};

const roleColors = {
	Mechanical: 'bg-blue-100 text-blue-700',
	Electrical: 'bg-green-100 text-green-700',
	Instrumentation: 'bg-purple-100 text-purple-700',
};

export function HeatmapSummary() {
	const averageUtilization =
		mockTechnicians.reduce((acc, tech) => {
			return (
				acc +
				tech.workload.reduce((sum, val) => sum + val, 0) /
					tech.workload.length
			);
		}, 0) / mockTechnicians.length;

	return (
		<div className="h-full flex flex-col">
			{/* Header */}
			<div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<h3 className="text-lg text-gray-900 dark:text-gray-100">
						Technician Workload
					</h3>
					<Badge
						variant="outline"
						className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
					>
						Q1 2025
					</Badge>
				</div>

				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
						<TrendingUp className="w-4 h-4" />
						<span>Avg: {averageUtilization.toFixed(1)}%</span>
					</div>

					{/* Legend */}
					<div className="flex items-center space-x-2 text-xs">
						<span className="text-gray-500 dark:text-gray-400">
							Utilization:
						</span>
						<div className="flex items-center space-x-1">
							<div className="w-3 h-3 bg-green-300 rounded-sm"></div>
							<span>Low</span>
						</div>
						<div className="flex items-center space-x-1">
							<div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
							<span>Optimal</span>
						</div>
						<div className="flex items-center space-x-1">
							<div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
							<span>High</span>
						</div>
						<div className="flex items-center space-x-1">
							<div className="w-3 h-3 bg-red-500 rounded-sm"></div>
							<span>Over</span>
						</div>
					</div>
				</div>
			</div>

			{/* Heatmap */}
			<div className="flex-1 p-4 overflow-y-auto">
				<div className="min-w-max">
					{/* Week Headers */}
					<div className="flex items-center mb-3">
						<div className="w-48 flex-shrink-0 text-sm text-gray-600 dark:text-gray-400">
							Technician
						</div>
						<div className="flex-1 min-w-0 grid grid-cols-12 gap-1">
							{weekLabels.map((week, index) => (
								<div
									key={index}
									className="text-center text-xs text-gray-500 dark:text-gray-400 py-1"
								>
									{week}
								</div>
							))}
						</div>
						<div className="w-20 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 text-center">
							Avg
						</div>
					</div>

					{/* Technician Rows */}
					<div className="space-y-3">
						{mockTechnicians.map((technician) => {
							const avgWorkload =
								technician.workload.reduce((sum, val) => sum + val, 0) /
								technician.workload.length;

							return (
								<Card
									key={technician.id}
									className="p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-700"
								>
									<div className="flex items-center">
										{/* Technician Info */}
										<div className="w-48 flex-shrink-0 flex items-center space-x-3">
											<div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
												<User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
											</div>
											<div>
												<div className="text-sm text-gray-900 dark:text-gray-100">
													{technician.name}
												</div>
												<Badge
													variant="outline"
													size="sm"
													className={
														roleColors[
															technician.role as keyof typeof roleColors
														]
													}
												>
													{technician.role}
												</Badge>
											</div>
										</div>

										{/* Workload Heatmap */}
										<div className="flex-1 min-w-0 grid grid-cols-12 gap-1">
											{technician.workload.map((utilization, index) => (
												<div
													key={index}
													className={`h-8 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:shadow-md ${getUtilizationColor(
														utilization
													)}`}
													title={`Week ${index + 1}: ${utilization}% utilization - ${getUtilizationLabel(
														utilization
													)}`}
												>
													<span className="text-xs text-white font-medium">
														{utilization}
													</span>
												</div>
											))}
										</div>

										{/* Average */}
										<div className="w-20 flex-shrink-0 text-center">
											<div
												className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
													avgWorkload >= 90
														? 'bg-red-100 text-red-700'
														: avgWorkload >= 80
														? 'bg-orange-100 text-orange-700'
														: avgWorkload >= 70
														? 'bg-yellow-100 text-yellow-700'
														: 'bg-green-100 text-green-700'
												}`}
											>
												{avgWorkload.toFixed(0)}%
											</div>
										</div>
									</div>
								</Card>
							);
						})}
					</div>
				</div>

				{/* Summary Stats */}
				<div className="mt-6 grid grid-cols-4 gap-4">
					<Card className="p-3 text-center dark:bg-gray-700">
						<div className="text-2xl text-red-600 dark:text-red-400 mb-1">
							2
						</div>
						<div className="text-xs text-gray-600 dark:text-gray-400">
							Overloaded
						</div>
					</Card>
					<Card className="p-3 text-center dark:bg-gray-700">
						<div className="text-2xl text-orange-600 dark:text-orange-400 mb-1">
							8
						</div>
						<div className="text-xs text-gray-600 dark:text-gray-400">
							High Load
						</div>
					</Card>
					<Card className="p-3 text-center dark:bg-gray-700">
						<div className="text-2xl text-green-600 dark:text-green-400 mb-1">
							32
						</div>
						<div className="text-xs text-gray-600 dark:text-gray-400">
							Optimal
						</div>
					</Card>
					<Card className="p-3 text-center dark:bg-gray-700">
						<div className="text-2xl text-blue-600 dark:text-blue-400 mb-1">
							18
						</div>
						<div className="text-xs text-gray-600 dark:text-gray-400">
							Available
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
