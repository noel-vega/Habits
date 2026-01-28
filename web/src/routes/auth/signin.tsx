import { Button } from '@/components/ui/button'
import { SignInForm } from '@/features/auth/components/sign-in-form'
import { useAuth } from '@/features/auth/store'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  return (

    <div className="max-w-lg w-full space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to continue staying organized</p>
      </div>
      <SignInForm />
      <div className="text-sm">
        <span>
          Don't have an account?
        </span>
        <Button className="text-blue-500" variant="link" asChild>
          <Link to="/auth/signup">
            Sign Up
          </Link>
        </Button>
      </div>
      <Button onClick={async () => {
        const response = await fetch("/api/auth/refresh", {
          credentials: "include"
        })
        if (response.ok) {
          const data = await response.json()
          useAuth.setState({ accessToken: data.accessToken })
          navigate({ to: "/app/habits" })
        } else {
          console.log("Refresh failed should redirect to login")
        }

      }}>Auth</Button>
    </div>
  )
}
