const growthHacksChanged = `
  subscription growthHacksChanged($_id: String!) {
    growthHacksChanged(_id: $_id) {
      _id
    }
  }
`;

const growthHacksMoved = `
  subscription growthHacksMoved {
    growthHacksMoved 
  }
`;

export default {
  growthHacksChanged,
  growthHacksMoved
};
