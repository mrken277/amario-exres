export type IFeature = {
  name: string;
  text: string;
  videoUrl: string;
  description: string;
  settings: string[];
  settingsDetails: { [key: string]: { name: string; url: string } };
  isComplete: boolean;
  showSettings: boolean;
};
