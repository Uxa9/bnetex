import { throwError } from 'lib/utils/errorThrower';
import getCssVariable from 'lib/utils/getCssVariable';
import { createContext, JSXElementConstructor, ReactNode, useContext, useMemo, useState } from 'react';

const modalSpawnerContext = createContext<ModalSpawnerContext | null>(null);

export interface ModalSpawnerContext {
    activeModal: JSX.Element | null;
    isModalVisible: boolean;

    useModal<E>(modal: JSXElementConstructor<BaseModalProps & E>, props?: E): ModalControl<E>;
}

export const useModalSpawner = () => useContext(modalSpawnerContext) ?? throwError('useModalSpawner can be used only inside ModalSpawnerProvider');

export function useModal<E>(modal: JSXElementConstructor<BaseModalProps & E>) {
    return useContext(modalSpawnerContext)?.useModal(modal)
        ?? throwError('useModal can be used only inside ModalSpawnerProvider');
}

export interface BaseModalProps {
    onClose(): void;
}

type ModalControl<E> = {
    open(props: E): void;
    close(): void;
}

const DEFAULT_TRANSITION = getCssVariable('DEFAULT_TRANSITION');

export function ModalSpawnerProvider({ children }: {children: ReactNode}) {
    const [ activeModal, setActiveModal ] = useState<JSX.Element | null>(null);
    const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);

    function useModal<E>(modal: JSXElementConstructor<BaseModalProps & E>): ModalControl<E> {
        const Element = modal;
        const open = (props: E) => {
            setActiveModal(<Element onClose={close} {...props} />);
            setIsModalVisible(true);
        };

        const close = () => {
            setIsModalVisible(false);
            setTimeout(() => {
                setActiveModal(null);
            }, DEFAULT_TRANSITION);
        };

        return {
            open,
            close,
        };
    }

    const memorized = useMemo(() => ({
        useModal,
        activeModal,
        isModalVisible,
    }), [ activeModal, isModalVisible ]);

    return (
        <modalSpawnerContext.Provider
            value={memorized}
        >
            {children}
        </modalSpawnerContext.Provider>
    );
}
