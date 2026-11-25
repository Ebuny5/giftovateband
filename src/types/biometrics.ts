export interface HotspotData {
  id: number;
  title: string;
  subtitle: string;
  position: [number, number, number]; // 3D world coordinates
  normal?: [number, number, number];  // Direction normal for culling
  category: 'sensor' | 'mechanical' | 'electronics' | 'display';
  specs: {
    label: string;
    value: string;
  }[];
  material: string;
  tolerance: string;
  costPrototype: number;
  costVolume: number;
  description: string;
  clinicalSignificance: string;
}

export interface BomItem {
  id: number;
  name: string;
  partNumber: string;
  category: string;
  material: string;
  costPrototype: number;
  costVolume: number;
  supplier: string;
  leadTime: string;
  keyFeature: string;
}

export type SimulationPhase = 'resting' | 'pre_surge' | 'active_sweating';

export type IontoDeviceType = 'HydroGlove' | 'HydroVisage' | 'HydroSock';

export interface IontoSessionState {
  isActive: boolean;
  device: IontoDeviceType;
  targetCurrentMa: number; // 8 - 20 mA
  currentDeliveredMa: number;
  sessionLengthMinutes: number; // 10, 15, 20, 25 min
  elapsedSeconds: number;
  padWetnessPct: number; // 0 - 100%
  polarity: 'positive' | 'negative';
}

export interface BiometricReading {
  timestamp: number;
  heartRate: number;         // BPM
  edaConductance: number;    // microSiemens (uS)
  skinTemperature: number;   // Celsius
  hrvRmssd: number;          // ms
  phasicPeak: boolean;
  surgeLevel: 'normal' | 'elevated' | 'critical';
}

export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'alert' | 'ble';
  message: string;
  metrics?: {
    hr?: number;
    eda?: number;
    temp?: number;
  };
}
