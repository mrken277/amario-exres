import colors from 'modules/common/styles/colors';

export const getAppearance = (name: string) => {
  switch (name) {
    case 'inbox':
      return {
        title: 'Team Inbox'
      };

    case 'deals':
      return {
        color: '#379ecb',
        icon: 'piggy-bank'
      };

    case 'tasks':
      return {
        color: colors.colorSecondary,
        icon: 'clipboard'
      };

    case 'growthHacks':
      return {
        title: 'Growth Hacks',
        icon: 'idea',
        color: '#f7802e'
      };

    case 'engages':
      return {
        color: '#e359ae',
        icon: 'megaphone'
      };

    case 'leads':
      return {
        color: '#45b94c',
        icon: 'laptop'
      };

    case 'knowledgebase':
      return {
        title: 'Knowledge Base',
        icon: 'book',
        color: '#df603f'
      };

    case 'tags':
      return {
        color: colors.colorLightBlue,
        icon: 'tag'
      };

    case 'insights':
      return {
        color: '#7b48ff',
        icon: 'bar-chart'
      };

    case 'importHistories':
      return {
        title: 'Import Histories',
        color: colors.colorCoreRed,
        icon: 'download-3'
      };

    case 'segments':
      return {
        color: colors.colorCoreTeal,
        icon: 'pie-chart'
      };

    case 'properties':
      return {
        color: colors.colorCoreGray,
        icon: 'folder-1'
      };

    case 'integrations':
      return {
        color: colors.colorCoreYellow,
        icon: 'puzzle'
      };

    default:
      return {
        color: colors.colorCoreBlue,
        icon: 'users'
      };
  }
};
