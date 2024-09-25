"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
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
  priority: number
  dueDate: Date
  estimatedTime: number
  scheduledTime: { start: Date; end: Date } | null
  actualTime: number | null
}

interface DashboardProps {
  initialTasks?: Task[]
  user: { name: string; id: string }
}

const CustomToolbar = ({ onNavigate, label }: { onNavigate: (action: string) => void; label: string }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <Button
          onClick={() => onNavigate("TODAY")}
          variant="outline"
          className="mr-2"
        >
          Today
        </Button>
        <Button
          onClick={() => onNavigate("PREV")}
          variant="outline"
          className="mr-2"
        >
          Back
        </Button>
        <Button onClick={() => onNavigate("NEXT")} variant="outline">
          Next
        </Button>
      </div>
      <span className="text-lg font-semibold">{label}</span>
    </div>
  )
}

const DaySelector = ({ selectedDate, onSelectDate }: { selectedDate: Date; onSelectDate: (date: Date) => void }) => {
  const handlePrevDay = () => {
    onSelectDate(moment(selectedDate).subtract(1, "day").toDate())
  }

  const handleNextDay = () => {
    onSelectDate(moment(selectedDate).add(1, "day").toDate())
  }

  return (
    <div className="flex justify-between items-center mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevDay}
        aria-label="Previous day"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <div className="text-center">
        <div className="text-lg font-semibold">
          {moment(selectedDate).format("dddd")}
        </div>
        <div className="text-sm text-gray-500">
          {moment(selectedDate).format("MMMM D, YYYY")}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextDay}
        aria-label="Next day"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

const TaskComponent = ({ task, onSchedule, onView }: { task: Task; onSchedule: (task: Task) => void; onView: (task: Task) => void }) => {
  const isScheduled = !!task.scheduledTime

  return (
    <Card className="mb-2">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <p className="font-medium">{task.content}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">Priority: {task.priority}</Badge>
              <Badge variant="outline">
                Due: {moment(task.dueDate).format("MMM D")}
              </Badge>
              {task.actualTime ? (
                <Badge variant="secondary" className="bg-green-500">
                  Actual: {task.actualTime}h
                </Badge>
              ) : (
                <Badge>Est: {task.estimatedTime}h</Badge>
              )}
            </div>
            {task.scheduledTime && (
              <div className="mt-2 text-sm text-gray-600 flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                Scheduled:{" "}
                {moment(task.scheduledTime.start).format("MMM D, h:mm A")}
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
                className="ml-2"
                aria-label="Schedule task"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            )}
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

const CustomEvent = ({ event }: { event: Event }) => {
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
          moment(task.scheduledTime.start).format("YYYY-MM-DDTHH:mm"),
        )
        setEndTime(moment(task.scheduledTime.end).format("YYYY-MM-DDTHH:mm"))
      }
    }
  }, [task])

  const handleUpdate = () => {
      const updatedTask: Partial<Task> = {
        content,
        estimatedTime: parseFloat(estimatedTime.toString()),
        dueDate: moment(dueDate).toDate(),
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

  const calculatePriority = () => {
    const daysUntilDue = moment(dueDate).diff(moment(), "days")
    const estimatedTimeNum = parseFloat(estimatedTime.toString())

    if (daysUntilDue <= 1 && estimatedTimeNum > 4) return 100
    if (daysUntilDue <= 3 && estimatedTimeNum > 2) return 75
    if (daysUntilDue <= 7) return 50
    return 25
  }

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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-priority" className="text-right">
              Priority
            </Label>
            <p className="col-span-3">
              {isEditing ? calculatePriority() : task.priority}
            </p>
          </div>
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

export default function Dashboard({ initialTasks = [], user }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTask, setNewTask] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false)
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentWeekStart, setCurrentWeekStart] = useState(
    moment().startOf("week").toDate(),
  )

  const router = useRouter()

  useEffect(() => {
    // Convert tasks to events
    const initialEvents = tasks.map(task => ({
      id: task.id,
      title: task.content,
      start: task.scheduledTime?.start || task.dueDate,
      end: task.scheduledTime?.end || moment(task.dueDate).add(1, 'hour').toDate(),
    }))
    setEvents(initialEvents)
  }, [tasks])

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        content: newTask,
        priority: 25, // Default priority
        dueDate: moment(selectedDate).toDate(),
        estimatedTime: 1, // Default estimated time
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

  const calculatePriority = (task: Task) => {
    const daysUntilDue = moment(task.dueDate).diff(moment(), "days")
    const estimatedTimeNum = task.estimatedTime

    if (daysUntilDue <= 1 && estimatedTimeNum > 4) return 100
    if (daysUntilDue <= 3 && estimatedTimeNum > 2) return 75
    if (daysUntilDue <= 7) return 50
    return 25
  }

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
          updatedTask.priority = calculatePriority(updatedTask)
          return updatedTask
        }
        return task
      })
    )

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
          updatedTask.priority = calculatePriority(updatedTask)
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
          updatedTask.priority = calculatePriority(updatedTask)
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
        moment(task.dueDate).format("YYYY-MM-DD") ===
        moment(date).format("YYYY-MM-DD")
    )
  }

  const handleRangeChange = (range: { start: Date }) => {
    const newWeekStart = moment(range.start).startOf("week").toDate()
    setCurrentWeekStart(newWeekStart)
    setSelectedDate(moment(range.start).toDate())
  }

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    const newDate = moment(selectedDate)
    switch (action) {
      case "PREV":
        newDate.subtract(1, "week")
        break
      case "NEXT":
        newDate.add(1, "week")
        break
      case "TODAY":
        newDate.set(moment())
        break
    }
    setSelectedDate(newDate.toDate())
    setCurrentWeekStart(newDate.startOf("week").toDate())
  }

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
        <div className="w-1/4 bg-gray-100 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
        <DaySelector
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="due">Due Today</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks">
            <div className="flex mb-4">
              <Input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-grow mr-2"
              />
              <Button
                onClick={addTask}
                className="bg-primary text-primary-foreground"
              >
                Add
              </Button>
            </div>
            <div>
              {tasks.map((task) => (
                <TaskComponent
                  key={task.id}
                  task={task}
                  onSchedule={handleScheduleTask}
                  onView={handleViewTask}
                />
              ))}
            </div>
          </TabsContent>
              <TabsContent value="due">
                <div>
                  {getDueTasks(selectedDate).map((task) => (
                    <TaskComponent
                      key={task.id}
                      task={task}
                      onSchedule={handleScheduleTask}
                      onView={handleViewTask}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex-1 p-6 overflow-hidden">
            <h1 className="text-3xl font-bold mb-6">Welcome, Shiven</h1>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "calc(100vh - 150px)" }}
              views={["week"]}
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
                  <CustomToolbar {...props} onNavigate={handleNavigate} />
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