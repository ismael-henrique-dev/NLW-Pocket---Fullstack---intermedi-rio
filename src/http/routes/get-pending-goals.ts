import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { getWeekPenddingGoals } from '../../functions/get-week-pending-goals'

export const getPenddingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/pendding-goals', async () => {
    const { penddingGoals } = await getWeekPenddingGoals()

    return {
      penddingGoals,
    }
  })
}
