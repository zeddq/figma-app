import { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus, AlertTriangle, Clock, Wrench } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TaskListPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  searchQuery: string;
}

const mockWorkOrders = [
  {
    id: 'WO-001',
    title: 'Pump Maintenance - Unit A',
    priority: 'High',
    status: 'In Progress',
    workType: 'Mechanical',
    operations: [
      { name: 'Bearing Replacement', priority: 'High', startDate: '2025-01-15', workCenter: 'MC-01' },
      { name: 'Seal Inspection', priority: 'Medium', startDate: '2025-01-16', workCenter: 'MC-01' },
    ]
  },
  {
    id: 'WO-002',
    title: 'Electrical Panel Upgrade',
    priority: 'Critical',
    status: 'Scheduled',
    workType: 'Electrical',
    operations: [
      { name: 'Panel Installation', priority: 'Critical', startDate: '2025-01-20', workCenter: 'EC-02' },
      { name: 'Wiring Check', priority: 'High', startDate: '2025-01-21', workCenter: 'EC-02' },
    ]
  },
  {
    id: 'WO-003',
    title: 'Calibration - Flow Meters',
    priority: 'Medium',
    status: 'Pending',
    workType: 'Instrumentation',
    operations: [
      { name: 'Flow Meter Cal', priority: 'Medium', startDate: '2025-01-25', workCenter: 'IC-01' },
    ]
  },
];

const priorityColors = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

const workTypeColors = {
  Mechanical: 'bg-blue-50 border-l-blue-400',
  Electrical: 'bg-green-50 border-l-green-400',
  Instrumentation: 'bg-purple-50 border-l-purple-400',
};

export function TaskListPanel({ isCollapsed, onToggleCollapse, searchQuery }: TaskListPanelProps) {
  const [expandedOrders, setExpandedOrders] = useState<string[]>(['WO-001']);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterWorkType, setFilterWorkType] = useState('all');

  const toggleExpanded = (orderId: string) => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const filteredOrders = mockWorkOrders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    const matchesWorkType = filterWorkType === 'all' || order.workType === filterWorkType;

    return matchesSearch && matchesPriority && matchesWorkType;
  });

  if (isCollapsed) {
    return (
      <div className="w-12 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="flex flex-col space-y-2">
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-md flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-md flex items-center justify-center">
            <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-md flex items-center justify-center">
            <Wrench className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg text-gray-900 dark:text-gray-100">Work Orders</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Filters</span>
        </div>

        <div className="flex space-x-2">
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterWorkType} onValueChange={setFilterWorkType}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Work Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Mechanical">Mechanical</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Instrumentation">Instrumentation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredOrders.map((order) => (
          <Card key={order.id} className={`border-l-4 ${workTypeColors[order.workType as keyof typeof workTypeColors]} dark:bg-gray-700`}>
            <Collapsible
              open={expandedOrders.includes(order.id)}
              onOpenChange={() => toggleExpanded(order.id)}
            >
              <CollapsibleTrigger className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{order.id}</span>
                      <Badge
                        variant="outline"
                        className={priorityColors[order.priority as keyof typeof priorityColors]}
                      >
                        {order.priority}
                      </Badge>
                    </div>
                    <h3 className="text-sm text-gray-900 dark:text-gray-100 mb-1">{order.title}</h3>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{order.status}</span>
                      <span>•</span>
                      <span>{order.workType}</span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 dark:text-gray-300 transition-transform ${
                      expandedOrders.includes(order.id) ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-600">
                  <h4 className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Operations</h4>
                  {order.operations.map((operation, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-600 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900 dark:text-gray-100">{operation.name}</span>
                        <Badge
                          variant="outline"
                          size="sm"
                          className={priorityColors[operation.priority as keyof typeof priorityColors]}
                        >
                          {operation.priority}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Start Date:</span>
                          <div>{operation.startDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Work Center:</span>
                          <div>{operation.workCenter}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}
