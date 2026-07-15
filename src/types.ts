export interface TrainCar {
  id: string;
  digit: number;
  colorClass: string; // e.g. 'bg-brand-pink', 'bg-brand-blue'
}

export type MagicMode = 'multiply-11-simple' | 'multiply-11-carry' | 'multiply-9-magic';

export type SceneId = 'intro' | 'split-magic' | 'addition-slide' | 'shortcut-derivation' | 'challenge-playground';

export interface SceneDefinition {
  id: SceneId;
  title: string;
  subtitle: string;
  description: string;
}

export interface PresetChallenge {
  number: number;
  label: string;
  isCustom?: boolean;
}
