# textra-discord 

このリポジトリは、[みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/)を利用したテキスト翻訳DiscordBotです。

このBotを使用する際には、[みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/)のアカウント(WebAPIのAPIkeyとAPIsecretが必須)が必要です。

## みんなの自動翻訳@textra🄬 とは

[みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/)の詳細は、下記リンクの紹介を読んでください。

https://mt-auto-minhon-mlt.ucri.jgn-x.jp/

要約すると、日本の国立研究開発法人情報通信研究機構が開発した、文字の翻訳サービスです。

商用利用でなければ、無料で利用できます。

## Botの導入方法

導入方法は、2つあります。

* 開発者が用意したDiscordBotをギルドに招待して利用
* ソースコードを自分の環境で実行して利用する方法

### 開発者が用意したDiscordBotをギルドに招待して利用

下記リンクにアクセスして、DiscordBotをギルドに招待してください。

https://discord.com/api/oauth2/authorize?client_id=678939530031529995&permissions=277025429504&scope=bot

### ソースコードを自分の環境で実行して利用する方法

#### インストール

```
git clone https://github.com/link1345/textra-discord.git
cd textra-discord
npm install
```

#### 実行

```
npm run start
```

### 使用方法

#### 「guild-setting」コマンドの権限変更

guild-settingは、ギルド全体の設定です。これの設定を変更されてしまうと、翻訳機能が使えなくなります。
サーバー管理者以外が、変更できないようにしておくことが強くお勧めします。

#### Guildに対する設定

ここでは、[みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/)のアカウント情報を入力します。
入力しない場合、翻訳が使用できません。

[みんなの自動翻訳@textra🄬]( https://mt-auto-minhon-mlt.ucri.jgn-x.jp/)にアカウントを作成して、API KeyとAPI secret、ログインに用いるユーザー名を、Botの「guild-setting」コマンドを使い設定してください。

#### 翻訳してみる

翻訳してほしいコメントを右クリックで「アプリ」から「翻訳」というボタンをクリックすると翻訳を行います。

#### 翻訳を行う言語を変える

1. 通常(Auto)

変換元の言語を自動認識して、お使いの言語に変換してくれます。

2. 翻訳モード選択(「set-translation」コマンド)

https://github.com/link1345/textra-discord/blob/main/docs_lang.md

上記の一覧の翻訳モードを選択することで、翻訳を行ってくれます。

特許文章向けや対話向けなどあるので、興味があれば、選択することをお勧めします。