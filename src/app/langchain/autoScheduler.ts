import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import moment from "moment";

interface Task {
  id: string;
  content: string;
  dueDate: Date | null;
  estimatedTime: number;
  scheduledTime: { start: Date; end: Date } | null;
  actualTime: number | null;
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const baseURL = "https://gateway.ai.cloudflare.com/v1/1bda6dee63e224968c4c71d51a4f5abb/opuslist-scheduler/openai";

export async function autoScheduleTask(
  taskToSchedule: Task,
  allTasks: Task[],
  existingEvents: Event[],
  selectedDate: Date
): Promise<{ start: Date; end: Date } | null> {
  const model = new OpenAI({ 
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    temperature: 0.1,
    modelName: "gpt-4o-mini",
    configuration: {
      baseURL,
    },
  });

  // Format the due date as YYYY-MM-DD
  const formattedDueDate = taskToSchedule.dueDate 
    ? moment(taskToSchedule.dueDate).format('YYYY-MM-DD')
    : 'Not specified';

  // Filter tasks and events for the selected date
  const selectedDateStart = moment(selectedDate).startOf('day');
  const selectedDateEnd = moment(selectedDate).endOf('day');

  const relevantTasks = allTasks.filter(task => 
    task.scheduledTime && 
    moment(task.scheduledTime.start).isBetween(selectedDateStart, selectedDateEnd, null, '[]')
  );

  const relevantEvents = existingEvents.filter(event => 
    moment(event.start).isBetween(selectedDateStart, selectedDateEnd, null, '[]')
  );

  // Combine and sort all relevant events and tasks
  const allScheduledItems = [...relevantTasks, ...relevantEvents].sort((a, b) => {
    const aStart = 'scheduledTime' in a ? a.scheduledTime!.start : a.start;
    const bStart = 'scheduledTime' in b ? b.scheduledTime!.start : b.start;
    return moment(aStart).diff(moment(bStart));
  });

  // Format existing tasks and events
  const existingTasksAndEvents = allScheduledItems.map(item => {
    if ('content' in item) {
      return `Task: ${item.content}, Estimated Time: ${item.estimatedTime}h, Scheduled: ${moment(item.scheduledTime!.start).format('YYYY-MM-DD HH:mm')} - ${moment(item.scheduledTime!.end).format('YYYY-MM-DD HH:mm')}`;
    } else {
      return `Event: ${item.title}, Time: ${moment(item.start).format('YYYY-MM-DD HH:mm')} - ${moment(item.end).format('YYYY-MM-DD HH:mm')}`;
    }
  }).join('\n');

  // Find available time slots
  const availableSlots = findAvailableTimeSlots(allScheduledItems, selectedDate);
  const formattedAvailableSlots = availableSlots.map(slot => 
    `${moment(slot.start).format('YYYY-MM-DD HH:mm')} - ${moment(slot.end).format('YYYY-MM-DD HH:mm')}`
  ).join('\n');

  const template = `
You are an AI task scheduler with extreme precision and attention to detail. Your primary goal is to schedule tasks efficiently while strictly adhering to all given constraints and user preferences. Analyze the following information and suggest the optimal time slot for scheduling a new task:

New Task: {newTask}
Estimated Time: {estimatedTime} hours
Due Date: {dueDate}

Current Date: {selectedDate}

Existing Schedule for {selectedDate}:
{existingTasksAndEvents}

Available Time Slots:
{availableSlots}

Scheduling Rules:
1. ONLY use the exact Available Time Slots provided. Do not suggest any time outside these slots.
2. The entire task duration MUST fit within a single available slot.
3. Do not overlap with any existing tasks or events.
4. Respect the task's due date if specified.
5. Prioritize scheduling tasks earlier in the day when possible, but maintain a balanced workload.
6. Consider the nature of the task and when it might best fit into the day.
7. Allow for short breaks (5-15 minutes) between tasks when possible.
8. If the task can't be scheduled on the current date, explicitly state this and suggest the next possible date.
9. If the entire day is available (00:00 - 23:59), schedule the task at an appropriate time considering its nature and estimated duration.

Provide your response in the following format:
Start Time: YYYY-MM-DD HH:mm
End Time: YYYY-MM-DD HH:mm
Reasoning: [Your detailed explanation here]

If no suitable time slot is available on the given date, respond with:
No Suitable Slot
Next Possible Date: YYYY-MM-DD
Reasoning: [Your detailed explanation here]

Remember, accuracy and adherence to the provided slots and rules are crucial. Double-check your suggestion before providing it.
`;

  const prompt = new PromptTemplate({
    template: template,
    inputVariables: [
      "newTask",
      "estimatedTime",
      "dueDate",
      "existingTasksAndEvents",
      "availableSlots",
      "selectedDate",
    ],
  });

  const chain = new LLMChain({ llm: model, prompt: prompt });

  const result = await chain.call({
    newTask: taskToSchedule.content,
    estimatedTime: taskToSchedule.estimatedTime,
    dueDate: formattedDueDate,
    existingTasksAndEvents: existingTasksAndEvents,
    availableSlots: formattedAvailableSlots,
    selectedDate: moment(selectedDate).format('YYYY-MM-DD'),
  });

  const output = result.text;

  // Parse the output
  const startTimeMatch = output.match(/Start Time: (\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
  const endTimeMatch = output.match(/End Time: (\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
  const noSlotMatch = output.match(/No Suitable Slot/);
  const nextPossibleDateMatch = output.match(/Next Possible Date: (\d{4}-\d{2}-\d{2})/);

  if (startTimeMatch && endTimeMatch) {
    const startTime = moment(startTimeMatch[1], 'YYYY-MM-DD HH:mm').toDate();
    const endTime = moment(endTimeMatch[1], 'YYYY-MM-DD HH:mm').toDate();
    
    // Verify if the suggested slot is within available slots
    const isValidSlot = availableSlots.some(slot => 
      startTime >= slot.start && endTime <= slot.end
    );

    if (isValidSlot) {
      console.log("AI Scheduler suggested valid time slot:", startTime, "-", endTime);
      return { start: startTime, end: endTime };
    } else {
      console.log("AI Scheduler suggested an invalid time slot. Rejecting.");
      return null;
    }
  } else if (noSlotMatch && nextPossibleDateMatch) {
    console.log("No suitable slot found. Next possible date:", nextPossibleDateMatch[1]);
    return null;
  }

  console.log("AI Scheduler output couldn't be parsed:", output);
  return null;
}

function findAvailableTimeSlots(scheduledItems: (Task | Event)[], selectedDate: Date): { start: Date; end: Date }[] {
  const startOfDay = moment(selectedDate).startOf('day');
  const endOfDay = moment(selectedDate).endOf('day');

  if (scheduledItems.length === 0) {
    // If there are no scheduled items, return the entire day as available
    return [{
      start: startOfDay.toDate(),
      end: endOfDay.toDate()
    }];
  }

  const availableSlots = [];
  let currentTime = startOfDay.toDate();

  for (let i = 0; i <= scheduledItems.length; i++) {
    const nextItem = scheduledItems[i];
    const nextStart = nextItem 
      ? ('scheduledTime' in nextItem ? nextItem.scheduledTime!.start : nextItem.start) 
      : endOfDay.toDate();
    
    if (moment(currentTime).isBefore(nextStart)) {
      availableSlots.push({
        start: new Date(currentTime),
        end: new Date(nextStart)
      });
    }

    if (nextItem) {
      currentTime = new Date('scheduledTime' in nextItem ? nextItem.scheduledTime!.end : nextItem.end);
    }
  }

  return availableSlots;
}
