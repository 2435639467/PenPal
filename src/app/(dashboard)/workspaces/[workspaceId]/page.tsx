import { NextPage } from 'next';
import { redirect } from 'next/navigation';

import { getCurrent } from '@/common/libs/actions/auth.actions';

import WorkspaceIdClient from './client';

const Page: NextPage = async () => {
  const user = await getCurrent();
  if (!user) redirect('/sign-in');

  return <WorkspaceIdClient />;
};

export default Page;
