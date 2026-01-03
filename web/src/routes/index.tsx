import { createFileRoute } from '@tanstack/react-router'
import "../index.css"
import { CreateHabitDialog } from '@/components/HabitsForm'
import { HabitCardList } from '@/components/HabitCard'
import { Suspense } from 'react'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const today = new Date();
    return { today }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between py-8">
        <h1 className="text-2xl font-semibold">Habits</h1>
        <CreateHabitDialog />
      </header>
      <Suspense fallback={"Loading habits..."}>
        <HabitCardList />
      </Suspense>
    </div>
  </div>
}

