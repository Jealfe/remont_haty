'use strict';
// Ревизия 29. В сводке материалы объединяются по виду, не по названию комнаты.
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
 [/^Кнопка без фиксации — вытяжка большого санузла$/i,'Кнопка без фиксации']
];
const allowed=/^(?:bedroom-|kitchen-|child[12]-|hall-|bath[12]-|office-)/;
const oneOff={
 'questionnaire-20261013-bed-spots':['Точечные светильники спальни','Точечный светильник'],
 'initial-66':['Основной свет детской','Потолочный светильник'],
 'initial-67':['Основной свет второй детской','Потолочный светильник']
};
function normalized(i){
 const exception=oneOff[i.id];
 if(exception&&i.name===exception[0])return exception[1];
 if(!allowed.test(i.id))return i.name;
 for(const [pattern,to] of standard)if(pattern.test(i.name))return to;
 return i.name;
}
function upgrade(data){
 if(data.catalogRevision>=29)return data;
 const items=data.items.map(item=>{
   const name=normalized(item);
   return name===item.name?item:{...item,name};
 });
 return {...data,catalogRevision:29,items};
}
const previousMerge=mergeCatalog;mergeCatalog=data=>upgrade(previousMerge(data));
const previousInitial=initial;initial=()=>upgrade(previousInitial());

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
if(state.catalogRevision<29)commit(upgrade(state));
else render();
})();
