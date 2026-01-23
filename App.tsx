import { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { TaskListPanel } from './components/TaskListPanel';
import { GanttChart } from './components/GanttChart';
import { HeatmapSummary } from './components/HeatmapSummary';
import { PredictiveSuggestions } from './components/PredictiveSuggestions';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Search, Bot, Users } from 'lucide-react';
import { Resizable } from 're-resizable';

export default function App() {
  const [isTaskPanelCollapsed, setIsTaskPanelCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('quarter');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAISchedulerVisible, setIsAISchedulerVisible] = useState(true);
  const [ganttHeight, setGanttHeight] = useState(400);

  return (
    <ThemeProvider>
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl text-gray-900 dark:text-gray-100">AI Task Scheduler</h1>
            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              Industrial Maintenance
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tasks, work orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quarter">Quarter View</SelectItem>
                <SelectItem value="half">Half Year</SelectItem>
                <SelectItem value="year">Year View</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6" onClick={() => setIsAISchedulerVisible(!isAISchedulerVisible)}>
              <Bot className="w-4 h-4 mr-2" />
              AI Scheduler
            </Button>

            <ThemeSwitcher />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Task List */}
          <TaskListPanel
            isCollapsed={isTaskPanelCollapsed}
            onToggleCollapse={() => setIsTaskPanelCollapsed(!isTaskPanelCollapsed)}
            searchQuery={searchQuery}
          />

          {/* Right Panel - Calendar and Charts */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Gantt Chart */}
            <Resizable
              size={{ width: '100%', height: ganttHeight }}
              onResizeStop={(_e, _direction, _ref, d) => setGanttHeight(ganttHeight + d.height)}
              minHeight={200}
              maxHeight={800}
              enable={{
                top: false,
                right: false,
                bottom: true,
                left: false,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false,
              }}
              handleClasses={{
                bottom: 'resize-handle'
              }}
            >
              <div className="h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-hidden">
                <GanttChart viewMode={viewMode} />
              </div>
            </Resizable>

            {/* Bottom Section */}
            <div className="flex-1 flex border-l border-t border-gray-200 dark:border-gray-700 overflow-x-auto overflow-y-hidden min-h-0">
              {/* Heatmap Summary */}
              <div className="flex-1 bg-white dark:bg-gray-800 min-w-0">
                <HeatmapSummary />
              </div>

              {/* Predictive Suggestions */}
              {isAISchedulerVisible && <PredictiveSuggestions />}
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500 dark:text-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Plant: Manufacturing Unit A</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <Badge variant="outline" className="text-blue-600 border-blue-200">Mechanical</Badge>
              <Badge variant="outline" className="text-green-600 border-green-200">Electrical</Badge>
              <Badge variant="outline" className="text-orange-600 border-orange-200">Instrumentation</Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-300">
            <span>Last updated: 2 minutes ago</span>
            <span>•</span>
            <span>24 active tasks</span>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
