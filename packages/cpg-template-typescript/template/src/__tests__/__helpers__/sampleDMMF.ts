import { DMMF } from '@prisma/generator-helper'

export const sampleDMMF: DMMF.DatamodelEnum[] = [
  {
    name: 'NotificationType',
    values: [
      {
        name: 'newPosts',
        dbName: null,
      },
      {
        name: 'newComments',
        dbName: null,
      },
      {
        name: 'newFollowers',
        dbName: null,
      },
      {
        name: 'reply',
        dbName: null,
      },
      {
        name: 'heartOnPost',
        dbName: null,
      },
      {
        name: 'heartOnComment',
        dbName: null,
      },
      {
        name: 'heartOnReply',
        dbName: null,
      },
    ],
    dbName: null,
  },
  {
    name: 'Language',
    values: [
      {
        name: 'Typescript',
        dbName: null,
      },
      {
        name: 'Javascript',
        dbName: null,
      },
      {
        name: 'Rust',
        dbName: null,
      },
      {
        name: 'Go',
        dbName: null,
      },
      {
        name: 'Python',
        dbName: null,
      },
      {
        name: 'Cpp',
        dbName: null,
      },
    ],
    dbName: null,
  },
]
