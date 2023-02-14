const {searchUser} = require("../../functions")
const {MessageEmbed} = require('discord.js');

module.exports = {
    //here we gonna set proprieties for the command like the name, the description, the aliases, the category and the usage in the collection that we created in the index.js file
    name : "search",
    //here we gonna use helpname for our help command later
    helpname : "search <user>",
    description : "Recherche un utilisateur sur youtube",
    execute(message, args) {
        //first we gonna check if there is an argument after the "search" if not we gonna send an error message
        if(!args[0]) return message.channel.send({embeds : [new MessageEmbed().setTitle("Erreur").setDescription("Veuillez spécifier un utilisateur").setColor("RED")]})
        //if there is an argument we gonna use the searchUser function that we created in the functions.js file and imported
        searchUser(args[0], message);
    }
}