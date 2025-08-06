// Prisma.SortOrder should be accessed by server only. So we need to define a enum in favor of client.
export enum PrismaSortDirection {
  ASC = 'asc',
  DESC = 'desc',
}