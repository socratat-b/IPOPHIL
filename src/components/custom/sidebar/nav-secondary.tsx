// src/components/custom/sidebar/nav-secondary.tsx
"use client"

import { useEffect, useState } from "react"
import { LucideIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { type NavSecondaryItem } from "@/lib/types/navigation"

interface NavSecondaryProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: Array<NavSecondaryItem & { icon?: LucideIcon }>
}

interface FeedbackFormProps {
  onSubmit: () => void
}

// Contact Info Component
const ContactInfo = () => {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Need help? Our support team is here for you.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Contact Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-1">
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">support@example.com</p>
          </div>
          <div className="grid gap-1">
            <Label>Phone</Label>
            <p className="text-sm text-muted-foreground">1-800-SUPPORT</p>
          </div>
          <div className="grid gap-1">
            <Label>Hours</Label>
            <p className="text-sm text-muted-foreground">24/7</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Feedback Form Component
const FeedbackForm = ({ onSubmit }: FeedbackFormProps) => {
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Error", {
        description: "Please enter your feedback before submitting."
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))

      toast.success("Success", {
        description: "Thank you for your feedback!"
      })
      onSubmit()
    } catch (error) {
      console.error(error)
      toast.error("Error", {
        description: "Failed to submit feedback. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        We value your feedback! Let us know how we can improve.
      </p>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="feedback">Your feedback</Label>
          <Textarea
            id="feedback"
            placeholder="Type your feedback here..."
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </div>
  )
}

// Main NavSecondary Component
export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  const [mounted, setMounted] = useState(false)
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = () => setOpenDialog(null)

  const getDialogContent = (item: NavSecondaryItem) => {
    switch (item.title) {
      case "Customer Support":
        return <ContactInfo />
      case "Send Feedback":
        return <FeedbackForm onSubmit={handleClose} />
      default:
        return <p className="text-muted-foreground">Content for {item.title}</p>
    }
  }

  if (!mounted || !items?.length) {
    return null
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const ItemIcon = item.icon

            return (
              <SidebarMenuItem key={item.title}>
                <Dialog
                  open={openDialog === item.title}
                  onOpenChange={(open) => setOpenDialog(open ? item.title : null)}
                >
                  <DialogTrigger asChild>
                    <SidebarMenuButton
                      size="sm"
                      className="w-full"
                    >
                      {ItemIcon && <ItemIcon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                    </DialogHeader>
                    {getDialogContent(item)}
                  </DialogContent>
                </Dialog>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}