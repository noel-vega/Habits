import { createFileRoute, notFound } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout';
import { FlagsSchema } from '@/features/_internal/api';

export const Route = createFileRoute('/app')({
  beforeLoad: ({ context: { flags }, location }) => {
    const result = FlagsSchema.keyof().safeParse(location.pathname.split("/")[2])

    if (!import.meta.env.DEV && result.success && !flags[result.data]) {
      throw notFound({ routeId: "__root__" })
    }
  },
  component: AppLayout,
})

