import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { z } from 'zod';

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user.id || !user.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    })
    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email
        }
      })
    }

    return { success: true }
  }),

  getTasks: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user.id) throw new TRPCError({ code: 'UNAUTHORIZED' })

    const tasks = await db.task.findMany({
      where: {
        userId: user.id
      },
      include: {
        scheduledTime: true
      }
    })

    return tasks
  }),

  createTask: publicProcedure
    .input(z.object({
      content: z.string(),
      dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
      estimatedTime: z.number(),
      scheduledTime: z.object({
        start: z.string().transform(val => new Date(val)),
        end: z.string().transform(val => new Date(val))
      }).optional()
    }))
    .mutation(async ({ input }) => {
      const { getUser } = getKindeServerSession()
      const user = await getUser()

      if (!user.id) throw new TRPCError({ code: 'UNAUTHORIZED' })

      try {
        const task = await db.task.create({
          data: {
            content: input.content,
            dueDate: input.dueDate,
            estimatedTime: input.estimatedTime,
            userId: user.id,
            scheduledTime: input.scheduledTime ? {
              create: input.scheduledTime
            } : undefined
          },
          include: {
            scheduledTime: true
          }
        })

        return task
      } catch (error) {
        console.error("Error creating task:", error)
        throw new TRPCError({ 
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create task',
          cause: error
        })
      }
    }),

  updateTask: publicProcedure
    .input(z.object({
      id: z.string(),
      content: z.string().optional(),
      dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
      estimatedTime: z.number().optional(),
      actualTime: z.number().optional(),
      scheduledTime: z.object({
        start: z.string().transform(val => new Date(val)),
        end: z.string().transform(val => new Date(val))
      }).optional()
    }))
    .mutation(async ({ input }) => {
      const { getUser } = getKindeServerSession()
      const user = await getUser()

      if (!user.id) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const task = await db.task.update({
        where: {
          id: input.id,
          userId: user.id
        },
        data: {
          content: input.content,
          dueDate: input.dueDate,
          estimatedTime: input.estimatedTime,
          actualTime: input.actualTime,
          scheduledTime: input.scheduledTime ? {
            upsert: {
              create: input.scheduledTime,
              update: input.scheduledTime
            }
          } : undefined
        },
        include: {
          scheduledTime: true
        }
      })

      return task
    }),

    deleteTask: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { getUser } = getKindeServerSession()
      const user = await getUser()

      if (!user.id) throw new TRPCError({ code: 'UNAUTHORIZED' })

      // First, delete the associated ScheduledTime if it exists
      await db.scheduledTime.deleteMany({
        where: {
          taskId: input,
        },
      })

      // Then, delete the Task
      await db.task.delete({
        where: {
          id: input,
          userId: user.id
        }
      })

      return { success: true }
    })

  // ... other procedures
})

export type AppRouter = typeof appRouter;
