export type DataAccessAllResponse = {
  accessAll: true;
}

export type DataLimitAccessResponse = {
  accessAll: false;
  ids: number[];
}

export type DataAccessResponse = DataAccessAllResponse | DataLimitAccessResponse;