import { CreateOrganizationWithChildrenFormInput } from "@/libs/client/organization/models/create-organization-with-children-form-input"

export const CREATE_ORGANIATION_DEFAULT: CreateOrganizationWithChildrenFormInput = {
  name: 'Eldia Ltd.',
  departmentName: 'Survey Department',
  posts: [
    { name: 'Host' },
    { name: 'Music Leader' },
    { name: 'Keyboard' },
    { name: 'Guitar' },
    { name: 'Drum' },
    { name: 'Bass' },
    { name: 'Vocal 1' },
    { name: 'Vocal 2' },
    { name: 'Audio' },
  ],
  workers: [
    { name: 'Mikasa' },
    { name: 'Reiner' },
    { name: 'Bertolt' },
    { name: 'Annie' },
    { name: 'Eren' },
    { name: 'John' },
    { name: 'Marco' },
    { name: 'Connie' },
    { name: 'Sasha' },
    { name: 'Historia' },
    { name: 'Levi' },
    { name: 'Erwin' },
    { name: 'Armin' },
    { name: 'Hanji' },
  ],
  postWorkers: [],
}