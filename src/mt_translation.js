import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as sanitize  from 'validator';
import * as database from './db.js';

const url    = 'https://mt-auto-minhon-mlt.ucri.jgn-x.jp';  // 基底URL (https://xxx.jpまでを入力)

var api_name  = 'mt';  // API名 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"mt")
//var api_param = '';  // API値 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"generalNT_ja_en")

var access_token_time = null;
var access_token = null;

import axios from 'axios';

export async function call_api (guild_data, text, api_param) {
    // トークンを貰ってくる
    await getToken(guild_data);

   let formData = new FormData();
    formData.append("access_token", guild_data["access_token"]);
    formData.append("key", guild_data["mt_key"]);
    formData.append("api_name", api_name);
    formData.append("api_param", api_param);
    formData.append("name", guild_data["mt_loginname"]);
    formData.append("type", "json");
    formData.append("text", text);
    const response_item = await axios.post(url + '/api/', formData);
    return sanitize.escape(response_item.data['resultset']['result']['text']);

}

export async function call_langdetect_api (guild_data, text) {
    // DBからGuild情報を手に入れる

    // トークンを貰ってくる
    await getToken(guild_data);

    let formData = new FormData();
    formData.append("access_token", guild_data["access_token"]);
    formData.append("key", guild_data["mt_key"]);
    formData.append("name", guild_data["mt_loginname"]);
    formData.append("type", "json");
    formData.append("text", text);
    const response_item = await axios.post(url + '/api/langdetect/', formData);
    //return sanitize.escape(response_item.data['resultset']['result']['langdetect']['1']['lang']);
    if(response_item.data['resultset']["code"] == 200){
        let item = response_item.data['resultset']['result']['langdetect']['1']['lang'];
        return sanitize.escape(item);
    }else{
        return null;
    }
}

export async function call_standard_api (guild_data, lang_s, lang_t) {
    // トークンを貰ってくる
    await getToken(guild_data);

   let formData = new FormData();
    formData.append("access_token", guild_data["access_token"]);
    formData.append("key", guild_data["mt_key"]);
    formData.append("name", guild_data["mt_loginname"]);
    formData.append("type", "json");
    formData.append("lang_s", lang_s);
    formData.append("lang_t", lang_t);
    const response_item = await axios.post(url + '/api/mt_standard/get/', formData);
    return sanitize.escape(response_item.data['resultset']['result']['list']['0']['id']);
}


export async function getToken (guild_data) {
    if( guild_data["access_token_time"] == null || guild_data["access_token_time"] == "" || guild_data["access_token_time"] <= Number(Date.now()) ){

        const response_item = await axios.post(url + '/oauth2/token.php', {
            grant_type: 'client_credentials',
            client_id: guild_data["mt_key"],                             // API Key
            client_secret: guild_data["mt_secret"],                      // API secret
            urlAccessToken: url + '/oauth2/token.php'   // アクセストークン取得URI
        });

        let timer = new Date();
        timer.setSeconds(timer.getSeconds() + n);
        await database.change_guild_token(guild_data["guild_id"], response_item.data['access_token'], Number(timer));
    }
}