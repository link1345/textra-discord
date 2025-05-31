import { DatabaseSync } from 'node:sqlite';
import sanitize from 'validator';

const dbPath = './db/textra_db';
const db = new DatabaseSync(dbPath);

export type GuildSetting = {
	guildId: string,
	mtKey: string,
	mtSecret: string,
	mtLoginname: string,
	accessToken: string,
	accessTokenTime: number,
};

class DatabaseError extends Error {
}

/**
 * DBテーブルを作成します
 * @returns false = error
 */
export function createDb(): undefined | DatabaseError {
	try {
		db.open();

		// user_mt_translation_modeテーブルを作成。
		const select = db.prepare('SELECT * FROM sqlite_master WHERE TYPE = ? AND name = ?');
		const TableMt = select.all('table', 'user_mt_translation_mode');
		if (TableMt.length === 0) {
			const tableCreate = db.prepare('CREATE TABLE user_mt_translation_mode (user_id, translation_mode)');
			tableCreate.run();
		}

		// guild_settingテーブルを作成。
		const tableGuild = select.all('table', 'guild_setting');
		if (tableGuild.length === 0) {
			const tableCreate = db.prepare('CREATE TABLE guild_setting (guild_id, mt_key, mt_secret, mt_loginname, access_token, access_token_time)');
			tableCreate.run();
		}

		db.close();

		return;
	} catch (error) {
		console.error(error);
		return new DatabaseError();
	}
}

/**
 * ユーザーの翻訳モードを変更する
 * Auto=情報を消す [other]=登録or上書き
 * @param userId 
 * @param mode 
 * @returns 
 */
export function changeUserMode(userId: string, mode: string): string | DatabaseError {
	try {
		db.open();

		// 情報を消すモード(Auto)
		if (mode === 'Auto') {
			const rowDelete = db.prepare('DELETE FROM user_mt_translation_mode WHERE user_id = ?');
			rowDelete.run(userId);
			db.close();
			return mode;
		}

		// 上書き
		const rowSelect = db.prepare('SELECT * FROM user_mt_translation_mode WHERE user_id = ?');
		const translationMode = rowSelect.all(userId);

		if (translationMode.length !== 0) {
			const rowUpdate = db.prepare('UPDATE user_mt_translation_mode SET translation_mode = ? WHERE user_id = ?');
			rowUpdate.run(mode, userId);
			db.close();
			return mode;
		}

		// 新規登録
		const rowUpdate = db.prepare('INSERT INTO user_mt_translation_mode VALUES(?,?)');
		rowUpdate.run(mode, userId);
		db.close();
		return mode;

	} catch (error) {
		console.error(error);
		return new DatabaseError();
	}
}

/**
 * 翻訳モードが設定されているかチェックする関数
 * @returns 設定値
 */
export async function checkUserMtTranslationMode(userId: string) {
	try {
		db.open();

		let mode = "Auto";

		const rowSelect = db.prepare('SELECT * FROM user_mt_translation_mode WHERE user_id = ?');
		const items = rowSelect.all(userId);

		if (items.length !== 0) {
			mode = items[0]['translation_mode']?.toString() ?? "Auto";
		}

		db.close();
		return mode;
	} catch (error) {
		console.error(error);
		return new DatabaseError();
	}
}

/**
 * Guild設定を行う関数
 */
export function changeGuildSetting(guildItem: { guildId: string, mtKey: string, mtSecret: string, mtLoginname: string }): undefined | DatabaseError {
	const { guildId, mtKey, mtSecret, mtLoginname } = guildItem;
	try {
		db.open();

		const rowSelect = db.prepare('SELECT * FROM guild_setting WHERE guild_id = ?');
		const items = rowSelect.all(guildId);

		if (items.length !== 0) {
			const rowUpdate = db.prepare('UPDATE guild_setting SET mt_key = ?, mt_secret = ?, mt_loginname = ? WHERE guild_id = ?');
			rowUpdate.run(mtKey, mtSecret, mtLoginname, guildId);
		} else {
			const rowInsert = db.prepare('INSERT INTO guild_setting VALUES(?,?,?,?,?,?)');
			rowInsert.run(guildId, mtKey, mtSecret, mtLoginname, '', 0)
		}
		db.close();
		return;
	} catch (error) {
		console.error(error);
		return new DatabaseError();
	}
}

/**
 * ギルドトークンを変える
 */
export function changeGuildToken(guildId: string, accessToken: string, accessTokenTime: string): undefined | DatabaseError {
	try {
		db.open();

		const rowSelect = db.prepare('SELECT * FROM guild_setting WHERE guild_id = ?');
		const items = rowSelect.all(guildId);

		if (items.length !== 0) {
			const rowUpdate = db.prepare('UPDATE guild_setting SET access_token = ?, access_token_time = ? WHERE guild_id = ?');
			rowUpdate.run(accessToken, accessTokenTime, guildId);
		}

		db.close();
		return;
	} catch (error) {
		console.error(error);
		return new DatabaseError();
	}
}

/**
 * Guild設定の取得関数
 * @return ギルドに紐づけられている情報, undefinedならば何も設定されていない
 */
export function getGuildSetting(guildId: string): undefined | GuildSetting | DatabaseError {
	try {
		db.open();

		const rowSelect = db.prepare('SELECT * FROM guild_setting WHERE guild_id = ?');
		const tablesItems = rowSelect.all(guildId);

		let items: GuildSetting | undefined = undefined;
		if (tablesItems.length !== 0) {
			const item = tablesItems[0];
			items = {
				guildId: item.guild_id?.toString() ?? "",
				mtKey: item.mt_key?.toString() ?? "",
				mtSecret: item.mt_secret?.toString() ?? "",
				mtLoginname: item.mt_loginname?.toString() ?? "",
				accessToken: item.access_token?.toString() ?? "",
				accessTokenTime: Number(item.access_token_time?.toString()) ?? 0
			}
		}
		if (!items ||
			items.accessToken === "" &&
			items.mtKey === "" &&
			items.mtSecret === "" &&
			items.mtLoginname === "" &&
			items.accessToken === ""
		) {
			items = undefined;
			return;
		}

		db.close();
		return items;
	} catch (error) {
		console.error(error);
		return new DatabaseError();
	}
}

/**
 * ギルド情報の削除
 */
export function deleteGuildSetting(guildId: string): undefined | DatabaseError {
	try {
		db.open();

		const rowSelect = db.prepare('SELECT * FROM guild_setting WHERE guild_id = ?');
		const tablesItems = rowSelect.all(guildId);

		if (tablesItems.length !== 0) {
			const rowDelete = db.prepare('DELETE FROM guild_setting WHERE guild_id = ?');
			rowDelete.run(guildId);
		}

		db.close();
		return;
	} catch (error) {
		console.error(error);
		return new DatabaseError();
	}
}
