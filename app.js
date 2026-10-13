'use strict';
const CATEGORIES=['Электрика','Освещение','Стены','Полы','Санузлы','Потолки','Двери','Инструменты','Прочее'];
const STATUSES=['Уточнить','Запланировано','В корзине','Куплено'];
const KEY='remont-haty-v1', BACKUP=KEY+'-before-import';
const money=new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:2});
const number=new Intl.NumberFormat('ru-RU',{maximumFractionDigits:3});
let seq=0;
function seed(category,name,spec,quantity,unit,price,kind='material',url='',quantityApprox=false){return {id:'initial-'+(++seq),category,name,spec,quantity,unit,price,kind,url,quantityApprox,priceApprox:price!==null,status:'Уточнить'};}
function initial(){return {version:1,updatedAt:new Date().toISOString(),items:[
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
function parseNum(v){if(v===null||v==='')return null;if(typeof v==='number'){if(!Number.isFinite(v)||v<0||v>1e9)throw Error('Число должно быть от 0 до 1 000 000 000.');return v;}if(typeof v!=='string'||!/^\d+(?:[.,]\d{1,3})?$/.test(v.trim()))throw Error('Введите неотрицательное число, например 12,5.');return parseNum(Number(v.trim().replace(',','.')));}
function safeUrl(v){if(!v)return '';const u=new URL(v);if(!['http:','https:'].includes(u.protocol))throw Error('Ссылка должна начинаться с https:// или http://');return u.href;}
function validate(data){if(!data||data.version!==1||!Array.isArray(data.items)||data.items.length>5000)throw Error('Нужен JSON сметы версии 1 (до 5000 позиций).');const ids=new Set();return {version:1,updatedAt:new Date().toISOString(),items:data.items.map(i=>{if(!i||typeof i.id!=='string'||!i.id||i.id.length>100||ids.has(i.id))throw Error('Некорректные или повторяющиеся идентификаторы.');ids.add(i.id);for(const [k,max] of [['name',150],['spec',2000],['unit',20],['url',2000]])if(typeof i[k]!=='string'||i[k].length>max)throw Error('Некорректное поле: '+k);if(!i.name.trim()||!i.unit.trim()||!CATEGORIES.includes(i.category)||!STATUSES.includes(i.status)||!['material','labor'].includes(i.kind)||typeof i.priceApprox!=='boolean'||typeof i.quantityApprox!=='boolean')throw Error('Проверьте категории, типы и статусы позиций.');return {id:i.id,category:i.category,name:i.name.trim(),spec:i.spec,unit:i.unit.trim(),url:safeUrl(i.url),kind:i.kind,status:i.status,price:parseNum(i.price),quantity:parseNum(i.quantity),priceApprox:i.priceApprox,quantityApprox:i.quantityApprox};})};}
function amount(i){return i.quantity===null||i.price===null?null:Math.round(i.quantity*i.price*100)/100;}
function sum(items){return items.reduce((s,i)=>s+(amount(i)??0),0);}
const $=s=>document.querySelector(s);let state,category='',editing=null,readOnly=false,lastSaved=null;
try{lastSaved=localStorage.getItem(KEY);state=lastSaved?validate(JSON.parse(lastSaved)):initial();}catch(e){state=initial();readOnly=true;setTimeout(()=>notice('Сохранение недоступно или данные повреждены. Экспортируйте данные; импорт корректной копии восстановит работу.',true),0);}
function notice(msg,persist=false){$('#toast').textContent=msg;$('#toast').classList.add('visible');clearTimeout(notice.timer);if(!persist)notice.timer=setTimeout(()=>$('#toast').classList.remove('visible'),4500);}
function commit(next){try{if(readOnly)throw Error('Сохранение заблокировано. Сначала импортируйте резервную копию или откройте сайт в обычном режиме браузера.');if(localStorage.getItem(KEY)!==lastSaved)throw Error('Смета изменена в другой вкладке. Обновите страницу перед редактированием.');next.updatedAt=new Date().toISOString();const raw=JSON.stringify(next);localStorage.setItem(KEY,raw);lastSaved=raw;state=next;$('#save-state').textContent='Сохранено в этом браузере';render();return true;}catch(e){notice(e.message,true);return false;}}
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function render(){
 $('#total').textContent=money.format(sum(state.items));$('#materials').textContent=money.format(sum(state.items.filter(i=>i.kind==='material')));$('#labor').textContent=money.format(sum(state.items.filter(i=>i.kind==='labor')));$('#bought').textContent=money.format(sum(state.items.filter(i=>i.status==='Куплено')));$('#unknown').textContent=state.items.filter(i=>amount(i)===null).length+' позиций без полной суммы';
 const query=$('#search').value.toLocaleLowerCase('ru');const items=state.items.filter(i=>(!category||i.category===category)&&(!$('#type-filter').value||i.kind===$('#type-filter').value)&&(!$('#status-filter').value||i.status===$('#status-filter').value)&&[i.name,i.spec,i.category].join(' ').toLocaleLowerCase('ru').includes(query));
 $('#rows').replaceChildren();for(const i of items){const row=el('tr');const title=el('td');const name=el('button',i.name,'item-name');name.setAttribute('aria-label','Открыть карточку: '+i.name);name.onclick=()=>openEditor(i);title.append(name);row.append(title);row.onclick=e=>{if(!e.target.closest('button,select,option'))openEditor(i);};
 for(const [label,value] of [['Количество',i.quantity===null?'Уточнить':(i.quantityApprox?'≈ ':'')+number.format(i.quantity)+' '+i.unit],['Цена / ед.',i.price===null?'Уточнить':(i.priceApprox?'≈ ':'')+money.format(i.price)+' / '+i.unit],['Сумма',amount(i)===null?'—':((i.priceApprox||i.quantityApprox)?'≈ ':'')+money.format(amount(i))]]){const td=el('td',value,'money');td.dataset.label=label;row.append(td)}
 const sd=el('td'),select=el('select',undefined,'status');select.dataset.status=i.status;select.setAttribute('aria-label','Статус: '+i.name);for(const s of STATUSES){const o=el('option',s);o.value=s;select.append(o)}select.value=i.status;select.onchange=()=>{if(!commit({...state,items:state.items.map(x=>x.id===i.id?{...x,status:select.value}:x)}))select.value=i.status;};sd.append(select);row.append(sd);
 $('#rows').append(row)}
 $('#empty').hidden=items.length>0;$('#visible-count').textContent='Показано '+items.length+' из '+state.items.length;$('#visible-total').textContent='По фильтру: '+money.format(sum(items));
}
for(const c of ['',...CATEGORIES]){const o=el('option',c||'Все категории');o.value=c;$('#categories').append(o)}$('#categories').onchange=()=>{category=$('#categories').value;render()};
const form=$('#item-form');for(const c of CATEGORIES){const o=el('option',c);o.value=c;form.elements.category.append(o)}
function openEditor(i=null){editing=i?.id??null;form.reset();$('#form-error').textContent='';$('#editor-title').textContent=i?'Карточка позиции':'Новая позиция';$('#delete-item').hidden=!i;if(i){for(const k of ['name','spec','unit','url','category','kind','status','price','quantity'])form.elements[k].value=i[k]??'';form.elements.priceApprox.checked=i.priceApprox;form.elements.quantityApprox.checked=i.quantityApprox;}else{form.elements.category.value=category||'Электрика';form.elements.unit.value='шт.';}$('#editor').showModal();form.elements.name.focus();}
form.onsubmit=e=>{e.preventDefault();try{const i={id:editing||('item-'+Date.now()+'-'+Math.random().toString(36).slice(2))};for(const k of ['name','spec','unit','url','category','kind','status'])i[k]=form.elements[k].value.trim();for(const k of ['quantity','price'])i[k]=parseNum(form.elements[k].value.trim());for(const k of ['priceApprox','quantityApprox'])i[k]=form.elements[k].checked;i.url=safeUrl(i.url);const next=validate({...state,items:editing?state.items.map(x=>x.id===editing?i:x):[...state.items,i]});if(commit(next)){$('#editor').close();notice('Позиция сохранена.')}}catch(err){$('#form-error').textContent=err.message}};
$('#add').onclick=()=>openEditor();$('#close').onclick=$('#cancel').onclick=()=>$('#editor').close();for(const id of ['search','type-filter','status-filter'])$('#'+id).addEventListener(id==='search'?'input':'change',render);
$('#export').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=el('a');a.href=url;a.download='remont-haty-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notice('Копия JSON подготовлена для скачивания.');};
$('#import').onclick=()=>$('#file').click();$('#file').onchange=async()=>{const file=$('#file').files[0];$('#file').value='';if(!file)return;try{if(file.size>5*1024*1024)throw Error('Файл слишком большой (максимум 5 МБ).');const next=validate(JSON.parse(await file.text()));if(!confirm('Импортировать '+next.items.length+' позиций? Текущая смета будет заменена. Её копия останется в браузере; для надёжного хранения предварительно экспортируйте JSON.'))return;const old=localStorage.getItem(KEY);if(old!==lastSaved)throw Error('Данные изменены в другой вкладке. Обновите страницу.');localStorage.setItem(BACKUP,old||JSON.stringify(state));readOnly=false;if(commit(next))notice('Смета импортирована.');}catch(e){notice('Импорт не выполнен: '+e.message,true)}};
$('#restore').onclick=()=>{try{const raw=localStorage.getItem(BACKUP);if(!raw)throw Error('Версии до импорта пока нет.');const next=validate(JSON.parse(raw));if(confirm('Заменить смету версией до последнего импорта?')){if(commit(next))notice('Предыдущая версия восстановлена.')}}catch(e){notice(e.message,true)}};
window.addEventListener('storage',e=>{if(e.key===KEY)notice('Смета изменена в другой вкладке. Обновите страницу.',true)});
render();


$('#delete-item').onclick=()=>{const i=state.items.find(x=>x.id===editing);if(i&&confirm('Удалить «'+i.name+'» из сметы?')&&commit({...state,items:state.items.filter(x=>x.id!==editing)})){$('#editor').close();notice('Позиция удалена.')}};
