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

interface DayContext {
  date: Date;
  tasks: Task[];
}

const baseURL = "https://gateway.ai.cloudflare.com/v1/1bda6dee63e224968c4c71d51a4f5abb/opuslist-scheduler/openai";

const model = new OpenAI({ 
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  temperature: 0.3,
  modelName: "gpt-4o-mini",
  configuration: {
    baseURL,
  },
});

const promptTemplate = new PromptTemplate({
  template: `You are a human-like task estimation assistant with a focus on accuracy and realistic time frames. Given the context of a day's schedule and a new task, estimate how long the task might take to complete. Consider factors such as task complexity, potential interruptions, and human tendencies.

Day's context:
Date: {date}
Existing tasks:
{existingTasks}

New task: {newTask}

Estimate the time in hours (use decimals for partial hours) it would likely take a person to complete this task. Provide your estimate and a brief explanation.

Estimated time (in hours):`,
  inputVariables: ["date", "existingTasks", "newTask"],
});

const chain = new LLMChain({ llm: model, prompt: promptTemplate });

export async function estimateTaskTime(newTask: string, dayContext: DayContext): Promise<number> {
  const existingTasks = dayContext.tasks.map(task => 
    `- ${task.content} (${task.estimatedTime} hours)`
  ).join("\n");

  const result = await chain.call({
    date: moment(dayContext.date).format('YYYY-MM-DD'),
    existingTasks,
    newTask,
  });

  // Extract the estimated time from the result
  const estimatedTimeMatch = result.text.match(/Estimated time \(in hours\):\s*(\d+(\.\d+)?)/);
  const estimatedTime = estimatedTimeMatch ? parseFloat(estimatedTimeMatch[1]) : null;

  if (estimatedTime === null || isNaN(estimatedTime)) {
    throw new Error("Failed to estimate task time");
  }

  return estimatedTime;
}

