'use strict';
const CATEGORIES=['Электрика','Освещение','Стены','Полы','Санузлы','Потолки','Двери','Инструменты','Прочее'];
const STATUSES=['Уточнить','Запланировано','В корзине','Куплено'];
const STAGES=['Электрика','Стены и обои','Полы','Санузлы','Потолки и освещение','Двери и завершение'];
function inferStage(i){
  if(i.category==='Инструменты'){
    if(['ozon-202610-tilecutter-400','ozon-202610-mixer-sds'].includes(i.id))return 'Санузлы';
    return 'Электрика';
  }
  return ({'Электрика':'Электрика','Стены':'Стены и обои','Полы':'Полы','Санузлы':'Санузлы','Потолки':'Потолки и освещение','Освещение':'Потолки и освещение','Двери':'Двери и завершение','Прочее':'Двери и завершение'})[i.category]||'Двери и завершение';
}

const KEY='remont-haty-v1', BACKUP=KEY+'-before-import';
const money=new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:2});
const number=new Intl.NumberFormat('ru-RU',{maximumFractionDigits:3});
let seq=0;
function seed(category,name,spec,quantity,unit,price,kind='material',url='',quantityApprox=false){return {id:'initial-'+(++seq),category,name,spec,quantity,unit,price,kind,url,quantityApprox,priceApprox:price!==null,status:'Уточнить'};}
function baseInitial(){seq=0;return {version:1,updatedAt:new Date().toISOString(),items:[
seed('Электрика','Кабель ВВГнг(А)-LS 3×1,5 мм²','Освещение. 100 ₽/м — предварительный ориентир владельца. Длины после трассировки.',null,'м',100),
seed('Электрика','Кабель ВВГнг(А)-LS 3×2,5 мм²','Розетки и отдельные потребители. Сечение и прокладку согласовать с электриком.',null,'м',140,'material','https://e-kc.ru/cena/cable-vvgng-ls-3-2_5'),
seed('Электрика','Кабель ВВГнг(А)-LS 3×4 мм²','Предварительно для духовки ~4 кВт; по паспорту и расчёту.',null,'м',230),
seed('Электрика','Кабель ВВГнг(А)-LS 3×6 мм²','Предварительно для варочной ~7 кВт; по паспорту и расчёту.',null,'м',300),
seed('Электрика','Корпус электрощита','Около 20 линий. Вместимость после схемы, с резервом; ориентир 54–72 модуля.',1,'шт.',7000),
seed('Электрика','Автоматы групп','Номиналы и отключающая способность после проверки ввода и расчёта. Количество пока не задано.',null,'шт.',450),
seed('Электрика','УЗО / дифавтоматы','Архитектура щита не утверждена. Цена условная на один аппарат; тип по нагрузкам.',null,'шт.',2800),
seed('Электрика','Реле напряжения','Однофазность и параметры ввода подтвердить.',1,'шт.',4700),
seed('Электрика','Розетки 230 В','С заземлением. Количество по плану мебели; рамки отдельно.',null,'шт.',450),
seed('Электрика','Выключатели','Одно- и двухклавишные. Количество по плану света.',null,'шт.',400),
seed('Электрика','Рамки','Число постов по раскладке; не считать каждое гнездо отдельной рамкой.',null,'шт.',180),
seed('Электрика','Подрозетники','Тип и глубина по стенам и соединениям.',null,'шт.',70),
seed('Электрика','Интернет-кабель Cat.6','Медь Cu, Solid, 4 пары. Отдельные линии к комнатам; длины после замеров.',null,'м',80),
seed('Электрика','Подключение и проверка электрики','Своими силами — подготовка и прокладка после согласования. Электрик: щит, соединения, измерения. Запросить смету.',null,'комплект',null,'labor'),
seed('Освещение','COB-лента для спальни','24 В, 3000 K, CRI ≥90, 800–1000 лм/м. Две линии по 3 м, без закупочного запаса.',6,'м',700),
seed('Освещение','Встраиваемый алюминиевый профиль','Для натяжного потолка, совместимый с лентой; две линии по 3 м. Цена без рассеивателя.',6,'м',1200),
seed('Освещение','Рассеиватель','Под выбранный профиль. Если входит в комплект профиля, удалить эту строку.',6,'м',250),
seed('Освещение','Блок питания 24 В','Мощность после выбора ленты с требуемым запасом; доступное место для обслуживания.',1,'шт.',3000),
seed('Освещение','Диммер для ленты 24 В','Совместимость с блоком питания, ток и схема управления после выбора комплекта.',1,'шт.',2500),
seed('Освещение','Монтаж световых линий спальни','Две линии по 3 м. Уточнить, что включено у потолочников, чтобы не считать монтаж дважды.',6,'м',1200,'labor'),
seed('Освещение','Остальные светильники','Световой план остальных помещений ещё не выбран.',null,'шт.',null),
seed('Стены','Обои','Основная отделка. Рулон 1,06×10 м как ориентир; подрезка и раппорт после выбора.',null,'рулон',2500),
seed('Стены','Грунтовка под обои','Тип под основание и клей; расход по инструкции после замеров.',null,'л',180),
seed('Стены','Клей для обоев','По типу полотна и площади, расход по упаковке.',null,'уп.',650),
seed('Стены','Финишная шпаклёвка','Только по состоянию предчистовой поверхности.',null,'кг',60),
seed('Стены','Подготовка и оклейка стен','Планируется своими руками; оплачиваемую площадь заполнить, если привлекается мастер.',null,'м²',0,'labor'),
seed('Полы','Линолеум','Класс и защитный слой по нагрузке. Раскрой по комнатам и ширине рулона; 90 м² не равно площади покрытия.',null,'м²',1100),
seed('Полы','Клей для сплошного приклеивания','Для выбранного покрытия и основания. Расход по инструкции.',null,'кг',500),
seed('Полы','Холодная сварка стыков','Тип под выбранный линолеум и шов. Длина стыков пока неизвестна.',null,'тюбик',650),
seed('Полы','Плинтус','Периметры за вычетом проёмов после замеров.',null,'м',250),
seed('Полы','Выравнивающая смесь','Нужность и толщина слоя после проверки основания.',null,'мешок',800),
seed('Полы','Укладка линолеума','Планируется своими руками. Беспороговую укладку согласовать по раскрою и требованиям покрытия.',null,'м²',0,'labor'),
seed('Санузлы','Нагревательный мат','150 Вт/м². Свободная площадь основного санузла примерно 3,5–4 м²; размер комплекта после раскладки.',null,'м²',3000,'material','https://electrical.ru/product/49120-teplyy-pol-mat-nagrevatelnyy-step-balance-sbm150040-150-vtm2-600-vt-4-m2-6367236',true),
seed('Санузлы','Программируемый терморегулятор','С датчиком пола, совместимый с матом; наличие датчика в комплекте проверить.',1,'шт.',4000),
seed('Санузлы','Плитка / керамогранит','Пол и стены двух санузлов. Площадь, формат и запас после раскладки.',null,'м²',1800),
seed('Санузлы','Плиточный клей','Класс по плитке, основанию и тёплому полу.',null,'мешок',1000),
seed('Санузлы','Обмазочная гидроизоляция','Расход по системе и количеству слоёв; площадь после замеров.',null,'кг',500),
seed('Санузлы','Гидроизоляционная лента','Примыкания и углы; длина после замеров.',null,'м',250),
seed('Санузлы','Затирка','Тип и расход по ширине шва и формату плитки.',null,'кг',900),
seed('Санузлы','Сантехника и смесители','Ванна, унитазы, раковины, смесители, сифоны. Разбить на позиции после выбора моделей.',null,'комплект',null),
seed('Санузлы','Монтаж и подключение тёплого пола','Состав работ и измерения согласовать с мастером.',null,'комплект',null,'labor'),
seed('Потолки','Полотно натяжного потолка','Площадь по комнатам. Только материал; если предложение под ключ, удалить дублирующие строки.',null,'м²',450),
seed('Потолки','Профиль, закладные, комплектующие','По периметрам и световому плану.',null,'комплект',null),
seed('Потолки','Монтаж натяжного потолка','Уточнить состав предложения. Световые линии отдельно учтены в освещении.',null,'м²',450,'labor'),
seed('Двери','Дверной блок','Полотно, коробка, наличники. Количество и размеры после замеров проёмов.',null,'комплект',15000),
seed('Двери','Ручки, петли и замки','Проверить комплектацию дверного блока.',null,'комплект',2500),
seed('Двери','Установка дверей','Количество и исполнитель пока не определены.',null,'шт.',4000,'labor'),
seed('Инструменты','Аренда штробореза и пылесоса','Планировать по этапам; проверить допустимость штроб и согласовать трассы.',null,'сутки',1800),
seed('Инструменты','Расходники и защита','Буры, диски, респираторы, очки, перчатки. Уточнить список.',null,'комплект',3000),
seed('Прочее','Доставка материалов','По заказам и магазинам.',null,'рейс',1500),
seed('Прочее','Вывоз строительного мусора','Количество и правила вывоза уточнить.',null,'рейс',4000)
]};}

const ROOMS=['Кухня','Спальня','Комната 2','Комната 3','Санузел 1','Санузел 2','Коридор','Кладовая','Общие'];
const ROOM_PRESETS={
  'Санузел 1':'Санузел 1 · душ',
  'Санузел 2':'Санузел 2 · ванна',
  'Комната 2':'Детская / комната 2',
  'Комната 3':'Детская / комната 3'
};
const MIGRATION_BACKUP=KEY+'-before-rooms';
const NON_MATERIALS=new Set(['Аренда штробореза и пылесоса','Доставка материалов','Вывоз строительного мусора']);
function inferRoom(item){
  if(item.category==='Освещение'&&['COB-лента для спальни','Встраиваемый алюминиевый профиль','Рассеиватель','Блок питания 24 В','Диммер для ленты 24 В'].includes(item.name))return 'Спальня';
  if(item.category==='Санузлы'&&['Нагревательный мат','Программируемый терморегулятор'].includes(item.name))return 'Санузел 2';
  return 'Общие';
}
function inRoom(room,category,name,spec,quantity=null,unit='шт.',price=null){
  return {...seed(category,name,spec,quantity,unit,price),room};
}
function additions(){
  return [
    inRoom('Санузел 1','Санузлы','Ванна','Размеры и материал после замеров, модель пока не выбрана.'),
    inRoom('Санузел 1','Санузлы','Слив-перелив для ванны','Состав комплекта проверить при выборе ванны.'),
    inRoom('Санузел 1','Санузлы','Смеситель ванны','Настенный или другой тип — после проверки разводки.'),
    inRoom('Санузел 1','Санузлы','Раковина','Размер и установка с учётом стиральной машины и мебели.'),
    inRoom('Санузел 1','Санузлы','Смеситель раковины','Под выбранную раковину и выводы воды.'),
    inRoom('Санузел 1','Санузлы','Сифон раковины','Под выпуск раковины и тумбу.'),
    inRoom('Санузел 1','Санузлы','Унитаз','Напольный/подвесной, тип выпуска и инсталляция — после выбора.'),
    inRoom('Санузел 2','Санузлы','Унитаз','Модель, выпуск и способ монтажа уточнить.'),
    inRoom('Санузел 2','Санузлы','Раковина','Необходимость и габариты уточнить по плану.'),
    inRoom('Санузел 2','Санузлы','Смеситель раковины','Только если планируется раковина.'),
    inRoom('Санузел 2','Санузлы','Сифон раковины','Только если планируется раковина.'),
    inRoom('Санузел 1','Санузлы','Санитарный герметик','Герметизация примыканий, расход после выбора сантехники.',null,'тюбик',null),
    inRoom('Кухня','Освещение','Основное освещение кухни','Световой план и световой поток после расстановки мебели.'),
    inRoom('Коридор','Освещение','Светильники коридора','Несколько точек по длине и поворотам; количество уточнить.'),
    inRoom('Комната 2','Освещение','Основной свет детской','Примерно 12 м²; первоначальный ориентир 2000–2500 лм.'),
    inRoom('Комната 3','Освещение','Основной свет второй детской','Примерно 12 м²; первоначальный ориентир 2000–2500 лм.'),
    inRoom('Общие','Стены','Абразивные материалы для стен','Шкурка/сетка для удаления небольших неровностей после приёмки.',null,'комплект',null),
    inRoom('Общие','Полы','Грунтовка основания под клей для линолеума','Только при необходимости по инструкции производителя клея.',null,'л',null),
    inRoom('Санузел 1','Санузлы','Манжеты для гидроизоляции выводов','Количество после проверки труб и системы гидроизоляции.',null,'шт.',null)
  ];
}

function selectedFromCart(id,name,spec,quantity,unit,price,category='Инструменты'){
  return {id:'ozon-202610-'+id,name,spec,quantity,unit,price,category,room:'Общие',kind:'material',url:'',status:'Уточнить',priceApprox:true,quantityApprox:false};
}
function toolAdditions(){
  return [
    selectedFromCart('grinder-deko','УШМ DEKO 125 мм, 1250 Вт','Кандидат из корзины Ozon; проверить комплектацию и возможность работы с нужными дисками.',1,'шт.',2356),
    selectedFromCart('tilecutter-400','Ручной плиткорез Tiler 400 мм','Кандидат из корзины. Пока не покупать: может оказаться коротким для выбранного формата плитки.',1,'шт.',1980),
    selectedFromCart('vacuum-rekidel','Строительный пылесос Rekidel 20 л','Кандидат из корзины. Для штробления требуется проверить тип фильтра и пригодность для мелкой строительной пыли.',1,'шт.',3806),
    selectedFromCart('mixer-sds','Миксер-насадка Вихрь SDS+ 600×100 мм','Кандидат из корзины. Перед покупкой проверить совместимость хвостовика с инструментом и смесью.',1,'шт.',555),
    selectedFromCart('gloves-pack','Рабочие перчатки, упаковка 10 пар','Предварительно выбранная упаковка 10 пар из корзины Ozon.',1,'уп.',205),
    selectedFromCart('film-54','Защитная плёнка для ремонта, 54 м²','Кандидат из корзины; фактическую площадь и толщину плёнки проверить.',1,'рулон',296),
    selectedFromCart('mask-6001','Полумаска с фильтрами типа 6001','Пока не покупать для бетонной пыли без совместимых фильтров P2/P3: картриджи 6001 обычно для органических паров.',1,'шт.',739)
  ];
}
const COLD_WELD_SPEC='Кандидат из корзины: Homakoll S401, 60 мл, 507 ₽. Уточнить тип линолеума, основу и совместимость холодной сварки до покупки.';
function maybeUpdateColdWeld(i){
  if(i.id==='initial-29'&&i.name==='Холодная сварка стыков'
    &&i.quantity===null&&i.price===650
    &&i.spec==='Тип под выбранный линолеум и шов. Длина стыков пока неизвестна.'){
    return {...i,quantity:1,price:507,priceApprox:true,spec:COLD_WELD_SPEC};
  }
  return i;
}

function initialRev3(){
  const raw=baseInitial();
  return {...raw,catalogRevision:3,items:[...raw.items.filter(i=>i.kind==='material'&&!NON_MATERIALS.has(i.name)).map(i=>maybeUpdateColdWeld({...i,room:inferRoom(i)})),...additions(),...toolAdditions()]};
}

function questionnaireItem(id,room,category,name,spec,quantity,unit,price){
  return {id:'questionnaire-20261013-'+id,room,category,name,spec,quantity,unit,price,kind:'material',status:'Уточнить',url:'',priceApprox:price!==null,quantityApprox:false};
}
function questionnaireItems(){
  const q=questionnaireItem;
  return [
    q('loranto','Санузел 2','Санузлы','Душевая кабина Loranto 120×80','Выбрана в «КрасАква», 31 490 ₽. Для временно работающего санузла; комплектацию и слив проверить до заказа.',1,'шт.',31490),
    q('bed-wall-38209','Спальня','Стены','Обои Лана Зел арт. 38209-05','1,06×10 м; один из двух артикулов спальни. Количество после замеров; 1 290 ₽/рулон по опроснику.',null,'рулон',1290),
    q('bed-wall-38109','Спальня','Стены','Обои арт. 38109-05','Второй артикул спальни, предположительно 1,06×10 м. Цена 1 290 ₽ указана общей строкой для двух рисунков — уточнить для этого артикула.',null,'рулон',1290),
    q('child-wall-1','Комната 2','Стены','Обои детская 1 — пока не выбраны','Цена 1 500 ₽/рулон ориентировочная, модель и ширина не определены.',null,'рулон',1500),
    q('child-wall-2','Комната 3','Стены','Обои детская 2 — пока не выбраны','Цена 1 500 ₽/рулон ориентировочная, модель и ширина не определены.',null,'рулон',1500),
    q('kitchen-wall','Кухня','Стены','Обои арт. 9294-17','Рулон 1,06×10 м, рисунок без подгонки по опроснику.',null,'рулон',2300),
    q('hall-wall','Коридор','Стены','Обои арт. 60977-04','Рулон 1,06×10 м; количество рассчитать после замеров.',null,'рулон',2500),
    q('bed-spots','Спальня','Освещение','Точечные светильники спальни','Шесть штук: 2 ряда по 3. Модель и световой поток пока неизвестны; учитывать вместе с одной световой линией 2 м.',6,'шт.',null)
  ];
}
const questionnaireChanges={
 'initial-15':{name:'COB-лента для спальни',qty:6,price:700,match:'Две линии по 3 м',change:{quantity:2,price:null,spec:'Одна световая линия 2 м, COB 24 В, 3000 K, CRI ≥90, ориентир 800–1000 лм/м. Конкретная лента и цена не выбраны; расчёт света совместно с 6 точечными.'}},
 'initial-16':{name:'Встраиваемый алюминиевый профиль',qty:6,price:1200,match:'две линии по 3 м',change:{quantity:2,price:null,spec:'Профиль для одной линии 2 м в натяжном потолке; модель и цена пока неизвестны. Учесть рассеиватель.'}},
 'initial-17':{name:'Рассеиватель',qty:6,price:250,match:'Под выбранный профиль',change:{quantity:2,price:null,spec:'На одну линию 2 м; не считать отдельно, если рассеиватель входит в профиль.'}},
 'initial-18':{name:'Блок питания 24 В',qty:1,price:3000,match:'Мощность после выбора',change:{price:null,spec:'Подобрать после выбора двухметровой ленты; проверить запас мощности и место доступа.'}},
 'initial-19':{name:'Диммер для ленты 24 В',qty:1,price:2500,match:'Совместимость с блоком',change:{quantity:null,price:null,spec:'Пока неизвестно, будет ли диммер. Оставлено для возможного выбора.'}},
 'initial-27':{name:'Линолеум',qty:null,price:1100,match:'Класс и защитный слой',change:{name:'Линолеум Kreaforta «Касли» арт. 89441400',price:915,spec:'Рулон 4 м; толщина 4,6 мм; защитный слой 0,4 мм; класс 32. Один декор во всех жилых комнатах и коридоре. Сравнить с вариантом шириной 3,5 м по отходам; объём после замеров.'}},
 'initial-66':{name:'Основной свет детской',qty:null,price:null,match:'Примерно 12 м²',change:{quantity:1,price:5000,spec:'Один центральный светильник в детскую ~12 м². Цена около 5 000 ₽ — предварительная, модель и световой поток ещё не выбраны.'}},
 'initial-67':{name:'Основной свет второй детской',qty:null,price:null,match:'Примерно 12 м²',change:{quantity:1,price:5000,spec:'Один центральный светильник в детскую ~12 м². Цена около 5 000 ₽ — предварительная, модель и световой поток ещё не выбраны.'}}
};
function questionnaireCleanup(i){
 const d=questionnaireChanges[i.id];
 if(d&&i.name===d.name&&i.quantity===d.qty&&i.price===d.price&&i.spec.includes(d.match)){
   const out={...i,...d.change};
   if(d.change.price===null)out.priceApprox=false;
   return out;
 }
 if(i.id==='initial-64'&&i.name==='Основное освещение кухни'&&i.spec==='Световой план и световой поток после расстановки мебели.')
   return {...i,spec:'Планируется светильник-планка с несколькими направленными плафонами. Модель, количество и цена позже.'};
 return i;
}
function questionnaireObsolete(i){
 if(i.id==='initial-22'&&i.name==='Обои'&&i.quantity===null&&i.price===2500&&i.spec==='Основная отделка. Рулон 1,06×10 м как ориентир; подрезка и раппорт после выбора.')return true;
 if(i.id==='initial-40'&&i.name==='Сантехника и смесители'&&i.quantity===null&&i.price===null&&i.spec==='Ванна, унитазы, раковины, смесители, сифоны. Разбить на позиции после выбора моделей.')return true;
 if(i.id==='initial-21'&&i.name==='Остальные светильники'&&i.quantity===null&&i.price===null)return true;
 const supplied={'initial-59':['Унитаз','Модель, выпуск и способ монтажа уточнить.'],'initial-60':['Раковина','Необходимость и габариты уточнить по плану.'],'initial-61':['Смеситель раковины','Только если планируется раковина.'],'initial-62':['Сифон раковины','Только если планируется раковина.']};
 const x=supplied[i.id];
 return Boolean(x&&i.room==='Санузел 2'&&i.name===x[0]&&i.spec===x[1]&&i.quantity===null&&i.price===null);
}
function questionnaireRevision(data){
 if(data.catalogRevision>=4)return data;
 const items=data.items.filter(i=>!questionnaireObsolete(i)).map(questionnaireCleanup);
 const ids=new Set(items.map(i=>i.id));
 const names=new Set(items.map(i=>[i.room,i.category,i.name].join('|').toLowerCase()));
 for(const i of questionnaireItems()){
   const key=[i.room,i.category,i.name].join('|').toLowerCase();
   if(ids.has(i.id)||names.has(key))continue;
   items.push(i);ids.add(i.id);names.add(key);
 }
 return {...data,catalogRevision:4,items};
}

function reviseKasliWidth(data){
  if(data.catalogRevision>=5)return data;
  const items=data.items.map(i=>{
    if(i.id==='initial-27'
      &&i.name==='Линолеум Kreaforta «Касли» арт. 89441400'
      &&i.price===915
      &&i.spec==='Рулон 4 м; толщина 4,6 мм; защитный слой 0,4 мм; класс 32. Один декор во всех жилых комнатах и коридоре. Сравнить с вариантом шириной 3,5 м по отходам; объём после замеров.'){
      return {...i,name:'Линолеум Kreaforta «Касли» 4 м (арт. 89441404 — проверить)',spec:'Для ширины 4 м в каталоге арт. 89441404; исходно был указан 89441400, но это артикул рулона 3 м. Толщина 4,6 мм, слой 0,4 мм, класс 32. Цена 915 ₽/м². Проверить артикул в корзине, сравнить раскрой с вариантом шириной 3,5 м.'};
    }
    return i;
  });
  return {...data,catalogRevision:5,items};
}

function markWallpaperCombination(data){
  if(data.catalogRevision>=6)return data;
  const expected={
    'questionnaire-20261013-bed-wall-38209':'1,06×10 м; один из двух артикулов спальни. Количество после замеров; 1 290 ₽/рулон по опроснику.',
    'questionnaire-20261013-bed-wall-38109':'Второй артикул спальни, предположительно 1,06×10 м. Цена 1 290 ₽ указана общей строкой для двух рисунков — уточнить для этого артикула.'
  };
  const note=' Обои двух артикулов будут сочетаться в одной спальне; при предполагаемой высоте 2,7 м ориентир около 6 рулонов СУММАРНО на спальню. Количество каждого артикула зависит от выбранной стены и точных размеров.';
  return {...data,catalogRevision:6,items:data.items.map(i=>
    Object.hasOwn(expected,i.id)&&i.spec===expected[i.id]?{...i,spec:i.spec+note}:i
  )};
}
function initialPrior(){return markWallpaperCombination(reviseKasliWidth(questionnaireRevision(initialRev3())));}



function parseNum(value){
  if(value===null||value==='')return null;
  if(typeof value==='number'){
    if(!Number.isFinite(value)||value<0||value>1e9)throw Error('Число должно быть от 0 до 1 000 000 000.');
    return value;
  }
  if(typeof value!=='string'||!/^\d+(?:[.,]\d{1,3})?$/.test(value.trim()))throw Error('Введите неотрицательное число, например 12,5.');
  return parseNum(Number(value.trim().replace(',','.')));
}
function safeUrl(value){
  if(!value)return '';
  const u=new URL(value);
  if(!['http:','https:'].includes(u.protocol))throw Error('Недопустимая ссылка.');
  return u.href;
}
function validate(data){
  if(!data||data.version!==1||!Array.isArray(data.items)||data.items.length>5000)throw Error('Нужен JSON сметы версии 1 (до 5000 позиций).');
  const ids=new Set();
  const items=data.items.map(i=>{
    if(!i||typeof i.id!=='string'||!i.id||i.id.length>100||ids.has(i.id))throw Error('Повторяющиеся или неверные ID.');
    ids.add(i.id);
    for(const [k,max] of [['name',150],['spec',2000],['unit',20],['url',2000],['shop',100]]){
      if(typeof (k==='shop'?(i.shop??''):i[k])!=='string'||(k==='shop'?(i.shop??''):i[k]).length>max)throw Error('Некорректное поле: '+k);
    }
    if(!i.name.trim()||!i.unit.trim()||!CATEGORIES.includes(i.category)||!STATUSES.includes(i.status)||!['material','labor'].includes(i.kind)||typeof i.priceApprox!=='boolean'||typeof i.quantityApprox!=='boolean')throw Error('Некорректные параметры позиции.');
    return {id:i.id,name:i.name.trim(),spec:i.spec,category:i.category,room:ROOMS.includes(i.room)?i.room:inferRoom(i),unit:i.unit.trim(),quantity:parseNum(i.quantity),price:parseNum(i.price),quantityApprox:i.quantityApprox,priceApprox:i.priceApprox,status:i.status,shop:i.shop??'',stage:STAGES.includes(i.stage)?i.stage:inferStage(i),kind:i.kind,url:safeUrl(i.url)};
  });
  return {version:1,catalogRevision:Number.isInteger(data.catalogRevision)?data.catalogRevision:0,updatedAt:new Date().toISOString(),items};
}
function mergeCatalogPrior(data){
  if(data.catalogRevision>=6)return data;
  if(data.catalogRevision===5)return markWallpaperCombination(data);
  if(data.catalogRevision===4)return markWallpaperCombination(reviseKasliWidth(data));
  if(data.catalogRevision===3)return markWallpaperCombination(reviseKasliWidth(questionnaireRevision(data)));
  const items=data.items.map(maybeUpdateColdWeld);
  const seenIds=new Set(items.map(i=>i.id));
  const seenNames=new Set(items.map(i=>[i.room,i.category,i.name].join('|').toLocaleLowerCase('ru')));
  const addMissing=list=>{
    for(const i of list){
      const key=[i.room,i.category,i.name].join('|').toLocaleLowerCase('ru');
      if(seenIds.has(i.id)||seenNames.has(key))continue;
      items.push(i);seenIds.add(i.id);seenNames.add(key);
    }
  };
  if(data.catalogRevision<2){baseInitial();addMissing(additions());}
  addMissing(toolAdditions());
  return markWallpaperCombination(reviseKasliWidth(questionnaireRevision({...data,catalogRevision:3,items})));
}

/*
 * Исправление нумерации после подтверждения владельцем 13.10.2026:
 * Санузел 1 (1,75×2,87 м) — МАЛЫЙ с душевой кабиной,
 * Санузел 2 (2,03×3,33 м) — БОЛЬШОЙ с ванной и тёплым полом.
 * Меняем только известные позиции прежнего каталога. Произвольные
 * добавленные пользователем товары не переносим, чтобы не угадать неверно.
 * Количество, цена, название и прочие данные сохраняются.
 */
const BATHROOM_REASSIGN={
  'initial-33':'Санузел 2', // нагревательный мат
  'initial-34':'Санузел 2', // терморегулятор
  'initial-52':'Санузел 2', // ванна
  'initial-53':'Санузел 2', // слив-перелив
  'initial-54':'Санузел 2', // смеситель ванны
  'initial-55':'Санузел 2', // раковина
  'initial-56':'Санузел 2', // смеситель раковины
  'initial-57':'Санузел 2', // сифон
  'initial-58':'Санузел 2', // унитаз
  'initial-63':'Санузел 2', // герметик
  'initial-70':'Санузел 2', // гидроизоляционные манжеты
  'initial-59':'Санузел 1', // типовой унитаз старого малого санузла, если остался с правками
  'initial-60':'Санузел 1', // раковина старого малого санузла
  'initial-61':'Санузел 1', // смеситель малого санузла
  'initial-62':'Санузел 1', // сифон малого санузла
  'questionnaire-20261013-loranto':'Санузел 1' // душевая кабина
};
function correctBathroomNumbers(data){
  if(data.catalogRevision>=7)return data;
  const corrected=data.items.map(i=>{
    const target=BATHROOM_REASSIGN[i.id];
    if(!target)return i;
    const other=target==='Санузел 1'?'Санузел 2':'Санузел 1';
    // Если пользователь вручную назначил иной раздел, не трогаем.
    if(i.room!==other&&i.room!=='Общие')return i;
    return {...i,room:target};
  });
  return {...data,catalogRevision:7,items:corrected};
}

/*
 * По просьбе владельца, ревизия 8: в смете только явно обсуждённые/
 * выбранные товары. Черновые предложения ассистента не входят в список.
 * План работ и невыбранные системы остаются на странице размеров/в README.
 *
 * Из ранее созданных позиций не удаляем строки, которые пользователь
 * действительно изменил, и никогда не удаляем им созданные вручную строки.
 * Это важно для локальных данных из старых версий.
 */
const USER_REQUESTED_IDS=new Set([
  // Варианты кабельных линий и интернет-кабель, заданные для будущего расчёта.
  'initial-1','initial-2','initial-3','initial-4','initial-13',
  // Обсуждаемые покрытия и конкретный тюбик холодной сварки из корзины.
  'initial-27','initial-29',
  // Пустая ванна по прямой просьбе владельца. Модель выберем отдельно.
  'initial-52',
  // По одному светильнику ~5000 руб. для каждой детской.
  'initial-66','initial-67',
  // Конкретные товары с предоставленного скриншота корзины.
  'ozon-202610-grinder-deko',
  'ozon-202610-tilecutter-400',
  'ozon-202610-vacuum-rekidel',
  'ozon-202610-mixer-sds',
  'ozon-202610-gloves-pack',
  'ozon-202610-film-54',
  'ozon-202610-mask-6001',
  // Выбранная душевая, конкретные обои и 6 запланированных точечных светильников.
  'questionnaire-20261013-loranto',
  'questionnaire-20261013-bed-wall-38209',
  'questionnaire-20261013-bed-wall-38109',
  'questionnaire-20261013-kitchen-wall',
  'questionnaire-20261013-hall-wall',
  'questionnaire-20261013-bed-spots'
]);
const AUTO_CREATED_BASELINE=new Map(
  correctBathroomNumbers(initialPrior()).items.map(i=>[i.id,i])
);
const USER_EDITABLE_FIELDS=[
  'name','spec','quantity','unit','price','category','room','shop',
  'priceApprox','quantityApprox','kind','status','url'
];
function userHasEditedAutoItem(item){
  const baseline=AUTO_CREATED_BASELINE.get(item.id);
  if(!baseline)return true; // любые самостоятельно добавленные позиции сохраняются
  return USER_EDITABLE_FIELDS.some(k=>(item[k]??'')!==(baseline[k]??''));
}
function cleanupUnselectedCatalog(data){
  if(data.catalogRevision>=8)return data;
  const items=data.items.filter(i=>
    USER_REQUESTED_IDS.has(i.id)||userHasEditedAutoItem(i)
  );
  return {...data,catalogRevision:8,items};
}
const DISC_ITEM={
  id:'user-20261013-diamond-disc-125',
  category:'Инструменты',room:'Общие',
  name:'Алмазный диск для УШМ 125 мм',
  spec:'Для штробления после уточнения материала стен. Совместимость с УШМ DEKO 125 мм: посадка, предельные обороты, кожух и пылеудаление. Марка и цена пока не выбраны.',
  quantity:1,unit:'шт.',price:null,kind:'material',url:'',
  priceApprox:false,quantityApprox:false,status:'Уточнить'
};
function includeDisc(data){
  if(data.catalogRevision>=9)return data;
  const existing=data.items.some(i=>i.id===DISC_ITEM.id||
    (i.category==='Инструменты'&&/алмазн/i.test(i.name)&&/диск/i.test(i.name)&&/125/.test(i.name)));
  return {...data,catalogRevision:9,
    items:existing?data.items:[...data.items,{...DISC_ITEM}]};
}
// Ревизия 10: откатить преждевременное добавление пустой строки диска.
// Два диска уже видны на скриншоте пользователя, но пока не идентифицированы.
function removePrematureDisc(data){
  if(data.catalogRevision>=10)return data;
  const unchanged=i=>i.id===DISC_ITEM.id &&
    ['name','spec','quantity','unit','price','category','room','kind','url','priceApprox','quantityApprox','status']
      .every(k=>i[k]===DISC_ITEM[k]);
  return {...data,catalogRevision:10,items:data.items.filter(i=>!unchanged(i))};
}

/*
 * Ревизия 11. Подтверждены две отдельные позиции этапа разметки.
 * Штатив из подборки за 1005 ₽ фактически куплен за 1000 ₽.
 * Его бренд и фактическое место покупки не подтверждены.
 */
const CONFIRMED_MARKING_ITEMS=[
  {
    id:'confirmed-20261013-paowafol-4d',name:'Лазерный уровень PAOWAFOL 4D, 16 линий',
    spec:'Выбранный кандидат из подборки Ozon, цена со скриншота 2613 ₽. Пока не куплен.',
    category:'Инструменты',room:'Общие',quantity:1,unit:'шт.',
    price:2613,priceApprox:true,quantityApprox:false,
    shop:'Ozon',kind:'material',url:'',status:'Запланировано'
  },
  {
    id:'confirmed-20261013-laser-tripod',name:'Штатив для лазерного уровня 80–340 см',
    spec:'В подборке Ozon был за 1005 ₽ (не путать с отдельным штативом WIBEK за 1112 ₽). Куплен за 1000 ₽; фактический магазин покупки не уточнён.',
    category:'Инструменты',room:'Общие',quantity:1,unit:'шт.',
    price:1000,priceApprox:false,quantityApprox:false,
    shop:'',kind:'material',url:'',status:'Куплено'
  }
];
function addConfirmedMarkingItems(data){
  if(data.catalogRevision>=11)return data;
  const items=[...data.items];
  for(const item of CONFIRMED_MARKING_ITEMS){
    const equivalent=items.some(i=>i.id===item.id||
      (i.category==='Инструменты'&&(
        (item.id.includes('paowafol')&&/лазерн/i.test(i.name)&&/PAOWAFOL/i.test(i.name))||
        (item.id.includes('tripod')&&/штатив/i.test(i.name)&&/лазерн/i.test(i.name)&&i.price===1000)
      )));
    if(!equivalent)items.push({...item});
  }
  return {...data,catalogRevision:11,items};
}
// Ревизия 12: группируем позиции по этапам, не меняя цены, статусы и товары.
function withStages(data){
  if(data.catalogRevision>=12&&data.items.every(i=>STAGES.includes(i.stage)))return data;
  return {...data,catalogRevision:12,items:data.items.map(i=>({...i,stage:STAGES.includes(i.stage)?i.stage:inferStage(i)}))};
}
// Ревизия 13. Предварительная полная новая проводка от щита у входа,
// трассы по потолку с вертикальными спусками. Позже заменим данными SketchUp.
// Центральные значения ранее обсуждавшихся диапазонов, не заказные метражи.
const CEILING_WIRE_ESTIMATES={
  'initial-1':{quantity:125,range:'100–150 м',use:'Освещение',price:100},
  'initial-2':{quantity:300,range:'250–350 м',use:'Розеточные линии',price:132},
  'initial-3':{quantity:20,range:'15–25 м',use:'Отдельная линия к духовке — при необходимости после проверки мощности и схемы',price:230},
  'initial-4':{quantity:20,range:'15–25 м',use:'Отдельная линия к варочной — при необходимости после проверки мощности и схемы',price:300},
  'initial-13':{quantity:75,range:'50–100 м',use:'Интернет Cat.6',price:80}
};
function withCeilingWiringEstimates(data){
  if(data.catalogRevision>=13)return data;
  const baseline=new Map(baseInitial().items.map(i=>[i.id,i]));
  const items=data.items.map(i=>{
    const plan=CEILING_WIRE_ESTIMATES[i.id];
    if(!plan)return i;
    const original=baseline.get(i.id);
    // Никогда не перезаписываем самостоятельно введённый метраж;
    // купленную проводку тоже нельзя переоценивать автоматически.
    const shouldFill=i.quantity===null&&i.status!=='Куплено';
    const changes={};
    if(shouldFill){
      changes.quantity=plan.quantity;
      changes.quantityApprox=true;
    }
    // Только исходную цену 3×2,5 уточняем по выбранной бухте:
    // Ozon ЭРА, 50 м за 6 597 ₽ => ≈132 ₽/м.
    if(i.id==='initial-2'&&i.price===original.price)changes.price=plan.price;
    if(i.spec===original.spec){
      changes.spec=plan.use+'. Предварительно '+plan.range+', для бюджета '+plan.quantity+' м. Раскладка: щит у входа, трассы по потолку, спуски к точкам; считаем электрику заново, не вычитаем проводку застройщика. Метраж уточнить в SketchUp. '+
        (i.id==='initial-2'?'Цена ≈132 ₽/м по скриншоту Ozon: ЭРА 3×2,5, бухта 50 м / 6597 ₽. ': 'Цена за метр предварительная. ')+
        'Тип кабеля и сечение окончательно уточнить по нагрузкам и проекту.';
    }
    return Object.keys(changes).length?{...i,...changes}:i;
  });
  return {...data,catalogRevision:13,items};
}
// Ревизия 14: явно названные товары и цены из обсуждения 13.10.2026.
// Кандидаты ещё не куплены. В случае наличия пользовательского аналога
// в локальной смете его данные сохраняем, дубликат не создаём.
const AGREED_STAGE_SUPPLIES=[
  {
    id:'discussed-20261013-rule-2m',category:'Инструменты',
    name:'Алюминиевое правило 2 м',
    spec:'Лемана ПРО. Цена 700 ₽ со слов владельца. Для разметки и проверки плоскостей; это не пузырьковый уровень.',
    quantity:1,unit:'шт.',price:700,shop:'Лемана ПРО',
    stage:'Электрика',status:'Запланировано'
  },
  {
    id:'discussed-20261013-eye-protection',category:'Инструменты',
    name:'Защитные очки для строительных работ',
    spec:'Ozon, цена 240 ₽ со слов владельца. При резке штроб и работе перфоратором необходима защита глаз.',
    quantity:1,unit:'шт.',price:240,shop:'Ozon',
    stage:'Электрика',status:'Запланировано'
  },
  {
    id:'discussed-20261013-hearing-protection',category:'Инструменты',
    name:'Защитные наушники',
    spec:'Лемана ПРО, цена 300 ₽ со слов владельца. Для работы с УШМ и перфоратором.',
    quantity:1,unit:'шт.',price:300,shop:'Лемана ПРО',
    stage:'Электрика',status:'Запланировано'
  },
  {
    id:'discussed-20261013-cable-ties',category:'Электрика',
    name:'Кабельные стяжки 4,8×200 мм, 100 шт.',
    spec:'Ozon, цена 170 ₽ по скриншоту. Упаковка 100 шт. Не путать с крепежом для фиксации кабелей непосредственно в штробах: его отдельно подберём.',
    quantity:1,unit:'уп.',price:170,shop:'Ozon',
    stage:'Электрика',status:'Запланировано'
  },
  {
    id:'discussed-20261013-tie-platforms',category:'Электрика',
    name:'Площадки REXANT для кабельных стяжек, 100 шт.',
    spec:'Ozon, цена 224 ₽ по скриншоту. Размер 22×16 мм; упаковка 100 шт. Способ крепления и необходимость в выбранной схеме уточним.',
    quantity:1,unit:'уп.',price:224,shop:'Ozon',
    stage:'Электрика',status:'Запланировано'
  },
  {
    id:'discussed-20261013-fugen-10kg',category:'Стены',
    name:'Шпаклёвка КНАУФ Фуген, 10 кг',
    spec:'Лемана ПРО, цена 420 ₽ со слов владельца. По карточке слой 0,2–5 мм. Кандидат для тонкого финишного выравнивания; не закладывать как основную смесь для глубоких штроб или установки подрозетников.',
    quantity:1,unit:'мешок',price:420,shop:'Лемана ПРО',
    stage:'Стены и обои',status:'Уточнить'
  }
];
function withDiscussedSupplies(data){
  if(data.catalogRevision>=14)return data;
  const items=[...data.items];
  const patterns=[
    i=>/правил/i.test(i.name)&&/(^|\D)2(?:[,.]0)?\s*м(?:етра|етров)?(\D|$)/i.test(i.name),
    i=>/очк/i.test(i.name)&&/защит|строит/i.test(i.name),
    i=>/наушник/i.test(i.name)&&/защит|строит/i.test(i.name),
    i=>/стяжк|хомут/i.test(i.name)&&/4[,.]8/.test(i.name)&&/200/.test(i.name),
    i=>/площадк/i.test(i.name)&&/стяжк|кабел/i.test(i.name),
    i=>/фуген|fugen/i.test(i.name)
  ];
  AGREED_STAGE_SUPPLIES.forEach((item,index)=>{
    if(!items.some(i=>i.id===item.id||patterns[index](i)))items.push({
      ...item,room:'Общие',kind:'material',url:'',priceApprox:false,quantityApprox:false
    });
  });
  return {...data,catalogRevision:14,items};
}
// Ревизия 15. Завершённый согласованный план электрики спальни.
// 10 силовых розеток + 1 RJ45 + 1 двухклавишный выключатель = 12 подрозетников.
// Кондиционер подключается напрямую, без подрозетника и розетки.
// Сами приборы и расходники пока не выбраны, поэтому цену не выдумываем.
const BEDROOM_ELECTRICAL_PLAN=[
  {
    id:'bedroom-20261013-sockets',name:'Розетки 230 В — спальня',
    spec:'10 механизмов: швейный стол 3, возле кровати 2, телевизор 2, зарядка вертикального пылесоса 1, запасная возле неё 1, база робота-пылесоса 1. Количество согласовано по предварительной расстановке мебели. Модель, серия и цена ещё не выбраны.',
    quantity:10,unit:'шт.'
  },
  {
    id:'bedroom-20261013-rj45',name:'Интернет-розетка RJ45 — спальня',
    spec:'1 механизм возле телевизора. Выбрана именно розетка RJ45, не открытый вывод кабеля. Модель, экранирование и цена ещё не выбраны.',
    quantity:1,unit:'шт.'
  },
  {
    id:'bedroom-20261013-switch',name:'Двухклавишный выключатель — спальня',
    spec:'1 механизм у входа: клавиша 1 — шесть точечных светильников, клавиша 2 — световая линия. Дополнительный выключатель возле кровати не предусмотрен.',
    quantity:1,unit:'шт.'
  },
  {
    id:'bedroom-20261013-underboxes',name:'Подрозетники — спальня',
    spec:'12 шт.: для десяти механизмов розеток 230 В, одной RJ45 и одного двухклавишного выключателя. Для кондиционера — отдельный вывод кабеля из стены под потолком, БЕЗ розетки и подрозетника. Проводка по потолку, точный раскрой трасс после проекта SketchUp. Тип подрозетников и цена после выбора основания и механизмов.',
    quantity:12,unit:'шт.'
  }
];
function withBedroomElectricalPlan(data){
  if(data.catalogRevision>=15)return data;
  const items=[...data.items];
  const lookFor=[
    /розетк.*230|силов.*розетк|электрическ.*розетк/i,
    /интернет.розетк|розетк.*rj.?45|rj.?45.*розетк/i,
    /двухклавиш.*выключ|выключ.*двухклавиш/i,
    /подрозетник/i
  ];
  BEDROOM_ELECTRICAL_PLAN.forEach((info,index)=>{
    const exists=items.some(i=>i.id===info.id||(i.room==='Спальня'&&lookFor[index].test(i.name)));
    if(!exists)items.push({
      ...info,category:'Электрика',room:'Спальня',stage:'Электрика',kind:'material',
      price:null,priceApprox:false,quantityApprox:false,status:'Запланировано',shop:'',url:''
    });
  });
  return {...data,catalogRevision:15,items};
}
// Ревизия 16. Бюджетная цена 550 ₽ за розетку в сборе и выключатель.
// Для интернет-розетки RJ45 временно та же условная цена 550 ₽.
// Коробки под монтаж (подрозетники) считаются отдельно; их цена не утверждена.
const BEDROOM_MECHANISM_PRICE_IDS=new Set([
  'bedroom-20261013-sockets','bedroom-20261013-rj45','bedroom-20261013-switch'
]);
function withBedroomMechanismPrices(data){
  if(data.catalogRevision>=16)return data;
  const items=data.items.map(i=>{
    if(!BEDROOM_MECHANISM_PRICE_IDS.has(i.id)||i.price!==null||i.status==='Куплено')return i;
    const label=i.id==='bedroom-20261013-rj45'?'Для RJ45 цена 550 ₽ принята предварительно по аналогии с розетками. ':'';
    const detail='Ориентировочная цена одного готового механизма с лицевой частью (550 ₽ по решению владельца). Подрозетник отдельно. ';
    const spec=(i.spec.includes('Модель,')?i.spec.replace('Модель, серия и цена ещё не выбраны.', 'Модель и серия ещё не выбраны.').replace('Модель, экранирование и цена ещё не выбраны.','Модель и экранирование ещё не выбраны.'):i.spec);
    return {...i,price:550,priceApprox:true,spec:spec+' '+label+detail};
  });
  return {...data,catalogRevision:16,items};
}
// Ревизия 17: подрозетники спальни по предварительной цене владельца 20 ₽/шт.
// Материал перегородок пока неизвестен, глубину 45/60 мм не выбираем.
function withBedroomBoxPrice(data){
  if(data.catalogRevision>=17)return data;
  const items=data.items.map(i=>{
    if(i.id!=='bedroom-20261013-underboxes'||i.price!==null||i.status==='Куплено')return i;
    const spec=i.spec.replace('Тип подрозетников и цена после выбора основания и механизмов.','Диаметр ориентировочно 68 мм; глубину (45 или 60 мм) выберем после замеров стен. Цена 20 ₽/шт. — предварительно задана владельцем.');
    return {...i,price:20,priceApprox:true,spec};
  });
  return {...data,catalogRevision:17,items};
}
function initial(){
  return withBedroomBoxPrice(withBedroomMechanismPrices(withBedroomElectricalPlan(withDiscussedSupplies(withCeilingWiringEstimates(withStages(addConfirmedMarkingItems(removePrematureDisc(cleanupUnselectedCatalog(correctBathroomNumbers(initialPrior()))))))))));
}
function mergeCatalog(data){
  const base=data.catalogRevision>=9?data:includeDisc(cleanupUnselectedCatalog(correctBathroomNumbers(mergeCatalogPrior(data))));
  return withBedroomBoxPrice(withBedroomMechanismPrices(withBedroomElectricalPlan(withDiscussedSupplies(withCeilingWiringEstimates(withStages(addConfirmedMarkingItems(removePrematureDisc(base))))))));
}

function amount(i){
  return i.quantity===null||i.price===null?null:Math.round(i.quantity*i.price*100)/100;
}
function sum(items){return Math.round(items.reduce((t,i)=>t+(amount(i)??0),0)*100)/100;}
const $=selector=>document.querySelector(selector);
function elem(tag,text,cls){
  const e=document.createElement(tag);
  if(text!==undefined)e.textContent=text;
  if(cls)e.className=cls;
  return e;
}
let state,activeRoom='',category='',editing=null,readOnly=false,lastSaved=null;
try{
  lastSaved=localStorage.getItem(KEY);
  state=lastSaved?mergeCatalog(validate(JSON.parse(lastSaved))):initial();
}catch(e){
  state=initial();readOnly=true;
  setTimeout(()=>notice('Не удалось прочитать прежние данные. Не редактируйте смету до восстановления резервной копии.',true),0);
}
function notice(text,persistent=false){
  const toast=$('#toast');
  toast.textContent=text;toast.classList.add('visible');
  clearTimeout(notice.timer);
  if(!persistent)notice.timer=setTimeout(()=>toast.classList.remove('visible'),4500);
}
function commit(next){
  try{
    if(readOnly)throw Error('Сохранение недоступно. Восстановите данные через импорт.');
    if(localStorage.getItem(KEY)!==lastSaved)throw Error('Смета изменена в другой вкладке. Обновите страницу.');
    if(lastSaved&&!localStorage.getItem(MIGRATION_BACKUP))localStorage.setItem(MIGRATION_BACKUP,lastSaved);
    next.updatedAt=new Date().toISOString();
    const raw=JSON.stringify(next);
    localStorage.setItem(KEY,raw);
    lastSaved=raw;state=next;
    $('#save-state').textContent='Сохранено в этом браузере';
    render();return true;
  }catch(e){notice(e.message,true);return false;}
}

function materials(){
  return state.items.filter(i=>i.kind==='material'&&!NON_MATERIALS.has(i.name));
}
const WIRES_FILTER='@wires';
const isWire=i=>/(кабел|провод|ввг|utp|ftp)/i.test(i.name);
const sectionName=i=>isWire(i)?'Кабели и провода':i.category;
const sectionOrder=['Кабели и провода',...CATEGORIES];
const expandedSummary=new Set(['Кабели и провода']);
const expandedRooms=new Set();
const expandedBundles=new Set();
let viewMode='summary';
let materialFilter='';
let stageFilter='';
function syncCategoryFilter(all){
  // Не показываем категории, в которых ещё нет согласованных товаров.
  const choices=[['','Все материалы']];
  if(all.some(isWire))choices.push([WIRES_FILTER,'Кабели и провода']);
  for(const c of CATEGORIES)if(all.some(i=>i.category===c))choices.push([c,c]);
  if(!choices.some(([value])=>value===materialFilter))materialFilter='';
  const select=$('#categories');
  select.replaceChildren();
  for(const [value,label] of choices){
    const option=elem('option',label);
    option.value=value;select.append(option);
  }
  select.value=materialFilter;
}
function nameOfRoom(room){return ROOM_PRESETS[room]||room;}
function getFiltered(){
  const query=$('#search').value.trim().toLocaleLowerCase('ru');
  return materials().filter(i=>
    (!stageFilter||i.stage===stageFilter)
    &&(!materialFilter||(materialFilter===WIRES_FILTER?isWire(i):i.category===materialFilter))
    &&(!query||[i.name,i.spec,i.category,i.room,nameOfRoom(i.room),i.shop||'',i.status,i.stage].join(' ').toLocaleLowerCase('ru').includes(query))
  );
}
function formatQuantity(item){
  return item.quantity===null?'—':(item.quantityApprox?'≈ ':'')+number.format(item.quantity)+' '+item.unit;
}
function formatPrice(item){
  return item.price===null?'—':(item.priceApprox?'≈ ':'')+money.format(item.price);
}
function formatAmount(item){
  const a=amount(item);
  return a===null?'—':((item.quantityApprox||item.priceApprox)?'≈ ':'')+money.format(a);
}
function aggregate(items){
  const known=items.filter(i=>i.quantity!==null);
  const qty=known.reduce((total,i)=>total+i.quantity,0);
  const unknownQty=known.length!==items.length;
  const quantity=(known.length?number.format(Math.round(qty*1000)/1000)+' '+items[0].unit:'—')+(unknownQty&&known.length?' + ?':'');
  const knownPrices=items.filter(i=>i.price!==null).map(i=>i.price);
  const price=knownPrices.length===items.length&&knownPrices.every(v=>v===knownPrices[0])
    ?(items.some(i=>i.priceApprox)?'≈ ':'')+money.format(knownPrices[0])
    :(knownPrices.length?'разная / ?':'—');
  const sumKnown=items.filter(i=>amount(i)!==null);
  const incomplete=sumKnown.length!==items.length;
  const total=sumKnown.length?((items.some(i=>i.priceApprox||i.quantityApprox)?'≈ ':'')+money.format(sum(items))+(incomplete?' + ?':'')):'—';
  return {quantity,price,total,incomplete,qty,knownQty:known.length};
}
function headerRow(label,items,expanded,onclick,kind){
  const tr=elem('tr',undefined,'group-row '+kind);
  const td=elem('td');td.colSpan=4;
  const button=elem('button',undefined,'group-button');
  button.type='button';button.setAttribute('aria-expanded',String(expanded));
  button.setAttribute('aria-label',(expanded?'Свернуть ':'Развернуть ')+label);
  const left=elem('span',undefined,'group-label');
  left.append(elem('span',expanded?'▾':'▸','chevron'),elem('strong',label),elem('small',items.length+' поз.'));
  const total=elem('span',money.format(sum(items)),'group-total');
  button.append(left,total);button.onclick=onclick;
  td.append(button);tr.append(td);return tr;
}
function materialRow(item,{child=false,subtitle=''}={}){
  const tr=elem('tr',undefined,'item-row'+(child?' nested-row':''));
  const title=elem('td');
  const b=elem('button',item.name,'item-name');
  b.type='button';b.onclick=()=>openEditor(item);
  b.setAttribute('aria-label','Изменить '+item.name);
  title.append(b);
  const meta=[subtitle,item.shop||'',item.status==='Куплено'?'✓ Куплено':''].filter(Boolean);
  if(meta.length)title.append(elem('div',meta.join(' · '),'item-subtitle'));
  tr.append(title);
  for(const [label,value] of [['Количество',formatQuantity(item)],['Цена',formatPrice(item)],['Сумма',formatAmount(item)]]){
    const td=elem('td',value,'money');td.dataset.label=label;tr.append(td);
  }
  tr.onclick=e=>{if(!e.target.closest('button'))openEditor(item);};
  return tr;
}
function bundleKey(i){return [i.category,i.name.trim().toLocaleLowerCase('ru'),i.unit.trim().toLocaleLowerCase('ru')].join('§');}
function groupedMaterials(items){
  const groups=new Map();
  for(const i of items){const key=bundleKey(i);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(i);}
  return [...groups.values()].sort((a,b)=>a[0].name.localeCompare(b[0].name,'ru'));
}
function bundleRow(items){
  if(items.length===1)return [materialRow(items[0])];
  const key=bundleKey(items[0]),expanded=expandedBundles.has(key),a=aggregate(items);
  const tr=elem('tr',undefined,'item-row aggregate-row');
  const td=elem('td'),b=elem('button',undefined,'item-name aggregate-button');
  b.type='button';b.setAttribute('aria-expanded',String(expanded));
  b.append(elem('span',expanded?'▾':'▸','inline-chevron'),elem('span',items[0].name));
  td.append(b);td.append(elem('div',items.length+' помещений / позиций · нажми для разбивки','item-subtitle'));
  tr.append(td);
  for(const [label,value] of [['Количество',a.quantity],['Цена',a.price],['Сумма',a.total]]){
    const cell=elem('td',value,'money');cell.dataset.label=label;tr.append(cell);
  }
  const toggle=()=>{if(expanded)expandedBundles.delete(key);else expandedBundles.add(key);render();};
  b.onclick=toggle;tr.onclick=e=>{if(!e.target.closest('button'))toggle();};
  const rows=[tr];
  if(expanded){
    for(const item of items)rows.push(materialRow(item,{child:true,subtitle:nameOfRoom(item.room)}));
  }
  return rows;
}
function forceExpand(){return Boolean(materialFilter||$('#search').value.trim());}
function renderSummary(items){
  const bySection=new Map();
  for(const item of items){
    const section=sectionName(item);
    if(!bySection.has(section))bySection.set(section,[]);
    bySection.get(section).push(item);
  }
  for(const section of sectionOrder){
    const entries=bySection.get(section);
    if(!entries?.length)continue;
    const expanded=forceExpand()||expandedSummary.has(section);
    const toggle=()=>{if(expandedSummary.has(section))expandedSummary.delete(section);else expandedSummary.add(section);render();};
    $('#rows').append(headerRow(section,entries,expanded,toggle,'summary-group'));
    if(expanded){
      for(const bundle of groupedMaterials(entries)){
        for(const row of bundleRow(bundle))$('#rows').append(row);
      }
    }
  }
}
function renderRoomList(items){
  for(const room of ROOMS){
    const entries=items.filter(i=>i.room===room);
    if(!entries.length)continue;
    const expanded=forceExpand()||expandedRooms.has(room);
    const toggle=()=>{if(expandedRooms.has(room))expandedRooms.delete(room);else expandedRooms.add(room);activeRoom=room;render();};
    $('#rows').append(headerRow(nameOfRoom(room),entries,expanded,toggle,'room-group'));
    if(expanded){
      const sorted=[...entries].sort((a,b)=>CATEGORIES.indexOf(a.category)-CATEGORIES.indexOf(b.category)||a.name.localeCompare(b.name,'ru'));
      let previous=null;
      for(const item of sorted){
        if(previous!==item.category){
          previous=item.category;
          const tr=elem('tr',undefined,'subsection-row');
          const td=elem('td',item.category);td.colSpan=4;tr.append(td);$('#rows').append(tr);
        }
        $('#rows').append(materialRow(item));
      }
    }
  }
}
function renderStageBudgets(all){
  const target=$('#stage-budget-rows');
  target.replaceChildren();
  for(const stage of STAGES){
    const items=all.filter(i=>i.stage===stage);
    const known=items.filter(i=>amount(i)!==null);
    const paid=items.filter(i=>i.status==='Куплено');
    const pending=items.filter(i=>i.status!=='Куплено');
    const missing=items.length-known.length;
    const div=elem('div',undefined,'stage-budget-row');
    div.append(elem('strong',stage,'stage-budget-name'));
    const total=items.length?(known.length?money.format(sum(items))+(missing?' + ?':''):'Пока нет расчёта'):'Не заполнен';
    div.append(elem('span',total,'stage-budget-cost'));
    if(items.length){
      div.append(elem('small','Куплено: '+money.format(sum(paid))+' · Осталось: '+money.format(sum(pending))+(missing?' · Без суммы: '+missing:'') ,'stage-budget-extra'));
    }
    target.append(div);
  }
}
function render(){
  const all=materials();
  syncCategoryFilter(all);
  const filtered=getFiltered();
  const paid=all.filter(i=>i.status==='Куплено');
  const pending=all.filter(i=>i.status!=='Куплено');
  $('#total').textContent=money.format(sum(all));
  $('#paid-total').textContent=money.format(sum(paid));
  $('#remaining-total').textContent=money.format(sum(pending));
  renderStageBudgets(all);
  const unknown=all.filter(i=>amount(i)===null).length;
  $('#budget-missing').textContent=unknown
    ?'Пока не полный бюджет: '+unknown+' позиций без суммы. Невнесённые товары не учтены.'
    :'Пока учтены только внесённые товары. Остальные добавим постепенно.';
  $('#unknown').textContent=unknown+' позиций без полной суммы';
  $('#section-total').textContent='По выборке: '+money.format(sum(filtered));
  $('#mode-summary').setAttribute('aria-pressed',String(viewMode==='summary'));
  $('#mode-rooms').setAttribute('aria-pressed',String(viewMode==='rooms'));
  $('#mode-summary').classList.toggle('active',viewMode==='summary');
  $('#mode-rooms').classList.toggle('active',viewMode==='rooms');
  $('#rows').replaceChildren();
  if(viewMode==='summary')renderSummary(filtered);else renderRoomList(filtered);
  $('#empty').hidden=filtered.length>0;
  $('#visible-count').textContent=filtered.length+' из '+all.length+' позиций';
  $('#visible-total').textContent=money.format(sum(filtered));
}
$('#mode-summary').onclick=()=>{viewMode='summary';activeRoom='';render();};
$('#mode-rooms').onclick=()=>{viewMode='rooms';render();};
const form=$('#item-form');
for(const c of CATEGORIES){const o=elem('option',c);o.value=c;form.elements.category.append(o);}
for(const r of ROOMS){const o=elem('option',ROOM_PRESETS[r]||r);o.value=r;form.elements.room.append(o);}
for(const status of STATUSES){const o=elem('option',status);o.value=status;form.elements.status.append(o);}
for(const stage of STAGES){const o=elem('option',stage);o.value=stage;form.elements.stage.append(o);}
for(const [value,label] of [['','Все этапы'],...STAGES.map(s=>[s,s])]){const o=elem('option',label);o.value=value;$('#stages').append(o);}
function openEditor(item=null){
  editing=item?.id??null;form.reset();
  $('#form-error').textContent='';
  $('#editor-title').textContent=item?'Изменить материал':'Новый материал';
  $('#delete-item').hidden=!item;
  if(item){
    for(const k of ['name','spec','unit','category','room','price','quantity','shop','status'])form.elements[k].value=item[k]??'';
    form.elements.stage.value=item.stage||inferStage(item);
    form.elements.priceApprox.checked=item.priceApprox;
    form.elements.quantityApprox.checked=item.quantityApprox;
  }else{
    form.elements.category.value=category||'Электрика';
    form.elements.room.value=activeRoom||'Общие';
    form.elements.unit.value='шт.';
    form.elements.status.value='Уточнить';
    form.elements.stage.value=stageFilter||inferStage({category:form.elements.category.value});
    form.elements.priceApprox.checked=true;
  }
  $('#editor').showModal();form.elements.name.focus();
}
form.onsubmit=event=>{
  event.preventDefault();
  try{
    const prior=state.items.find(i=>i.id===editing);
    const item=prior?{...prior}:{id:'item-'+Date.now()+'-'+Math.random().toString(36).slice(2),kind:'material',status:'Уточнить',url:''};
    for(const k of ['name','spec','category','room','unit','shop','status','stage'])item[k]=form.elements[k].value.trim();
    for(const k of ['quantity','price'])item[k]=parseNum(form.elements[k].value.trim());
    for(const k of ['quantityApprox','priceApprox'])item[k]=form.elements[k].checked;
    const next=validate({...state,items:editing?state.items.map(i=>i.id===editing?item:i):[...state.items,item]});
    if(commit(next)){$('#editor').close();notice('Материал сохранён.');}
  }catch(e){$('#form-error').textContent=e.message;}
};
$('#add').onclick=()=>openEditor();
$('#close').onclick=$('#cancel').onclick=()=>$('#editor').close();
$('#search').oninput=render;
$('#categories').onchange=()=>{materialFilter=$('#categories').value;render();};
$('#stages').onchange=()=>{stageFilter=$('#stages').value;render();};
$('#export').onclick=()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=elem('a');a.href=url;a.download='remont-haty-'+new Date().toISOString().slice(0,10)+'.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  notice('Резервная копия подготовлена.');
};
$('#import').onclick=()=>$('#file').click();
$('#file').onchange=async()=>{
  const file=$('#file').files[0];$('#file').value='';if(!file)return;
  try{
    if(file.size>5*1024*1024)throw Error('Файл слишком большой.');
    const next=mergeCatalog(validate(JSON.parse(await file.text())));
    if(!confirm('Импортировать '+next.items.length+' позиций? Текущая смета будет заменена. Предварительно экспортируйте резервную копию.'))return;
    if(localStorage.getItem(KEY)!==lastSaved)throw Error('Данные изменены в другой вкладке.');
    localStorage.setItem(BACKUP,lastSaved||JSON.stringify(state));
    readOnly=false;
    if(commit(next))notice('Смета импортирована.');
  }catch(e){notice('Импорт не выполнен: '+e.message,true);}
};
$('#restore').onclick=()=>{
  try{
    const raw=localStorage.getItem(BACKUP);
    if(!raw)throw Error('Резервной копии до импорта нет.');
    const next=mergeCatalog(validate(JSON.parse(raw)));
    if(confirm('Восстановить смету до последнего импорта?'))if(commit(next))notice('Смета восстановлена.');
  }catch(e){notice(e.message,true);}
};
$('#delete-item').onclick=()=>{
  const item=state.items.find(i=>i.id===editing);
  if(item&&confirm('Удалить «'+item.name+'»?')&&commit({...state,items:state.items.filter(i=>i.id!==editing)})){
    $('#editor').close();notice('Материал удалён.');
  }
};
window.addEventListener('storage',e=>{
  if(e.key===KEY)notice('Смета обновлена в другой вкладке. Перезагрузите страницу.',true);
});
render();
