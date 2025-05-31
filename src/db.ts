import sqlite3 from 'sqlite3';
import sanitize from 'validator';

const db_path = './db/textra_db';

export async function create_db() {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database(db_path);

		db.serialize(() => {
			const setting_mode = 'Auto';

			db.each('SELECT * FROM sqlite_master WHERE TYPE = ? AND name = ?', ['table', 'user_mt_translation_mode'], (err, row) => {
				if (err) {
					// エラー処理
					db.close();
					resolve();
				} else {
					// SQLの実行結果が1件以上の場合
				}
			}, (err, count) => { // ←complete処理追加
				// SQL実行直後に上のコールバック処理が走る前にここが処理
				if (err) {
					// エラー処理
					db.close();
					resolve();
				} else if (count == 0) {
					// SQLの実行結果が0件の場合
					// user情報追加
					db.run('CREATE TABLE user_mt_translation_mode (user_id, translation_mode)');
				} else {
					// その他(基本的何もしない)
				}
			});
		});

		db.each('SELECT * FROM sqlite_master WHERE TYPE = ? AND name = ?', ['table', 'guild_setting'], (err, row) => {
			if (err) {
				// エラー処理
				db.close();
				resolve();
			} else {
				// SQLの実行結果が1件以上の場合
			}
		}, (err, count) => { // ←complete処理追加
			// SQL実行直後に上のコールバック処理が走る前にここが処理
			if (err) {
				// エラー処理
				db.close();
				resolve();
			} else if (count == 0) {
				// SQLの実行結果が0件の場合
				// user情報追加
				db.run('CREATE TABLE guild_setting (guild_id, mt_key, mt_secret, mt_loginname, access_token, access_token_time)');
			} else {
				// その他(基本的何もしない)
			}
		});
	});
}

// User_modeを変更する関数
// Auto=情報を消す [other]=登録or上書き
export async function change_user_mode(user_id, mode) {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database(db_path);

		db.serialize(() => {
			if (mode == 'Auto') {
				db.run('DELETE FROM user_mt_translation_mode WHERE user_id = ?', user_id, err => {
					if (err) {
						return console.error(err.message);
					}
				});

				db.close();
				resolve();
				return;
			}

			db.each('SELECT * FROM user_mt_translation_mode WHERE user_id = ?', [user_id], (err, row) => {
				if (err) {
					// エラー処理
					return console.error(err.message);
					db.close();
					resolve();
				}

				// SQLの実行結果が1件以上の場合
				console.log(row.user_id + ':' + row.translation_mode + ' > ' + mode);
				db.run('UPDATE user_mt_translation_mode SET translation_mode = ? WHERE user_id = ?', [mode, user_id], err => {
					if (err) {
						return console.error(err.message);
					}

					db.close();
					resolve();
				});
			}, (err, count) => { // ←complete処理追加
				// SQL実行直後に上のコールバック処理が走る前にここが処理
				if (err) {
					// エラー処理
					db.close();
					resolve();
				} else if (count == 0) {
					// SQLの実行結果が0件の場合
					// user情報追加
					const stmt = db.prepare('INSERT INTO user_mt_translation_mode VALUES(?,?)');
					stmt.run([user_id, mode]);
					stmt.finalize();
					db.close();
					resolve();
				} else {
					// その他(基本的何もしない)
				}
			});
		});
	});
}

// 翻訳モードが設定されているかチェックする関数
// return=設定値
export async function check_user_mt_translation_mode(user_id) {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database(db_path);

		db.serialize(() => {
			let setting_mode = 'Auto';

			db.each('SELECT * FROM user_mt_translation_mode WHERE user_id = ?', [user_id], (err, row) => {
				if (err) {
					// エラー処理
					db.close();
					resolve(setting_mode);
				} else {
					// SQLの実行結果が1件以上の場合
					setting_mode = row.translation_mode;
					db.close();
					resolve(setting_mode);
				}
			}, (err, count) => { // ←complete処理追加
				// SQL実行直後に上のコールバック処理が走る前にここが処理
				if (err) {
					// エラー処理
					db.close();
					resolve(setting_mode);
				} else if (count == 0) {
					// SQLの実行結果が0件の場合
					// user情報追加
					setting_mode = 'Auto';
					db.close();
					resolve(setting_mode);
				} else {
					// その他(基本的何もしない)
				}
			});
		});
	});
}

// Guild設定を行う関数
export async function change_guild_setting(guild_id, mt_key, mt_secret, mt_loginname) {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database(db_path);

		db.serialize(() => {
			db.each('SELECT * FROM guild_setting WHERE guild_id = ?', [guild_id], (err, row) => {
				if (err) {
					// エラー処理
					db.close();
					resolve();
				} else {
					// SQLの実行結果が1件以上の場合
					db.run('UPDATE guild_setting SET mt_key = ?, mt_secret = ?, mt_loginname = ? WHERE guild_id = ?', [mt_key, mt_secret, mt_loginname, guild_id], err => {
						if (err) {
							return console.error(err.message);
						}

						db.close();
						resolve();
					});
				}
			}, (err, count) => { // ←complete処理追加
				// SQL実行直後に上のコールバック処理が走る前にここが処理
				if (err) {
					// エラー処理
					db.close();
					resolve();
				} else if (count == 0) {
					// SQLの実行結果が0件の場合
					// user情報追加
					const stmt = db.prepare('INSERT INTO guild_setting VALUES(?,?,?,?,?,?)');
					stmt.run([guild_id, mt_key, mt_secret, mt_loginname, '', 0]);
					stmt.finalize();

					db.close();
					resolve();
				} else {
					// その他(基本的何もしない)
				}
			});
		});
	});
}

export async function change_guild_token(guild_id, access_token, access_token_time) {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database(db_path);

		db.serialize(() => {
			db.each('SELECT * FROM guild_setting WHERE guild_id = ?', [guild_id], (err, row) => {
				if (err) {
					// エラー処理
					db.close();
					resolve();
				} else {
					// SQLの実行結果が1件以上の場合
					db.run('UPDATE guild_setting SET access_token = ?, access_token_time = ? WHERE guild_id = ?', [access_token, access_token_time, guild_id], err => {
						if (err) {
							return console.error(err.message);
						}

						db.close();
						resolve();
					});
				}
			}, (err, count) => { // ←complete処理追加
				// SQL実行直後に上のコールバック処理が走る前にここが処理
				if (err) {
					// エラー処理
					db.close();
					resolve();
				} else if (count == 0) {
					// SQLの実行結果が0件の場合
					db.close();
					resolve();
				} else {
					// その他(基本的何もしない)
				}
			});
		});
	});
}

// Guild設定が行われているかチェックする関数
export async function check_guild_setting(guild_id) {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database(db_path);

		db.serialize(() => {
			let hit_flag = false;
			let return_item = [];
			db.each('SELECT * FROM guild_setting WHERE guild_id = ?', [guild_id], (err, row) => {
				if (err) {
					// エラー処理
					console.log(err);
					db.close();
					resolve({ hit: hit_flag, return_item });
				} else {
					// SQLの実行結果が1件以上の場合
					hit_flag = true;
					return_item = {
						guild_id: row.guild_id, mt_key: row.mt_key, mt_secret: row.mt_secret, mt_loginname: row.mt_loginname, access_token: row.access_token, access_token_time: row.access_token_time,
					};

					db.close();
					resolve({ hit: hit_flag, return_item });
				}
			}, (err, count) => { // ←complete処理追加
				// SQL実行直後に上のコールバック処理が走る前にここが処理
				if (err) {
					// エラー処理
					console.log(err);
					db.close();
					resolve({ hit: hit_flag, return_item });
				} else if (count == 0) {
					// SQLの実行結果が0件の場合
					// user情報追加
					hit_flag = false;
					return_item = [];

					db.close();
					resolve({ hit: hit_flag, return_item });
				} else {
					// その他(基本的何もしない)
				}
			});
		});
	});
}

export async function delete_guild_setting(guild_id) {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database(db_path);

		db.serialize(() => {
			db.each('SELECT * FROM guild_setting WHERE guild_id = ?', [guild_id], (err, row) => {
				if (err) {
					// エラー処理
					console.log(err);
					db.close();
					resolve(false);
				} else {
					// SQLの実行結果が1件以上の場合
					db.run('DELETE FROM guild_setting WHERE guild_id = ?', guild_id, err => {
						if (err) {
							console.error(err.message);
							db.close();
							resolve(false);
						}
					});

					db.close();
					resolve(true);
				}
			}, (err, count) => { // ←complete処理追加
				// SQL実行直後に上のコールバック処理が走る前にここが処理
				if (err) {
					// エラー処理
					console.log(err);
					db.close();
					resolve(false);
				} else if (count == 0) {
					// SQLの実行結果が0件の場合
					// user情報追加
					hit_flag = false;
					return_item = [];

					db.close();
					resolve(false);
				} else {
					// その他(基本的何もしない)
				}
			});
		});
	});
}
