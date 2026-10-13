'use strict';
const CATEGORIES=['Электрика','Освещение','Стены','Полы','Санузлы','Потолки','Двери','Инструменты','Прочее'];
const STATUSES=['Уточнить','Запланировано','В корзине','Куплено'];
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
  'Санузел 1':'Ванная',
  'Санузел 2':'Второй санузел',
  'Комната 2':'Детская / комната 2',
  'Комната 3':'Детская / комната 3'
};
const MIGRATION_BACKUP=KEY+'-before-rooms';
function inferRoom(item){
  if(item.category==='Освещение'&&['COB-лента для спальни','Встраиваемый алюминиевый профиль','Рассеиватель','Блок питания 24 В','Диммер для ленты 24 В'].includes(item.name))return 'Спальня';
  if(item.category==='Санузлы'&&['Нагревательный мат','Программируемый терморегулятор'].includes(item.name))return 'Санузел 1';
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
function initial(){
  const raw=baseInitial();
  return {...raw,catalogRevision:2,items:[...raw.items.filter(i=>i.kind==='material').map(i=>({...i,room:inferRoom(i)})),...additions()]};
}
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
    for(const [k,max] of [['name',150],['spec',2000],['unit',20],['url',2000]]){
      if(typeof i[k]!=='string'||i[k].length>max)throw Error('Некорректное поле: '+k);
    }
    if(!i.name.trim()||!i.unit.trim()||!CATEGORIES.includes(i.category)||!STATUSES.includes(i.status)||!['material','labor'].includes(i.kind)||typeof i.priceApprox!=='boolean'||typeof i.quantityApprox!=='boolean')throw Error('Некорректные параметры позиции.');
    return {id:i.id,name:i.name.trim(),spec:i.spec,category:i.category,room:ROOMS.includes(i.room)?i.room:inferRoom(i),unit:i.unit.trim(),quantity:parseNum(i.quantity),price:parseNum(i.price),quantityApprox:i.quantityApprox,priceApprox:i.priceApprox,status:i.status,kind:i.kind,url:safeUrl(i.url)};
  });
  return {version:1,catalogRevision:Number.isInteger(data.catalogRevision)?data.catalogRevision:0,updatedAt:new Date().toISOString(),items};
}
function mergeCatalog(data){
  if(data.catalogRevision>=2)return data;
  // Старые строки пользователя остаются нетронутыми, добавляем только новые.
  const existingIds=new Set(data.items.map(i=>i.id));
  const existingNames=new Set(data.items.map(i=>[i.room,i.category,i.name].join('|').toLocaleLowerCase('ru')));
  baseInitial(); // Сброс счётчика, чтобы дополнительные позиции имели стабильные ID.
  const extra=additions().filter(i=>!existingIds.has(i.id)&&!existingNames.has([i.room,i.category,i.name].join('|').toLocaleLowerCase('ru')));
  return {...data,catalogRevision:2,items:[...data.items,...extra]};
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
function materials(){return state.items.filter(i=>i.kind==='material');}
function renderRooms(){
  const nav=$('#rooms');nav.replaceChildren();
  const all=materials();
  for(const room of ['',...ROOMS]){
    const count=room?all.filter(i=>i.room===room).length:all.length;
    const label=(room?ROOM_PRESETS[room]||room:'Вся квартира')+' · '+count;
    const b=elem('button',label,'room-tab'+(room===activeRoom?' active':''));
    b.type='button';b.setAttribute('aria-pressed',String(room===activeRoom));
    b.onclick=()=>{activeRoom=room;render()};
    nav.append(b);
  }
}
function render(){
  const all=materials();
  $('#total').textContent=money.format(sum(all));
  const current=activeRoom?all.filter(i=>i.room===activeRoom):all;
  $('#section-total').textContent=(activeRoom?(ROOM_PRESETS[activeRoom]||activeRoom):'Вся квартира')+': '+money.format(sum(current));
  $('#unknown').textContent=all.filter(i=>amount(i)===null).length+' позиций без полной суммы';
  const query=$('#search').value.trim().toLocaleLowerCase('ru');
  const filtered=all.filter(i=>(!activeRoom||i.room===activeRoom)&&(!category||i.category===category)&&[i.name,i.spec,i.category,i.room].join(' ').toLocaleLowerCase('ru').includes(query));
  filtered.sort((a,b)=>ROOMS.indexOf(a.room)-ROOMS.indexOf(b.room)||CATEGORIES.indexOf(a.category)-CATEGORIES.indexOf(b.category)||a.name.localeCompare(b.name,'ru'));
  renderRooms();$('#rows').replaceChildren();
  let prevRoom=null,prevCategory=null;
  for(const i of filtered){
    if(prevRoom!==i.room){
      prevRoom=i.room;prevCategory=null;
      const row=elem('tr',undefined,'room-group');
      const td=elem('td');td.colSpan=5;
      const byRoom=filtered.filter(x=>x.room===i.room);
      td.append(elem('strong',ROOM_PRESETS[i.room]||i.room),elem('span',byRoom.length+' поз. · '+money.format(sum(byRoom))));
      row.append(td);$('#rows').append(row);
    }
    if(prevCategory!==i.category){
      prevCategory=i.category;
      const row=elem('tr',undefined,'category-group');
      const td=elem('td',i.category);td.colSpan=5;
      row.append(td);$('#rows').append(row);
    }
    const row=elem('tr',undefined,'item-row');
    const name=elem('td');
    const button=elem('button',i.name,'item-name');
    button.setAttribute('aria-label','Изменить материал: '+i.name);
    button.onclick=()=>openEditor(i);
    name.append(button);row.append(name);
    row.onclick=e=>{if(!e.target.closest('button'))openEditor(i)};
    const spec=elem('td',i.spec||'—','spec-cell');row.append(spec);
    const cells=[
      ['Количество',i.quantity===null?'Уточнить':(i.quantityApprox?'≈ ':'')+number.format(i.quantity)+' '+i.unit],
      ['Цена / ед.',i.price===null?'Уточнить':(i.priceApprox?'≈ ':'')+money.format(i.price)],
      ['Сумма',amount(i)===null?'—':((i.quantityApprox||i.priceApprox)?'≈ ':'')+money.format(amount(i))]
    ];
    for(const [label,value] of cells){
      const td=elem('td',value,'money');td.dataset.label=label;row.append(td);
    }
    $('#rows').append(row);
  }
  $('#empty').hidden=filtered.length!==0;
  $('#visible-count').textContent='Показано '+filtered.length+' из '+all.length;
  $('#visible-total').textContent='Сумма выбранного: '+money.format(sum(filtered));
}
for(const c of ['',...CATEGORIES]){
  const option=elem('option',c||'Все виды материалов');option.value=c;$('#categories').append(option);
}
const form=$('#item-form');
for(const c of CATEGORIES){const o=elem('option',c);o.value=c;form.elements.category.append(o);}
for(const r of ROOMS){const o=elem('option',ROOM_PRESETS[r]||r);o.value=r;form.elements.room.append(o);}
function openEditor(item=null){
  editing=item?.id??null;form.reset();
  $('#form-error').textContent='';
  $('#editor-title').textContent=item?'Изменить материал':'Новый материал';
  $('#delete-item').hidden=!item;
  if(item){
    for(const k of ['name','spec','unit','category','room','price','quantity'])form.elements[k].value=item[k]??'';
    form.elements.priceApprox.checked=item.priceApprox;
    form.elements.quantityApprox.checked=item.quantityApprox;
  }else{
    form.elements.category.value=category||'Электрика';
    form.elements.room.value=activeRoom||'Общие';
    form.elements.unit.value='шт.';
    form.elements.priceApprox.checked=true;
  }
  $('#editor').showModal();form.elements.name.focus();
}
form.onsubmit=event=>{
  event.preventDefault();
  try{
    const prior=state.items.find(i=>i.id===editing);
    const item=prior?{...prior}:{id:'item-'+Date.now()+'-'+Math.random().toString(36).slice(2),kind:'material',status:'Уточнить',url:''};
    for(const k of ['name','spec','category','room','unit'])item[k]=form.elements[k].value.trim();
    for(const k of ['quantity','price'])item[k]=parseNum(form.elements[k].value.trim());
    for(const k of ['quantityApprox','priceApprox'])item[k]=form.elements[k].checked;
    const next=validate({...state,items:editing?state.items.map(i=>i.id===editing?item:i):[...state.items,item]});
    if(commit(next)){$('#editor').close();notice('Материал сохранён.');}
  }catch(e){$('#form-error').textContent=e.message;}
};
$('#add').onclick=()=>openEditor();
$('#close').onclick=$('#cancel').onclick=()=>$('#editor').close();
$('#search').oninput=render;
$('#categories').onchange=()=>{category=$('#categories').value;render();};
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
