import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from "@/trpc"
import { db } from '@/db'

async function handler(req: Request) {
  try {
    await db.$connect()
    return fetchRequestHandler({
      endpoint: '/api/trpc',
      req,
      router: appRouter,
      createContext: () => ({})
    });
  } catch (error) {
    console.error('Error in tRPC handler:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export { handler as GET, handler as POST };
