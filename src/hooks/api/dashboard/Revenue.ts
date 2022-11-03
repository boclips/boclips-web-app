export interface Revenue {
  contractName: string;
  contractId: string;
  today: string;
  currency: string;
  currentPeriod: CurrentPeriod;
  closedPeriods: Period[];
}

export interface Period {
  period: string;
  revenue: number;
  changeFromPreviousPercent: number;
}

export interface CurrentPeriod extends Period {
  startDate: string;
  endDate: string;
  currentRevenue: number;
  revenueEstimation: number;
}