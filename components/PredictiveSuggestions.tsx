import { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Resizable } from 're-resizable';

const mockSuggestions = [
	{
		id: 1,
		type: 'optimization',
		priority: 'High',
		title: 'Reschedule Pump Maintenance',
		description: "Moving WO-001 to Jan 18th reduces John Smith's workload from 95% to 82%",
		impact: 'Reduces overload by 13%',
		confidence: 92,
		action: 'Reschedule',
		timesSaved: '4 hours',
	},
	{
		id: 2,
		type: 'prevention',
		priority: 'Medium',
		title: 'Add Buffer Time',
		description: 'Historical data shows electrical work takes 15% longer than planned',
		impact: 'Prevents 2 potential delays',
		confidence: 87,
		action: 'Add Buffer',
		timesSaved: '2 hours',
	},
	{
		id: 3,
		type: 'resource',
		priority: 'Low',
		title: 'Load Balancing',
		description: 'Tom Wilson has 23% availability next week for mechanical tasks',
		impact: 'Better resource utilization',
		confidence: 78,
		action: 'Reassign',
		timesSaved: '6 hours',
	},
];

const mockPredictions = [
	{
		metric: 'Completion Rate',
		current: 87,
		predicted: 94,
		trend: 'up',
		description: 'With AI optimizations',
	},
	{
		metric: 'Resource Utilization',
		current: 73,
		predicted: 82,
		trend: 'up',
		description: 'Balanced workload',
	},
	{
		metric: 'Overdue Tasks',
		current: 12,
		predicted: 3,
		trend: 'down',
		description: 'Reduced delays',
	},
];

const mockInsights = [
	{
		title: 'Peak Workload Pattern',
		description: 'Tuesdays show 23% higher task complexity',
		recommendation: 'Schedule routine maintenance on Mondays',
		type: 'pattern',
	},
	{
		title: 'Skill Gap Alert',
		description: 'Instrumentation team capacity will drop by 40% in Q2',
		recommendation: 'Consider cross-training or hiring',
		type: 'alert',
	},
	{
		title: 'Equipment Correlation',
		description: 'Pump failures increase 2 weeks after electrical work',
		recommendation: 'Schedule pump inspection after electrical tasks',
		type: 'correlation',
	},
];

const priorityColors = {
	High: 'bg-red-100 text-red-700 border-red-200',
	Medium: 'bg-orange-100 text-orange-700 border-orange-200',
	Low: 'bg-green-100 text-green-700 border-green-200',
};

const typeIcons = {
	optimization: TrendingUp,
	prevention: AlertTriangle,
	resource: CheckCircle,
	pattern: Clock,
	alert: AlertTriangle,
	correlation: Brain,
};

export function PredictiveSuggestions() {
	const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
	const [size, setSize] = useState<{ width: number; height: number }>({ width: 320, height: 600 });

	return (
		<Resizable
			size={size}
			onResizeStop={(_e, _direction, ref, d) => {
				setSize({
					width: size.width + d.width,
					height: ref.offsetHeight,
				});
			}}
			minWidth={280}
			minHeight={400}
			maxWidth={800}
			enable={{
				top: false,
				right: false,
				bottom: false,
				left: true,
				topRight: false,
				bottomRight: false,
				bottomLeft: false,
				topLeft: false,
			}}
			className="border-l border-gray-200 dark:border-gray-700 flex-shrink-0"
		>
			<div className="h-full flex flex-col bg-gradient-to-b from-purple-50 dark:from-purple-900/20 to-white dark:to-gray-800">
				{/* Header */}
				<div className="p-4 border-b border-purple-200 dark:border-purple-800 bg-purple-100 dark:bg-purple-900/30 rounded-tl-[100px] rounded-tr-[10px] rounded-bl-[10px] rounded-br-[10px]">
					<div className="flex items-center space-x-2 mb-2">
						<Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
						<h3 className="text-lg text-purple-900 dark:text-purple-100">AI Insights</h3>
						<Badge variant="outline" className="bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300">
							Beta
						</Badge>
					</div>
					<p className="text-sm text-purple-700 dark:text-purple-300">
						Powered by machine learning and historical data
					</p>
				</div>

				{/* Content Tabs */}
				<div className="flex-1 overflow-hidden">
					<Tabs defaultValue="suggestions" className="h-full flex flex-col">
						<TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
							<TabsTrigger value="suggestions">Suggestions</TabsTrigger>
							<TabsTrigger value="predictions">Predictions</TabsTrigger>
							<TabsTrigger value="insights">Insights</TabsTrigger>
						</TabsList>

						<TabsContent value="suggestions" className="flex-1 overflow-auto p-4 space-y-3 mt-0">
							{mockSuggestions.map((suggestion) => {
								const IconComponent = typeIcons[suggestion.type as keyof typeof typeIcons];
								const isSelected = selectedSuggestion === suggestion.id;

								return (
									<Card
										key={suggestion.id}
										className={`p-4 cursor-pointer transition-all border-l-4 dark:bg-gray-700 ${
											isSelected ? 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-l-gray-200 dark:border-l-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
										}`}
										onClick={() => setSelectedSuggestion(isSelected ? null : suggestion.id)}
									>
										<div className="space-y-3">
											{/* Header */}
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-2">
													<IconComponent className="w-4 h-4 text-purple-600 dark:text-purple-400" />
													<Badge
														variant="outline"
														size="sm"
														className={priorityColors[suggestion.priority as keyof typeof priorityColors]}
													>
														{suggestion.priority}
													</Badge>
												</div>
												<div className="text-xs text-gray-500 dark:text-gray-400">
													{suggestion.confidence}% confidence
												</div>
											</div>

											{/* Content */}
											<div>
												<h4 className="text-sm text-gray-900 dark:text-gray-100 mb-1">{suggestion.title}</h4>
												<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
													{suggestion.description}
												</p>
											</div>

											{/* Impact */}
											<div className="flex items-center justify-between text-xs">
												<span className="text-green-600 dark:text-green-400">{suggestion.impact}</span>
												<span className="text-blue-600 dark:text-blue-400">Saves {suggestion.timesSaved}</span>
											</div>

											{/* Action Button */}
											{isSelected && (
												<div className="pt-2 border-t border-gray-200 dark:border-gray-600">
													<Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
														<ArrowRight className="w-3 h-3 mr-1" />
														Apply {suggestion.action}
													</Button>
												</div>
											)}
										</div>
									</Card>
								);
							})}
						</TabsContent>

						<TabsContent value="predictions" className="flex-1 overflow-auto p-4 space-y-4 mt-0">
							{mockPredictions.map((prediction, index) => (
								<Card key={index} className="p-4 dark:bg-gray-700">
									<div className="flex items-center justify-between mb-2">
										<h4 className="text-sm text-gray-900 dark:text-gray-100">{prediction.metric}</h4>
										<div className={`flex items-center space-x-1 text-xs ${
											prediction.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
										}`}>
											<TrendingUp className={`w-3 h-3 ${
												prediction.trend === 'down' ? 'rotate-180' : ''
											}`} />
											<span>
												{prediction.trend === 'up' ? '+' : '-'}
												{Math.abs(prediction.predicted - prediction.current)}%
											</span>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex justify-between text-xs">
											<span className="text-gray-500 dark:text-gray-400">Current</span>
											<span className="text-gray-900 dark:text-gray-100">{prediction.current}%</span>
										</div>
										<div className="flex justify-between text-xs">
											<span className="text-gray-500 dark:text-gray-400">Predicted</span>
											<span className="text-purple-600 dark:text-purple-400">{prediction.predicted}%</span>
										</div>
										<div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
											<div
												className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full transition-all"
												style={{ width: `${prediction.predicted}%` }}
											/>
										</div>
										<p className="text-xs text-gray-600 dark:text-gray-400">{prediction.description}</p>
									</div>
								</Card>
							))}
						</TabsContent>

						<TabsContent value="insights" className="flex-1 overflow-auto p-4 space-y-3 mt-0">
							{mockInsights.map((insight, index) => {
								const IconComponent = typeIcons[insight.type as keyof typeof typeIcons];

								return (
									<Card key={index} className="p-4 border-l-4 border-l-blue-400 dark:border-l-blue-600 dark:bg-gray-700">
										<div className="space-y-2">
											<div className="flex items-center space-x-2">
												<IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
												<h4 className="text-sm text-gray-900 dark:text-gray-100">{insight.title}</h4>
											</div>

											<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
												{insight.description}
											</p>

											<div className="bg-blue-50 dark:bg-blue-900/30 rounded-md p-2">
												<p className="text-xs text-blue-700 dark:text-blue-300">
													<strong>Recommendation:</strong> {insight.recommendation}
												</p>
											</div>
										</div>
									</Card>
								);
							})}
						</TabsContent>
					</Tabs>
				</div>

				{/* Footer */}
				<div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
					<div className="text-xs text-gray-500 dark:text-gray-400 text-center">
						Last AI analysis: 3 minutes ago
					</div>
				</div>
			</div>
		</Resizable>
	);
}
