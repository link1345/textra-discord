import { Client, GatewayIntentBits } from 'discord.js';
import { Routes, MessageFlags , ChannelType , PermissionFlagsBits } from 'discord-api-types/v10';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as mt from './mt_translation.js';
import sanitize  from 'validator';
import * as database from './db.js';

import * as command_help from './command_help.js';
import * as command_translation from './command_translation.js';

const BASE_CONFIG = yaml.load(fs.readFileSync('./conf/base.yml', 'utf8'));

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

let command = []

export async function ready(){
    console.log(`Logged in as ${client.user.tag}!`);
}

function save_yaml(filename, json_text){
    const yamlText = yaml.dump(json_text);
    try {
       fs.writeFileSync(filename, yamlText, 'utf8');
    } catch (err) {
       console.error(err.message);
    }
}

export async function interactionCreate(interaction){

    try {
        if (interaction.isChatInputCommand())
        {
            
            // 待ち(非表示)
            await interaction.deferReply({ ephemeral: true });

            try {
                if (interaction.commandName === 'help') {
                    await command_help.help(interaction);
                }
                else if (interaction.commandName === 'now-translation') {
                    interaction.editReply({content:' => Now Mode : ' + await database.check_user_mt_translation_mode(interaction.user.id), flags: MessageFlags.Ephemeral });
                }
                else if (interaction.commandName === 'set-translation') {
                    // データ貰ってくる時に、サニタイジングしておく
                    let item = sanitize.escape(interaction.options.get("mode").value);
                    interaction.editReply({content:' => Set Mode : ' + item, flags: MessageFlags.Ephemeral });
                    // Set
                    database.change_user_mode(sanitize.escape(interaction.user.id), item);
                }
                else if (interaction.commandName === 'setting-clear') {
                    interaction.editReply({content:' => Clear!', flags: MessageFlags.Ephemeral });
                    database.change_user_mode(sanitize.escape(interaction.user.id), "Auto");
                }
                else if (interaction.commandName === 'guild-setting') {
                    // データ貰ってくる時に、サニタイジングしておく
                    const mt_key = sanitize.escape(interaction.options.get("mt_key").value);
                    const mt_secret = sanitize.escape(interaction.options.get("mt_secret").value);
                    const mt_loginname = sanitize.escape(interaction.options.get("mt_loginname").value);
                    // Set
                    await database.change_guild_setting(sanitize.escape(interaction.guild.id), mt_key, mt_secret, mt_loginname);
                    const guild_data = await database.check_guild_setting(sanitize.escape(interaction.guild.id), mt_key, mt_secret, mt_loginname);
                    const token_return = await mt.getToken(guild_data["return_item"]);
                    if(token_return == false){
                        // アカウント情報取得に失敗したら、警告出してDBから消す。
                        interaction.editReply({content:' => Guild NG !', flags: MessageFlags.Ephemeral });                        
                        database.delete_guild_setting(sanitize.escape(interaction.guild.id));
                    }else{
                        interaction.editReply({content:' => Guild OK !', flags: MessageFlags.Ephemeral });
                    }
                }

            } catch (error) {
                interaction.editReply("Error!");
            }

            return;
        }
        else if (interaction.isContextMenuCommand()){            
            // 自分のメッセージを蹴る
            const reqest = interaction.options.getMessage("message");
            if(client.user.id == reqest.member.user.id)
            {
                await interaction.reply({content:'Cannot reply to bot own messages.', flags: MessageFlags.Ephemeral });
                return;
            }

            const database_guild = await database.check_guild_setting(interaction.guild.id);
            if(database_guild["hit"] == false){                
                await interaction.reply({content:'Guild is not configured.', flags: MessageFlags.Ephemeral });
                return;
            }

            // 待ち(表示)
            await interaction.deferReply({ ephemeral: true });            
            try {
                if (interaction.commandName === 'translation') {
                    // 翻訳をしてもらう 
                    await command_translation.translation(interaction, database_guild, reqest, false);
                    return;
                }else if (interaction.commandName === 'hidden-translation') {
                    // 翻訳をしてもらう 
                    await command_translation.translation(interaction, database_guild, reqest, true);
                    return;
                }
            } catch (error) {
                console.log(error);
                await interaction.editReply("Error!");
            }
        }
    } catch (error) {
        console.error(error);
    }
}


async function initCommnad(){

    try {
        console.log('Started refreshing application (/) commands.');
        command = await client.application.commands.set(BASE_CONFIG['commands']);
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

export function run(){

    database.create_db();
    
    client.on('ready', async () => {
        await ready();
    });
    
    client.on('interactionCreate', async interaction => {
        await interactionCreate(interaction);
    });

    client.on('guildCreate', async guild => {
        let message = "**Hello! thank you for inviting me!**\n";
        message += "I am [textra-discord] .\n";
        message += "It is developed with OSS. This is a discord bot.\n";
        message += "This uses `みんなの自動翻訳@textra🄬` to translate characters.\n";
        message += "Please read the URL page for details!\n";
        message += "Github(discord bot) : https://github.com/link1345/textra-discord\n";
        message += "translate Engine(`みんなの自動翻訳@textra🄬`)' : https://mt-auto-minhon-mlt.ucri.jgn-x.jp/\n";
        
        let defaultChannel = "";
        guild.channels.cache.forEach((channel) => {
            if(channel.type == ChannelType.GuildText && defaultChannel == "") {
                const chennel_bit = channel.permissionsFor(guild.members.me);
                if( chennel_bit.has(PermissionFlagsBits.SendMessages) && chennel_bit.has(PermissionFlagsBits.ViewChannel) ) {
                    defaultChannel = channel;
                }
            }
        });
        if(defaultChannel == "") return;
        defaultChannel.send(message);

    })
    
    client.login(BASE_CONFIG['app']['discord_token']).then( async () => {
        initCommnad();
    })
}   

export async function exit(){
    //await client.application.commands.set([]);
}