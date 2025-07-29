const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const forbiddenWords = ['venda', 'compro', 'comprar', 'vender'];
const logChannels = new Map();

client.once('ready', () => {
  console.log('Bot online!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // Comando para setar canal de logs
  if (content.startsWith('!setlog')) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('Você precisa ser administrador para usar esse comando.');
    }
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply('Por favor, mencione um canal válido.');
    logChannels.set(message.guild.id, channel.id);
    return message.reply(`Canal de logs definido para ${channel}.`);
  }

  // Apagar mensagens proibidas
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
  }
});

// Faz login usando variável de ambiente TOKEN
client.login(process.env.TOKEN);
