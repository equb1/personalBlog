// components/ui/select.tsx
'use client'
import * as React from 'react'
import * as SelectPrimitives from '@radix-ui/react-select'
import { ChevronDown } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

const selectVariants = cva(
  'flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-10',
        sm: 'h-9 px-2',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const Select = SelectPrimitives.Root
const SelectValue = SelectPrimitives.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Trigger> &
    VariantProps<typeof selectVariants>
>(({ className, size, children, ...props }, ref) => (
  <SelectPrimitives.Trigger
    ref={ref}
    className={selectVariants({ size, className })}
    {...props}
  >
    {children}
    <SelectPrimitives.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitives.Icon>
  </SelectPrimitives.Trigger>
))

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitives.Portal>
    <SelectPrimitives.Content
      ref={ref}
      className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
      {...props}
    >
      <SelectPrimitives.Viewport className="p-1">
        {children}
      </SelectPrimitives.Viewport>
    </SelectPrimitives.Content>
  </SelectPrimitives.Portal>
))

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitives.Item
    ref={ref}
    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    {...props}
  >
    <SelectPrimitives.ItemText>{children}</SelectPrimitives.ItemText>
  </SelectPrimitives.Item>
))

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}