"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, Plus, Minus } from "lucide-react"

interface GuestSelectorProps {
  onChange?: (guests: { adults: number; children: number; rooms: number }) => void
  defaultValues?: { adults: number; children: number; rooms: number }
}

export function GuestSelector({ onChange, defaultValues }: GuestSelectorProps) {
  const [open, setOpen] = useState(false)
  const [adults, setAdults] = useState(defaultValues?.adults || 1)
  const [children, setChildren] = useState(defaultValues?.children || 0)
  const [rooms, setRooms] = useState(defaultValues?.rooms || 1)

  // Only update state when defaultValues actually change and are different from current values
  useEffect(() => {
    if (
      defaultValues &&
      (defaultValues.adults !== adults || defaultValues.children !== children || defaultValues.rooms !== rooms)
    ) {
      setAdults(defaultValues.adults)
      setChildren(defaultValues.children)
      setRooms(defaultValues.rooms)
    }
  }, [defaultValues])

  // Call onChange when values change, but use a separate effect to avoid dependency issues
  useEffect(() => {
    onChange?.({ adults, children, rooms })
  }, [adults, children, rooms])

  const increment = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev) => Math.min(prev + 1, 10))
  }

  const decrement = (setter: React.Dispatch<React.SetStateAction<number>>, minValue: number) => {
    setter((prev) => Math.max(prev - 1, minValue))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border border-gray-300 h-10"
        >
          <span className="truncate">
            {adults} Adult{adults !== 1 ? "s" : ""}, {children} Child{children !== 1 ? "ren" : ""}, {rooms} Room
            {rooms !== 1 ? "s" : ""}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Adult(s)</span>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => decrement(setAdults, 1)}
                disabled={adults <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{adults}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => increment(setAdults)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Child</span>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => decrement(setChildren, 0)}
                disabled={children <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{children}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => increment(setChildren)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Rooms(s)</span>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => decrement(setRooms, 1)}
                disabled={rooms <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{rooms}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => increment(setRooms)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
