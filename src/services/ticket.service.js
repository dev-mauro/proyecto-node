import { TicketManagerMongo } from "../Dao/managers/TicketManagerMongo.js";

import TicketDTO from "../Dao/dto/ticketDTO.js";

class TicketService {

  // Inserta un nuevo ticket
  addTicket = async( amount, purchaser ) => {
    const ticket = new TicketDTO( amount, purchaser );
    const newTicket = await TicketManagerMongo.addTicket(ticket);
    return newTicket;
  }

}

export default new TicketService();