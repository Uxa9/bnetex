import React, { PropsWithChildren, ReactElement, ReactNode } from "react"

/**
 * @param children ReactNode элементы, к которым будут применены новые пропсы
 * @param elementProps новые пропсы, которые будут прокинуты в копии переданных элементов наравне с исходными
 * @returns массив из копий ReactNode элементов (children), с переданными им пропсами elementProps
 */

export function renderChildrenWithProps<Type>(children: ReactNode, elementProps: any): ReactNode {
    return React.Children.map(children, (child, index) => {
        const element = child as ReactElement<PropsWithChildren<Type>>

        return React.cloneElement(element, { ...elementProps, key: index })
    })
}
