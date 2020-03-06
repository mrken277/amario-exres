const ticketsChanged = `
  subscription ticketsChanged($_id: String!) {
    ticketsChanged(_id: $_id) {
      _id
    }
  }
`;

const ticketsMoved = `
  subscription ticketsMoved {
    ticketsMoved
  }
`;

export default {
  ticketsChanged,
  ticketsMoved
};
