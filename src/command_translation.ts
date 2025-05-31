import * as mt from './mt_translation.js';
import {checkUserMtTranslationMode, GuildSetting} from './db.js';
import {callLangdetect, callStandard, call} from './mt_translation.js';
import {
	CacheType,
	MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction,
	Message,
} from 'discord.js';

export async function translation(interaction: MessageContextMenuCommandInteraction<CacheType> | UserContextMenuCommandInteraction<CacheType>, guild: GuildSetting, reqest: Message<boolean>, hidden = false) {
	// 翻訳をしてもらう
	const DbTranslationMode = await checkUserMtTranslationMode(interaction.user.id);
	let translationMode: string | undefined;
	if (DbTranslationMode instanceof Error) {
		translationMode = 'Auto';
	} else {
		translationMode = DbTranslationMode;
	}

	if (!(await mt.getToken(guild))) {
		interaction.editReply({content: '**[Error]** It seems that the guild settings are incorrect..'});
		return;
	}

	let convertLang: string | undefined;
	if (translationMode === 'Auto') {
		const originalLang = await callLangdetect(guild, reqest.content);
		const convertedLang = interaction.locale;
		convertLang = '**[Translation : ' + originalLang + ' > ' + convertedLang + ']**\n';

		if (!originalLang) {
			interaction.editReply({content: '**[Error]** The language could not be determined.'});
			return;
		}

		if (originalLang === convertedLang) {
			interaction.editReply({content: '**[Error]** It cannot be translated because it is in the same language as the environment.'});
			return;
		}

		translationMode = await callStandard(guild, originalLang, convertedLang);
		if (!translationMode) {
			interaction.editReply({content: '**[Error]** Could not set language model.'});
			return;
		}
	} else {
		convertLang = '**[Translation Mode : ' + translationMode + ']**\n';
	}

	const convertedMessage = await call(guild, reqest.content, translationMode);
	if (!convertedMessage || convertedMessage === '') {
		interaction.editReply({content: '**[Error]** Translation failed.'});
		return;
	}

	if (hidden) {
		// Reqestで返すと必ず公開状態になってしまうので、回避する。
		interaction.editReply({content: `${convertLang}  ${convertedMessage}`});
	} else {
		// コメント削除
		interaction.deleteReply();
		// 翻訳結果を返す
		reqest.reply({content: `${convertLang} ${convertedMessage}`});
	}
}
