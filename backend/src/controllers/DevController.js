const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index (request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store (request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });
    
        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const {name = login, bio, avatar_url} = apiResponse.data;
        
            const techsArrays = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                bio,
                avatar_url,
                techs: techsArrays,
                location,
            });
            
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArrays
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
            
        }

        return response.json(dev);
    },

    async update (request, response){
        let dev = await Dev.findOne({ github_username:request.params.github_username });
        const {techs, bio, avatar_url, name} = request.body;
        const techsArrays = parseStringAsArray(techs);

        dev = await Dev.findByIdAndUpdate(dev.id,{
            techs: techsArrays,
            name,
            bio,
            avatar_url,
        });
        
        return response.json( dev );
    },

    async delete (request, response){
        let dev = await Dev.findOne({ github_username:request.params.github_username });

        dev = await Dev.findByIdAndRemove(dev.id);
        
        return response.json({ dev });
    }
};