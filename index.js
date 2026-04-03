const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 起動時にメッセージ送る（初期状態）
client.once('ready', async () => {
  console.log(`ログイン成功: ${client.user.tag}`);

  const channel = await client.channels.fetch('1489681970027040970');

  const borrowButton = new ButtonBuilder()
    .setCustomId('borrow')
    .setLabel('借りた！')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(borrowButton);

  await channel.send({
    content: '鍵を借りましたか？',
    components: [row]
  });
});

// ボタン処理
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  // 借りるボタン
  if (interaction.customId === 'borrow') {
    const returnButton = new ButtonBuilder()
      .setCustomId('return')
      .setLabel('返した！')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(returnButton);

    await interaction.update({
      content: `<@${interaction.user.id}> が借りました`,
      components: [row]
    });
  }

  // 返すボタン
  if (interaction.customId === 'return') {
    const borrowButton = new ButtonBuilder()
      .setCustomId('borrow')
      .setLabel('借りた！')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(borrowButton);

    await interaction.update({
      content: '鍵を借りましたか？',
      components: [row]
    });
  }
});

client.login(process.env.TOKEN);