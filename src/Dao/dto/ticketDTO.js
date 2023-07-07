import { v4 as uuid } from 'uuid';

export default class TicketDTO {
  constructor( amount, purchaser ) {
    this.code = uuid();
    this.purchase_datetime = new Date();
    this.amount = amount;
    this.purchaser = purchaser;
  }
}