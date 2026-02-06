import { Page } from '@/components/layout/page'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AddItemForm, type AddItemFormData } from '@/features/groceries/components/AddItemForm'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { BookTextIcon, CheckIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
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

  const handleClear = () => {
    setItems([])
  }

  const handleDelete = (item: Item) => {
    setItems(prev => prev.filter(x => x.id !== item.id))
  }

  return (
    <Page title="Groceries">
      <div className="max-w-5xl h-full flex flex-col pb-2">
        <div className="flex gap-2 items-end mb-4">
          <AddItemForm className='flex-1' onSubmit={handleAddItem} />
          <Button variant="secondary">
            <BookTextIcon />
            {t("Catalog")}
          </Button>
        </div>


        <div className="text-lg font-medium flex items-center mb-4">
          <div className="h-px w-[18px] bg-border" />
          <p className="px-2">
            {t("Shopping List")} ({items.length})
          </p>
          <div className="h-px w-full flex-1 bg-border" />
        </div>

        <div className="flex-1">
          {items.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              {t("Add some groceries to your list.")}
            </p>
          ) : (
            <ul className="flex-1 divide-y border rounded-lg">
              {items.map(x => (
                <li key={x.id} className="hover:bg-secondary/50">
                  <div
                    onClick={() => toggleItemInCart(x)}
                    className='hover:cursor-pointer p-0 px-0'>
                    <div className="px-3">
                      <div className="flex items-center gap-4 py-2">
                        <div className={cn("h-6 w-6 border rounded-full flex items-center justify-center", {
                          "bg-green-100 border-green-900": x.inCart
                        })}>
                          <CheckIcon size={14} className={cn("hidden text-green-900", {
                            "block": x.inCart
                          })} />
                        </div>
                        <p>{x.name} <span className="text-sm text-muted-foreground">{x.quantity} pcs</span></p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className='ml-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive' onClick={e => {
                              e.stopPropagation()
                            }}>
                              <Trash2Icon />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t("Are you want to delete this item?")}</AlertDialogTitle>
                              <AlertDialogDescription>{t("This will delete this item from your list.")}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(x)}>{t("Proceed")}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>


        <div className="flex gap-2">

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" className="flex-1" size="lg" disabled={items.length === 0}>{t("Clear")}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("Are you want to clear items?")}</AlertDialogTitle>
                <AlertDialogDescription>{t("This will clear all items from your list.")}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleClear}>{t("Proceed")}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" className="flex-1" size="lg" disabled={items.filter(x => x.inCart).length === 0}>{t("Checkout")}</Button>
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
      </div>
    </Page>
  )
}
