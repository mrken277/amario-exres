type Action = {
  name: string;
  url: string;
};

export type IFeature = {
  name: string;
  text: string;
  videoUrl: string;
  description: string;
  actions: Action[];
};
