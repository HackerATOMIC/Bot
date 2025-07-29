const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const PREFIX = '!';
const forbiddenWords = ['venda', 'compro', 'comprar', 'vender'];
const logChannels = new Map();

client.once('ready', () => {
  console.log('Bot online!'); // Mensagem que aparece quando o bot conecta
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // Comando para definir canal de logs
  if (content.startsWith(`${PREFIX}setlog`)) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('Você precisa ser administrador para usar este comando.');
    }
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply('Por favor, mencione um canal válido.');
    logChannels.set(message.guild.id, channel.id);
    return message.reply(`Canal de logs definido para ${channel}.`);
  }

  // Filtrar mensagens com palavras proibidas
  if (forbiddenWords.some(word => content.includes(word))) {
    try {
      const originalMessage = message.content;
      await message.delete();

      const logChannelId = logChannels.get(message.guild.id);
      if (logChannelId) {
        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (logChannel) {
          logChannel.send(`🗑️ Mensagem apagada de **${message.author.tag}**:\n"${originalMessage}"`);
        }
      }
    } catch (error) {
      console.error(error);
    }
    return;
  }

  // Comandos simples
  if (!content.startsWith(PREFIX)) return;

  const args = content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift();

  if (command === 'ping') {
    return message.reply('Pong!');
  }

  // Aqui pode adicionar mais comandos
});

client.login(process.env.TOKEN);
