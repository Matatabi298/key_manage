const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Botが起動したとき
client.once('ready', () => {
  console.log(`ログイン成功: ${client.user.tag}`);
});

// 新しいメンバーが入ったとき
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(
    ch => ch.name === "general" // ←チャンネル名変更OK
  );

  if (channel) {
    channel.send(`<@${member.id}> ようこそ！🎉`);
  }
});

client.login(process.env.TOKEN);