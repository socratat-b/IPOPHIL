// src/lib/stores/navigation.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    hasSubItems,
    type NavMainItem,
    type NavSecondaryItem
} from '@/lib/types/navigation'
import {
    navigationConfig,
    transformToMainNavItem,
    transformToSecondaryNavItem
} from '@/lib/config/navigation'

interface NavigationState {
    visibleMainItems: string[]
    visibleSecondaryItems: string[]
    visibleSubItems: Record<string, string[]>
    showUserSection: boolean
    toggleMainItem: (id: string) => void
    toggleSecondaryItem: (id: string) => void
    toggleSubItem: (parentId: string, itemId: string) => void
    toggleUserSection: () => void
    resetToDefault: () => void
}

// Create initial state from config
const getDefaultMainItems = () => navigationConfig.mainNav.map(item => item.id)
const getDefaultSecondaryItems = () => navigationConfig.secondaryNav.map(item => item.id)
const getDefaultSubItems = () => {
    const subItems: Record<string, string[]> = {}
    navigationConfig.mainNav.forEach(item => {
        if (hasSubItems(item)) {
            subItems[item.id] = item.items.map(subItem => subItem.id)
        }
    })
    return subItems
}

export const useNavigationStore = create<NavigationState>()(
    persist(
        (set) => ({
            visibleMainItems: getDefaultMainItems(),
            visibleSecondaryItems: getDefaultSecondaryItems(),
            visibleSubItems: getDefaultSubItems(),
            showUserSection: true,

            toggleMainItem: (id) =>
                set((state) => ({
                    visibleMainItems: state.visibleMainItems.includes(id)
                        ? state.visibleMainItems.filter((item) => item !== id)
                        : [...state.visibleMainItems, id],
                })),

            toggleSecondaryItem: (id) =>
                set((state) => ({
                    visibleSecondaryItems: state.visibleSecondaryItems.includes(id)
                        ? state.visibleSecondaryItems.filter((item) => item !== id)
                        : [...state.visibleSecondaryItems, id],
                })),

            toggleSubItem: (parentId, itemId) =>
                set((state) => ({
                    visibleSubItems: {
                        ...state.visibleSubItems,
                        [parentId]: state.visibleSubItems[parentId]?.includes(itemId)
                            ? state.visibleSubItems[parentId].filter((item) => item !== itemId)
                            : [...(state.visibleSubItems[parentId] || []), itemId],
                    },
                })),

            toggleUserSection: () =>
                set((state) => ({
                    showUserSection: !state.showUserSection,
                })),

            resetToDefault: () =>
                set({
                    visibleMainItems: getDefaultMainItems(),
                    visibleSecondaryItems: getDefaultSecondaryItems(),
                    visibleSubItems: getDefaultSubItems(),
                    showUserSection: true,
                }),
        }),
        {
            name: 'navigation-storage',
        }
    )
)

interface FilteredNavigation {
    mainNav: NavMainItem[]
    secondaryNav: NavSecondaryItem[]
    showUserSection: boolean
}

export const getFilteredNavigation = (): FilteredNavigation => {
    const state = useNavigationStore.getState()

    const mainNav = navigationConfig.mainNav
        .filter(item => state.visibleMainItems.includes(item.id))
        .map(item => {
            // Transform the main item first to ensure icon is properly set
            const transformed = transformToMainNavItem(item)

            // Then handle sub-items if they exist
            if (hasSubItems(item)) {
                transformed.items = item.items
                    .filter(subItem => state.visibleSubItems[item.id]?.includes(subItem.id))
                    .map(subItem => ({
                        title: subItem.title,
                        url: subItem.url,
                        notViewedCount: subItem.notViewedCount,
                    }))
            }

            return transformed
        })

    const secondaryNav = navigationConfig.secondaryNav
        .filter(item => state.visibleSecondaryItems.includes(item.id))
        .map(item => {
            // Transform secondary items ensuring icon is properly set
            const transformed = transformToSecondaryNavItem(item)
            return transformed
        })

    return {
        mainNav,
        secondaryNav,
        showUserSection: state.showUserSection
    }
}