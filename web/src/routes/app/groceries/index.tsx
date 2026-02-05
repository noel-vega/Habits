import { Page } from '@/components/layout/page'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { AddItemForm, type AddItemFormData } from '@/features/groceries/components/AddItemForm'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { CheckIcon, ListPlusIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useState, type PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/app/groceries/')({
  component: RouteComponent,
})

type Item = {
  id: number
  name: string
  quantity: number
  inCart: boolean
}

const initialItems = [
  { id: 1, name: "Soup", inCart: false, quantity: 3 },
  { id: 2, name: "Tomatoes", inCart: true, quantity: 4 }
]

function RouteComponent() {
  const { t } = useTranslation()
  const [items, setItems] = useState<Item[]>([])

  const handleAddItem = (item: AddItemFormData) => {
    setItems(prev => [...prev, { id: Math.random(), inCart: false, ...item }])
  }

  const toggleItemInCart = (item: Item) => {
    setItems(prev => prev.map(x => {
      if (x.id !== item.id) return x
      return { ...x, inCart: !item.inCart }
    }))
  }

  const handleCheckout = () => {
    setItems(prev => prev.filter(x => !x.inCart))
  }

  const handleDelete = (item: Item) => {
    setItems(prev => prev.filter(x => x.id !== item.id))
  }

  return (
    <Page title="Groceries">
      <div className="max-w-5xl h-full flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">{t("Shopping List")} ({items.length})</h2>
        <div className="flex gap-2 items-end mb-4">
          <AddItemForm className='flex-1' onSubmit={handleAddItem} />
          {/* <Button variant="secondary" className="ml-auto"> */}
          {/*   <ListPlusIcon /> */}
          {/*   {t("Catalog")} */}
          {/* </Button> */}
        </div>
        {items.length === 0 && (
          <p className="text-center py-4 text-muted-foreground">
            {t("Your grocery list is empty. Add some items.")}
          </p>
        )}
        <ul className="flex-1 space-y-2">
          {items.map(x => (
            <li key={x.id}>
              <Card onClick={() => toggleItemInCart(x)}>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className={cn("h-7 w-7 border rounded-full flex items-center justify-center", {
                      "bg-green-100 border-green-900": x.inCart
                    })}>
                      <CheckIcon size={14} className={cn("hidden text-green-900", {
                        "block": x.inCart
                      })} />
                    </div>
                    <p className="font-medium text-lg">{x.name} <span className="text-sm text-muted-foreground">{x.quantity} pcs</span></p>
                    <Button variant="outline" className='ml-auto text-muted-foreground' onClick={e => {
                      e.stopPropagation()
                      handleDelete(x)
                    }}>
                      <Trash2Icon />

                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="lg" disabled={items.filter(x => x.inCart).length === 0}>{t("Checkout")}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("Are you want to checkout?")}</AlertDialogTitle>
              <AlertDialogDescription>{t("This will clear all checked items. Checkouts can be viewd in your groceries history.")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleCheckout}>{t("Proceed")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </Page>
  )
}

function AddGroceriesDrawer(props: { onSubmit: (v: AddItemFormData) => void } & PropsWithChildren) {

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {props.children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Groceries</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <AddItemForm onSubmit={props.onSubmit} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
