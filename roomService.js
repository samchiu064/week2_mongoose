const http = require('http');
const dotenv = require('dotenv').config({ path: "./config.env" });
const mongoose = require('mongoose');
const Room = require('./models/room');
const errHandle = require('./errorHandle');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log('connect success');
}).catch((err) => console.log(err));

const requestListener = async (req, res) => {
  let body = "";
  req.on('data', (chunk) => body += chunk);
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  };

  if (req.url === "/rooms" && req.method === "GET") {
    const roomData = await Room.find();
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: true,
      data: roomData,
    }))
    res.end();
  } else if (req.url === "/rooms" && req.method === "POST") {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const roomData = await Room.create({
          name: data.name,
          price: data.price,
          rating: data.rating,
        });
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          status: true,
          data: roomData,
        }));
        res.end();
      } catch (err) {
        errHandle(res, err)
      }
    })
  } else if (req.url === "/rooms" && req.method === "DELETE") {
    const roomData = await Room.deleteMany({});
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: true,
      data: roomData,
    }))
    res.end();
  } else if (req.url.startsWith('/rooms/') && req.method === "DELETE") {
    try {
      const id = req.url.split('/').pop();
      const roomData = await Room.findByIdAndDelete(id)
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        status: true,
        data: roomData,
      }))
      res.end();
    } catch (err) {
      errHandle(res, err)
    }
  } else if (req.url.startsWith('/rooms/') && req.method === "PATCH") {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const data = JSON.parse(body);
        const roomData = await Room.findByIdAndUpdate(id, {
          name: data.name,
          price: data.price,
        })
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          status: true,
          data: roomData,
        }))
        res.end();
      } catch (err) {
        errHandle(res, err)
      }
    })
  }
}

const server = http.createServer(requestListener).listen(3005);