interface TzktAlias {
  address: string;
  alias?: string;
}

export interface TzktContract extends TzktAlias {
  kind: string;
  typeHash: number;
}

export interface TzktOriginatedOperation {
  allocationFee: number;
  bakerFee: number;
  block: string;
  contractBalance: number;
  counter: number;
  gasLimit: number;
  gasUsed: number;
  hash: string;
  id: number;
  level: number;
  originatedContract: TzktContract;
  sender: TzktAlias;
  status: string;
  storageFee: number;
  storageLimit: number;
  storageUsed: number;
  timestamp: string; //Date
  type: string;
}

export interface Tab {
  name: string;
  value: string;
}

export interface BcdOriginatedContract {
  address: string;
  alias?: string;
  annotations: Array<string>;
  entrypoints: Array<string>;
  fail_strings: Array<string>;
  hash: string;
  id: number;
  last_action: string;
  level: number;
  manager: string;
  network: string;
  same_count: number;
  tags: Array<string>;
  timestamp: string;
  tx_count: 7;
}
