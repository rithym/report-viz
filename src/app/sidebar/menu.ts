export interface NavItem {
  displayName: string;
  iconName: string;
  routelink: string;
  children?: NavItem[];
  childrenroute: boolean;
}
export class MenuItem {
  navItems: NavItem[] = [
    {
      displayName: 'Dashboard',
      iconName: 'appraisal.svg',
      routelink: '/home',
      children: [],
      childrenroute: false,
    },
    {
      displayName: 'Recruitment',
      iconName: 'hiring.svg',
      routelink: '/home/recruitment',
      children: [
        {
          displayName: 'Manpower Planning & Request',
          iconName: 'hiring.svg',
          routelink: '/home/recruitment/manpower-planning',
          children: [],
          childrenroute: false,
        },
        {
          displayName: 'Job Request Management (HR)',
          iconName: 'hiring.svg',
          routelink: '/home/recruitment/manpower-planning',
          children: [
            {
              displayName: 'HR Manpower View',
              iconName: 'hiring.svg',
              routelink: '/home/recruitment/manpower-planning',
              children: [],
              childrenroute: false,
            },
            {
              displayName: 'Add New Candidate',
              iconName: 'hiring.svg',
              routelink: '/home/recruitment/manpower-planning',
              children: [],
              childrenroute: false,
            },
            {
              displayName: 'Refer/Publish Candidates',
              iconName: 'hiring.svg',
              routelink: '/home/recruitment/manpower-planning',
              children: [],
              childrenroute: false,
            },
            {
              displayName: 'Schedule Interview',
              iconName: 'hiring.svg',
              routelink: '/home/recruitment/manpower-planning',
              children: [],
              childrenroute: false,
            },
            {
              displayName: 'Interview Feedback',
              iconName: 'hiring.svg',
              routelink: '/home/recruitment/manpower-planning',
              children: [],
              childrenroute: false,
            },
            {
              displayName: 'Shortlist Candidate',
              iconName: 'hiring.svg',
              routelink: '/home/recruitment/manpower-planning',
              children: [],
              childrenroute: false,
            },
            {
              displayName: 'Offer Management',
              iconName: 'hiring.svg',
              routelink: '/home/recruitment/manpower-planning',
              children: [],
              childrenroute: false,
            },
          ],
          childrenroute: true,
        },
        {
          displayName: 'Job Request Management (Manager)',
          iconName: 'hiring.svg',
          routelink: '/home/recruitment/manpower-planning',
          children: [],
          childrenroute: false,
        },
      ],
      childrenroute: true,
    },
    {
      displayName: 'Onboarding',
      iconName: 'onboarding.svg',
      routelink: '/home/onboarding',
      childrenroute: true,
      children: [
        {
          displayName: 'Client / Company Onboarding',
          iconName: 'onboarding.svg',
          routelink: '/home/onboarding',
          childrenroute: false,
        },
        {
          displayName: 'Module creation',
          iconName: 'onboarding.svg',
          routelink: '/home/module-creation',
          childrenroute: false,
        },
        {
          displayName: 'Client Information',
          iconName: 'onboarding.svg',
          routelink: '/home/client-list',
          childrenroute: false,
        },
        {
          displayName: 'Company Information',
          iconName: 'onboarding.svg',
          routelink: '/home/company-list',
          childrenroute: false,
        },
      ],
    },
    {
      displayName: 'Appraisal',
      iconName: 'appraisal.svg',
      routelink: '/home/appraisal',
      children: [],
      childrenroute: false,
    },
    {
      displayName: 'Exit',
      iconName: 'exit.svg',
      routelink: '/home/exit',
      children: [],
      childrenroute: false,
    },
    {
      displayName: 'Training',
      iconName: 'training.svg',
      routelink: '/home/training',
      children: [],
      childrenroute: false,
    },
    {
      displayName: 'Assessment',
      iconName: 'assessment.svg',
      routelink: '/home/assessment',
      children: [],
      childrenroute: false,
    },
  ];
  constructor() {}
}
