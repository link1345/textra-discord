import * as yaml from 'js-yaml';
import * as fs from 'fs';
import sanitize from 'validator';
import * as database from './db.js';

const url = 'https://mt-auto-minhon-mlt.ucri.jgn-x.jp'; // 基底URL (https://xxx.jpまでを入力)

const api_name = 'mt'; // API名 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"mt")
// var api_param = '';  // API値 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"generalNT_ja_en")

const access_token_time = null;
const access_token = null;

import axios from 'axios';

export async function call_api(guild_data, text, api_param) {
	// トークンを貰ってくる
	if (!(await getToken(guild_data))) {
		return null;
	}

	const formData = new FormData();
	formData.append('access_token', guild_data.access_token);
	formData.append('key', guild_data.mt_key);
	formData.append('api_name', api_name);
	formData.append('api_param', api_param);
	formData.append('name', guild_data.mt_loginname);
	formData.append('type', 'json');
	formData.append('text', text);
	const response_item = await axios.post(url + '/api/', formData);
	if (response_item.data.resultset.code == 0) {
		return sanitize.escape(response_item.data.resultset.result.text);
	}

	return null;
}

export async function call_langdetect_api(guild_data, text) {
	// トークンを貰ってくる
	if (!(await getToken(guild_data))) {
		return null;
	}

	const formData = new FormData();
	formData.append('access_token', guild_data.access_token);
	formData.append('key', guild_data.mt_key);
	formData.append('name', guild_data.mt_loginname);
	formData.append('type', 'json');
	formData.append('text', text);
	const response_item = await axios.post(url + '/api/langdetect/', formData);
	// Return sanitize.escape(response_item.data['resultset']['result']['langdetect']['1']['lang']);
	if (response_item.data.resultset.code == 0) {
		const item = response_item.data.resultset.result.langdetect['1'].lang;
		return sanitize.escape(item);
	}

	return null;
}

export async function call_standard_api(guild_data, lang_s, lang_t) {
	// トークンを貰ってくる
	if (!(await getToken(guild_data))) {
		return null;
	}

	const formData = new FormData();
	formData.append('access_token', guild_data.access_token);
	formData.append('key', guild_data.mt_key);
	formData.append('name', guild_data.mt_loginname);
	formData.append('type', 'json');
	formData.append('lang_s', lang_s);
	formData.append('lang_t', lang_t);
	const response_item = await axios.post(url + '/api/mt_standard/get/', formData);

	if (response_item.data.resultset.code == 0) {
		return sanitize.escape(response_item.data.resultset.result.list['0'].id);
	}

	return null;
}

// トークン取得
// return=false:失敗 true=成功
export async function getToken(guild_data) {
	if (guild_data.access_token_time == 0 || guild_data.access_token == '' || guild_data.access_token_time <= Number(Date.now())) {
		try {
			const response_item = await axios.post(url + '/oauth2/token.php', {
				grant_type: 'client_credentials',
				client_id: guild_data.mt_key, // API Key
				client_secret: guild_data.mt_secret, // API secret
				urlAccessToken: url + '/oauth2/token.php', // アクセストークン取得URI
			});

			if (response_item.status == 200) {
				const timer = new Date();
				timer.setSeconds(timer.getSeconds() + response_item.data.expires_in);
				await database.change_guild_token(guild_data.guild_id, response_item.data.access_token, Number(timer));
				return true;
			}

			return false;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	// 最初のIFに当てはまらないものは、既に認証済みで有効なTokenであるため、何もせずにtrue(成功)
	return true;
}
