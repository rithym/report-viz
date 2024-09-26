export interface NavItem {
  displayName: string;
  iconName: string;
  routelink: string;
  children?: NavItem[];
  childrenroute: boolean;
}
export class SuperAdminMenuItem {
  navItems: NavItem[] = [
    {
      displayName: 'Onboarding',
      iconName: 'onboarding.svg',
      routelink: '/home/onboarding',
      childrenroute: true,
      children: [
        {
          displayName: 'Client / Company Onboarding',
          iconName: 'onboarding.svg',
          routelink: '/home/onboarding/client-company-onboarding',
          childrenroute: false,
        },
      ],
    },
  ];
  constructor() {}
}
