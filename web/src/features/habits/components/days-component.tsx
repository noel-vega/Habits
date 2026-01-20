import { cn, getCompletedHabits, getWeekDays } from "@/lib/utils"
import { format, getDayOfYear } from "date-fns"
import { CheckIcon } from "lucide-react"
import type { HabitWithContributions } from "../types"


export function Days(props: { habits: HabitWithContributions[] }) {

  const weekDays = getWeekDays()
  return (

    <ul className="flex gap-1">
      {weekDays.map(day => {
        const { isDone } = getCompletedHabits({ day, habits: props.habits })

        return (
          <li key={day.getDay()} className="flex-1">
            <div className={cn("p-4 rounded-lg hover:bg-secondary flex flex-col items-center gap-3", {
              "bg-secondary": getDayOfYear(day) === getDayOfYear(new Date())
            })}>
              <p>{format(day, 'EEEEE')}</p>
              <div className={cn("size-10 rounded-full bg-white border-2 flex items-center justify-center", {
                "bg-green-600 text-white border-green-600": isDone
              })}>
                {isDone && (
                  <CheckIcon />
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
