import { db } from '../db'
import { goals } from '../db/schema'

interface CreateGoalRequest {
  title: string
  deseridWeeklyFrequency: number
}

export async function createGoal({
  title,
  deseridWeeklyFrequency,
}: CreateGoalRequest) {
  const result = await db
    .insert(goals)
    .values({
      title,
      deseridWeeklyFrequency,
    })
    .returning()

  const goal = result[0]

  return {
    goal,
  }
}
