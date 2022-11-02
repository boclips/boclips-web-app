export interface Revenue {
  contractName: string;
  contractId: string;
  today: string;
  currency: string;
  currentPeriod: Period;
  revenue: RevenueDetail[];
}

export interface Period {
  name: string;
  startDate: string;
  endDate: string;
}

export interface RevenueDetail {
  period: string;
  revenue: number;
  changeFromPreviousPercent: number;
}
