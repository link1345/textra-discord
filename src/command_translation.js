import { Client } from 'discord.js';
import { Routes, MessageFlags , ChannelType , PermissionFlagsBits } from 'discord-api-types/v10';
import * as mt from './mt_translation.js';
import * as database from './db.js';

export async function translation(interaction, database_guild, reqest, hidden = false){
    // 翻訳をしてもらう
    let translation_mode = await database.check_user_mt_translation_mode(interaction.user.id)

    if( !(await mt.getToken(database_guild["return_item"])) ){
        interaction.editReply({content: "**[Error]** It seems that the guild settings are incorrect.." });
        return;
    }

    let convert_message = "";
    if(translation_mode == "Auto"){        
        const original_lang = await mt.call_langdetect_api(database_guild["return_item"], reqest.content);
        const converted_lang = interaction.locale;
        convert_message = "**[Translation : " + original_lang + " > " + converted_lang + "]**\n";

        if(original_lang == null){
            interaction.editReply({content: "**[Error]** The language could not be determined." });
            return;
        }
        else if(original_lang == converted_lang){
            interaction.editReply({content: "**[Error]** It cannot be translated because it is in the same language as the environment." });
            return;
        }
        translation_mode = await mt.call_standard_api(database_guild["return_item"], original_lang, converted_lang);
        if(translation_mode == null){
            interaction.editReply({content: "**[Error]** Could not set language model." });
            return;
        }
    }else{
        convert_message = "**[Translation Mode : " + translation_mode + "]**\n";
    }
    const mt_response = await mt.call_api(database_guild["return_item"], reqest.content, translation_mode);
    if(mt_response == null || mt_response == ""){
        interaction.editReply({content: "**[Error]** Translation failed." });
        return;
    }

    if(hidden != true){
        // コメント削除
        interaction.deleteReply();
        // 翻訳結果を返す
        reqest.reply({content: convert_message + mt_response});
    }else{
        // reqestで返すと必ず公開状態になってしまうので、回避する。
        interaction.editReply({content: convert_message + mt_response });
    }
}
