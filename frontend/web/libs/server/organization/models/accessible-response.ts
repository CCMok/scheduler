export type AccessAllResponse = {
  accessAll: true;
}

export type LimitAccessResponse = {
  accessAll: false;
  ids: number[];
}

export type AccessibleResponse = AccessAllResponse | LimitAccessResponse;