import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { getWeekPendingGoals } from '../../functions/get-week-pending-goals'

export const getPenddingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/pendding-goals', async () => {
    const { pendingGoals } = await getWeekPendingGoals()

    return {
      pendingGoals,
    }
  })
}
