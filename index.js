const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json')
const prefix = config.prefix
const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs');
const { join } = require('path'); 

client.on('ready', () => {
    console.log(`${client.user.tag} ismi ile giriş yapıldı. ${client.users.cache.size} kullanıcıya, ${client.guilds.cache.size} sunucuya hizmet veriliyor.`)
})

client.on('ready', () => { 
    
    const degisenaktivite = [ 
    "🍬 " + client.users.cache.size + " kullanıcıya hizmet veriyorum.", 
    "🔥 " + client.guilds.cache.size + " sunucuya hizmet veriyorum.",
    "⭐ " + client.channels.cache.size + " kanalda kullanılıyorum."
    ];
    
    setInterval(() => { 
        const aktivite = Math.floor(Math.random() * (degisenaktivite.length - 1) + 1); 
        client.user.setActivity(degisenaktivite[aktivite]); 
    }, 15000); 
    client.user.setStatus('idle')
});

client.commands= new Discord.Collection(); 

const commandFiles = readdirSync(join(__dirname, "komutlar")).filter(file => file.endsWith(".js")); 

for (const file of commandFiles) {
    const command = require(join(__dirname, "komutlar", `${file}`));
    client.commands.set(command.kod, command); 
}

client.on("error", console.error);

client.on("message", async message => {

    if(message.author.bot) return;

    if(message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);

        const command = args.shift().toLowerCase();

        if(!client.commands.has(command)) return message.channel.send(`**${command}** isminde bir komutum bulunmuyor. Eklenmesini istediğiniz komutları sahibime özelden ulaştırabilirsiniz. **'burak#9013** `);


        try {
            client.commands.get(command).run(client, message, args);

        } catch (error){
            console.error(error);
        }
    }
})


client.on('guildMemberAdd', member => {

    const channel = member.guild.channels.cache.find(channel => channel.name === "hoş-geldin")
    if (!channel) return;

    const joinembed = new Discord.MessageEmbed()
    .setTitle(`Partiye yeni biri katıldı!`)
    .setDescription(`<a:wumpthumbsup:815250711394648084> Hoşgeldin, ${member}! Umarım yiyecek birşeyler getirmişsindir.`)
    .setThumbnail(`https://cdn.discordapp.com/attachments/817698826977935381/818960799271354378/749054660769218631-small.gif`)
    .setColor("RANDOM")

    channel.send(joinembed)
});

client.on('guildMemberRemove', member => {

    const channel = member.guild.channels.cache.find(channel => channel.name === "görüşürüz")
    if (!channel) return;

    const quitembed = new Discord.MessageEmbed()
    .setTitle(`Bir üye kaybettik.`)
    .setThumbnail(`https://cdn.discordapp.com/attachments/817698826977935381/818960874579427378/749052311476895834-small.gif`)
    .setDescription(` <a:wumpcry:815250704586375188> ${member} kullanıcısı aramızdan ayrıldı. Tekrar bekleriz..`)
    .setColor("RANDOM")

    channel.send(quitembed)
});

client.on('guildDelete', guild => {

    let brk = new Discord.MessageEmbed()
    
    .setColor("RED")
    .setTitle("Bot bir sunucudan atıldı.")
    .addField("Sunucu adı・", guild.name)
    .addField("Sunucu sahibi・", guild.owner)
    .addField("Sunucu sahibinin IDsi・", guild.ownerID)
    .addField("Sunucunun kurulu olduğu bölge・", guild.region)
    .addField("Sunucudaki kişi sayısı・", guild.memberCount)
    
       client.channels.cache.get('817705622984065074').send(brk);
    
    });


 client.on('guildCreate', guild => {
    
    let brk = new Discord.MessageEmbed()
    
    .setColor("GREEN")
    .setTitle("Bot bir sunucuya eklendi!")
    .addField("Sunucu adı:", guild.name)
    .addField("Sunucu sahibi", guild.owner)
    .addField("Sunucu sahibinin IDsi", guild.ownerID)
    .addField("Sunucunun kurulu olduğu bölge:", guild.region)
    .addField("Sunucudaki kişi sayısı:", guild.memberCount)
    
       client.channels.cache.get('817705622984065074').send(brk);
    
    });

client.login(config.token)