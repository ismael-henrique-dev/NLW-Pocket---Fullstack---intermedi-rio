import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { and, count, eq, sql, asc } from 'drizzle-orm'
import dayjs from 'dayjs'

export async function getWeekPendingGoals() {
  const currentYear = dayjs().year()
  const currentWeek = dayjs().week()

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.deseridWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(
        and(
          sql`EXTRACT(YEAR FROM ${goals.createdAt}) <= ${currentYear}`,
          sql`EXTRACT(WEEK FROM ${goals.createdAt}) <= ${currentWeek}`
        )
      )
  )

  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goals.id,
        completionCount: count(goalCompletions.id).as('completionCount'),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      .groupBy(goals.id)
  )

  const pendingGoals = await db
    .with(goalsCreatedUpToWeek, goalCompletionCounts)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount:
        sql`COALESCE(${goalCompletionCounts.completionCount}, 0)`.mapWith(
          Number
        ),
    })
    .from(goalsCreatedUpToWeek)
    .orderBy(asc(goalsCreatedUpToWeek.createdAt))
    .leftJoin(
      goalCompletionCounts,
      eq(goalsCreatedUpToWeek.id, goalCompletionCounts.goalId)
    )

  return { pendingGoals }
}
