import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { isArray } from "util";
import { Ticket } from "../entity/Ticket";

class TicketController {
  public static listAll = async (req: Request, res: Response): Promise<void> => {
      const ticketRepository = getRepository(Ticket);
      const tickets = await ticketRepository.find();
      res.send(tickets);
  }

  public static activateTicket = async (req: Request, res: Response): Promise<void> => {
      const ticketRepository = getRepository(Ticket);
      try {
          const ticket = await ticketRepository.findOne({ where: { guid: req.params.guid } });
          if (ticket.activated == true) {
              res.send({ status: "Das Ticket ist schon aktiviert!" });
              return;
          }
          ticket.activated = true;
          ticketRepository.save(ticket);
      } catch (err) {
          res.status(500).send({ message: err });
          return;
      }
      res.send({ status: true });
  }

  public static editTicket = async (req: Request, res: Response): Promise<void> => {
      const ticketRepository = getRepository(Ticket);
      const { name } = req.body;
      if (name == undefined) {
          res.status(400).send(i18n.__("errors.notAllFieldsProvided"));
          return;
      }
      try {
          const ticket = await ticketRepository.findOne({ where: { guid: req.params.guid } });
          ticket.name = name;
          ticketRepository.save(ticket);
      } catch (err) {
          res.status(500).send({ message: err });
          return;
      }
      res.send({ status: true });
  }

  public static newTickets = async (req: Request, res: Response): Promise<void> => {
      const ticketRepository = getRepository(Ticket);
      let { tickets } = req.body;
      if (!(tickets && isArray(tickets) && tickets.length > 0)) {
          res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
          return;
      }
      tickets = tickets.map((t) => ({
          activated: false,
          guid: t.guid,
          name: t.name,
      }));

      try {
          await ticketRepository.save(tickets);
      } catch (e) {
          res.status(500).send({ message: `${i18n.__("errors.error")} ${e.toString()}` });
          return;
      }

      res.status(200).send({ status: true });
  }

  public static deleteTicket = async (req: Request, res: Response): Promise<void> => {
      const guid = req.params.ticket;
      const ticketRepository = getRepository(Ticket);
      try {
          await ticketRepository.delete({ guid });
      } catch (error) {
          res.status(404).send({ message: i18n.__("errors.ticketNotFound") });
          return;
      }
      res.status(200).send({ status: true });
  }
}

export default TicketController;
