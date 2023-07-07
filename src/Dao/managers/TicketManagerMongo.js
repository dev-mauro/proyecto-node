import ticketModel from "../models/ticket.model.js";

class TicketManagerMongo {

  // Inserta un nuevo ticket
  async addTicket( ticket ) {
    const newTicket = await ticketModel.create(ticket);
    return newTicket;
  }

}

export { TicketManagerMongo }