'use client'

import Image from 'next/image'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ImageIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { userRoleEnum } from '@/lib/dms/schema'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateUserData, createUserSchema } from '@/lib/validations/user/create'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'

interface AddUserDialogProps {
    onCloseAction: () => void
}

const ROLE_OPTIONS = Object.values(userRoleEnum.enum)

export const AddUserDialog: React.FC<AddUserDialogProps> = ({ onCloseAction }) => {
    const form = useForm<CreateUserData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            role: 'user'
        }
    })

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [avatarDimensions, setAvatarDimensions] = useState({ width: 64, height: 64 })

    const handleSubmit = async (data: CreateUserData) => {
        try {
            console.log('Form Data:', data)
            toast.success('User Created', {
                description: 'New user has been successfully added.',
            })
            onCloseAction()
        } catch (error) {
            toast.error('Failed to create user', {
                description: error instanceof Error ? error.message : String(error),
            })
        }
    }

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Set the file in form
            form.setValue('avatar', file)

            // Create preview URL and get image dimensions
            const url = URL.createObjectURL(file)
            const img = document.createElement('img')

            img.onload = () => {
                // Calculate dimensions while maintaining aspect ratio
                const maxSize = 64
                const ratio = Math.min(maxSize / img.width, maxSize / img.height)
                setAvatarDimensions({
                    width: Math.round(img.width * ratio),
                    height: Math.round(img.height * ratio)
                })
            }

            img.src = url
            setAvatarPreview(url)

            // Clean up old preview URL
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview)
            }
        }
    }

    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview)
            }
        }
    }, [avatarPreview])

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && onCloseAction()}>
            <DialogContent className='w-full max-w-3xl rounded-lg shadow-lg'>
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        {/* First Name */}
                        <div>
                            <label htmlFor='first_name' className='block mb-1'>First Name *</label>
                            <Input
                                id='first_name'
                                placeholder='Enter first name'
                                {...form.register('first_name')}
                                className='w-full'
                            />
                            {form.formState.errors.first_name && (
                                <p className='text-red-500 text-sm'>{form.formState.errors.first_name.message}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor='last_name' className='block mb-1'>Last Name *</label>
                            <Input
                                id='last_name'
                                placeholder='Enter last name'
                                {...form.register('last_name')}
                                className='w-full'
                            />
                            {form.formState.errors.last_name && (
                                <p className='text-red-500 text-sm'>{form.formState.errors.last_name.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Middle Name */}
                    <div>
                        <label htmlFor='middle_name' className='block mb-1'>Middle Name</label>
                        <Input
                            id='middle_name'
                            placeholder='Enter middle name (optional)'
                            {...form.register('middle_name')}
                            className='w-full'
                        />
                        {form.formState.errors.middle_name && (
                            <p className='text-red-500 text-sm'>{form.formState.errors.middle_name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor='email' className='block mb-1'>Email *</label>
                        <Input
                            id='email'
                            type='email'
                            placeholder='Enter email address'
                            {...form.register('email')}
                            className='w-full'
                        />
                        {form.formState.errors.email && (
                            <p className='text-red-500 text-sm'>{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    {/* Agency */}
                    <div>
                        <label htmlFor='agency_id' className='block mb-1'>Bureau/Office/Unit *</label>
                        <Controller
                            name="agency_id"
                            control={form.control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Replace with your agency data */}
                                        <SelectItem value="agency1">Agency 1</SelectItem>
                                        <SelectItem value="agency2">Agency 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {form.formState.errors.agency_id && (
                            <p className='text-red-500 text-sm'>{form.formState.errors.agency_id.message}</p>
                        )}
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        {/* Role - Now using userRoleEnum values */}
                        <div>
                            <label htmlFor='role' className='block mb-1'>Role *</label>
                            <Controller
                                name="role"
                                control={form.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select a role' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ROLE_OPTIONS.map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {form.formState.errors.role && (
                                <p className='text-red-500 text-sm'>{form.formState.errors.role.message}</p>
                            )}
                        </div>

                        {/* Job Title */}
                        <div>
                            <label htmlFor='title' className='block mb-1'>Job Title *</label>
                            <Input
                                id='title'
                                placeholder='Enter job title'
                                {...form.register('title')}
                                className='w-full'
                            />
                            {form.formState.errors.title && (
                                <p className='text-red-500 text-sm'>{form.formState.errors.title.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Job Type */}
                    <div>
                        <label htmlFor='type' className='block mb-1'>Job Type *</label>
                        <Input
                            id='type'
                            placeholder='Enter job type'
                            {...form.register('type')}
                            className='w-full'
                        />
                        {form.formState.errors.type && (
                            <p className='text-red-500 text-sm'>{form.formState.errors.type.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avatar">Profile Picture</Label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                                {avatarPreview ? (
                                    <Image
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        width={avatarDimensions.width}
                                        height={avatarDimensions.height}
                                        className="object-cover w-full h-full"
                                        priority={true}
                                        unoptimized={true}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                        <ImageIcon className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleAvatarChange}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Supported formats: JPEG, PNG, WebP. Max size: 5MB
                                </p>
                                {form.formState.errors.avatar && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {form.formState.errors.avatar.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardHeader className='pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                <p className='text-sm text-gray-500'>
                                    Note: The following will be automatically generated:
                                </p>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className='text-sm text-gray-500 list-disc list-inside'>
                                <li>User ID</li>
                                <li>Username (from email)</li>
                                <li>Created At</li>
                                <li>Updated At</li>
                                <li>Active Status</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <div className='flex justify-end space-x-2'>
                        <Button type='submit' variant='default'>Create User</Button>
                        <DialogClose asChild>
                            <Button variant='secondary' onClick={onCloseAction}>
                                Cancel
                            </Button>
                        </DialogClose>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}