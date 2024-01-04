import * as yaml from 'js-yaml';
import * as fs from 'fs';

const BASE_CONFIG = yaml.load(fs.readFileSync('./conf/base.yml', 'utf8'));

var url    = 'https://mt-auto-minhon-mlt.ucri.jgn-x.jp';  // 基底URL (https://xxx.jpまでを入力)
var key    = BASE_CONFIG['app']['mt_key'];  // API key
var secret = BASE_CONFIG['app']['mt_secret'];  // API secret
var name   = BASE_CONFIG['app']['mt_loginname'];  // ログインID

var api_name  = 'mt';  // API名 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"mt")
//var api_param = '';  // API値 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"generalNT_ja_en")

var access_token_time = null;
var access_token = null;

import axios from 'axios';

export async function call_api (text, api_param) {
    // トークンを貰ってくる
    await getToken();

    var formData = new FormData();
    formData.append("access_token", access_token);
    formData.append("key", key);
    formData.append("api_name", api_name);
    formData.append("api_param", api_param);
    formData.append("name", name);
    formData.append("type", "json");
    formData.append("text", text);
    const response_item = await axios.post(url + '/api/', formData);
    return response_item.data['resultset']['result']['text'];

}

export async function call_langdetect_api (text) {
    // トークンを貰ってくる
    await getToken();

    var formData = new FormData();
    formData.append("access_token", access_token);
    formData.append("key", key);
    formData.append("name", name);
    formData.append("type", "json");
    formData.append("text", text);
    const response_item = await axios.post(url + '/api/langdetect/', formData);
    return response_item.data['resultset']['result']['langdetect']['1']['lang'];

}

export async function call_standard_api (lang_s, lang_t) {
    // トークンを貰ってくる
    await getToken();

    var formData = new FormData();
    formData.append("access_token", access_token);
    formData.append("key", key);
    formData.append("name", name);
    formData.append("type", "json");
    formData.append("lang_s", lang_s);
    formData.append("lang_t", lang_t);
    const response_item = await axios.post(url + '/api/mt_standard/get/', formData);
    return response_item.data['resultset']['result']['list']['0']['id'];
}


export async function getToken () {

    if( !(access_token_time == null && access_token_time <= Date.now() ) ) return;

    const response_item = await axios.post(url + '/oauth2/token.php', {
        grant_type: 'client_credentials',
        client_id: key,                             // API Key
        client_secret: secret,                      // API secret
        urlAccessToken: url + '/oauth2/token.php'   // アクセストークン取得URI
    });
    access_token = response_item.data['access_token'];
    access_token_time = response_item.data['expires_in'] + Date.now();

}