import { CreateHabitSchema } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, type FormEvent } from "react"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "./ui/field"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog"
import { PlusIcon } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { createHabit, getListHabitsQueryOptions } from "@/api"
import { queryClient } from "@/lib/react-query"


type CreateHabitFormProps =
  {
    onSubmit: () => void
    onCancel: () => void
  }
export function CreateHabitForm(props: CreateHabitFormProps) {
  const form = useForm({
    resolver: zodResolver(CreateHabitSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  })

  const createHabitMutation = useMutation({
    mutationFn: createHabit,
  })

  const handleSubmit = (e: FormEvent) => {
    console.log("handle submit")
    form.handleSubmit(async data => {
      createHabitMutation.mutate(data, {
        onSuccess: (newHabit) => {
          console.log("success")
          const queryKey = getListHabitsQueryOptions().queryKey
          queryClient.setQueryData(queryKey, (oldData) => {
            return oldData ? [...oldData, newHabit] : oldData
          })
          props.onSubmit()
        }, onError: (e) => {
          console.log("something went wrong", e.message)
        }
      })
    })(e)
  }

  const handleCancel = () => {
    form.reset()
    props.onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Controller control={form.control} name="name"
        render={({ field, fieldState }) => {
          return <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        }}
      />

      <Controller control={form.control} name="description"
        render={({ field, fieldState }) => {
          return <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        }}
      />
      <div className="justify-end gap-3 flex">
        <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>

  )
}

export function CreateHabitDialog() {
  const [open, setOpen] = useState(false)
  const closeDialog = () => setOpen(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><PlusIcon />Add Habit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Habit</DialogTitle>
        <CreateHabitForm onSubmit={closeDialog} onCancel={closeDialog} />
      </DialogContent>
    </Dialog>
  )
}
