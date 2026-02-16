import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { Support } from '@app/Support/Support';
import { Tables } from '@app/Tables/Tables';
import { MigrationDetails } from '@app/MigrationDetails/MigrationDetails';
import { MigrationStatus } from '@app/MigrationStatus/MigrationStatus';
import { CreateProvider } from '@app/CreateProvider/CreateProvider';
import { CreateProviderWizard } from '@app/CreateProviderWizard/CreateProviderWizard';
import { ClustersTable } from '@app/ClustersTable/ClustersTable';
import { StorageMappings } from '@app/StorageMappings/StorageMappings';
import { VDDKSetup } from '@app/VDDKSetup/VDDKSetup';
import { Prerequisites } from '@app/Prerequisites/Prerequisites';
import { GeneralSettings } from '@app/Settings/General/GeneralSettings';
import { ProfileSettings } from '@app/Settings/Profile/ProfileSettings';
import { NotFound } from '@app/NotFound/NotFound';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  element: React.ReactElement;
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    element: <Dashboard />,
    exact: true,
    label: 'Home',
    path: '/',
    title: 'PatternFly Seed | Home',
  },
  {
    element: <Dashboard />,
    exact: true,
    label: 'Favorites',
    path: '/favorites',
    title: 'PatternFly Seed | Favorites',
  },
  {
    element: <Dashboard />,
    exact: true,
    label: 'Operators',
    path: '/operators',
    title: 'PatternFly Seed | Operators',
  },
  {
    element: <Dashboard />,
    exact: true,
    label: 'Helm',
    path: '/helm',
    title: 'PatternFly Seed | Helm',
  },
  {
    element: <Dashboard />,
    exact: true,
    label: 'Workloads',
    path: '/workloads',
    title: 'PatternFly Seed | Workloads',
  },
  {
    element: <Dashboard />,
    exact: true,
    label: 'Virtualization',
    path: '/virtualization',
    title: 'PatternFly Seed | Virtualization',
  },
  {
    label: 'Migration for Virtualization',
    routes: [
              {
          element: <Dashboard />,
          exact: true,
          label: 'Overview',
          path: '/migration/overview',
          title: 'PatternFly Seed | Migration Overview',
        },
        {
          element: <Prerequisites />,
          exact: true,
          label: 'Prerequisites',
          path: '/migration/prerequisites',
          title: 'PatternFly Seed | Migration Prerequisites',
        },
        {
          element: <CreateProvider />,
          exact: true,
          label: 'Providers',
          path: '/migration/providers',
          title: 'PatternFly Seed | Migration Providers',
        },
        {
          element: <CreateProviderWizard />,
          exact: true,
          label: 'Create Provider Wizard',
          path: '/migration/providers/wizard',
          title: 'PatternFly Seed | Create Provider Wizard',
        },
        {
          element: <VDDKSetup />,
          exact: true,
          label: 'VDDK Setup',
          path: '/migration/vddk-setup',
          title: 'PatternFly Seed | VDDK Setup',
        },
      {
        element: <MigrationDetails />,
        exact: true,
        label: 'Migration plans',
        path: '/migration/plans',
        title: 'PatternFly Seed | Migration Plans',
      },
      {
        element: <Tables />,
        exact: true,
        label: 'Network maps',
        path: '/migration/network-maps',
        title: 'PatternFly Seed | Network Maps',
      },
      {
        element: <MigrationStatus />,
        exact: true,
        label: 'Storage maps',
        path: '/migration/storage-maps',
        title: 'PatternFly Seed | Storage Maps',
      },
      {
        element: <StorageMappings />,
        exact: true,
        label: 'Storage mappings',
        path: '/migration/storage-mappings',
        title: 'PatternFly Seed | Storage Mappings',
      },
    ],
  },
  {
    element: <Dashboard />,
    exact: true,
    label: 'Networking',
    path: '/networking',
    title: 'PatternFly Seed | Networking',
  },
  {
    element: <Dashboard />,
    exact: true,
    label: 'Storage',
    path: '/storage',
    title: 'PatternFly Seed | Storage',
  },
  {
    element: <Dashboard />,
    exact: true,
    label: 'Builds',
    path: '/builds',
    title: 'PatternFly Seed | Builds',
  },
  {
    element: <Dashboard />,
    exact: true,
    label: 'Observe',
    path: '/observe',
    title: 'PatternFly Seed | Observe',
  },
  {
    element: <Dashboard />,
    exact: true,
    label: 'Compute',
    path: '/compute',
    title: 'PatternFly Seed | Compute',
  },
  {
    element: <Support />,
    exact: true,
    label: 'User Management',
    path: '/user-management',
    title: 'PatternFly Seed | User Management',
  },
  {
    element: <ClustersTable />,
    exact: true,
    label: 'Clusters',
    path: '/clusters',
    title: 'PatternFly Seed | Clusters',
  },
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };
