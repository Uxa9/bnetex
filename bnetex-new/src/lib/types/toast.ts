import { UUID } from './uuid';

export type ToastType = 'error' | 'success' | 'info';

export interface ToastInterface {
    id: UUID;
    type: ToastType;
    text: string;
}
