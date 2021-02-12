'use strict';

const {Contract} = require('fabric-contract-api');

//TODO Users?
//  Create a serverless API to manage users (create/read/update/delete)
//TODO Access Control/Permissions?
//  Create roles. Where?

class TicketContract extends Contract {
  //#region Ticket

  async ticketExists(ctx, id) {
    const buffer = await ctx.stub.getState(id);
    return !!buffer && buffer.length > 0;
  }

  async createTicket(ctx, id, contents) {
    const exists = await this.ticketExists(ctx, id);
    if (exists) {
      throw new Error(`Ticket ${id} already exists`);
    }
    const ticket = {
      id: id,
      contents: contents,
    };
    const buffer = Buffer.from(JSON.stringify(ticket));
    let error = await ctx.stub.putState(id, buffer);
    if (error) {
      throw new Error(error);
    }
    return ticket;
  }

  async getTicket(ctx, id) {
    const exists = await this.ticketExists(ctx, id);
    if (!exists) {
      throw new Error(`Ticket ${id} does not exist`);
    }
    const buffer = await ctx.stub.getState(id);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async updateTicket(ctx, id, contents) {
    const exists = await this.ticketExists(ctx, id);
    if (!exists) {
      throw new Error(`Ticket ${id} does not exist`);
    }
    const ticket = {contents: contents};
    const buffer = Buffer.from(JSON.stringify(ticket));
    let error = await ctx.stub.putState(id, buffer);
    if (error) {
      throw new Error(error);
    }
    return {
      id: id,
      contents: contents,
    };
  }

  async deleteTicket(ctx, id) {
    const exists = await this.ticketExists(ctx, id);
    if (!exists) {
      throw new Error(`Ticket ${id} does not exist`);
    }
    let error = await ctx.stub.deleteState(id);
    if (error) {
      throw new Error(error);
    }
    return {};
  }

  //#endregion

  //#region Requests

  async requestExists(ctx, ticketId, requestId) {
    const ticketExists = await this.ticketExists(ctx, ticketId);
    if (!ticketExists) {
      throw new Error(`Ticket ${ticketId} does not exist`);
    }
    let ticket = await this.getTicket(ctx, ticketId);
    let request = ticket.requests.find((r) => r.id === requestId);
    if (!request) {
      throw new Error(`Request ${requestId} from ticket ${ticketId} does not exist`);
    }
    return true;
  }

  async addRequest(ctx, ticketId, requestId, requestContents) {
    const ticketExists = await this.ticketExists(ctx, ticketId);
    if (!ticketExists) {
      throw new Error(`Ticket ${ticketId} does not exist`);
    }
    let ticket = await this.getTicket(ctx, ticketId);
    ticket.requests.push({
      id: requestId,
      contents: requestContents,
    });
    const buffer = Buffer.from(JSON.stringify(ticket));
    let error = await ctx.stub.putState(ticketId, buffer);
    if (error) {
      throw new Error(error);
    }
    return ticket;
  }

  async getRequest(ctx, ticketId, requestId) {
    let ticket = await this.getTicket(ctx, ticketId);

    let request = ticket.requests.find((r) => r.id === requestId);
    if (!request) {
      throw new Error(`Request ${requestId} from ticket ${ticketId} does not exist`);
    }
    return request;
  }

  async updateRequest(ctx, ticketId, requestId, contents) {
    let ticket = await this.getTicket(ctx, ticketId);

    let requestIndex = ticket.requests.findIndex((r) => r.id === requestId);
    if (requestIndex === -1) {
      throw new Error(`Request ${requestId} from ticket ${ticketId} does not exist`);
    }

    const updatedRequest = {contents: contents};
    ticket.requests[requestIndex] = updatedRequest;
    await this.updateTicket(ctx, ticketId, ticket.contents);
    return ticket.requests[requestIndex];
  }

  async deleteRequest(ctx, ticketId, requestId) {
    let ticket = await this.getTicket(ctx, ticketId);

    let requestIndex = ticket.requests.findIndex((r) => r.id === requestId);
    if (requestIndex === -1) {
      throw new Error(`Request ${requestId} from ticket ${ticketId} does not exist`);
    }

    ticket.requests = ticket.requests.splice(requestIndex, 1);
    await this.updateTicket(ctx, ticketId, ticket);
    return {};
  }

  //#endregion
}

module.exports = TicketContract;
