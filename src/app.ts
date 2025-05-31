import {
	Client,
	GatewayIntentBits,
	Interaction,
	CacheType,
	TextChannel,
	ApplicationCommandDataResolvable,
} from 'discord.js';
import {
	MessageFlags,
	ChannelType,
	PermissionFlagsBits,
} from 'discord-api-types/v10';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { getToken } from './mt_translation.js';
import sanitize from 'validator';
import {
	createDb,
	checkUserMtTranslationMode,
	changeUserMode,
	changeGuildSetting,
	getGuildSetting,
	deleteGuildSetting,
} from './db.js';
import { help } from './command_help.js';
import { translation } from './command_translation.js';

type BaseConig = {
	app: {
		discord_token: string;
	};
	commands: ApplicationCommandDataResolvable[];
};

const baseConfig = yaml.load(fs.readFileSync('./conf/base.yml', 'utf8')) as BaseConig;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

export async function ready() {
	console.log(`Logged in as ${client.user?.tag}!`);
}

export async function interactionCreate(interaction: Interaction<CacheType>) {
	try {
		if (interaction.isChatInputCommand()) {
			// 待ち(非表示)
			await interaction.deferReply({ flags: 'Ephemeral' });

			try {
				if (interaction.commandName === 'help') {
					await help(interaction);
				} else if (interaction.commandName === 'now-translation') {
					await interaction.editReply({
						content: `=> Now Mode : ' ${await checkUserMtTranslationMode(interaction.user.id)}`,
					});
				} else if (interaction.commandName === 'set-translation') {
					// データ貰ってくる時に、サニタイジングしておく
					const item = sanitize.escape(interaction.options.getString('mode') ?? '');
					interaction.editReply({ content: ` => Set Mode : ${item}` });
					// Set
					changeUserMode(sanitize.escape(interaction.user.id), item);
				} else if (interaction.commandName === 'setting-clear') {
					interaction.editReply({ content: ' => Clear!' });
					changeUserMode(sanitize.escape(interaction.user.id), 'Auto');
				} else if (interaction.commandName === 'guild-setting') {
					// データ貰ってくる時に、サニタイジングしておく
					const mtKey = sanitize.escape(interaction.options.getString('mt_key') ?? '');
					const mtSecret = sanitize.escape(interaction.options.getString('mt_secret') ?? '');
					const mtLoginname = sanitize.escape(interaction.options.getString('mt_loginname') ?? '');

					const guidlId = interaction.guild?.id;
					if (!guidlId) {
						await interaction.reply({ content: 'Guild is not configured.', flags: MessageFlags.Ephemeral });
						return;
					}

					// Set
					await changeGuildSetting({
						guildId: sanitize.escape(interaction.guild?.id ?? ''),
						mtKey,
						mtSecret,
						mtLoginname,
					});
					const guild = await getGuildSetting(sanitize.escape(guidlId));
					if (!guild || guild instanceof Error) {
						interaction.editReply({ content: ' => Guild NG !' });
						return;
					}

					const tokenReturn = await getToken(guild);
					if (tokenReturn == false) {
						// アカウント情報取得に失敗したら、警告出してDBから消す。
						interaction.editReply({ content: ' => Guild NG !' });
						deleteGuildSetting(sanitize.escape(interaction.guild?.id ?? ''));
					} else {
						interaction.editReply({ content: ' => Guild OK !' });
					}
				}
			} catch (error) {
				interaction.editReply('Error!');
				console.log(error);
			}
		} else if (interaction.isContextMenuCommand()) {
			// 自分のメッセージを蹴る
			const reqest = interaction.options.get('message')?.message;
			if (reqest && client.user?.id == reqest.member?.user.id) {
				await interaction.reply({ content: 'Cannot reply to bot own messages.', flags: MessageFlags.Ephemeral });
				return;
			}

			if (!reqest) {
				await interaction.reply({ content: 'An unknown error has occurred.', flags: MessageFlags.Ephemeral });
				return;
			}

			const guild = await getGuildSetting(sanitize.escape(interaction.guild?.id ?? ''));
			if (!guild || guild instanceof Error) {
				await interaction.reply({ content: 'Guild is not configured.', flags: MessageFlags.Ephemeral });
				return;
			}

			// 待ち(表示)
			await interaction.deferReply({ ephemeral: true });
			try {
				if (interaction.commandName === 'translation') {
					// 翻訳をしてもらう
					await translation(interaction, guild, reqest, false);
				} else if (interaction.commandName === 'hidden-translation') {
					// 翻訳をしてもらう
					await translation(interaction, guild, reqest, true);
				}
			} catch (error) {
				console.log(error);
				await interaction.editReply('Error!');
			}
		}
	} catch (error) {
		console.error(error);
	}
}

async function initCommnad() {
	try {
		console.log('Started refreshing application (/) commands.');
		//const command: Collection<Snowflake, ApplicationCommand<{ guild: GuildResolvable }>> = await client.application?.commands.set(baseConfig.commands);
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
}

export function run() {
	createDb();

	client.on('ready', async () => {
		await ready();
	});

	client.on('interactionCreate', async interaction => {
		await interactionCreate(interaction);
	});

	client.on('guildCreate', async guild => {
		let message = '**Hello! thank you for inviting me!**\n';
		message += 'I am [textra-discord] .\n';
		message += 'It is developed with OSS. This is a discord bot.\n';
		message += 'This uses `みんなの自動翻訳@textra🄬` to translate characters.\n';
		message += 'Please read the URL page for details!\n';
		message += 'Github(discord bot) : https://github.com/link1345/textra-discord\n';
		message += 'translate Engine(`みんなの自動翻訳@textra🄬`)\' : https://mt-auto-minhon-mlt.ucri.jgn-x.jp/\n';

		let defaultChannel: TextChannel | undefined;

		for (const guildChannel of guild.channels.cache) {
			const channel = guildChannel[1];
			if (channel.type === ChannelType.GuildText && guild.members.me) {
				const chennel_bit = channel.permissionsFor(guild.members.me);
				if (chennel_bit.has(PermissionFlagsBits.SendMessages) && chennel_bit.has(PermissionFlagsBits.ViewChannel)) {
					defaultChannel = channel;
					break;
				}
			}
		}

		if (!defaultChannel) {
			return;
		}

		defaultChannel.send(message);
	});

	client.login(baseConfig.app.discord_token).then(async () => {
		initCommnad();
	});
}
