export interface LandRecord {
  landUid: string;
  ownerAddress: string;
  ownerName: string;
  surveyNumber: string;
  division: string;
  district: string;
  area: { value: number; unit: 'metrekare' | 'dönüm' | 'hektar' };
  gpsCoordinates: { lat: number; lng: number };
  documentHash: string;
  registrationDate: number;
  isVerified: boolean;
  history?: OwnershipHistory[];
}

export interface OwnershipHistory {
  from: string;
  to: string;
  date: number;
  hash: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  landUid: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

export type Language = 'en' | 'tr';

export interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  chainId?: number;
}

export type ViewState = 'home' | 'register' | 'search' | 'admin' | 'govt_records';
