export type ActiveSectionType = 'tools' | 'settings' | 'wallet/main' | 'wallet/investor' | 'transactions';

export interface DashboardSection{
    link: ActiveSectionType,
    title: string
}

export const dashboardSections: DashboardSection[] = [
    {
        link: 'tools',
        title: 'Панель инструментов',
    },
    {
        link: 'settings',
        title: 'Настройки',
    },
    {
        link: 'wallet/main',
        title: 'Основной кошелек',
    },
    {
        link: 'wallet/investor',
        title: 'Инвестиционный кошелек',
    },
    {
        link: 'transactions',
        title: 'История транзакций',
    },
];
