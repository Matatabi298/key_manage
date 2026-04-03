const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 起動確認
client.once('ready', () => {
  console.log(`ログイン成功: ${client.user.tag}`);
});

// メッセージ受信
client.on('messageCreate', message => {
  // Bot自身は無視
  if (message.author.bot) return;

  // コマンド①
  if (message.content === '!ping') {
    message.reply('pong!');
  }

  // コマンド②
  if (message.content.includes('こんにちは')) {
    message.reply(`こんにちは！ <@${message.author.id}>`);
  }

  // メンションされたら
  if (message.mentions.has(client.user)) {
    message.reply('呼んだ？👀');
  }
});

client.login(process.env.TOKEN);