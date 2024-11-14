import { CodeConfig } from '@/lib/types'

export const CODE_CONFIG: Record<'preview' | 'cell', CodeConfig> = {
    preview: {
        QR: {
            size: 400,
            level: 'Q',
            marginSize: 20
        },
        Barcode: {
            width: 3,
            height: 200,
            fontSize: 20,
            margin: 20
        }
    },
    cell: {
        QR: {
            size: 24,
            level: 'Q',
            marginSize: 0
        },
        Barcode: {
            width: 1,
            height: 24,
            fontSize: 0,
            margin: 0
        }
    }
} as const