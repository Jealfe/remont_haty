'use strict';
// Ревизия 30. В сводке материалы объединяются по виду, не по названию комнаты.
// Комната и подробное назначение остаются в полях room/spec.
// Переименовываются ТОЛЬКО прежние служебные наименования, вручную изменённые записи не трогаем.
(function(){
const standard=[
 [/^Розетки 230 В — (?:спальня|кухня-гостиная|детская №[12]|коридор|малый санузел|большой санузел|мини-кабинет)$/i,'Розетки 230 В'],
 [/^Интернет-розетк(?:а|и|ы) RJ45 — (?:спальня|кухня-гостиная|детская №[12]|мини-кабинет)$/i,'Интернет-розетка RJ45'],
 [/^Подрозетники — (?:спальня|кухня-гостиная|детская №[12]|коридор|малый санузел|большой санузел|мини-кабинет)$/i,'Подрозетники'],
 [/^Одноклавишн(?:ый выключатель|ые выключатели) — (?:детская №[12]|коридор|большой санузел|мини-кабинет)$/i,'Одноклавишный выключатель'],
 [/^Двухклавишный выключатель — (?:спальня|кухня-гостиная|малый санузел)$/i,'Двухклавишный выключатель'],
 [/^Вытяжной вентилятор — (?:малый|большой) санузел$/i,'Вытяжной вентилятор'],
 [/^Потолочный светильник — (?:прихожая|малый санузел|мини-кабинет)$/i,'Потолочный светильник'],
 [/^Настенные светильники — длинный коридор$/i,'Настенный светильник'],
 [/^Кнопка без фиксации — вытяжка большого санузла$/i,'Кнопка без фиксации'],
 [/^Терморегулятор тёплого пола — большой санузел$/i,'Терморегулятор тёплого пола'],
 [/^Нагревательный мат — большой санузел$/i,'Нагревательный мат'],
 [/^Световые линии — два уголка большого санузла$/i,'Световые линии (уголки)']
];
const allowed=/^(?:bedroom-|kitchen-|child[12]-|hall-|bath[12]-|office-)/;
const oneOff={
 'questionnaire-20261013-bed-spots':['Точечные светильники спальни','Точечный светильник'],
 'initial-66':['Основной свет детской','Потолочный светильник'],
 'initial-67':['Основной свет второй детской','Потолочный светильник'],
 'lighting-bed-line':['Спальня: комплект световой линии около 2 м','Комплект световой линии 2 м']
};
function normalized(i){
 const exception=oneOff[i.id];
 if(exception&&i.name===exception[0])return exception[1];
 if(!allowed.test(i.id))return i.name;
 for(const [pattern,to] of standard)if(pattern.test(i.name))return to;
 return i.name;
}
function upgrade(data){
 if(data.catalogRevision>=30)return data;
 const items=data.items.map(item=>{
   const name=normalized(item);
   return name===item.name?item:{...item,name};
 });
 return {...data,catalogRevision:30,items};
}
const previousMerge=mergeCatalog;mergeCatalog=data=>upgrade(previousMerge(data));
const previousInitial=initial;initial=()=>upgrade(previousInitial());

// В разделе «Кабели и провода» не должны оказываться кабельные стяжки
// и монтажные площадки: прежнее правило искало любое слово «кабел».
const originalIsWire=isWire;
isWire=function(item){
 const n=item.name||'';
 return /(?:^|[\s(])(?:кабель|провод|ввг|utp|ftp)(?:[\s:(]|$)/i.test(n)
   || /^интернет-кабель(?:[\s:]|$)/i.test(n);
};

// Два трековых комплекта разных зон одной кухни-гостиной показываем
// одной строкой только в «Сводке». В «По комнатам» названия зон остаются.
const originalBundleKey=bundleKey;
bundleKey=function(i){
 if(i.id==='lighting-kitchen-track'||i.id==='lighting-sofa-track')
   return [i.category,'комплект трекового освещения',i.unit.trim().toLocaleLowerCase('ru')].join('§');
 return originalBundleKey(i);
};
const originalBundleRow=bundleRow;
bundleRow=function(items){
 const rows=originalBundleRow(items);
 if(items.length>1&&items.every(i=>i.id==='lighting-kitchen-track'||i.id==='lighting-sofa-track')){
   const label=rows[0].querySelector('.aggregate-button span:last-child');
   if(label)label.textContent='Комплект трекового освещения';
 }
 return rows;
};

// Если у одного вида материала разные цены (например, у светильников),
// показываем диапазон вместо непонятного «разная / ?».
const originalAggregate=aggregate;
aggregate=function(items){
 const result=originalAggregate(items);
 const prices=items.map(i=>i.price);
 if(prices.length>1&&prices.every(p=>p!==null)){
   const lo=Math.min(...prices),hi=Math.max(...prices);
   if(lo!==hi)result.price=(items.some(i=>i.priceApprox)?'≈ ':'')+number.format(lo)+'–'+number.format(hi)+' ₽';
 }
 return result;
};

// Вместо "33 поз." в сводке показываем, сколько видов материалов реально видно.
const previousHeaderRow=headerRow;
headerRow=function(label,items,expanded,onclick,kind){
 const row=previousHeaderRow(label,items,expanded,onclick,kind);
 if(kind==='summary-group'){
   const note=row.querySelector('.group-label small');
   if(note)note.textContent=new Set(items.map(bundleKey)).size+' видов';
 }
 return row;
};
if(state.catalogRevision<30)commit(upgrade(state));
else render();
})();
