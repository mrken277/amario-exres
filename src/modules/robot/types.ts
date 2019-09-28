export type IFeature = {
  name: string;
  text: string;
  videoUrl: string;
  description: string;
  actions: string[];
  actionDetails: { [key: string]: { name: string; url: string } };
  isComplete: boolean;
  showActions: boolean;
};
