import { Page } from '@/components/layout/page'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/groceries/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page title="Groceries">
      <Field>
        <FieldLabel>Item</FieldLabel>
        <div className="flex gap-4">
          <Input />
          <Button>Add</Button>
        </div>

      </Field>
    </Page>
  )
}
