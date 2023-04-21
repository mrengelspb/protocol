const express = require('express');
const { MySQL } = require('./Mysql');

const database = new MySQL('local');
const TicketController = express.Router();

TicketController.post('/search/:id', async (req, res) => {
    const { id } = req.params;
    const response =  await database.getTicket(id);
    if (response.length === 0) {
      res.status(404).send();
    } else {
      let total;
      const start = new Date(response[0].in);
      response[0].in = start.toLocaleString();
      const end = new Date();
      response[0].out = end.toLocaleString();
      let time = Math.round(((end - start)/1000)/60);
      res.status(200).send({ ...response[0], time, total });
    }
});


TicketController.put('/update', async (req, res) => {
  Date.prototype.addMins = function(m) {
    this.setTime(this.getTime() + (m*60*1000));
    return this;
  }
  const split = req.body.out.split(", ");
  const date = split[0].split("/");
  req.body.out = `${date[2]}-${date[1]}-${date[0]} ${split[1]}`;
  console.log(req.body);
  const args = [
    req.body.id,
    req.body.out,
    req.body.state,
    req.body.min_used,
    req.body.total,
    req.body.out,
  ];
  const response =  await database.updateTicket(args);
  res.send(response);
});


TicketController.get('/spaces', async (req, res) => {
  const response =  await database.spacesTicket();
  res.send(response);
});

TicketController.post('/command', async (req, res) => {
  const { nTerminal, command, status, id_parking } = req.body;
  const response =  await database.insertCommand(nTerminal, command, status, id_parking);
  res.send(response);
});

TicketController.get('/controllers', async (req, res) => {
  const response =  await database.loadController();
  res.send(response);
});

TicketController.get('/database', async (req, res) => {
  const response =  await database.status();
  res.send(response);
});

TicketController.get('/controller', async (req, res) => {
  const status = {
    c1: process.env.CONTROLLER_1 == 'true' ? true : false,
    c2: process.env.CONTROLLER_2 == 'true' ? true : false,
    p: process.env.PRINTER === 'true' ? true : false,
    pc: process.env.PRINTER_CODE,
  }
  res.send(status);
});

TicketController.get('/list', async (req, res) => {
  const response =  await database.spaces();
  res.send(response);
});

TicketController.post('/free', async (req, res) => {
  const { place, ticket } = req.body;
  const response =  await database.spacesFree(place, ticket);
  res.send(response);
});


module.exports = TicketController;
