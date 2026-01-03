import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import type { Contribution, Habit } from "@/types";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createContribution, deleteContribution, getListHabitsQueryOptions, invalidateListHabits } from "@/api";
import { CheckIcon } from "lucide-react";
import { Button } from "./ui/button";
import { getDayOfYear } from "date-fns";

type Cell = {
  checked: boolean
  day: number
}

function generateCells() {
  const cells: Cell[] = []
  for (let day = 1; day <= 365; day++) {
    cells.push({ checked: false, day })
  }
  return cells
}


function HabitGrid(props: { contributions: Map<number, Contribution> }) {
  const cells = generateCells()
  return (
    <>
      <ul className="gap-1 grid grid-rows-7 grid-flow-col">
        {cells.map((cell) => (
          <li
            className={cn("size-4 cursor-pointer rounded border text-xs bg-blue-500/10", "hover:border-blue-500",
              {
                "bg-blue-500": props.contributions.has(cell.day)
              }
            )} key={cell.day}></li>
        ))}
      </ul>
    </>
  )
}

// the contributions map should not be the day of year
function HabitDailyContributionButton(props: { habitId: number, contributions: Map<number, Contribution> }) {
  const { contributions } = props
  const todaysContribution = contributions.get(getDayOfYear(new Date()))

  const createContributionMutation = useMutation({
    mutationFn: createContribution,
    onSuccess: invalidateListHabits
  })
  const deleteContributionMutation = useMutation({
    mutationFn: deleteContribution,
    onSuccess: invalidateListHabits
  })

  const handleToggleContribution = async () => {
    if (!todaysContribution) {
      createContributionMutation.mutate({
        habitId: props.habitId,
        date: new Date()
      })
    } else {
      deleteContributionMutation.mutate({ id: todaysContribution.id })
    }

  }
  return (<Button variant="outline" onClick={handleToggleContribution}
    className={cn({
      "bg-blue-500 text-white hover:bg-blue-500 hover:text-white": !!todaysContribution
    })}>
    <CheckIcon />
  </Button>)
}

function HabitCard(props: { habit: Habit }) {
  const { habit } = props
  const contributions = new Map(props.habit.contributions.map(contrib => [getDayOfYear(contrib.date), contrib]));
  return (
    <Card>
      <CardHeader className="flex">
        <div className="flex-1 space-y-2">
          <CardTitle>
            {habit.name}
          </CardTitle>
          <CardDescription>{habit.description}</CardDescription>
        </div>
        <HabitDailyContributionButton habitId={habit.id} contributions={contributions} />
      </CardHeader>
      <CardContent>
        <HabitGrid contributions={contributions} />
      </CardContent>
    </Card>
  )
}


export function HabitCardList() {
  const { data: habits } = useSuspenseQuery(getListHabitsQueryOptions())
  console.log("habits", habits)
  if (habits.length === 0) {
    return <div>No Habits</div>
  }
  return (
    <ul className="space-y-4">
      {habits.map(habit => <li key={habit.id}>
        <HabitCard habit={habit} />
      </li>)}
    </ul>
  )

}
