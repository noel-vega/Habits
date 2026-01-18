import { Button } from '@/components/ui/button'
import { getBoard, getBoardQueryOptions, getListTodosQueryOptions, invalidateGetBoardQuery, invalidateListTodosQuery, moveTodo } from '@/features/todos/api'
import { CreateTodoDialog } from '@/features/todos/components/create-todo-dialog'
import { TodoCard } from '@/features/todos/components/todo-card'
import { TodoSchema, TodoStatusSchema, type Todo, type TodoStatus } from '@/features/todos/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  useDroppable,
} from '@dnd-kit/core';

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDialog } from '@/hooks'
import { TodoInfoDialog } from '@/features/todos/components/todo-info-dialog'
import z from 'zod/v3'

export const Route = createFileRoute('/todos/')({
  loader: async ({ context: { queryClient } }) => {
    const todos = await queryClient.ensureQueryData(getListTodosQueryOptions())
    const board = await queryClient.ensureQueryData(getBoardQueryOptions())
    return { todos, board }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()
  const { data: board } = useQuery({ ...getBoardQueryOptions(), initialData: loaderData.board })
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null)
  const [openTodo, setOpenTodo] = useState<Todo | null>(null)
  const todoDialog = useDialog()

  const moveMutation = useMutation({
    mutationFn: moveTodo,
    onSuccess: () => {
      invalidateGetBoardQuery()
    }
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before activating
      }
    }),
  );

  const SortableSchema = z.object({
    containerId: TodoStatusSchema,
    index: z.number(),
    items: z.number().array()
  })

  const SortableTodoSchema = z.object({
    type: z.literal("todo"),
    sortable: SortableSchema,
    todo: TodoSchema,
  })

  const DroppableLane = z.object({
    type: z.literal("lane"),
    status: TodoStatusSchema
  })

  const OverSchema = z.discriminatedUnion("type", [SortableTodoSchema, DroppableLane])

  function handleDragEnd(event: DragEndEvent) {
    setActiveTodo(null)
    if (!event.over) {
      console.log("no over")
      return
    };

    const active = SortableTodoSchema.parse(event.active.data.current)
    const over = OverSchema.parse(event.over.data.current)

    if (over.type === "todo") {
      const activeIndex = active.sortable.index
      const overIndex = over.sortable.index
      const todos = board[over.todo.status]!

      if (overIndex === 0) {
        moveMutation.mutate({
          id: active.todo.id,
          status: over.todo.status,
          afterPosition: "",
          beforePosition: over.todo.position
        })
      } else {
        if (activeIndex < overIndex) {
          moveMutation.mutate({
            id: active.todo.id,
            status: over.todo.status,
            afterPosition: over.todo.position,
            beforePosition: todos[overIndex + 1]?.position ?? "",
          })
        } else {
          moveMutation.mutate({
            id: active.todo.id,
            status: over.todo.status,
            afterPosition: todos[overIndex - 1]?.position ?? "",
            beforePosition: over.todo.position,
          })
        }
      }
    } else {
      const todos = board[over.status]
      moveMutation.mutate({
        id: active.todo.id,
        status: over.status,
        afterPosition: !todos ? "" : todos[todos.length - 1].position,
        beforePosition: "",
      })

    }
  }

  function findTodoById(status: TodoStatus, id: number) {
    return board[status]?.find(x => x.id === id) ?? null
  }

  function handleDragStart({ active }: DragStartEvent) {
    const todo = active.data.current?.todo as Todo
    if (!todo) return
    setActiveTodo(todo)
  }

  function handleTodoClick(todo: Todo) {
    setOpenTodo(todo)
    todoDialog.onOpenChange(true)
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className="p-8 h-full w-full">
          <div className="flex gap-4">
            <Lane onTodoClick={handleTodoClick} title="Todo" status={"todo"} todos={board["todo"] ?? []} showDropZone={activeTodo && activeTodo.status !== "todo" ? true : false} />
            <Lane onTodoClick={handleTodoClick} title="In Progress" status={"in-progress"} todos={board["in-progress"] ?? []} showDropZone={activeTodo && activeTodo.status !== "in-progress" ? true : false} />
            <Lane onTodoClick={handleTodoClick} title="Done" status={"done"} todos={board["done"] ?? []} showDropZone={activeTodo && activeTodo.status !== "done" ? true : false} />
          </div>
        </div>
        <DragOverlay>
          {activeTodo && (
            <TodoCard index={0} todo={activeTodo} className="shadow-lg hover:cursor-grabbing" isDragging={true} />
          )}
        </DragOverlay>
      </DndContext>

      <TodoInfoDialog todo={openTodo} onClose={() => setOpenTodo(null)} />
    </>
  )
}

type LaneProps = { title: string, status: TodoStatus, todos: Todo[], showDropZone?: boolean, onTodoClick: (todo: Todo) => void }

function Lane(props: LaneProps) {
  const createTodoDialog = useDialog()
  const { setNodeRef, isOver } = useDroppable({ id: props.status, data: { type: "lane", status: props.status } });
  const handleCreateBtnClick = () => createTodoDialog.onOpenChange(true)

  return (
    <SortableContext
      id={props.status}
      items={props.todos.map(t => t.id)}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className={cn("w-72 border bg-gray-50 rounded")}>
        <div className="p-4 uppercase text-xs flex gap-2 justify-between">
          {props.title}
          <p className="bg-neutral-200 py-1 px-2 rounded shrink-0 border">{props.todos.length}</p>
        </div>
        {props.showDropZone && (
          <div className={cn("h-40 border border-blue-500 flex items-center justify-center bg-blue-500/10", {
            "bg-blue-500/20": isOver
          })}>
            <p className="border border-blue-500 p-2 rounded text-xs font-bold">{props.title}</p>
          </div>
        )}

        {!props.showDropZone && (
          <>
            <div className="px-1.5 pb-1.5 space-y-1">
              <ul className="space-y-1">
                {props.todos.map((todo, index) => (
                  <li key={todo.id}>
                    <TodoCard index={index} todo={todo} onClick={() => props.onTodoClick(todo)} />
                  </li>
                ))}
              </ul>
              <div>
                <Button variant="ghost" className="w-full justify-start hover:bg-neutral-200" onClick={handleCreateBtnClick}>
                  <PlusIcon />
                  <span>Create</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <CreateTodoDialog status={props.status} {...createTodoDialog} />
    </SortableContext>
  )
}


