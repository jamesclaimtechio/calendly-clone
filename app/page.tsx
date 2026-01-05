import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-tertiary)] p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Calendly Clone
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Component Test Page - Module 1 Complete
          </p>
        </div>

        {/* Card with Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>shadcn/ui Components</CardTitle>
            <CardDescription>
              Testing Button, Input, Card, and Label components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input with Label */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
              />
            </div>

            {/* Button Variants */}
            <div className="space-y-4">
              <Label>Button Variants</Label>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div className="space-y-4">
              <Label>Button Sizes</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Design System Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Design System Colors</CardTitle>
            <CardDescription>
              Verifying CSS variables from .cursorrules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-2 text-center">
                <div className="h-16 rounded-lg bg-primary" />
                <p className="text-sm text-muted-foreground">Primary</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="h-16 rounded-lg bg-secondary" />
                <p className="text-sm text-muted-foreground">Secondary</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="h-16 rounded-lg bg-muted" />
                <p className="text-sm text-muted-foreground">Muted</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="h-16 rounded-lg bg-destructive" />
                <p className="text-sm text-muted-foreground">Destructive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-[var(--color-text-muted)]">
          ✅ Module 1: Project Foundation Complete
        </p>
      </div>
    </main>
  )
}
