import { create } from 'zustand';
import { IntentionCategory } from '../../domain/entities/User';

export type ProximityRange = 5 | 15 | 50;

interface RadarState {
  range: ProximityRange;
  isFuzzyLocation: boolean;
  selectedFilter: IntentionCategory | 'Todos';
  isMapView: boolean;
  setRange: (range: ProximityRange) => void;
  setFuzzyLocation: (isFuzzy: boolean) => void;
  setSelectedFilter: (filter: IntentionCategory | 'Todos') => void;
  setMapView: (isMap: boolean) => void;
}

export const useRadarStore = create<RadarState>((set) => ({
  range: 5, // Default Ultra-cercano
  isFuzzyLocation: false,
  selectedFilter: 'Todos',
  isMapView: false,
  setRange: (range) => set({ range }),
  setFuzzyLocation: (isFuzzyLocation) => set({ isFuzzyLocation }),
  setSelectedFilter: (selectedFilter) => set({ selectedFilter }),
  setMapView: (isMapView) => set({ isMapView }),
}));
