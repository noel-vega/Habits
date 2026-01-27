import { queryOptions, useMutation } from "@tanstack/react-query"
import { HabitWithContributionsSchema, type CreateHabit, type Habit } from "./types"
import { queryClient } from "@/lib/react-query"
import { useAuth } from "../auth/store"

export async function getHabitById(params: { id: number }) {
  const { token } = useAuth.getState()
  const res = await fetch(`/api/habits/${params.id}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  const data = await res.json()
  return HabitWithContributionsSchema.parse(data)
}

export function getHabitByIdQueryOptions(params: { id: number }) {
  return queryOptions({
    queryKey: ["habit", params.id],
    queryFn: () => getHabitById(params)
  })
}

export async function invalidateHabitById(id: number) {
  return queryClient.invalidateQueries(getHabitByIdQueryOptions({ id }))
}

export async function listHabits() {
  const { token } = useAuth.getState()
  const res = await fetch("/api/habits", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  const data = await res.json()
  return HabitWithContributionsSchema.array().parse(data)
}

export function getListHabitsQueryOptions() {
  return queryOptions({
    queryKey: ["habits"],
    queryFn: listHabits,
  })
}

export async function invalidateListHabits() {
  return queryClient.invalidateQueries(getListHabitsQueryOptions())
}

export async function createHabit(params: CreateHabit) {
  const { token } = useAuth.getState()
  const res = await fetch("/api/habits", {
    method: "POST",
    body: JSON.stringify(params),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  const data = await res.json()
  return HabitWithContributionsSchema.parse(data)
}


export async function updateHabit(params: Habit) {
  const { token } = useAuth.getState()
  const { id, ...rest } = params
  await fetch(`/api/habits/${id}`, {
    method: "PATCH",
    body: JSON.stringify(rest),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
}

export async function deleteHabit(params: { id: number }) {
  const { token } = useAuth.getState()
  await fetch(`/api/habits/${params.id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  // TODO: return id from api
  return params
}

function removeHabitFromQueryCache(params: { id: number }) {
  queryClient.setQueryData(getListHabitsQueryOptions().queryKey, (oldData) => {
    return !oldData ? oldData : oldData.filter(x => x.id !== params.id)
  })
}

export function useDeleteHabit() {
  return useMutation({
    mutationFn: deleteHabit,
    onMutate: (vars) => {
      removeHabitFromQueryCache(vars)
    },
    onSuccess: async (data) => {
      removeHabitFromQueryCache(data)
      await invalidateListHabits()
    }

  })
}

export async function createContribution(params: { habitId: number, date: Date, completions: number }) {
  const { token } = useAuth.getState()
  await fetch(`/api/habits/${params.habitId}/contributions`, {
    method: "POST",
    body: JSON.stringify({ date: params.date.toISOString(), completions: params.completions }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
}

export async function deleteContribution(params: { id: number }) {
  const { token } = useAuth.getState()
  await fetch(`/api/contributions/${params.id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export async function updateContributionCompletions(params: { contributionId: number, completions: number }) {
  const { contributionId, completions } = params
  const { token } = useAuth.getState()
  await fetch(`/api/habits/contributions/${contributionId}/completions`, {
    method: "PATCH",
    body: JSON.stringify({ completions }),
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
}
