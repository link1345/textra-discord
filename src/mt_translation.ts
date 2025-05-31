import sanitize from 'validator';
import { GuildSetting, changeGuildToken } from './db.js';

const url = 'https://mt-auto-minhon-mlt.ucri.jgn-x.jp'; // 基底URL (https://xxx.jpまでを入力)

const apiName = 'mt'; // API名 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"mt")
export async function call(guild: GuildSetting, text: string, apiParam: string) {
	// トークンを貰ってくる
	if (!(await getToken(guild))) {
		return undefined;
	}
	const formData = new FormData();
	formData.append("access_token", guild["accessToken"]);
	formData.append("key", guild["mtKey"]);
	formData.append("api_name", apiName);
	formData.append("api_param", apiParam);
	formData.append("name", guild["mtLoginname"]);
	formData.append("type", "json");
	formData.append("text", text);

	const response = await fetch(url + '/api/', {
		method: 'POST',
		body: formData,
	});

	if (response.ok) {
		const json = await response.json();
		return (json as {
			resultset: { result: { text: string } }
		}).resultset.result.text;
	}

	return undefined;
}

export async function callLangdetect(guild: GuildSetting, text: string) {
	// トークンを貰ってくる
	if (!(await getToken(guild))) {
		return undefined;
	}

	const formData = new FormData();
	formData.append("access_token", guild["accessToken"]);
	formData.append("key", guild["mtKey"]);
	formData.append("name", guild["mtLoginname"]);
	formData.append("type", "json");
	formData.append("text", text);

	const response = await fetch(url + '/api/langdetect/', {
		method: 'POST',
		body: formData,
	});

	// Return sanitize.escape(response_item.data['resultset']['result']['langdetect']['1']['lang']);
	if (response.ok) {
		const json = await response.json();
		const result = json as
			{ resultset: { result: { langdetect: { lang: string }[] } } };

		const item = result.resultset.result.langdetect[0].lang;
		return sanitize.escape(item);
	}

	return undefined;
}

export async function callStandard(guild: GuildSetting, langS: string, langT: string) {
	// トークンを貰ってくる
	if (!(await getToken(guild))) {
		return undefined;
	}

	const formData = new FormData();
	formData.append("access_token", guild["accessToken"]);
	formData.append("key", guild["mtKey"]);
	formData.append("name", guild["mtLoginname"]);
	formData.append("type", "json");
	formData.append("lang_s", langS);
	formData.append("lang_t", langT);

	const response = await fetch(url + '/api/mt_standard/get/', {
		method: 'POST',
		body: formData,
	});

	if (response.ok) {
		const json = await response.json();
		const result = json as {
			resultset: { result: { list: { id: string }[] } }
		};
		return result.resultset.result.list[0].id;
	}

	return undefined;
}

// トークン取得
// return=false:失敗 true=成功
export async function getToken(guild: GuildSetting) {
	if (guild.accessTokenTime === 0 || guild.accessToken === '' || guild.accessTokenTime <= Number(Date.now())) {
		try {
			const form_token_endpoint = new FormData();
			form_token_endpoint.append("grant_type", "client_credentials");
			/** Set API Key */
			form_token_endpoint.append("client_id", guild.mtKey);
			/** Set API secret */
			form_token_endpoint.append("client_secret", guild.mtSecret);
			/** Set Access token url */
			form_token_endpoint.append("urlAccessToken", url + "/oauth2/token.php");

			const response = await fetch(url + "/oauth2/token.php", {
				method: "POST",
				body: form_token_endpoint,
			});
			if (response.ok) {
				const timer = new Date();
				const body = await response.json() as { expires_in: number, access_token: string, };

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
