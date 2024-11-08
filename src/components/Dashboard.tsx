"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { trpc } from "@/app/_trpc/client";
import { autoScheduleTask } from "@/app/langchain/autoScheduler";

import * as chrono from "chrono-node";
import {removeStopwords} from "stopword"
import WeeklySummary from './WeeklySummary';

import React, { useState, useCallback, useEffect, SyntheticEvent, useRef, useMemo } from "react";
import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { NavigateAction } from "react-big-calendar";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClockIcon,
  CalendarIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  EditIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogOut,
  Trash,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { generateWeeklySummary } from '@/app/langchain/weeklySummary';
import { estimateTaskTime as estimateTaskTimeAPI } from '@/app/langchain/taskEstimator';

const localizer = momentLocalizer(moment);

interface Task {
  id: string;
  content: string;
  dueDate: Date | null;
  estimatedTime: number;
  scheduledTime: { start: Date; end: Date } | null;
  actualTime: number | null;
  allDay?: boolean;
}

interface DayContext {
  date: Date;
  tasks: Task[];
}

interface DashboardProps {
  initialTasks?: Task[];
  user: { name: string; id: string };
}

import { Switch } from "@/components/ui/switch";

interface ViewToggleProps {
  view: "week" | "month";
  onViewChange: (view: "week" | "month") => void;
}
const TaskInputForm: React.FC<{
  newTask: string;
  setNewTask: (value: string) => void;
  addTask: (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => void;
}> = ({ newTask, setNewTask, addTask }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
      <Button type="submit">Add</Button>
    </form>
  );
};

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="view-toggle">Weekly</Label>
      <Switch
        id="view-toggle"
        checked={view === "month"}
        onCheckedChange={(checked) => onViewChange(checked ? "month" : "week")}
      />
      <Label htmlFor="view-toggle">Monthly</Label>
    </div>
  );
};
const stringToView = (viewString: string): View => {
  const viewMap: { [key: string]: View } = {
    month: Views.MONTH,
    week: Views.WEEK,
    work_week: Views.WORK_WEEK,
    day: Views.DAY,
    agenda: Views.AGENDA,
  };
  return viewMap[viewString.toLowerCase()] || Views.WEEK;
};
const CustomToolbar = ({
  onNavigate,
  label,
  view,
  onViewChange,
}: {
  onNavigate: (newDate: Date, view: string, action: NavigateAction) => void;
  label: string;
  view: "week" | "month";
  onViewChange: (view: "week" | "month") => void;
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
        <Button
          onClick={() => onNavigate(new Date(), Views.WEEK, "NEXT")}
          variant="outline"
        >
          Next
        </Button>
      </div>
      {/* <ViewToggle view={view} onViewChange={onViewChange} /> */}
      <span className="text-lg font-semibold">
        {view === "week"
          ? label
          : moment(label.split(" – ")[0]).format("MMMM YYYY")}
      </span>
    </div>
  );
};

interface DaySelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  view: "daily" | "weekly";
}

const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDate,
  onSelectDate,
  view,
}) => {
  const handlePrev = () => {
    onSelectDate(
      moment(selectedDate)
        .subtract(view === "daily" ? 1 : 7, "day")
        .toDate(),
    );
  };

  const handleNext = () => {
    onSelectDate(
      moment(selectedDate)
        .add(view === "daily" ? 1 : 7, "day")
        .toDate(),
    );
  };

  const formatDate = () => {
    if (view === "daily") {
      return {
        main: moment(selectedDate).format("dddd"),
        sub: moment(selectedDate).format("MMMM D, YYYY"),
      };
    } else {
      const weekStart = moment(selectedDate).startOf("week");
      const weekEnd = moment(selectedDate).endOf("week");
      return {
        main: `Week of ${weekStart.format("MMM D")}`,
        sub: `${weekStart.format("MMM D")} - ${weekEnd.format("MMM D, YYYY")}`,
      };
    }
  };

  const dateFormat = formatDate();

  return (
    <div className="flex justify-between items-center mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrev}
        aria-label={view === "daily" ? "Previous day" : "Previous week"}
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
        aria-label={view === "daily" ? "Next day" : "Next week"}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

const TaskComponent = ({
  task,
  onSchedule,
  onView,
  onDelete,
  selectedDate,
  isSelected,
}: {
  task: Task;
  onSchedule: (task: Task) => void;
  onView: (task: Task) => void;
  onDelete: (taskId: string) => void;
  selectedDate: Date;
  isSelected: boolean;
}) => {
  const isScheduled = !!task.scheduledTime;
  const isDueToday =
    task.dueDate && moment(task.dueDate).isSame(selectedDate, "day");
  const isScheduledToday =
    task.scheduledTime &&
    moment(task.scheduledTime.start).isSame(selectedDate, "day");

  const getBackgroundColor = () => {
    if (isDueToday && !isScheduledToday) return "bg-blue-50";
    if (isScheduledToday && !isDueToday) return "bg-white";
    if (isScheduledToday && isDueToday) return "bg-white";
    return "bg-white";
  };

  const showActualTime = isScheduledToday || !isDueToday;

  return (
    <Card className={`mb-2 ${getBackgroundColor()} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <p className="font-medium">{task.content}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {task.dueDate && (
                <Badge variant="outline">
                  Due: {moment(task.dueDate).format("MMM D")}
                </Badge>
              )}
              {showActualTime ? (
                task.actualTime ? (
                  <Badge variant="secondary" className="bg-green-500">
                    Actual: {task.actualTime}h
                  </Badge>
                ) : (
                  <Badge>Est: {task.estimatedTime}h</Badge>
                )
              ) : null}
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
  );
};

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  isResizing?: boolean;
}

import { EventProps } from "react-big-calendar";

// const CustomEvent = ({ event }: EventProps<Event>) => {
//   const [isSmallEvent, setIsSmallEvent] = useState(false)
//   const eventRef = React.useRef(null)

//   React.useEffect(() => {
//     if (eventRef.current) {
//       const { offsetHeight } = eventRef.current
//       setIsSmallEvent(offsetHeight < 40)
//     }
//   }, [event])

//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <div
//             ref={eventRef}
//             className={`bg-blue-500 text-white p-1 rounded overflow-hidden h-full flex flex-col justify-center ${
//               isSmallEvent ? "items-center" : ""
//             }`}
//           >
//             {isSmallEvent ? (
//               <div
//                 className="text-xs font-semibold truncate w-full text-center"
//                 aria-label={event.title}
//               >
//                 {event.title}
//               </div>
//             ) : (
//               <>
//                 <div className="font-semibold text-sm truncate">
//                   {event.title}
//                 </div>
//                 <div className="text-xs">
//                   {moment(event.start).format("h:mm A")} -{" "}
//                   {moment(event.end).format("h:mm A")}
//                 </div>
//               </>
//             )}
//           </div>
//         </TooltipTrigger>
//         {/* <TooltipContent>
//           <p>{event.title}</p>
//           <p className="text-xs">
//             {moment(event.start).format("h:mm A")} -{" "}
//             {moment(event.end).format("h:mm A")}
//           </p>
//         </TooltipContent> */}
//       </Tooltip>
//     </TooltipProvider>
//   )
// }

interface TaskScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSchedule: (taskId: string, start: Date, end: Date) => void;
}

const TaskScheduleModal: React.FC<TaskScheduleModalProps> = ({
  isOpen,
  onClose,
  task,
  onSchedule,
}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (task) {
      setStartTime(moment().format("YYYY-MM-DDTHH:mm"));
      setEndTime(moment().add(1, "hour").format("YYYY-MM-DDTHH:mm"));
    }
  }, [task]);

  const handleSchedule = () => {
    const start = moment(startTime, "YYYY-MM-DDTHH:mm");
    const end = moment(endTime, "YYYY-MM-DDTHH:mm");
    if (task) {
      onSchedule(task.id, start.toDate(), end.toDate());
    }
    onClose();
  };

  if (!task) return null;

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
  );
};

interface TaskViewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (taskId: string, updatedInfo: Partial<Task>) => void;
  initialEditMode?: boolean;
}

const TaskViewEditModal: React.FC<TaskViewEditModalProps> = ({
  isOpen,
  onClose,
  task,
  onUpdate,
  initialEditMode = false
}) => {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [content, setContent] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (task) {
      setContent(task.content);
      setEstimatedTime(task.estimatedTime);
      setDueDate(task.dueDate ? moment(task.dueDate).format("YYYY-MM-DD") : "");
      if (task.scheduledTime) {
        setStartTime(
          moment(task.scheduledTime.start).format("YYYY-MM-DDTHH:mm"),
        );
        setEndTime(moment(task.scheduledTime.end).format("YYYY-MM-DDTHH:mm"));
      }
    }
  }, [task]);

  useEffect(() => {
    setIsEditing(initialEditMode);
  }, [initialEditMode, isOpen]);

  const handleUpdate = () => {
    const updatedTask: Partial<Task> = {
      content,
      estimatedTime: parseFloat(estimatedTime.toString()),
      dueDate: dueDate ? moment(dueDate).toDate() : null,
    };
    if (startTime && endTime) {
      updatedTask.scheduledTime = {
        start: moment(startTime).toDate(),
        end: moment(endTime).toDate(),
      };
    }
    if (task) {
      onUpdate(task.id, updatedTask);
    }
    setIsEditing(false);
  };

  // const calculatePriority = (task: Task) => {
  //   if (!task.dueDate) return null; // Default priority if no due date is set

  //   const daysUntilDue = moment(task.dueDate).diff(moment(), "days")
  //   const estimatedTimeNum = task.estimatedTime

  //   if (daysUntilDue <= 1 && estimatedTimeNum > 4) return 100
  //   if (daysUntilDue <= 3 && estimatedTimeNum > 2) return 75
  //   if (daysUntilDue <= 7) return 50
  //   return 25
  // }

  if (!task) return null;

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
  );
};

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const DragAndDropCalendar = withDragAndDrop(Calendar);

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskListView, setTaskListView] = useState<"daily" | "weekly">("daily");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('week').toDate());
  const [currentMonthStart, setCurrentMonthStart] = useState(
    moment().startOf("month").toDate(),
  );
  const [calendarView, setCalendarView] = useState<"week" | "month">("week");
  const { user, getUser } = useKindeBrowserClient();
  const userDetails = getUser();
  const userId = userDetails?.given_name;
  const [weeklySummary, setWeeklySummary] = useState<string>('');
  const [tasksBeingEstimated, setTasksBeingEstimated] = useState<Set<string>>(new Set());

  const router = useRouter();

  const { data: tasksData, refetch: refetchTasks } = trpc.getTasks.useQuery();
  const createTaskMutation = trpc.createTask.useMutation();
  const updateTaskMutation = trpc.updateTask.useMutation();
  const deleteTaskMutation = trpc.deleteTask.useMutation();

  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
  const getFilteredTasks = () => {
    if (taskListView === "daily") {
      const dueDate = moment(selectedDate).startOf("day");
      const dueTasks = tasks.filter(
        (task) => task.dueDate && moment(task.dueDate).isSame(dueDate, "day"),
      );
      const scheduledTasks = tasks.filter(
        (task) =>
          task.scheduledTime &&
          moment(task.scheduledTime.start).isSame(dueDate, "day"),
      );

      return [...new Set([...dueTasks, ...scheduledTasks])];
    } else {
      const weekStart = moment(selectedDate).startOf("week");
      const weekEnd = moment(selectedDate).endOf("week");
      const weekTasks = tasks.filter(
        (task) =>
          (task.dueDate &&
            moment(task.dueDate).isBetween(weekStart, weekEnd, "day", "[]")) ||
          (task.scheduledTime &&
            moment(task.scheduledTime.start).isBetween(
              weekStart,
              weekEnd,
              "day",
              "[]",
            )),
      );

      return weekTasks.sort((a, b) => {
        const dateA =
          a.dueDate || (a.scheduledTime && a.scheduledTime.start) || new Date();
        const dateB =
          b.dueDate || (b.scheduledTime && b.scheduledTime.start) || new Date();
        return moment(dateA).diff(moment(dateB));
      });
    }
  };

  const updateTaskAndEvent = useCallback(async (
    taskId: string,
    start: Date,
    end: Date,
    allDay: boolean
  ) => {
    await updateTaskMutation.mutateAsync({
      id: taskId,
      scheduledTime: { start: start.toISOString(), end: end.toISOString() },
    });
    refetchTasks();
  }, [updateTaskMutation, refetchTasks]);

  const filteredTasks = useMemo(() => getFilteredTasks(), [tasks, selectedDate, taskListView]);

  const handleTaskSelect = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsViewEditModalOpen(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the input field is focused
      if (document.activeElement === inputRef.current) {
        if (event.key === 'Tab') {
          event.preventDefault(); // Prevent default tab behavior
          inputRef.current?.blur(); // Remove focus from input
          calendarRef.current?.focus(); // Focus the calendar container
          setSelectedTaskIndex(null); // Reset task selection
          return;
        }
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault(); // Prevent default arrow key behavior
          setSelectedTaskIndex((prevIndex) => {
            if (prevIndex === null) return event.key === 'ArrowUp' ? filteredTasks.length - 1 : 0;
            if (event.key === 'ArrowUp') return (prevIndex - 1 + filteredTasks.length) % filteredTasks.length;
            return (prevIndex + 1) % filteredTasks.length;
          });
          return;
        }
        if (event.key === 'Enter' && selectedTaskIndex !== null) {
          event.preventDefault();
          handleTaskSelect(filteredTasks[selectedTaskIndex]);
          return;
        }
        return; // Exit the function if the input is focused (for other keys)
      }

      // Reset task selection when focus is not on the input
      setSelectedTaskIndex(null);

      switch (event.key) {
        case 'ArrowLeft':
          setSelectedDate(prevDate => moment(prevDate).subtract(1, 'day').toDate());
          break;
        case 'ArrowRight':
          setSelectedDate(prevDate => moment(prevDate).add(1, 'day').toDate());
          break;
        case 'ArrowUp':
          setSelectedDate(prevDate => moment(prevDate).subtract(7, 'days').toDate());
          break;
        case 'ArrowDown':
          setSelectedDate(prevDate => moment(prevDate).add(7, 'days').toDate());
          break;
        case 'Enter':
          // Focus the input field when Enter is pressed
          inputRef.current?.focus();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredTasks, selectedTaskIndex, handleTaskSelect]); // Add dependencies

  useEffect(() => {
    if (tasksData) {
      setTasks(
        tasksData.map((task) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          scheduledTime: task.scheduledTime
            ? {
                ...task.scheduledTime,
                start: new Date(task.scheduledTime.start),
                end: new Date(task.scheduledTime.end),
              }
            : null,
        })),
      );
    }
  }, [tasksData]);

  useEffect(() => {
    const scheduledEvents: Event[] = tasks
      .filter((task) => task.scheduledTime !== null)
      .map((task) => ({
        id: task.id,
        title: task.content,
        start: task.scheduledTime!.start,
        end: task.scheduledTime!.end,
        allDay: task.allDay || false,
      }));
    setEvents(scheduledEvents);
  }, [tasks]);

  const findAvailableTimeSlot = (date: Date, duration: number) => {
    const startOfDay = moment(date).startOf("day").hour(8);
    const endOfDay = moment(date).startOf("day").hour(24);

    const scheduledEvents = events.filter((event) =>
      moment(event.start).isSame(date, "day"),
    );

    while (startOfDay.isBefore(endOfDay)) {
      const slotEnd = moment(startOfDay).add(duration, "hours");

      if (slotEnd.isAfter(endOfDay)) {
        break; // No more slots available today
      }

      const isSlotAvailable = scheduledEvents.every(
        (event) =>
          startOfDay.isSameOrAfter(moment(event.end)) ||
          slotEnd.isSameOrBefore(moment(event.start)),
      );

      if (isSlotAvailable) {
        return {
          start: startOfDay.toDate(),
          end: slotEnd.toDate(),
        };
      }

      startOfDay.add(30, "minutes"); // Try next 30-minute slot
    }

    return null; // No available slot found
  };
  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }: EventInteractionArgs<object>) => {
      const typedEvent = event as Event;
      const { allDay } = typedEvent;
      let updatedAllDay = allDay;

      if (!allDay && droppedOnAllDaySlot) {
        updatedAllDay = true;
      } else if (allDay && !droppedOnAllDaySlot) {
        updatedAllDay = false;
      }

      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === typedEvent.id) ?? {
          id: typedEvent.id,
          title: typedEvent.title,
          start,
          end,
          allDay: updatedAllDay,
        };
        const filtered = prev.filter((ev) => ev.id !== typedEvent.id);
        return [...filtered, { ...existing, start, end, allDay: updatedAllDay } as Event];
      });

      updateTaskAndEvent(typedEvent.id, new Date(start), new Date(end), updatedAllDay);
    },
    [setEvents, updateTaskAndEvent]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }: EventInteractionArgs<object>) => {
      const typedEvent = event as Event;
      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === typedEvent.id);
        if (!existing) return prev;
        const filtered = prev.filter((ev) => ev.id !== typedEvent.id);
        return [...filtered, { ...existing, start: new Date(start), end: new Date(end) }];
      });

      updateTaskAndEvent(typedEvent.id, new Date(start), new Date(end), typedEvent.allDay);
    },
    [setEvents, updateTaskAndEvent]
  );

  useEffect(() => {
    const scheduledEvents = tasks
      .filter((task) => task.scheduledTime !== null)
      .map((task) => ({
        id: task.id,
        title: task.content,
        start: task.scheduledTime!.start,
        end: task.scheduledTime!.end,
        allDay: false, // Add this property
      }));
    setEvents(scheduledEvents);
  }, [tasks]);

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId);
    refetchTasks();
  };

  const addTask = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newTask.trim() === '') return;

    // NLP parsing
    const parsedResults = chrono.parse(newTask, selectedDate, {
      forwardDate: true,
    });

    // Removing stop words from the task name
    const taskWords = newTask.split(" ");
    const parsedIndex = parsedResults[0]?.index ?? newTask.length;
    const oldTaskStrings = taskWords.slice(0, parsedIndex);
    const newTaskString = removeStopwords(oldTaskStrings, [
      "by", "BY", "By", "The", "the", "THE", "a", "A", "from", "From", "FROM",
      "at", "AT", "At", "in", "IN", "In", "for", "For", "FOR", "to", "To", "TO",
      "I", "i", "want", "Want", "WANT"
    ]);
    const taskContent = newTaskString.join(" ") || newTask;

    const task: Omit<Task, 'id'> = {
      content: taskContent,
      dueDate: parsedResults[0]?.start.date() || selectedDate,
      estimatedTime: 1, // Default value, will be updated after estimation
      scheduledTime: null,
      actualTime: null,
    };

    try {
      const createdTask = await createTaskMutation.mutateAsync({
        content: task.content,
        estimatedTime: task.estimatedTime,
        dueDate: task.dueDate?.toISOString() ?? selectedDate.toISOString(),
      });

      const createdTaskWithDates: Task = {
        ...createdTask,
        dueDate: createdTask.dueDate ? new Date(createdTask.dueDate) : null,
        scheduledTime: createdTask.scheduledTime ? {
          start: new Date(createdTask.scheduledTime.start),
          end: new Date(createdTask.scheduledTime.end)
        } : null
      };

      setTasks(prevTasks => [...prevTasks, createdTaskWithDates]);
      setNewTask('');
      refetchTasks();

      // Start estimation process
      setTasksBeingEstimated(prev => new Set(prev).add(createdTaskWithDates.id));
      estimateAndUpdateTaskTime(createdTaskWithDates);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const estimateAndUpdateTaskTime = async (task: Task) => {
    const dayContext: DayContext = {
      date: task.dueDate || new Date(),
      tasks: tasks.filter(t => t.dueDate && moment(t.dueDate).isSame(task.dueDate, 'day'))
    };

    try {
      const estimatedTime = await estimateTaskTimeAPI(task.content, dayContext);
      await updateTaskMutation.mutateAsync({
        id: task.id,
        estimatedTime: estimatedTime
      });
      // Update the local state as well
      setTasks(prevTasks => prevTasks.map(t => 
        t.id === task.id ? {...t, estimatedTime} : t
      ));
    } catch (error) {
      console.error('Error estimating task time:', error);
    } finally {
      setTasksBeingEstimated(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
    }
  };

  const handleScheduleTask = async (task: Task) => {
    const suggestedSlot = await autoScheduleTask(task, tasks, events, selectedDate);

    if (suggestedSlot) {
      const startTime = suggestedSlot.start;
      const endTime = suggestedSlot.end;

      const actualTime = calculateActualTime(startTime, endTime);
      try {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          scheduledTime: {
            start: startTime.toISOString(),
            end: endTime.toISOString(),
          },
          actualTime: actualTime,
        });
        refetchTasks();
        // Optionally, update the local state to reflect the change immediately
        setTasks(prevTasks => prevTasks.map(t => 
          t.id === task.id 
            ? {...t, scheduledTime: { start: startTime, end: endTime }, actualTime: actualTime}
            : t
        ));
      } catch (error) {
      
        console.error("Error updating task:", error);
        alert("Failed to schedule the task. Please try again.");
      }
    } else {
      alert("No suitable time slot found for this task on the selected date. Please try scheduling it for another day or adjusting your schedule.");
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsViewEditModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setSelectedTask(null);
    setIsScheduleModalOpen(false);
  };

  const handleCloseViewEditModal = () => {
    setSelectedTask(null);
    setIsViewEditModalOpen(false);
  };

  const calculateActualTime = (start: Date, end: Date) => {
    const duration = moment.duration(moment(end).diff(moment(start)));
    return duration.asMinutes() / 60;
  };

  const handleTaskScheduled = async (
    taskId: string,
    start: Date,
    end: Date,
  ) => {
    const actualTime = calculateActualTime(start, end);
    await updateTaskMutation.mutateAsync({
      id: taskId,
      scheduledTime: { start: start.toISOString(), end: end.toISOString() },
      actualTime: actualTime,
    });
    refetchTasks();
  };

  const handleTaskUpdate = async (taskId: string, updatedInfo: Partial<Task>) => {
    const { dueDate, ...otherInfo } = updatedInfo;

    const updatedTask = {
      id: taskId,
      ...otherInfo,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      scheduledTime: otherInfo.scheduledTime
        ? {
            start: otherInfo.scheduledTime.start.toISOString(),
            end: otherInfo.scheduledTime.end.toISOString(),
          }
        : undefined,
      actualTime: otherInfo.scheduledTime
        ? calculateActualTime(
            otherInfo.scheduledTime.start,
            otherInfo.scheduledTime.end,
          )
        : undefined,
    };

    try {
      await updateTaskMutation.mutateAsync(updatedTask);
      refetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle error (e.g., show an error message to the user)
    }
    setIsViewEditModalOpen(false);
  };

  

  const onEventResize = useCallback(
    ({ event, start, end }: { event: Event; start: Date; end: Date }) => {
      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id);
        if (!existing) return prev;
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
  
      updateTaskAndEvent(event.id, new Date(start), new Date(end), event.allDay);
    },
    [setEvents, updateTaskAndEvent]
  );

  const onEventDrop = useCallback(
    ({ event, start, end }: { event: Event; start: Date; end: Date }) => {
      updateTaskAndEvent(event.id, start, end, event.allDay);
    },
    [updateTaskAndEvent]
  );

  const handleSelectEvent = useCallback(
    (event: object, e: React.SyntheticEvent<HTMLElement>) => {
      const calendarEvent = event as CalendarEvent;
      const task = tasks.find((t) => t.id === calendarEvent.id);
      if (task) {
        setSelectedTask(task);
        setIsViewEditModalOpen(true);
      }
    },
    [tasks]
  );

  const handleRangeChange = useCallback((range: Date[] | { start: Date; end: Date }) => {
    const startDate = Array.isArray(range) ? range[0] : range.start;
    const newWeekStart = moment(startDate).startOf('week').toDate();
    setCurrentWeekStart(newWeekStart);
    setSelectedDate(moment(startDate).toDate());

    if (taskListView === 'weekly') {
      generateWeeklySummary(tasks, newWeekStart).then(setWeeklySummary);
    }
  }, [tasks, taskListView, generateWeeklySummary]);

  const handleNavigate = (
    newDate: Date,
    view: string,
    action: NavigateAction,
  ) => {
    let date = moment(selectedDate);

    switch (action) {
      case "PREV":
        date =
          taskListView === "daily"
            ? date.subtract(1, "day")
            : date.subtract(1, "week");
        break;
      case "NEXT":
        date =
          taskListView === "daily" ? date.add(1, "day") : date.add(1, "week");
        break;
      case "TODAY":
        date = moment();
        break;
      default:
        date = moment(newDate);
    }

    setSelectedDate(date.toDate());

    if (taskListView === "weekly") {
      setCurrentWeekStart(date.startOf("week").toDate());
    }
  };

  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    setSelectedDate(start);
  }, []);

  const CustomToolbar = ({
    onNavigate,
    label,
    view,
    onViewChange,
  }: {
    onNavigate: (newDate: Date, view: string, action: NavigateAction) => void;
    label: string;
    view: "week" | "month";
    onViewChange: (view: "week" | "month") => void;
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
          <Button
            onClick={() => onNavigate(new Date(), Views.WEEK, "NEXT")}
            variant="outline"
          >
            Next
          </Button>
        </div>
        {/* <ViewToggle view={view} onViewChange={onViewChange} /> */}
        <span className="text-lg font-semibold">
          {view === "week"
            ? label
            : moment(label.split(" – ")[0]).format("MMMM YYYY")}
        </span>
      </div>
    );
  };

  const CustomEvent = ({ event }: { event: Event }) => (
    <div className="p-1 text-xs">
      <strong>{event.title}</strong>
      {/* <br />
      {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')} */}
    </div>
  );
  const dayPropGetter = useCallback(
    (date: Date) => {
      const isSelected = moment(date).isSame(selectedDate, "day");
      const isToday = moment(date).isSame(new Date(), "day");
      const isSelectedWeek =
        taskListView === "weekly" &&
        moment(date).isBetween(
          moment(selectedDate).startOf("week"),
          moment(selectedDate).endOf("week"),
          "day",
          "[]",
        );

      if (isSelectedWeek) {
        return {
          className: "rbc-selected-week",
          style: {
            backgroundColor: "rgba(66, 153, 225, 0.2)", // Light blue background for the whole week
          },
        };
      }

      if (isSelected && taskListView === "daily") {
        return {
          className: "rbc-selected-day",
          style: {
            backgroundColor: "rgba(66, 153, 225, 0.2)", // Slightly darker blue for the selected day
          },
        };
      }

      if (isToday) {
        return {
          className: "rbc-today",
        };
      }

      return {};
    },
    [selectedDate, taskListView],
  );

  useEffect(() => {
    async function updateWeeklySummary() {
      if (taskListView === 'weekly') {
        setWeeklySummary("Generating weekly summary...");
        const summary = await generateWeeklySummary(tasks, currentWeekStart);
        setWeeklySummary(summary);
      }
    }

    updateWeeklySummary();
  }, [tasks, currentWeekStart, taskListView, generateWeeklySummary]);

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
        </div>
        <div className="flex flex-col items-center space-y-4">
          <a href="/api/auth/logout">
            <Button variant="ghost" size="icon" className="rounded-full">
              <LogOut className="h-6 w-6" />
              <span className="sr-only">Logout</span>
            </Button>
          </a>
        </div>
      </aside>
      <div className="flex-1 flex">
        <div className="w-1/4 bg-muted/20 p-6 overflow-y-auto">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Tasks</h2>
              <div className="flex space-x-2">
                <Button
                  variant={taskListView === "daily" ? "default" : "outline"}
                  onClick={() => setTaskListView("daily")}
                >
                  Daily
                </Button>
                <Button
                  variant={taskListView === "weekly" ? "default" : "outline"}
                  onClick={() => setTaskListView("weekly")}
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
            {taskListView === 'weekly' ? (
              <WeeklySummary summary={weeklySummary} />
            ) : (
              <>
                <form onSubmit={addTask} className="mb-4">
                  <Input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Type out your tasks here..."
                    className="mb-2"
                    ref={inputRef}
                  />
                  <Button type="submit">Add Task</Button>
                </form>
                {filteredTasks.map((task, index) => (
                  <TaskComponent
                    key={task.id}
                    task={task}
                    onSchedule={handleScheduleTask}
                    onView={handleViewTask}
                    onDelete={handleDeleteTask}
                    selectedDate={selectedDate}
                    isSelected={index === selectedTaskIndex}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <div className="flex-1 p-6 overflow-hidden" ref={calendarRef} tabIndex={0}>
          <h1 className="text-3xl font-bold mb-6">Welcome, {userId}</h1>
          <DragAndDropCalendar
            localizer={localizer}
            events={events}
            onEventDrop={moveEvent}
            resizable
            onEventResize={resizeEvent}
            style={{ height: "calc(100vh - 150px)" }}
            views={[Views.WEEK, Views.MONTH]}
            view={taskListView === "weekly" ? Views.MONTH : Views.WEEK}
            onView={(newView) => {
              setTaskListView(newView === Views.MONTH ? "weekly" : "daily");
            }}
            defaultView={Views.WEEK}
            min={new Date(0, 0, 0, 0, 0, 0)}
            max={new Date(0, 0, 0, 23, 59, 59)}
            step={10}
            timeslots={6}
            onSelectEvent={handleSelectEvent}
            onRangeChange={handleRangeChange}
            onNavigate={handleNavigate}
            onSelectSlot={handleSelectSlot}
            selectable={true}
            date={selectedDate}
            popup
            dayPropGetter={dayPropGetter}
            components={{
              toolbar: (props) => (
                <CustomToolbar
                  {...props}
                  onNavigate={handleNavigate}
                  view={taskListView === "weekly" ? "month" : "week"}
                  onViewChange={(newView) =>
                    setTaskListView(newView === "month" ? "weekly" : "daily")
                  }
                />
              ),
              event: CustomEvent as any,
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
        onClose={() => setIsViewEditModalOpen(false)}
        task={selectedTask}
        onUpdate={handleTaskUpdate}
        initialEditMode={true}
      />
    </div>
  );
}

