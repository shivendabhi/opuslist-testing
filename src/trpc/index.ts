import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';

export const appRouter = router({
   authCallback: publicProcedure.query(async () => {
    const{getUser} = getKindeServerSession()
    const user = getUser()

    if (!(await user).id || !(await user).email)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

    const dbUser = await db.user.findFirst({
        where: {
            id: (await user).id,
        },
    })
    if(!dbUser){
        await db.user.create({
            data: {
                id: (await user).id,
                email: (await user).email ?? (() => { throw new TRPCError({ code: 'UNAUTHORIZED' }) })()
            }
        })
    }

    return { success: true }
  
})
})

export type AppRouter = typeof appRouter;