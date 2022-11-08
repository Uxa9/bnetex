import { Bitcoin, Coins, History, Settings, Wrench } from 'assets/images/icons';

export type ActiveSectionType = 'tools' | 'settings' | 'wallet/main' | 'wallet/investor' | 'transactions';

export interface DashboardSection {
    link: ActiveSectionType;
    title: string;
    icon: ReactSvg;
}

export const dashboardSections: DashboardSection[] = [
    {
        link: 'tools',
        title: 'Панель инструментов',
        icon: Wrench,
    },
    {
        link: 'settings',
        title: 'Настройки',
        icon: Settings,
    },
    {
        link: 'wallet/main',
        title: 'Основной кошелек',
        icon: Coins,
    },
    {
        link: 'wallet/investor',
        title: 'Инвестиционный кошелек',
        icon: Bitcoin,
    },
    {
        link: 'transactions',
        title: 'История транзакций',
        icon: History,
    },
];
