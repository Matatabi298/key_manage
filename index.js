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

// 現在借りてる人
let currentUserId = null;

// 起動時
client.once('ready', async () => {
  console.log(`ログイン成功: ${client.user.tag}`);

  const channel = await client.channels.fetch('1489681970027040970');

  const borrowButton = new ButtonBuilder()
    .setCustomId('borrow')
    .setLabel('借りる')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(borrowButton);

  await channel.send({
    content: '鍵を借りますか？',
    components: [row]
  });
});

// ボタン処理
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  // 借りる
  if (interaction.customId === 'borrow') {
    currentUserId = interaction.user.id;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('return')
        .setLabel('返す')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('swap')
        .setLabel('交換')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.update({
      content: `<@${currentUserId}> が鍵を借りています`,
      components: [row]
    });
  }

  // 交換
  if (interaction.customId === 'swap') {
    if (!currentUserId) return;

    currentUserId = interaction.user.id;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('return')
        .setLabel('返す')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('swap')
        .setLabel('交換')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.update({
      content: `<@${currentUserId}> が鍵を借りています`,
      components: [row]
    });
  }

  // 返す
  if (interaction.customId === 'return') {
    currentUserId = null;

    const borrowButton = new ButtonBuilder()
      .setCustomId('borrow')
      .setLabel('借りる')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(borrowButton);

    await interaction.update({
      content: '鍵を借りますか？',
      components: [row]
    });
  }
});

client.login(process.env.TOKEN);
