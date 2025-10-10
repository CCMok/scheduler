import { CreateOrganizationFormInput } from "@/libs/client/organization/models/create-organization-form-input"

export const DEFAULT_POSTS = [
  { tempId: crypto.randomUUID(), name: 'Host' },
  { tempId: crypto.randomUUID(), name: 'Music Leader' },
  { tempId: crypto.randomUUID(), name: 'Keyboard' },
  { tempId: crypto.randomUUID(), name: 'Guitar' },
  { tempId: crypto.randomUUID(), name: 'Drum' },
  { tempId: crypto.randomUUID(), name: 'Bass' },
  { tempId: crypto.randomUUID(), name: 'Vocal 1' },
  { tempId: crypto.randomUUID(), name: 'Vocal 2' },
  { tempId: crypto.randomUUID(), name: 'Audio' },
]

export const DEFAULT_WORKERS = [
  { tempId: crypto.randomUUID(), name: 'Mikasa' },
  { tempId: crypto.randomUUID(), name: 'Reiner' },
  { tempId: crypto.randomUUID(), name: 'Bertolt' },
  { tempId: crypto.randomUUID(), name: 'Annie' },
  { tempId: crypto.randomUUID(), name: 'Eren' },
  { tempId: crypto.randomUUID(), name: 'John' },
  { tempId: crypto.randomUUID(), name: 'Marco' },
  { tempId: crypto.randomUUID(), name: 'Connie' },
  { tempId: crypto.randomUUID(), name: 'Sasha' },
  { tempId: crypto.randomUUID(), name: 'Historia' },
  { tempId: crypto.randomUUID(), name: 'Levi' },
  { tempId: crypto.randomUUID(), name: 'Erwin' },
  { tempId: crypto.randomUUID(), name: 'Armin' },
  { tempId: crypto.randomUUID(), name: 'Hanji' },
]

export const CREATE_ORGANIATION_DEFAULT: CreateOrganizationFormInput = {
  name: 'Eldia Ltd.',
  departmentName: 'Survey Department',
  posts: DEFAULT_POSTS,
  workers: DEFAULT_WORKERS,
  postWorkers: DEFAULT_POSTS.map(post => ({
    postTempId: post.tempId,
    postName: post.name,
    workerTempIds: [],
  })),
}