import sanitize from 'validator';
import {GuildSetting, changeGuildToken} from './db.js';

const url = 'https://mt-auto-minhon-mlt.ucri.jgn-x.jp'; // 基底URL (https://xxx.jpまでを入力)

const apiName = 'mt'; // API名 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"mt")
export async function call(guild: GuildSetting, text: string, apiParam: string) {
	// トークンを貰ってくる
	if (!(await getToken(guild))) {
		return null;
	}

	const response = await fetch(url + '/api/', {
		method: 'POST',
		body: JSON.stringify({
			access_token: guild.accessToken,
			key: guild.mtKey,
			api_name: apiName,
			api_param: apiParam,
			name: guild.mtLoginname,
			type: 'json',
			text,
		}),
	});

	if (response.ok) {
		return ((await response.json()) as {
			data: {
				resultset: {result: {text: string}}
			}
		}).data.resultset.result.text;
	}

	return undefined;
}

export async function callLangdetect(guild: GuildSetting, text: string) {
	// トークンを貰ってくる
	if (!(await getToken(guild))) {
		return undefined;
	}

	const response = await fetch(url + '/api/langdetect/', {
		method: 'POST',
		body: JSON.stringify({
			access_token: guild.accessToken,
			key: guild.mtKey,
			name: guild.mtLoginname,
			type: 'json',
			text,
		}),
	});

	// Return sanitize.escape(response_item.data['resultset']['result']['langdetect']['1']['lang']);
	if (response.ok) {
		const json = (await response.json()) as
			{data: {resultset: {result: {langdetect: {lang: string}[]}}}};

		const item = json.data.resultset.result.langdetect['1'].lang;
		return sanitize.escape(item);
	}

	return undefined;
}

export async function callStandard(guild: GuildSetting, langS: string, langT: string) {
	// トークンを貰ってくる
	if (!(await getToken(guild))) {
		return undefined;
	}

	const response = await fetch(url + '/api/mt_standard/get/', {
		method: 'POST',
		body: JSON.stringify({
			access_token: guild.accessToken,
			key: guild.mtKey,
			name: guild.mtLoginname,
			type: 'json',
			langS,
			langT,
		}),
	});

	if (response.ok) {
		const json = (await response.json()) as {
			data: {resultset: {result: {list: {id: string}[]}}}
		};
		return json.data.resultset.result.list['0'].id;
	}

	return undefined;
}

// トークン取得
// return=false:失敗 true=成功
export async function getToken(guild: GuildSetting) {
	if (guild.accessTokenTime === 0 || guild.accessToken === '' || guild.accessTokenTime <= Number(Date.now())) {
		try {
			const response = await fetch(url + '/oauth2/token.php', {
				method: 'POST',
				body: JSON.stringify({
					grant_type: 'client_credentials',
					client_id: guild.mtKey, // API Key
					client_secret: guild.mtSecret, // API secret
					urlAccessToken: url + '/oauth2/token.php', // アクセストークン取得URI
				}),
			});
			if (response.ok) {
				const timer = new Date();
				const body = await response.json() as {expires_in: number, access_token: string,};

				timer.setSeconds(timer.getSeconds() + body.expires_in);
				await changeGuildToken(guild.guildId, body.access_token, timer.getTime().toString());
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
