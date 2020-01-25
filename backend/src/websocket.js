const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setupWebSocket = (server) =>{
    io = socketio(server);

    io.on('connection', socket => {

        const { latidude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates:{
                latitude: Number(latidude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        });
    });
};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10 && connection.techs.some(item => techs.includes(item));
    })
}

exports.sendMessage = (to, messa, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    })
}