import {Client} from 'discord.js';
import {
	Routes, MessageFlags, ChannelType, PermissionFlagsBits,
} from 'discord-api-types/v10';

export async function help(interaction) {
	let message = '';
	switch (interaction.locale) {
		case 'ja':
			message += '** -- 翻訳前の言語について -- **\n';
			message += '自動で言語を判定して翻訳を行います。\n';
			message += '** -- 翻訳後の言語について -- **\n';
			message += '何も設定しない場合は、ユーザーの環境の言語に翻訳を行います。\n';
			message += '元の言語がユーザーの言語と同じ場合は、翻訳をしません。\n';
			message += '** -- 翻訳モードを変更する場合について -- **\n';
			message += '`set-translation`コマンドを用いると、翻訳モードを指定できます。\n';
			message += 'モード名は、下記のリンクに載っている。モード名を指定してください。\n';
			break;
		case 'bg':
			message += '** -- Езикът преди превода -- **\n';
			message += 'Езикът се определя автоматично и се превежда.\n';
			message += '** -- Езикът след превода -- **\n';
			message += 'Ако не се наложи да се настроите нищо, то ще бъде преведено на езика на околната среда на потребителя.\n';
			message += 'Преводът не се извършва, ако оригиналният език е същият като езика на потребителя.\n';
			message += '** -- Ако искате да промените начина на превод -- **\n';
			message += 'Можете да изберете режима за превод, като използвате командването `set-translation`.\n';
			message += 'Можете да намерите името на модата в връзката по-долу.\n';
			break;
		case 'zh-CN':
			message += '** -- 关于翻译前的语言 -- **\n';
			message += '自动判断语言并进行翻译。\n';
			message += '** -- 关于翻译后的语言 -- **\n';
			message += '如果未进行任何设置，则将其转换为用户环境的语言。\n';
			message += '如果源语言与用户的语言相同，则不进行翻译。\n';
			message += '** -- 关于变更翻译模式的情况 -- **\n';
			message += '您可以使用`set-translation`命令来指定转换模式。\n';
			message += '模式名称可在以下链接中找到。请指定模式名称。\n';
			break;
		case 'zh-TW':
			message += '** -- 關於翻譯前的語言 -- **\n';
			message += '自動判斷語言並進行翻譯。\n';
			message += '** -- 關於翻譯後的語言 -- **\n';
			message += '如果未進行任何設置，則將其轉換為用戶環境的語言。\n';
			message += '如果源語言與用戶的語言相同，則不進行翻譯。\n';
			message += '** -- 關於變更翻譯模式的情況 -- **\n';
			message += '您可以使用`set-translation`命令來指定轉換模式。\n';
			message += '模式名稱可在以下鏈接中找到。請指定模式名稱。\n';
			break;
		case 'hr':
			message += '** -- Jezik prije prijevođenja -- **\n';
			message += 'To će automatski odrediti jezik i prevesti ga.\n';
			message += '** -- Jezik nakon prevoda -- **\n';
			message += 'Ako ništa ne postavljate, prevedite na jezik korisnika.\n';
			message += 'Ako je izvorni jezik isti kao jezik korisnika, ne može se prevesti.\n';
			message += '** -- Kako promijeniti način prijevođenja -- **\n';
			message += 'Možete odabrati način prijevođenja pomoću zapovijedi `set-translation`.\n';
			message += 'Naziv modela možete pronaći na linku ispod: Odaberite ime modela.\n';
			break;
		case 'cs':
			message += '** -- Jazyk před překladem -- **\n';
			message += 'Jazyk je automaticky přeložen.\n';
			message += '** -- Jazyk po překladu-- **\n';
			message += 'Pokud nic nenakládáte, přeložíme to do jazyka uživatele.\n';
			message += 'Pokud je původní jazyk stejný jako jazyk uživatele, není překládán.\n';
			message += '** -- Jak změnit způsob překladu -- **\n';
			message += 'Použijte příkaz `set-translation`, abyste mohli zvolit způsob překladu.\n';
			message += 'Název modu naleznete na níže uvedeném linku, prosím, zvolte název modu.\n';
			break;
		case 'da':
			message += '** -- Før oversættelse af sprog -- **\n';
			message += 'Det oversætter og oversætter automatisk.\n';
			message += '** -- Hvilket sprog skal oversættes. -- **\n';
			message += 'Hvis ikke, vil maskinen oversætte den til den fremmed sprog.\n';
			message += 'Det betyder, at det ikke er oversat, hvis det er det samme som brugeren.\n';
			message += '** -- Skifte oversættelse mode -- **\n';
			message += 'Hvis du bruger `set-translation`, kan du sætte en oversættelse mode.\n';
			message += 'Modenavnet kan blive fundet på skilt som følger. Giv mig modenavnet.\n';
			break;
		case 'nl':
			message += '** -- Over de taal voor vertaling -- **\n';
			message += 'Het controleert automatisch de taal en vertaalt.\n';
			message += '** -- Over de vertaling gesprek -- **\n';
			message += 'Zonder deze, vertaalt het in de taal die de gebruiker spreekt.\n';
			message += 'Er is geen vertaling wanneer de originele taal geïnformeerd wordt.\n';
			message += '** -- Omruilen van vertaling mode -- **\n';
			message += 'U kunt de bediening van de tolk uitleggen door de `set-translatie`.\n';
			message += 'De modaliteiten staan aangegeven op de onderkant. Specificeer de modaliteit.\n';
			break;
		case 'en-GB':
		case 'en-US':
			message += '** -- About the pre-translation language-- **\n';
			message += 'It automatically determines the language and translates.\n';
			message += '** -- About the translated language -- **\n';
			message += 'If nothing is set, the translation is done in the language of the user\'s environment.\n';
			message += 'If the source language is the same as the user\'s language, no translation is done.\n';
			message += '** -- Changing the translation mode -- **\n';
			message += 'The `Set Translation` command allows you to specify the translation mode.\n';
			message += 'The mode name can be found in the link below. Please specify the mode name.\n';
			break;
		case 'fi':
			message += '** -- Kieli ennen kääntämistä -- **\n';
			message += 'Kieli määritellään ja käännetään automaattisesti.\n';
			message += '** -- Kieli käännöksen jälkeen -- **\n';
			message += 'Jos mitään ei ole asennettu, kääntäminen tapahtuu käyttäjän ympäristön kielessä.\n';
			message += 'Jos alkuperäinen kieli on sama kuin käyttäjän kieli, se ei ole käännetty.\n';
			message += '** -- Jos haluat muuttaa käännöksen muotoa -- **\n';
			message += 'Voit valita käännöstyylin käyttämällä `set-translation` -komentoa.\n';
			message += 'Nimi on saatavilla alla olevassa linkissä.Voit valita mallin nimen.\n';
			break;
		case 'fr':
			message += '** -- A propos de la langue source -- **\n';
			message += 'La langue est automatiquement déterminée et traduite.\n';
			message += '** -- A propos de la langue cible -- **\n';
			message += 'Si ce n\'est pas le cas, traduisez dans la langue de l\'environnement de l\'utilisateur.\n';
			message += 'Si la langue d\'origine est la même que la langue de l\'utilisateur, aucune traduction n\'est effectuée.\n';
			message += '** -- À propos de la modification du mode de traduction -- **\n';
			message += 'Vous pouvez spécifier le mode de traduction à l\'aide de la commande `set-translation`.\n';
			message += 'Le nom du mode est répertorié dans le lien ci-dessous. Spécifiez un nom de mode.\n';
			break;
		case 'de':
			message += '** -- Ausgangssprache -- **\n';
			message += 'Die Sprache wird automatisch bestimmt und übersetzt.\n';
			message += '** -- Zielsprache -- **\n';
			message += 'Wenn nichts festgelegt ist, wird die Übersetzung in die Sprache der Benutzerumgebung durchgeführt.\n';
			message += 'Wenn die Ausgangssprache mit der Sprache des Benutzers identisch ist, wird keine Übersetzung durchgeführt.\n';
			message += '** -- Wann sollte der Übersetzungsmodus geändert werden? -- **\n';
			message += 'Mit dem Befehl `Set Translation` können Sie den Übersetzungsmodus festlegen.\n';
			message += 'Den Modusnamen finden Sie unter dem folgenden Link. Geben Sie einen Modusnamen an.\n';
			break;
		case 'el':
			message += '** -- Η γλώσσα πριν την μετάφραση -- **\n';
			message += 'Η γλώσσα θα καθοριστεί αυτόματα και θα μεταφραστεί.\n';
			message += '** -- Η γλώσσα μετά τη μετάφραση -- **\n';
			message += 'Εάν δεν θέλετε να ρυθμίσετε κάτι, θα πρέπει να μεταφραστεί στη γλώσσα του περιβάλλοντος του χρήστη.\n';
			message += 'Αν η γλώσσα της προέλευσης είναι η ίδια με τη γλώσσα του χρήστη, δεν θα μεταφραστεί.\n';
			message += '** -- Πως να αλλάξετε τη μεταφραστή -- **\n';
			message += 'Μπορείτε να επιλέξετε τη μορφή μετάφρασης χρησιμοποιώντας την εντολή `set-translation`.\n';
			message += 'παρακάτω σύνδεση: Επιλέξτε το όνομα της μορφής.\n';
			break;
		case 'hi':
			message += '** -- अनुवाद से पहले -- **\n';
			message += 'यह स्वचालित रूप से भाषा का न्याय करता है और अनुवाद करता है।\n';
			message += '** -- अनुवादित भाषा -- **\n';
			message += 'यदि आप कुछ भी सेट नहीं करते हैं, तो हम आपके वातावरण की भाषा में अनुवाद करेंगे।\n';
			message += 'यदि मूल भाषा उपयोगकर्ता की भाषा के समान है, तो इसका अनुवाद नहीं किया जाएगा।\n';
			message += '** -- अनुवाद मोड बदलने के बारे में -- **\n';
			message += 'अनुवाद मोड निर्दिष्ट करने के लिए `set-translation` कमांड का प्रयोग करें.\n';
			message += 'आप नीचे दिए गए लिंक पर मोड नाम पा सकते हैं।\n';
			break;
		case 'hu':
			message += '** -- Előző tolmács -- **\n';
			message += 'Automatikusan betűzi a nyelvet és fordítja el.\n';
			message += '** -- Fordító nyelv -- **\n';
			message += 'Ha nincs szükségem rá, akkor a szolgáltató féle nyelven fordítja át.\n';
			message += 'Nem fordítják el, ha a közvetlen szöveg ugyanabban a nyelven van.\n';
			message += '** -- Hogy váltsam be a fordítási rendszert? -- **\n';
			message += 'Az `set-translation` feliratot használja, hogy jelölje a fordítás stílusát.\n';
			message += 'A modell nevét a következő oldalon található. Szigorítsa a modellt.\n';
			break;
		case 'id':
			message += '** -- Tentang Bahasa sebelum terjemahan -- **\n';
			message += 'Terjemahan dilakukan dengan menilai bahasa secara otomatis.\n';
			message += '** -- Tentang bahasa yang diterjemahkan -- **\n';
			message += 'Jika tidak ada pengaturan, akan diterjemahkan ke dalam bahasa di lingkungan Anda.\n';
			message += 'Jika bahasa aslinya sama dengan bahasa Anda, jangan diterjemahkan.\n';
			message += '** -- Mengubah Mode Terjemahan -- **\n';
			message += 'Perintah `set-translation` memungkinkan Anda untuk menentukan mode terjemahan.\n';
			message += 'Nama mode dapat ditemukan pada link di bawah. Tentukan nama mode.\n';
			break;
		case 'it':
			message += '** -- Informazioni sulla lingua di partenza -- **\n';
			message += 'Valuta automaticamente la lingua ed esegue la traduzione.\n';
			message += '** -- Informazioni sulla lingua di destinazione -- **\n';
			message += 'Se non si specifica alcuna impostazione, la traduzione viene eseguita nella lingua dell\'ambiente.\n';
			message += 'Se la lingua originale è uguale a quella dell\'utente, la traduzione non viene eseguita.\n';
			message += '** -- Modifica della modalità di traduzione -- **\n';
			message += 'Il comando `set-translation` consente di specificare la modalità di traduzione.\n';
			message += 'Il nome della modalità è riportato nel seguente link. Specificare il nome della modalità.\n';
			break;
		case 'ko':
			message += '** -- 번역전 언어 정보 -- **\n';
			message += '자동으로 언어를 판정해서 번역을 해요.\n';
			message += '** -- 번역된 언어 정보 -- **\n';
			message += '아무 것도 설정하지 않으면 사용자의 환경 언어로 번역합니다.\n';
			message += '원래 언어가 사용자의 언어와 같은 경우에는 번역을 하지 않습니다.\n';
			message += '** -- 번역모드를 변경하는 경우에 대해서 -- **\n';
			message += 'Set Translation`명령을 사용하여 번역 모드를 지정할 수 있습니다.\n';
			message += '모드 이름은 아래 링크에 나와 있습니다. 모드 이름을 지정하십시오.\n';
			break;
		case 'lt':
			message += '** -- Kalba prieš vertimą -- **\n';
			message += 'Jis automatiškai nustato kalbą ir išvers.\n';
			message += '** -- Kalba po vertimo -- **\n';
			message += 'Jei nieko nenustatysite, vertimas bus atliekamas į naudotojo aplinkos kalbą.\n';
			message += 'Jei kilmės kalba yra ta pati, kaip naudotojo kalba, ji nebus išversta.\n';
			message += '** -- Kaip pakeisti vertimo būdą -- **\n';
			message += 'Galite pasirinkti vertimo režimą, naudojant `Set Translation` komandą.\n';
			message += 'Modelio pavadinimą galite rasti žemiau esančioje nuorodoje.\n';
			break;
		case 'no':
			message += '** -- Språket før oversettelsen -- **\n';
			message += 'Språket er automatisk definert og oversatt.\n';
			message += '** -- Språket etter oversettelsen -- **\n';
			message += 'Hvis du ikke setter opp noe, vil det bli oversatt til språket i brukernes miljø.\n';
			message += 'Hvis originalspråket er det samme som brukernes språk, vil det ikke bli oversatt.\n';
			message += '** -- Hvis du ønsker å endre oversettelsesmetoden -- **\n';
			message += 'Du kan velge oversettelsesmodus ved å bruke kommandoen `set-translation`.\n';
			message += 'Du kan finne navnet på modellen på linken nedenfor.\n';
			break;
		case 'pl':
			message += '** -- Do języka przed tłumaczeniem -- **\n';
			message += 'To automatyczne przetłumaczenie języka.\n';
			message += '** -- Sposób tłumaczy -- **\n';
			message += 'Bez żadnych zmian, system przetłumaczy go do języka użytkowego.\n';
			message += 'Nie ma głównego tłumaczenia, jeśli język własny jest taki sam jak język osobisty.\n';
			message += '** -- W przypadku zmiany modulu tłumaczy. -- **\n';
			message += 'Wykorzystanie z tego słowa `set-translation` pozwala nawet wyznaczyć pozycję tłumaczy.\n';
			message += 'Nazwa modemu znajduje się w następnym środku. Proszę wyznaczyć nazwę modemu.\n';
			break;
		case 'ro':
			message += '** -- Limba înainte de traducere -- **\n';
			message += 'Limbajul este stabilit automat pentru a fi tradus.\n';
			message += '** -- Limba după traducere -- **\n';
			message += 'În cazul în care nu aveți nevoie să configurați nimic, traducerea va fi efectuată în limba utilizatorului.\n';
			message += 'Dacă limba originală este aceeași cu cea a utilizatorului, traducerea nu va fi efectuată.\n';
			message += '** -- Când trebuie să schimbi modul de traducere -- **\n';
			message += 'Puteți selecta modul de traducere utilizând comanda `Set Translation`.\n';
			message += 'Numele modului poate fi găsit în link-ul de mai jos.\n';
			break;
		case 'ru':
			message += '** -- О языке до перевода -- **\n';
			message += 'Он автоматически определяет язык и выполняет перевод.\n';
			message += '** -- О языке после перевода -- **\n';
			message += 'В противном случае выполните перевод на язык вашей среды.\n';
			message += 'Если исходный язык совпадает с языком пользователя, перевод не выполняется.\n';
			message += '** -- Сведения об изменении режима преобразования -- **\n';
			message += 'Режим преобразования можно задать с помощью команды `Set Translation`.\n';
			message += 'Имя режима можно найти по ссылке ниже. Укажите имя режима.\n';
			break;
		case 'es-ES':
			message += '** -- Acerca del idioma de pretraducción -- **\n';
			message += 'Determina automáticamente el idioma y realiza la traducción.\n';
			message += '** -- Acerca del idioma de destino -- **\n';
			message += 'Si no lo hace, traduzca al idioma de su entorno.\n';
			message += 'Si el idioma original es el mismo que el idioma del usuario, no se realizará la traducción.\n';
			message += '** -- Cambio del modo de traducción -- **\n';
			message += 'El comando `Set Translation` permite especificar el modo de traducción.\n';
			message += 'Los nombres de modo se encuentran en el siguiente vínculo. Especifique un nombre de modo.\n';
			break;
		case 'sv-SE':
			message += '** -- Språket före översättningen -- **\n';
			message += 'Språket kommer automatiskt att bedömas och översättas.\n';
			message += '** -- Språket efter översättningen -- **\n';
			message += 'Om du inte ställer in något, översättas det till användarens språk.\n';
			message += 'Om det ursprungliga språket är detsamma som användarens språk, kommer det inte att översättas.\n';
			message += '** -- Om du vill ändra översättningsmetoden -- **\n';
			message += 'Du kan `set-translation` genom att använda kommandot Sätt översättning.\n';
			message += 'Namnet på modellen kan du hitta på länken nedanför.Visa namnet på modellen.\n';
			break;
		case 'th':
			message += '** -- เกี่ยวกับภาษาก่อนทำการแปล -- **\n';
			message += 'ภาษาจะถูกกำหนดและแปลโดยอัตโนมัติครับ\n';
			message += '** -- เกี่ยวกับภาษาเป้าหมาย -- **\n';
			message += 'ถ้าไม่ได้ตั้งค่าไว้ก็จะแปลเป็นภาษาของสิ่งแวดล้อมครับ\n';
			message += 'ถ้าภาษาต้นฉบับเหมือนกับภาษาของผู้ใช้ก็จะไม่มีการแปลครับ\n';
			message += '** -- เกี่ยวกับการเปลี่ยนโหมดการแปล -- **\n';
			message += 'ใช้คำสั่ง `set-translation` เพื่อระบุโหมดการแปล\n';
			message += 'ชื่อโหมดสามารถพบได้ที่ลิงค์ด้านล่างนี้โปรดระบุชื่อโหมด\n';
			break;
		case 'tr':
			message += '** -- Tercüme öncesi diller hakkında -- **\n';
			message += 'Otomatik olarak dil belirleyip çeviri yapar.\n';
			message += '** -- Tercüme edilmiş dil hakkında -- **\n';
			message += 'Eğer hiçbir şey kurmazsanız, kullanıcının çevresindeki dilde çeviri yapıyor.\n';
			message += 'Eğer orijinal dili kullanıcının diliğiyle aynıysa, tercüme yapılmaz.\n';
			message += '** -- Çeviri modasını değiştirmek ile ilgili durum -- **\n';
			message += '`set-translation` kumandasını kullanarak çevirme şeklini belirleyebilirsiniz.\n';
			message += 'Mode ismi aşağıdaki bağlantıda yer alıyor. Mode ismi belirleyin.\n';
			break;
		case 'uk':
			message += '** -- Про мову перед перекладом -- **\n';
			message += 'Він автоматично визначає мову і виконує переклад.\n';
			message += '** -- Про перекладену мову -- **\n';
			message += 'Якщо нічого не встановлено, ми перекладаємо на мову середовища користувача.\n';
			message += 'Якщо мова оригіналу така ж, як і мова користувача, переклад не виконується.\n';
			message += '** -- Про зміну режиму перекладу -- **\n';
			message += 'Ви можете вказати режим перекладу за допомогою команди `Set Translation`.\n';
			message += 'Ви можете знайти назву режиму за наступним посиланням: Вкажіть назву режиму.\n';
			break;
		case 'vi':
			message += '** -- Về ngôn ngữ của trước khi dịch -- **\n';
			message += 'Nó sẽ tự động phán đoán ngôn ngữ và tiến hành dịch.\n';
			message += '** -- Về ngôn ngữ sau khi dịch -- **\n';
			message += 'Nếu không cài đặt gì cả thì sẽ tiến hành dịch sang ngôn ngữ của môi trường người dùng.\n';
			message += 'Nếu ngôn ngữ gốc giống với ngôn ngữ của người sử dụng thì sẽ không dịch.\n';
			message += '** -- Trường hợp thay đổi chế độ dịch -- **\n';
			message += 'Lệnh `Set Translation` cho phép bạn xác định chế độ dịch.\n';
			message += 'Tên chế độ có thể được tìm thấy tại liên kết bên dưới. Chỉ định tên chế độ.\n';
			break;
	}

	message += 'minimum Page: https://github.com/link1345/textra-discord/blob/main/docs_lang.md\n';
	message += 'full Page: https://mt-auto-minhon-mlt.ucri.jgn-x.jp/content/mt/\n';
	interaction.editReply({content: message, flags: MessageFlags.Ephemeral});
}
