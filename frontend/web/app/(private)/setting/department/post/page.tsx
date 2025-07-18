import { getOrganizationsBySessionIncludeDepartments } from '@/libs/server/organization/repositories/organization-repository';
import PageSettingSection from './_components/page-setting-section';

export default async function PostSettingPage() {
  const organizations = await getOrganizationsBySessionIncludeDepartments();

  return <PageSettingSection organizations={organizations} />;
}