# textra-discord 

このリポジトリは、[みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/)を利用したテキスト翻訳DiscordBotです。

このBotを使用する際には、[みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/)のアカウント(WebAPIのAPIkeyとAPIsecretが必須)が必要です。

---

【 Everyone's automatic translation @textra🄬 】 => 「みんなの自動翻訳@textra🄬」

This repository is a text translation DiscordBot using [みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/).

To use this bot, you will need an account for [みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/) (WebAPI APIkey and APIsecret are required).

## みんなの自動翻訳@textra🄬 とは (What is みんなの自動翻訳@textra🄬 )

[みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/)の詳細は、下記リンクの紹介を読んでください。

https://mt-auto-minhon-mlt.ucri.jgn-x.jp/

要約すると、日本の国立研究開発法人情報通信研究機構が開発した、文字の翻訳サービスです。

商用利用でなければ、無料で利用できます。

---

For more information about [みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/), please read the introduction in the link below.

https://mt-auto-minhon-mlt.ucri.jgn-x.jp/

To summarize, it is a text translation service developed by the National Institute of Information and Communications Technology, a Japanese national research and development agency.
It can be used for free for non-commercial use.

## Botの導入方法 (How to install a bot)

導入方法は、2つあります。

* 開発者が用意したDiscordBotをギルドに招待して利用
* ソースコードを自分の環境で実行して利用する方法

---

There are two installation methods.

* Invite and use DiscordBot prepared by the developer to the guild
* How to run and use the source code in your own environment

### 開発者が用意したDiscordBotをギルドに招待して利用 (Invite and use DiscordBot prepared by the developer to the guild)

下記リンクにアクセスして、DiscordBotをギルドに招待してください。

https://discord.com/api/oauth2/authorize?client_id=678939530031529995&permissions=277025429504&scope=bot

---

Please visit the link below and invite DiscordBot to your guild.

https://discord.com/api/oauth2/authorize?client_id=678939530031529995&permissions=277025429504&scope=bot

### ソースコードを自分の環境で実行して利用する方法 (How to run and use the source code in your own environment)

#### Install

```
git clone https://github.com/link1345/textra-discord.git
cd textra-discord
npm install
```

#### RUN

```
npm run start
```

### 使用方法 (how to use)

#### 「guild-setting」コマンドの権限変更 (Change permissions for "guild-setting" command)

guild-settingは、ギルド全体の設定です。これの設定を変更されてしまうと、翻訳機能が使えなくなります。

サーバー管理者以外が、変更できないようにしておくことが強くお勧めします。

---

guild-setting is a guild-wide setting. If you change this setting, you will no longer be able to use the translation function.

It is strongly recommended that no one other than the server administrator make changes.

#### Guildに対する設定 (Settings for Guild)

ここでは、[みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/)のアカウント情報を入力します。

入力しない場合、翻訳が使用できません。

[みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/)にアカウントを作成して、API KeyとAPI secret、ログインに用いるユーザー名を、Botの「guild-setting」コマンドを使い設定してください。

---

Here, enter the account information for [みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/).

If not entered, the translation will not be available.

Create an account at [みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/), enter your API Key, API secret, and username for login. Please use the bot's "guild-setting" command to set it.

#### 翻訳してみる (Try translating it)

翻訳してほしいコメントを右クリックで「アプリ」から「翻訳」というボタンをクリックすると翻訳を行います。

---

Right-click the comment you want translated and click the "Translate" button from "App" to translate it.

#### 翻訳を行う言語を変える (Change the language for translation)

1. 通常(Auto)

変換元の言語を自動認識して、お使いの言語に変換してくれます。

---

Right-click the comment you want translated and click the "Translate" button from "App" to translate it.

2. 翻訳モード選択(「set-translation」コマンド) : Translation mode selection (“set-translation” command)

https://github.com/link1345/textra-discord/blob/main/docs_lang.md

上記の一覧の翻訳モードを選択することで、翻訳を行ってくれます。

特許文章向けや対話向けなどあるので、興味があれば、選択することをお勧めします。

---

1. Normal (Auto)

It automatically recognizes the source language and converts it to your language.

2. Translation mode selection (“set-translation” command)

https://github.com/link1345/textra-discord/blob/main/docs_lang.md

Translation will be performed by selecting the translation mode from the list above.

There are versions for patent writing and dialogue, so if you are interested, we recommend choosing one.


## LICENSE

このソースコードは、MIT LICENSEですが、Botを使用する上で、[みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/)のライセンスを遵守してください。

このソースコードを使って収入を得ることは可能ですが、Botを使用する際、[みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/)のライセンスの関係上、Botを商用利用で使用することは出来ません。

---

This source code is MIT LICENSE, but in order to use the bot, you must obtain the license from [みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/). Please comply.

It is possible to earn income using this source code, but when using the bot, [みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/), the bot cannot be used for commercial purposes due to the license.