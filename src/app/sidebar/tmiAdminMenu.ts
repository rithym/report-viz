export interface NavItem {
  displayName: string;
  iconName: string;
  routelink: string;
  children?: NavItem[];
  childrenroute: boolean;
}
export class TmiAdminMenuItem {
  navItems: NavItem[] = [
    {
      displayName: 'Onboarding',
      iconName: 'onboarding.svg',
      routelink: '/home/onboarding',
      childrenroute: true,
      children: [
        {
          displayName: 'Client Information',
          iconName: 'onboarding.svg',
          routelink: '/home/onboarding/client-list',
          childrenroute: false,
        },
        {
          displayName: 'Company Information',
          iconName: 'onboarding.svg',
          routelink: '/home/onboarding/company-list',
          childrenroute: false,
        },
        {
          displayName: 'Pending Approvals',
          iconName: 'onboarding.svg',
          routelink: '/home/onboarding/pending-approvals',
          childrenroute: false,
        },
      ],
    },
  ];
  constructor() {}
}
