import { AppRouter } from '@/trpc'
import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      // You can add custom headers here if needed
      headers: () => {
        return {}
      },
    }),
  ],
})
