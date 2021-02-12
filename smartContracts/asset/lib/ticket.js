'use strict';

class Ticket {
  constructor(id, active, status, title, description, creatorName, creatorEmail, creatorPhoneNumber, assigneeName, assigneeEmail, assigneePhoneNumber, priority) {
    this.id = id;
    this.active = active;
    this.status = status;
    this.title = title;
    this.description = description;
    this.creatorName = creatorName;
    this.creatorEmail = creatorEmail;
    this.creatorPhoneNumber = creatorPhoneNumber;
    this.assigneeName = assigneeName;
    this.assigneeEmail = assigneeEmail;
    this.assigneePhoneNumber = assigneePhoneNumber;
    this.priority = priority;
    this.requests = [];
  }

  getRequest(id) {
    let foundIndex = this.requests.findIndex((r) => r.id === id);
    return this.requests[foundIndex];
  }

  addRequest(request) {
    this.requests.push(request);
  }

  updateRequest(id, request) {
    let foundIndex = this.requests.findIndex((r) => r.id === id);
    this.requests[foundIndex] = request;
  }

  deleteRequest(id) {
    this.requests = this.requests.filter((r) => {
      return r.id !== id;
    });
  }
}

module.exports = Ticket;
