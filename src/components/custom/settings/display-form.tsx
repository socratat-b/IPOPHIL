// src\components\custom\settings\display-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { navigationConfig } from '@/lib/config/navigation'
import { useNavigationStore } from '@/lib/stores/navigation'
import { NavConfig, hasSubItems } from '@/lib/types/navigation'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'

export function SidebarDisplayForm() {
    const {
        visibleMainItems,
        visibleSecondaryItems,
        visibleSubItems,
        showUserSection,
        toggleMainItem,
        toggleSecondaryItem,
        toggleSubItem,
        toggleUserSection,
        resetToDefault,
    } = useNavigationStore()

    const form = useForm({
        defaultValues: {
            mainItems: visibleMainItems,
            secondaryItems: visibleSecondaryItems,
            subItems: visibleSubItems,
            showUserSection: showUserSection,
        },
    })

    const renderSubItems = (item: NavConfig) => {
        if (!hasSubItems(item)) {
            return null
        }

        return (
            <div className='ml-6 space-y-4'>
                {item.items.map((subItem) => (
                    <FormField
                        key={subItem.id}
                        control={form.control}
                        name={`subItems.${item.id}`}
                        render={() => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                <FormControl>
                                    <Checkbox
                                        checked={(visibleSubItems[item.id] || []).includes(subItem.id)}
                                        onCheckedChange={() => toggleSubItem(item.id, subItem.id)}
                                        disabled={!visibleMainItems.includes(item.id)}
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel className={!visibleMainItems.includes(item.id) ? 'text-muted-foreground' : ''}>
                                        {subItem.title}
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                ))}
            </div>
        )
    }

    return (
        <Form {...form}>
            <form className='space-y-8'>
                {/* Main Menu Section */}
                <div className='space-y-4'>
                    <div className='mb-4'>
                        <h3 className='text-lg font-medium'>Main Menu</h3>
                        <p className='text-sm text-muted-foreground'>
                            Select the main menu items to display in the sidebar.
                        </p>
                    </div>
                    {navigationConfig.mainNav.map((item) => (
                        <div key={item.id} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='mainItems'
                                render={() => (
                                    <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                        <FormControl>
                                            <Checkbox
                                                checked={visibleMainItems.includes(item.id)}
                                                onCheckedChange={() => toggleMainItem(item.id)}
                                            />
                                        </FormControl>
                                        <div className='space-y-1 leading-none'>
                                            <FormLabel>{item.title}</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {renderSubItems(item)}
                        </div>
                    ))}
                </div>

                {/* Secondary Menu */}
                <div className='space-y-4'>
                    <div className='mb-4'>
                        <h3 className='text-lg font-medium'>Secondary Menu</h3>
                        <p className='text-sm text-muted-foreground'>
                            Select which secondary menu items to display.
                        </p>
                    </div>
                    {navigationConfig.secondaryNav.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name='secondaryItems'
                            render={() => (
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                    <FormControl>
                                        <Checkbox
                                            checked={visibleSecondaryItems.includes(item.id)}
                                            onCheckedChange={() => toggleSecondaryItem(item.id)}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>{item.title}</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                    ))}
                </div>

                {/* User Section Toggle */}
                <FormField
                    control={form.control}
                    name='showUserSection'
                    render={() => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                            <FormControl>
                                <Checkbox
                                    checked={showUserSection}
                                    onCheckedChange={() => toggleUserSection()}
                                />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                                <FormLabel>Show User Section</FormLabel>
                                <FormDescription>
                                    Toggle visibility of the user profile section in the sidebar footer
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <div className='flex space-x-4'>
                    <Button onClick={() => resetToDefault()} variant='outline' type='button'>
                        Reset to Default
                    </Button>
                </div>
            </form>
        </Form>
    )
}