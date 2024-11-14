import { useState } from 'react'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'
import { Icons } from '@/components/ui/icons'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { format, subDays, startOfYear, endOfYear } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DateFilterProps {
    date: DateRange | undefined
    onDateSelect: (date: DateRange | undefined) => void
    className?: string
}

type DateRangeItem = {
    id: string
    label: string
    getValue: (year: number) => DateRange
}

const dateRangeOptions: Record<string, DateRangeItem[]> = {
    quarterly: [
        {
            id: 'q1',
            label: 'Q1 (Jan-Mar)',
            getValue: (year) => ({
                from: new Date(year, 0, 1),
                to: new Date(year, 2, 31)
            })
        },
        {
            id: 'q2',
            label: 'Q2 (Apr-Jun)',
            getValue: (year) => ({
                from: new Date(year, 3, 1),
                to: new Date(year, 5, 30)
            })
        },
        {
            id: 'q3',
            label: 'Q3 (Jul-Sep)',
            getValue: (year) => ({
                from: new Date(year, 6, 1),
                to: new Date(year, 8, 30)
            })
        },
        {
            id: 'q4',
            label: 'Q4 (Oct-Dec)',
            getValue: (year) => ({
                from: new Date(year, 9, 1),
                to: new Date(year, 11, 31)
            })
        }
    ],
    semester: [
        {
            id: 's1',
            label: 'S1 (Jan-Jun)',
            getValue: (year) => ({
                from: new Date(year, 0, 1),
                to: new Date(year, 5, 30)
            })
        },
        {
            id: 's2',
            label: 'S2 (Jul-Dec)',
            getValue: (year) => ({
                from: new Date(year, 6, 1),
                to: new Date(year, 11, 31)
            })
        }
    ],
    trimester: [
        {
            id: 't1',
            label: 'T1 (Jan-Apr)',
            getValue: (year) => ({
                from: new Date(year, 0, 1),
                to: new Date(year, 3, 30)
            })
        },
        {
            id: 't2',
            label: 'T2 (May-Aug)',
            getValue: (year) => ({
                from: new Date(year, 4, 1),
                to: new Date(year, 7, 31)
            })
        },
        {
            id: 't3',
            label: 'T3 (Sep-Dec)',
            getValue: (year) => ({
                from: new Date(year, 8, 1),
                to: new Date(year, 11, 31)
            })
        }
    ],
    other: [
        {
            id: 'annual',
            label: 'Annual',
            getValue: (year) => ({
                from: startOfYear(new Date(year, 0, 1)),
                to: endOfYear(new Date(year, 0, 1))
            })
        },
        {
            id: 'last-7-days',
            label: 'Last 7 Days',
            getValue: () => ({
                from: subDays(new Date(), 7),
                to: new Date()
            })
        },
        {
            id: 'last-10-days',
            label: 'Last 10 Days',
            getValue: () => ({
                from: subDays(new Date(), 10),
                to: new Date()
            })
        }
    ]
}

const DateFilter = ({ date, onDateSelect, className }: DateFilterProps) => {
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
    const [selectedRanges, setSelectedRanges] = useState<string[]>([])
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

    const handleCheckboxChange = (checked: boolean, rangeItem: DateRangeItem) => {
        let newSelectedRanges: string[]

        if (checked) {
            // Add the range
            newSelectedRanges = [...selectedRanges, rangeItem.id]
        } else {
            // Remove the range
            newSelectedRanges = selectedRanges.filter(id => id !== rangeItem.id)
        }

        setSelectedRanges(newSelectedRanges)

        if (newSelectedRanges.length === 0) {
            onDateSelect(undefined)
            return
        }

        // Find the selected range item
        const allRanges = Object.values(dateRangeOptions).flat()
        const selectedRange = allRanges.find(r => r.id === rangeItem.id)

        if (selectedRange) {
            const newRange = selectedRange.getValue(selectedYear)
            onDateSelect(newRange)
        }
    }

    const handleYearChange = (year: string) => {
        const numYear = parseInt(year)
        setSelectedYear(numYear)

        if (selectedRanges.length > 0) {
            // Update the date range with the new year
            const allRanges = Object.values(dateRangeOptions).flat()
            const selectedRange = allRanges.find(r => r.id === selectedRanges[0])

            if (selectedRange) {
                const newRange = selectedRange.getValue(numYear)
                onDateSelect(newRange)
            }
        }
    }

    return (
        <div className={className}>
            <Tabs defaultValue='manual'>
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='manual'>Manual Selection</TabsTrigger>
                    <TabsTrigger value='assisted'>Assisted Selection</TabsTrigger>
                </TabsList>

                <TabsContent value='manual'>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id='date'
                                variant='outline'
                                className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !date && 'text-muted-foreground'
                                )}
                            >
                                <Icons.calendarIcon className='mr-2 h-4 w-4' />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, 'LLL dd, y')} -{' '}
                                            {format(date.to, 'LLL dd, y')}
                                        </>
                                    ) : (
                                        format(date.from, 'LLL dd, y')
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                                initialFocus
                                mode='range'
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={onDateSelect}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </TabsContent>

                <TabsContent value='assisted' className='space-y-4'>
                    <div className='grid gap-4'>
                        <div>
                            <Label className='text-sm font-medium'>Select Year</Label>
                            <Select
                                value={selectedYear.toString()}
                                onValueChange={handleYearChange}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {Object.entries(dateRangeOptions).map(([groupName, ranges]) => (
                            <div key={groupName} className='space-y-2'>
                                <Label className='text-sm font-medium capitalize'>{groupName}</Label>
                                <div className='grid grid-cols-2 gap-2'>
                                    {ranges.map((range) => (
                                        <div key={range.id} className='flex items-center space-x-2'>
                                            <Checkbox
                                                id={range.id}
                                                checked={selectedRanges.includes(range.id)}
                                                onCheckedChange={(checked) =>
                                                    handleCheckboxChange(checked as boolean, range)
                                                }
                                            />
                                            <Label
                                                htmlFor={range.id}
                                                className='text-sm font-normal'
                                            >
                                                {range.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default DateFilter