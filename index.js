const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require('discord.js');


function scheduleNotification(channel) {

  function getNowJST() {
    return new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
    );
  }

  const now = getNowJST();

  // 今日の21:10（日本時間）
  let target = getNowJST();
  target.setHours(16, 35, 0, 0);

  // すでに過ぎていたら翌日
  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target - now;

  setTimeout(() => {

    if (currentUserId) {
        return interaction.reply({
        content: '鍵の返却大丈夫？',
        ephemeral: true // ←本人だけに表示
        });
    }

    // 次の日の分を再セット
    scheduleNotification(channel);

  }, delay);
}


const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 現在借りてる人
let currentUserId = null;

// 起動時
client.once('ready', async () => {
  console.log(`ログイン成功: ${client.user.tag}`);

  const channel = await client.channels.fetch('1489681970027040970');

  // 👇ここに入れる！！
  scheduleNotification(channel);

  const borrowButton = new ButtonBuilder()
    .setCustomId('borrow')
    .setLabel('借りた！')
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
        .setLabel('返した！')
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
        .setLabel('返した！')
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
    // 🔒 本人チェック
    if (interaction.user.id !== currentUserId) {
        return interaction.reply({
        content: '借りている人しか返せません',
        ephemeral: true // ←本人だけに表示
        });
    }

    // OKなら返却処理
    currentUserId = null;

    const borrowButton = new ButtonBuilder()
        .setCustomId('borrow')
        .setLabel('借りた！')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(borrowButton);

    await interaction.update({
        content: '鍵を借りますか？',
        components: [row]
    });
    }  
});

client.login(process.env.TOKEN);