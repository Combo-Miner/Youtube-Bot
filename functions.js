const config = require("./config.json");
const { MessageEmbed } = require("discord.js");

function searchUser(user, message) {
  const request = require("request");
  request(
    `https://www.googleapis.com/youtube/v3/search?key=${config.apiKey}` +
      "&type=channel&part=snippet&maxResults=1" +
      "&q=" +
      user,
    function (error, response, body) {
      if (error)
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Erreur")
              .setDescription(
                "Une erreur est survenue lors de la recherche de l'utilisateur ou l'utilisateur n'existe pas"
              )
              .setColor("RED"),
          ],
        });
      let info = JSON.parse(body);
      console.log(info.items[0].statistics);
      let channelId = info.items[0].id.channelId;
      let channelTitle = info.items[0].snippet.channelTitle;
      let channelDescription = info.items[0].snippet.description;
      let channelThumbnail = info.items[0].snippet.thumbnails.default.url;
      let startedAt = info.items[0].snippet.publishTime;
      //transform the date to a readable date
      startedAt = readableDate(startedAt);

      request(
        `https://www.googleapis.com/youtube/v3/channels?key=${config.apiKey}` +
          "&part=statistics&id=" +
          channelId,
        function (error, response, body) {
          if (error)
            return message.channel.send({
              embeds: [
                new MessageEmbed()
                  .setTitle("Erreur")
                  .setDescription(
                    "Une erreur est survenue lors de la recherche de l'utilisateur"
                  )
                  .setColor("RED"),
              ],
            });
          let stats = JSON.parse(body);
          let totalViews = stats.items[0].statistics.viewCount;
          let totalSubscribers = stats.items[0].statistics?.subscriberCount;
          let totalVideos = stats.items[0].statistics.videoCount;
          //transform the numbers to a readable number
          totalViews = readableNumbers(totalViews);
          totalSubscribers = readableNumbers(totalSubscribers);
          totalVideos = readableNumbers(totalVideos);

          if (stats.items[0].statistics.hiddenSubscriberCount == true) {
            totalSubscribers = "Caché";
          }
          //envoyer les données dans un embeds
          let embed = new MessageEmbed()
            .setTitle(channelTitle)
            .setURL(`https://www.youtube.com/channel/${channelId}`)
            .setThumbnail(channelThumbnail)
            .setDescription(channelDescription)
            .addField("Abonnés", totalSubscribers)
            .addField("Vues", totalViews)
            .addField("Vidéos", totalVideos)
            .addField("Date de création", startedAt)
            .setColor("RED")
            .setFooter(
              "Requête effectuée par " + message.author.username,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setTimestamp();
          message.channel.send({ embeds: [embed] });
        }
      );
    }
  );
}

function readableDate(date) {
  date = new Date(date);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();
  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }
  return dt + "/" + month + "/" + year;
}

function readableNumbers(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = { searchUser, readableDate };
