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
const baseURL = "https://gateway.ai.cloudflare.com/v1/1bda6dee63e224968c4c71d51a4f5abb/opuslist-ai/openai";
export async function generateWeeklySummary(tasks: Task[], weekStart: Date) {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    console.error("OpenAI API key not found");
    return "Unable to generate weekly summary due to missing API key.";
  }

  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const model = new OpenAI({ 
        openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        temperature: 0.3,
        modelName: "gpt-4o-mini",
        configuration: {
          baseURL,
        },
      });

      const weekEnd = moment(weekStart).endOf('week').toDate();
      const weekTasks = tasks.filter(task => 
        task.dueDate && moment(task.dueDate).isBetween(weekStart, weekEnd, 'day', '[]')
      );

      const tasksSummary = weekTasks.map(task => {
        const dueDate = task.dueDate ? moment(task.dueDate).format('MMM D, YYYY') : 'No due date';
        const time = task.scheduledTime ? task.actualTime : task.estimatedTime;
        return `${task.content} - ${time}h on ${dueDate}`;
      }).join('\n');

      const promptTemplate = new PromptTemplate({
        template: `You are a highly precise AI assistant specialized in creating weekly task summaries. Your role is to analyze the given tasks and generate a summary strictly based on the provided information. Do not invent or assume any information not explicitly stated.

Week: {weekStart} to {weekEnd}

Tasks:
{tasks}

Instructions:
1. Use only the information provided above. Do not add, invent, or assume any tasks or dates not listed.
2. Ensure all dates mentioned in your summary fall within the specified week.
3. Maintain the exact task names, times, and dates as given.
4. If there are fewer than 5 tasks, only list the available tasks in the "Most Important Tasks" section.

Please generate a summary in the following format:

Weekly Objectives
• [Derive 1-3 high-level objectives based solely on the given tasks. If there are not enough tasks to determine meaningful objectives, state "Insufficient tasks to determine weekly objectives."]

Most Important Tasks
[List up to 5 tasks, prioritized by due date (earlier dates first) and then by estimated/actual time (longer times first). Use exactly this format:]
1. [taskName] - [estimatedTime or actualTime]h on [dueDate]
2. ...

Timeline for the Week
[List all tasks chronologically, using exactly this format:]
• [taskName] - [dueDate]
• ...

If there are no tasks within the specified week, respond with:
"No tasks scheduled for the week of {weekStart} to {weekEnd}."

Remember, accuracy is crucial. Only include information directly provided in the task list.`,
  inputVariables: ["weekStart", "weekEnd", "tasks"],
        });

      const chain = new LLMChain({ llm: model, prompt: promptTemplate });

      const result = await chain.call({
        weekStart: moment(weekStart).format('MMM D, YYYY'),
        weekEnd: moment(weekEnd).format('MMM D, YYYY'),
        tasks: tasksSummary,
      });

      return result.text;
    } catch (error) {
      console.error(`Error in generateWeeklySummary (attempt ${retries + 1}):`, error);
      if (error instanceof Error && error.message.includes("429")) {
        retries++;
        if (retries < maxRetries) {
          const delay = Math.pow(2, retries) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          return "Unable to generate weekly summary due to API rate limit. Please try again later.";
        }
      } else {
        return "An error occurred while generating the weekly summary. Please try again later.";
      }
    }
  }

  return "Failed to generate weekly summary after multiple attempts. Please try again later.";
}

