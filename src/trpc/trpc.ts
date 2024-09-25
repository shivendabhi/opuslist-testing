// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
// import { TRPCError, initTRPC } from '@trpc/server'

// const t = initTRPC.create()
// const middleware = t.middleware

// const isAuth = middleware(async (opts) => {
//   const { getUser } = getKindeServerSession()
//   const user = getUser()

//   if (!user || !(await user).id) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' })
//   }

//   return opts.next({
//     ctx: {
//       userId: (await user).id,
//       user,
//     },
//   })
// })

// export const router = t.router
// export const publicProcedure = t.procedure
// export const privateProcedure = t.procedure.use(isAuth)

import { TRPCError, initTRPC } from '@trpc/server'

const t = initTRPC.create()
export const router = t.router
export const publicProcedure = t.procedure


// import { AppRouter } from "@/trpc"
// import { createTRPCClient } from "@trpc/react-query"

// export const trpc = createTRPCClient<AppRouter>({})