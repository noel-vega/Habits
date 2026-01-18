import { createFileRoute } from '@tanstack/react-router'
import { HabitCardList } from '@/features/habits/components/habit-card'
import { CreateHabitDialog } from '@/features/habits/components/create-habit-form'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getListHabitsQueryOptions } from '@/features/habits/api'
import { useDialog } from '@/hooks'

export const Route = createFileRoute('/habits/')({
  loader: async ({ context: { queryClient } }) => {
    const habits = await queryClient.ensureQueryData(getListHabitsQueryOptions())
    return { habits }
  },
  component: Page,
})

function Page() {
  const loaderData = Route.useLoaderData()
  const habits = useQuery({ ...getListHabitsQueryOptions(), initialData: loaderData.habits })
  return (
    <div className="p-8 max-w-6xl w-full">
      <Header />
      <HabitCardList habits={habits.data} />
    </div >
  )
}

function Header() {
  const createHabitDialog = useDialog()
  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Habits</h1>
        <Button onClick={createHabitDialog.handleOpenDialog}>
          <PlusIcon /><span>Add Habit</span>
        </Button>
      </header>
      <CreateHabitDialog {...createHabitDialog} />
    </>
  )
}
