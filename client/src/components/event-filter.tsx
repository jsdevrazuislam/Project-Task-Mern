import { useState } from "react"
import { Search, Calendar as CalendarIcon, X } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar } from "../components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from "date-fns"
import type { DateRange } from "react-day-picker"

type QuickFilterOption =
    | "today"
    | "current-week"
    | "last-week"
    | "current-month"
    | "last-month"
    | ""

export type DateFilterRange = {
  from?: Date
  to?: Date
}


interface EventSearchFiltersProps {
    onSearch: (query: string) => void
    onFilter: (dateRange: DateFilterRange) => void
}

export function EventSearchFilters({ onSearch, onFilter }: EventSearchFiltersProps) {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [dateRange, setDateRange] = useState<DateRange>({
        from: undefined,
        to: undefined,
    })
    const [quickFilter, setQuickFilter] = useState<QuickFilterOption>("")

    const handleQuickFilter = (value: QuickFilterOption) => {
        setQuickFilter(value)
        let from: Date | undefined
        let to: Date | undefined

        switch (value) {
            case "today":
                from = new Date()
                to = new Date()
                break
            case "current-week":
                from = startOfWeek(new Date())
                to = endOfWeek(new Date())
                break
            case "last-week":
                from = startOfWeek(subWeeks(new Date(), 1))
                to = endOfWeek(subWeeks(new Date(), 1))
                break
            case "current-month":
                from = startOfMonth(new Date())
                to = endOfMonth(new Date())
                break
            case "last-month":
                from = startOfMonth(subMonths(new Date(), 1))
                to = endOfMonth(subMonths(new Date(), 1))
                break
            default:
                from = undefined
                to = undefined
        }

        const newDateRange = { from, to }
        setDateRange(newDateRange)
        onFilter(newDateRange)
    }

    const handleSearch = () => {
        onSearch(searchQuery)
    }

    const clearFilters = () => {
        setSearchQuery("")
        setDateRange({ from: undefined, to: undefined })
        setQuickFilter("")
        onSearch("")
        onFilter({ from: undefined, to: undefined })
    }

    const hasActiveFilters = Boolean(searchQuery || dateRange.from || dateRange.to)

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
                <Search className="absolute z-10 left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search events..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
            </div>

            <Select
                value={quickFilter}
                onValueChange={(value: QuickFilterOption) => handleQuickFilter(value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Quick filters" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="current-week">Current Week</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                </SelectContent>
            </Select>

            {/* Date Range Picker */}
            <div className="flex gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "MMM dd")} -{" "}
                                        {format(dateRange.to, "MMM dd")}
                                    </>
                                ) : (
                                    format(dateRange.from, "MMM dd")
                                )
                            ) : (
                                <span>From date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={(range?: DateRange) => {
                                if (!range) return
                                setDateRange(range)
                                setQuickFilter("")
                                onFilter(range)
                            }}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.to ? (
                                format(dateRange.to, "MMM dd")
                            ) : (
                                <span>To date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(to?: Date) => {
                                if (!to) return
                                const newRange = { from: dateRange.from, to }
                                setDateRange(newRange)
                                setQuickFilter("")
                                onFilter(newRange)
                            }}
                            disabled={{ before: dateRange.from as Date }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Clear Filters Button */}
            <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="flex items-center gap-2"
            >
                <X className="h-4 w-4" />
                Clear filters
            </Button>
        </div>
    )
}