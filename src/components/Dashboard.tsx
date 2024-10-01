"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from "moment"
import { NavigateAction } from "react-big-calendar";
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ClockIcon,
  CalendarIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  EditIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogOut,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

interface Task {
  id: string
  content: string
  // priority: number | null
  dueDate: Date | null
  estimatedTime: number
  scheduledTime: { start: Date; end: Date } | null
  actualTime: number | null
}

interface DashboardProps {
  initialTasks?: Task[]
  user: { name: string; id: string }
}

import { Switch } from "@/components/ui/switch"

interface ViewToggleProps {
  view: 'week' | 'month'
  onViewChange: (view: 'week' | 'month') => void
}
const TaskInputForm: React.FC<{ newTask: string; setNewTask: (value: string) => void; addTask: (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => void }> = ({ newTask, setNewTask, addTask }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form onSubmit={addTask} className="flex mb-4">
      <Input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Add a new task..."
        className="flex-grow mr-2"
      />
      <Button type="submit">
        Add
      </Button>
    </form>
  );
};

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="view-toggle">Weekly</Label>
      <Switch
        id="view-toggle"
        checked={view === 'month'}
        onCheckedChange={(checked) => onViewChange(checked ? 'month' : 'week')}
      />
      <Label htmlFor="view-toggle">Monthly</Label>
    </div>
  )
}

const CustomToolbar = ({ onNavigate, label, view, onViewChange }: { 
  onNavigate: (newDate: Date, view: typeof Views, action: NavigateAction) => void
  label: string
  view: 'week' | 'month'
  onViewChange: (view: 'week' | 'month') => void
  }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <Button
          onClick={() => onNavigate(new Date(), Views.WEEK, "TODAY")}
          variant="outline"
          className="mr-2"
        >
          Today
        </Button>
        <Button
          onClick={() => onNavigate(new Date(), Views.WEEK, "PREV")}
          variant="outline"
          className="mr-2"
        >
          Back
        </Button>
        <Button onClick={() => onNavigate(new Date(), Views.WEEK, "NEXT")} variant="outline">
          Next
        </Button>
      </div>
      {/* <ViewToggle view={view} onViewChange={onViewChange} /> */}
      <span className="text-lg font-semibold">
        {view === 'week' ? label : moment(label.split(' – ')[0]).format('MMMM YYYY')}
      </span>
    </div>
  )
}

interface DaySelectorProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
  view: 'daily' | 'weekly'
}

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDate, onSelectDate, view }) => {
  const handlePrev = () => {
    onSelectDate(moment(selectedDate).subtract(view === 'daily' ? 1 : 7, "day").toDate())
  }

  const handleNext = () => {
    onSelectDate(moment(selectedDate).add(view === 'daily' ? 1 : 7, "day").toDate())
  }

  const formatDate = () => {
    if (view === 'daily') {
      return {
        main: moment(selectedDate).format("dddd"),
        sub: moment(selectedDate).format("MMMM D, YYYY")
      }
    } else {
      const weekStart = moment(selectedDate).startOf('week')
      const weekEnd = moment(selectedDate).endOf('week')
      return {
        main: `Week of ${weekStart.format("MMM D")}`,
        sub: `${weekStart.format("MMM D")} - ${weekEnd.format("MMM D, YYYY")}`
      }
    }
  }

  const dateFormat = formatDate()

  return (
    <div className="flex justify-between items-center mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrev}
        aria-label={view === 'daily' ? "Previous day" : "Previous week"}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <div className="text-center">
        <div className="text-lg font-semibold">{dateFormat.main}</div>
        <div className="text-sm text-muted-foreground">{dateFormat.sub}</div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        aria-label={view === 'daily' ? "Next day" : "Next week"}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

import { Trash } from "lucide-react"

const TaskComponent = ({ task, onSchedule, onView, onDelete }: { task: Task; onSchedule: (task: Task) => void; onView: (task: Task) => void; onDelete: (taskId: string) => void }) => {
  const isScheduled = !!task.scheduledTime

  return (
    <Card className="mb-2">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <p className="font-medium">{task.content}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {/* <Badge variant="secondary">Priority: {task.priority}</Badge> */}
              {task.dueDate && (
                <Badge variant="outline">
                  Due: {moment(task.dueDate).format("MMM D")}
                </Badge>
              )}
              {task.actualTime ? (
                <Badge variant="secondary" className="bg-green-500">
                  Actual: {task.actualTime}h
                </Badge>
              ) : (
                <Badge>Est: {task.estimatedTime}h</Badge>
              )}
            </div>
            {isScheduled && (
              <div className="mt-2 text-sm text-muted-foreground flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                Scheduled:{" "}
                {moment(task.scheduledTime!.start).format("MMM D, h:mm A")}
              </div>
            )}
          </div>
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(task)}
              className="mr-2"
              aria-label="View task details"
            >
              <EditIcon className="h-4 w-4" />
            </Button>
            {!isScheduled && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSchedule(task)}
                className="mr-2"
                aria-label="Schedule task"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="text-red-500 hover:text-red-700"
              aria-label="Delete task"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

import { EventProps } from "react-big-calendar";

const CustomEvent = ({ event }: EventProps<Event>) => {
  const [isSmallEvent, setIsSmallEvent] = useState(false)
  const eventRef = React.useRef(null)

  React.useEffect(() => {
    if (eventRef.current) {
      const { offsetHeight } = eventRef.current
      setIsSmallEvent(offsetHeight < 40)
    }
  }, [event])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={eventRef}
            className={`bg-blue-500 text-white p-1 rounded overflow-hidden h-full flex flex-col justify-center ${
              isSmallEvent ? "items-center" : ""
            }`}
          >
            {isSmallEvent ? (
              <div
                className="text-xs font-semibold truncate w-full text-center"
                aria-label={event.title}
              >
                {event.title}
              </div>
            ) : (
              <>
                <div className="font-semibold text-sm truncate">
                  {event.title}
                </div>
                <div className="text-xs">
                  {moment(event.start).format("h:mm A")} -{" "}
                  {moment(event.end).format("h:mm A")}
                </div>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{event.title}</p>
          <p className="text-xs">
            {moment(event.start).format("h:mm A")} -{" "}
            {moment(event.end).format("h:mm A")}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface TaskScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSchedule: (taskId: string, start: Date, end: Date) => void;
}

const TaskScheduleModal: React.FC<TaskScheduleModalProps> = ({ isOpen, onClose, task, onSchedule }) => {
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  useEffect(() => {
    if (task) {
      setStartTime(moment().format("YYYY-MM-DDTHH:mm"))
      setEndTime(moment().add(1, "hour").format("YYYY-MM-DDTHH:mm"))
    }
  }, [task])

  const handleSchedule = () => {
    const start = moment(startTime, "YYYY-MM-DDTHH:mm")
    const end = moment(endTime, "YYYY-MM-DDTHH:mm")
    if (task) {
      onSchedule(task.id, start.toDate(), end.toDate())
    }
    onClose()
  }

  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Task: {task.content}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-time" className="text-right">
              Start Time
            </Label>
            <Input
              id="start-time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-time" className="text-right">
              End Time
            </Label>
            <Input
              id="end-time"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSchedule}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface TaskViewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (taskId: string, updatedInfo: Partial<Task>) => void;
}

const TaskViewEditModal: React.FC<TaskViewEditModalProps> = ({ isOpen, onClose, task, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState("")
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [dueDate, setDueDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  useEffect(() => {
    if (task) {
      setContent(task.content)
      setEstimatedTime(task.estimatedTime)
      setDueDate(task.dueDate ? moment(task.dueDate).format("YYYY-MM-DD") : "")
      if (task.scheduledTime) {
        setStartTime(
          moment(task.scheduledTime.start).format("YYYY-MM-DDTHH:mm")
        )
        setEndTime(moment(task.scheduledTime.end).format("YYYY-MM-DDTHH:mm"))
      }
    }
  }, [task])

  const handleUpdate = () => {
    const updatedTask: Partial<Task> = {
      content,
      estimatedTime: parseFloat(estimatedTime.toString()),
      dueDate: dueDate ? moment(dueDate).toDate() : null,
    }
    if (startTime && endTime) {
      updatedTask.scheduledTime = {
        start: moment(startTime).toDate(),
        end: moment(endTime).toDate(),
      }
    }
    if (task) {
      onUpdate(task.id, updatedTask)
    }
    setIsEditing(false)
  }

    // const calculatePriority = (task: Task) => {
    //   if (!task.dueDate) return null; // Default priority if no due date is set
    
    //   const daysUntilDue = moment(task.dueDate).diff(moment(), "days")
    //   const estimatedTimeNum = task.estimatedTime
    
    //   if (daysUntilDue <= 1 && estimatedTimeNum > 4) return 100
    //   if (daysUntilDue <= 3 && estimatedTimeNum > 2) return 75
    //   if (daysUntilDue <= 7) return 50
    //   return 25
    // }

  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Task Details"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-content" className="text-right">
              Task
            </Label>
            {isEditing ? (
              <Input
                id="task-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3"
              />
            ) : (
              <p className="col-span-3">{task.content}</p>
            )}
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-priority" className="text-right">
              Priority
            </Label>
            <p className="col-span-3">
              {isEditing ? calculatePriority(task) : task.priority}
            </p>
          </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-estimated-time" className="text-right">
              Estimated Time (hours)
            </Label>
            {isEditing ? (
              <Input
                id="task-estimated-time"
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(parseFloat(e.target.value))}
                className="col-span-3"
              />
            ) : (
              <p className="col-span-3">{task.estimatedTime}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-due-date" className="text-right">
              Due Date
            </Label>
            {isEditing ? (
              <Input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="col-span-3"
              />
            ) : (
              <p className="col-span-3">
                {moment(task.dueDate).format("MMMM D, YYYY")}
              </p>
            )}
          </div>
          {(task.scheduledTime || isEditing) && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-start-time" className="text-right">
                  Start Time
                </Label>
                {isEditing ? (
                  <Input
                    id="task-start-time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="col-span-3"
                  />
                ) : (
                  <p className="col-span-3">
                    {moment(task.scheduledTime?.start).format(
                      "MMMM D, YYYY h:mm A",
                    )}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-end-time" className="text-right">
                  End Time
                </Label>
                {isEditing ? (
                  <Input
                    id="task-end-time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="col-span-3"
                  />
                ) : (
                  <p className="col-span-3">
                    {moment(task.scheduledTime?.end).format(
                      "MMMM D, YYYY h:mm A",
                    )}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          {isEditing ? (
            <>
              <Button onClick={handleUpdate}>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Task</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const DragAndDropCalendar = withDragAndDrop(Calendar);

export default function Dashboard({ initialTasks = [], user }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTask, setNewTask] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskListView, setTaskListView] = useState<'daily' | 'weekly'>('daily');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false)
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentWeekStart, setCurrentWeekStart] = useState(
    moment().startOf("week").toDate(),
  )
  const [currentMonthStart, setCurrentMonthStart] = useState(
    moment().startOf("month").toDate(),
  )
  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== taskId))
  }
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week')

  const router = useRouter()

 useEffect(() => {
  // Convert only scheduled tasks to events
  const scheduledEvents = tasks
    .filter(task => task.scheduledTime !== null)
    .map(task => ({
      id: task.id,
      title: task.content,
      start: task.scheduledTime!.start,
      end: task.scheduledTime!.end,
    }))
  setEvents(scheduledEvents)
}, [tasks])
const addTask = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        content: newTask,
        dueDate: selectedDate,
        estimatedTime: 1,
        scheduledTime: null,
        actualTime: null,
      }
      setTasks((prevTasks) => [...prevTasks, task])
      setNewTask("")
    }
  }
  const handleScheduleTask = (task: Task) => {
    setSelectedTask(task)
    setIsScheduleModalOpen(true)
  }

  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
    setIsViewEditModalOpen(true)
  }

  const handleCloseScheduleModal = () => {
    setSelectedTask(null)
    setIsScheduleModalOpen(false)
  }

  const handleCloseViewEditModal = () => {
    setSelectedTask(null)
    setIsViewEditModalOpen(false)
  }

  const calculateActualTime = (start: Date, end: Date) => {
    const duration = moment.duration(moment(end).diff(moment(start)))
    return Math.round(duration.asHours() * 10) / 10
  }

  // const calculatePriority = (task: Task) => {
  //   const daysUntilDue = moment(task.dueDate).diff(moment(), "days")
  //   const estimatedTimeNum = task.estimatedTime

  //   if (daysUntilDue <= 1 && estimatedTimeNum > 4) return 100
  //   if (daysUntilDue <= 3 && estimatedTimeNum > 2) return 75
  //   if (daysUntilDue <= 7) return 50
  //   return 25
  // }

  const handleTaskScheduled = (taskId: string, start: Date, end: Date) => {
    const actualTime = calculateActualTime(start, end)
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            scheduledTime: { start, end },
            actualTime,
          }
          // updatedTask.priority = calculatePriority(updatedTask)
          return updatedTask
        }
        return task
      })
    )
  
    // Add the event to the calendar only when explicitly scheduled
    const taskToSchedule = tasks.find((t) => t.id === taskId)
    if (taskToSchedule) {
      const newEvent = {
        id: taskId,
        title: taskToSchedule.content,
        start,
        end,
      }
      setEvents((prevEvents) => [...prevEvents, newEvent])
    }
  }

  const handleTaskUpdate = (taskId: string, updatedInfo: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task, ...updatedInfo }
          if (updatedTask.scheduledTime) {
            updatedTask.actualTime = calculateActualTime(
              updatedTask.scheduledTime.start,
              updatedTask.scheduledTime.end,
            )
          }
          // updatedTask.priority = calculatePriority(updatedTask)
          return updatedTask
        }
        return task
      })
    )

    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === taskId) {
          const updatedTask = tasks.find((t) => t.id === taskId)
          if (updatedTask) {
            return {
              ...event,
              title: updatedInfo.content || event.title,
              start: updatedTask.scheduledTime?.start || event.start,
              end: updatedTask.scheduledTime?.end || event.end,
            }
          }
        }
        return event
      })
    )
  }

  const updateTaskAndEvent = (taskId: string, start: Date, end: Date) => {
    const actualTime = calculateActualTime(start, end)
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            scheduledTime: { start, end },
            actualTime,
          }
          // updatedTask.priority = calculatePriority(updatedTask)
          return updatedTask
        }
        return task
      })
    )

    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === taskId) {
          return { ...event, start, end }
        }
        return event
      })
    )
  }
  const getFilteredTasks = () => {
    if (taskListView === 'daily') {
      return tasks.filter(task => 
        task.dueDate && moment(task.dueDate).isSame(selectedDate, 'day')
      );
    } else {
      const weekStart = moment(selectedDate).startOf('week');
      const weekEnd = moment(selectedDate).endOf('week');
      return tasks.filter(task => 
        task.dueDate && moment(task.dueDate).isBetween(weekStart, weekEnd, 'day', '[]')
      );
    }
  };

  const onEventResize = useCallback(
    ({ event, start, end }: { event: Event; start: Date; end: Date }) => {
      updateTaskAndEvent(event.id, start, end)
    },
    [updateTaskAndEvent]
  )

  const onEventDrop = useCallback(
    ({ event, start, end }: { event: Event; start: Date; end: Date }) => {
      updateTaskAndEvent(event.id, start, end)
    },
    [updateTaskAndEvent]
  )

  const handleSelectEvent = useCallback(
    (event: { id: string }) => {
      const task = tasks.find((t) => t.id === event.id)
      if (task) {
        setSelectedTask(task)
        setIsViewEditModalOpen(true)
      }
    },
    [tasks]
  )

  const getDueTasks = (date: Date) => {
    return tasks.filter(
      (task) =>
        task.dueDate && moment(task.dueDate).isSame(date, 'day')
    )
  }

  const getWeekTasks = (date: Date) => {
    const weekStart = moment(date).startOf('week');
    const weekEnd = moment(date).endOf('week');
    return tasks.filter(task => 
      task.dueDate && moment(task.dueDate).isBetween(weekStart, weekEnd, 'day', '[]')
    );
  }

  const handleRangeChange = (range: Date[] | { start: Date; end: Date }) => {
    const startDate = Array.isArray(range) ? range[0] : range.start
    const newWeekStart = moment(startDate).startOf("week").toDate()
    setCurrentWeekStart(newWeekStart)
    setSelectedDate(moment(startDate).toDate())
  }


  
  const handleNavigate = (newDate: Date, view: typeof Views, action: NavigateAction) => {
    let date = moment(selectedDate); // Use the current selectedDate as the reference point
  
    switch (action) {
      case "PREV":
        date = calendarView === 'week' ? date.subtract(1, "week") : date.subtract(1, "month");
        break;
      case "NEXT":
        date = calendarView === 'week' ? date.add(1, "week") : date.add(1, "month");
        break;
      case "TODAY":
        date = moment();
        break;
      default:
        // If it's a date object (e.g., when clicking on a specific date), use that
        date = moment(newDate);
    }
  
    setSelectedDate(date.toDate());
  
    // Update currentWeekStart or currentMonthStart based on the view
    if (calendarView === 'week') {
      setCurrentWeekStart(date.startOf('week').toDate());
    } else {
      setCurrentMonthStart(date.startOf('month').toDate());
    }
  };

  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    setSelectedDate(start)
  }, [])


  return (
      <div className="flex h-screen bg-white">
        <aside className="w-16 bg-gray-800 text-white flex flex-col justify-between py-4">
          <div className="flex flex-col items-center space-y-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveView("dashboard")}
              className={`rounded-full ${activeView === "dashboard" ? "bg-gray-700" : ""}`}
            >
              <LayoutDashboardIcon className="h-6 w-6" />
              <span className="sr-only">Dashboard</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveView("calendar")}
              className={`rounded-full ${activeView === "calendar" ? "bg-gray-700" : ""}`}
            >
              <CalendarIcon className="h-6 w-6" />
              <span className="sr-only">Calendar</span>
            </Button>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <SettingsIcon className="h-6 w-6" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" /*onClick={}*/>
              <LogOut className="h-6 w-6" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </aside>
        <div className="flex-1 flex">
        <div className="w-1/4 bg-muted/20 p-6 overflow-y-auto">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Tasks</h2>
              <div className="flex space-x-2">
                <Button
                  variant={taskListView === 'daily' ? 'default' : 'outline'}
                  onClick={() => setTaskListView('daily')}
                >
                  Daily
                </Button>
                <Button
                  variant={taskListView === 'weekly' ? 'default' : 'outline'}
                  onClick={() => setTaskListView('weekly')}
                >
                  Weekly
                </Button>
              </div>
            </div>
            <DaySelector
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              view={taskListView}
            />
            <TaskInputForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
            <div>
              {getFilteredTasks().map((task) => (
                <TaskComponent
                  key={task.id}
                  task={task}
                  onSchedule={handleScheduleTask}
                  onView={handleViewTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>  
          </div>
            <div className="flex-1 p-6 overflow-hidden">
              <h1 className="text-3xl font-bold mb-6">Welcome, Shiven</h1>
              <DragAndDropCalendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: "calc(100vh - 150px)" }}
  views={[Views.WEEK, Views.MONTH]}
  view={taskListView === 'weekly' ? Views.MONTH : Views.WEEK}
  onView={(newView) => {
    setTaskListView(newView === Views.MONTH ? 'weekly' : 'daily');
  }}
  defaultView={Views.WEEK}
  min={new Date(0, 0, 0, 0, 0, 0)}
  max={new Date(0, 0, 0, 23, 59, 59)}
  step={30}
  timeslots={2}
  onEventResize={onEventResize}
  onEventDrop={onEventDrop}
  onSelectEvent={handleSelectEvent}
  onRangeChange={handleRangeChange}
  onNavigate={handleNavigate}
  onSelectSlot={handleSelectSlot}
  selectable={true}
  date={selectedDate}
  components={{
    toolbar: (props) => (
      <CustomToolbar 
        {...props} 
        onNavigate={handleNavigate}
        view={taskListView === 'weekly' ? 'month' : 'week'}
        onViewChange={(newView) => setTaskListView(newView === 'month' ? 'weekly' : 'daily')}
      />
    ),
    event: CustomEvent,
  }}
  scrollToTime={new Date(0, 0, 0, 5, 0, 0)}
/>
            </div>
        </div>
        <TaskScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={handleCloseScheduleModal}
          task={selectedTask}
          onSchedule={handleTaskScheduled}
        />
        <TaskViewEditModal
          isOpen={isViewEditModalOpen}
          onClose={handleCloseViewEditModal}
          task={selectedTask}
          onUpdate={handleTaskUpdate}
        />
      </div>
  )
}