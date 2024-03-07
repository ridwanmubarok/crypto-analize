"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type optionsProps = {
    value: string
    label: string
}

interface SearchSelectProps {
    options: optionsProps[],
    onChange: (value:string) => void
}

export function SearchSelect({ options,onChange }: SearchSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const onChangeSelect = (value: string) => {
    setValue(value)
    setOpen(false)
    onChange(value)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="bg-white" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] text-black justify-between"
        >
          {value
            ? value
            : "Select Pairs..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Pairs..." />
          <CommandEmpty>No Options found.</CommandEmpty>
          <CommandGroup>
            {
                options?.map((item: optionsProps, key: number) => (
                    <CommandItem
                      key={key}
                      value={item.value as string}
                      onSelect={onChangeSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
