import { createContribution, getHabitByIdQueryOptions, invalidateHabitById, invalidateListHabits, updateContributionCompletions } from '@/api'
import { BackButton } from '@/components/BackButton'
import { ContributionsGrid } from '@/components/ContributionsGrid'
import { EditHabitDialog } from '@/components/EditHabitForm'
import { Button } from '@/components/ui/button'
import { queryClient } from '@/lib/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getDayOfYear } from 'date-fns/getDayOfYear'
import { CheckIcon, EditIcon } from 'lucide-react'
import z from 'zod/v3'

import { Calendar } from '@/components/ui/calendar'
import type { Contribution, HabitWithContributions } from '@/types'

export const Route = createFileRoute('/habits/$id')({
  params: {
    parse: z.object({ id: z.coerce.number() }).parse
  },
  beforeLoad: async ({ params }) => {
    const habit = await queryClient.ensureQueryData(getHabitByIdQueryOptions(params))
    return { habit }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const rtContext = Route.useRouteContext()

  const { data: habit } = useQuery({ ...getHabitByIdQueryOptions(params), initialData: rtContext.habit })

  const contributions = new Map(habit.contributions.map(contrib => [getDayOfYear(contrib.date), contrib]));
  return <div className="px-3 max-w-6xl mx-auto">
    <div>
      <div className="flex gap-8 items-center py-8">
        <BackButton to="/habits" />
        <h2 className="text-2xl font-semibold">{habit.name}</h2>
        <EditHabitDialog habit={habit}>
          <Button className="ml-auto">
            <EditIcon /> <span>Edit Habit</span>
          </Button>
        </EditHabitDialog>
      </div>
      <p>{!habit.description ? "No Description" : habit.description}</p>
    </div>

    <div className="py-4 mb-4 overflow-x-auto">
      <ContributionsGrid habit={habit} contributions={contributions} />
    </div>
    <HabitCalendar habit={habit} />
  </div>
}

export function HabitCalendar(props: { habit: HabitWithContributions }) {
  const { habit } = props

  const createContributionMutation = useMutation({
    mutationFn: createContribution,
    onSuccess: () => {
      invalidateListHabits()
      invalidateHabitById(props.habit.id)
    }
  })

  const updateCompletionsMutation = useMutation({
    mutationFn: updateContributionCompletions,
    onSuccess: () => {
      invalidateListHabits()
      invalidateHabitById(props.habit.id)
    }
  })

  const handleContribution = async (params: { contribution: Contribution } | { contribution: undefined, date: Date }) => {
    console.log("handle contribution")
    if (habit.completionType === "custom") {
      console.log("custom dialog")
      // setOpen(true)
      return
    }
    if (!params.contribution) {
      console.log("create contribution")
      createContributionMutation.mutate({
        habitId: habit.id,
        date: params.date,
        completions: 1,
      })
      return
    }

    if (params.contribution.completions === habit.completionsPerDay) {
      console.log("reset")
      updateCompletionsMutation.mutate({ contributionId: params.contribution.id, completions: 0 })
    } else {
      console.log("add 1")
      updateCompletionsMutation.mutate({ contributionId: params.contribution.id, completions: params.contribution.completions + 1 })
    }
  }
  const contributions = new Map(props.habit.contributions.map(contrib => [getDayOfYear(contrib.date), contrib]));
  return (
    <Calendar
      className="rounded-lg border shadow-sm w-full [--cell-size:theme(spacing.16)]"
      classNames={{
        weeks: "gap-2"
      }}
      components={{
        DayButton: ({ day }) => {
          const dayOfYear = getDayOfYear(day.date)
          const contribution = contributions.get(dayOfYear)
          return <button className="hover:border-border rounded border border-transparent h-full w-full flex flex-col cursor-pointer" onClick={
            () => {
              if (dayOfYear > getDayOfYear(new Date())) return

              if (!contribution) {
                handleContribution({ contribution, date: day.date })
              } else {
                handleContribution({ contribution })
              }
            }
          }>
            <div className="py-4">{day.date.getDate()}</div>
            <div className="flex-1">
              <div className="text-center">
                {contribution?.completions === habit.completionsPerDay && <CheckIcon className="text-green-500 mx-auto" />}
              </div>

            </div>


          </button>
        }
      }}
      onDayClick={(date) => {
        const dayOfYear = getDayOfYear(date)
        const contribution = contributions.get(dayOfYear)
        console.log(contribution)

      }}
    />
  )
}

