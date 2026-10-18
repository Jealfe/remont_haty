'use strict';
// Ревизия 32: владелец согласовал рабочий зональный расчёт щита.
// 20 обычных автоматов, 7 групповых УЗО, две отдельные линии пенала.
// Параметры вводной сети неизвестны: это сметный ориентир, не готовый проект.
// Ранее изменённые вручную или купленные позиции не перезаписывать.
(function(){
const previousId='panel-rcbo';
const oldName='Дифавтоматы групп 1P+N, тип A, 30 мА';
const oldSpec='Предварительно 26 независимых групп: 5 освещения, 9 общих розеточных, 12 выделенных линий. Ориентир 6 кА, тип A, по 2 модуля. Номиналы 10/16/20/25/32 А только после расчёта и проверки вводной мощности. Отдельные УЗО не нужны при такой схеме.';
const oldFrameName='Корпус квартирного щита 72 модуля';
const oldFrameSpec='Для ориентировочно 26 двухмодульных дифавтоматов, вводного аппарата и реле напряжения. Замер места и проверка существующего щита до покупки.';
const oldPartsSpec='Предварительный комплект внутренней сборки щита и подключений 26 групп, без стоимости работы электрика.';
const groupInfo='Черновой зональный расчёт: 20 групп, в том числе две отдельные линии для кухонного пенала. Номиналы и отключающая способность по кабелям и мощности; число фаз и параметры ввода пока неизвестны. Это бюджет, не заказ к покупке.';
function isOriginalBreaker(x){
 return x.id===previousId&&x.name===oldName&&x.spec===oldSpec&&x.quantity===26&&x.unit==='шт.'&&x.price===2300&&x.room==='Общие'&&x.status==='Запланировано';
}
function upgrade(d){
 if(d.catalogRevision>=32)return d;
 const original=d.items.find(x=>x.id===previousId);
 const canReplace=original&&isOriginalBreaker(original);
 let items=d.items.filter(x=>!(canReplace&&isOriginalBreaker(x)));
 if(canReplace){
   const templates=[
    {id:'panel-zone-breakers',name:'Автоматические выключатели — зональные линии',quantity:20,price:450,spec:groupInfo},
    {id:'panel-zone-rcds',name:'УЗО тип A 30 мА — зональная защита',quantity:7,price:2800,spec:'Черновой вариант: семь двухполюсных групповых УЗО, условно по два модуля. Распределение линий в плане электрики. Тип, номинал, суммарные токи утечки и защита от перегрузки требуют расчёта по фактическому вводу. Обязательно раздельные N-шины групп.'}
   ];
   for(const x of templates){
     if(items.some(e=>e.id===x.id||(e.room==='Общие'&&e.name===x.name)))continue;
     items.push({...x,room:'Общие',category:'Электрика',stage:'Электрика',kind:'material',unit:'шт.',status:'Уточнить',priceApprox:true,quantityApprox:true,shop:'',url:''});
   }
 }
 items=items.map(x=>{
   if(x.id==='panel-case'&&x.name===oldFrameName&&x.spec===oldFrameSpec&&x.quantity===1&&x.price===9500&&x.status==='Запланировано')
     return {...x,name:'Корпус квартирного щита 48 модулей',spec:'Предварительно однофазный щит: 20 одномодульных автоматов + 7 двухмодульных УЗО = 34 модуля, ориентировочно 4 модуля вводного аппарата и реле, запас около 10. Сохранён старый ценовой резерв 9 500 ₽, точная цена не выбрана; размеры и комплектация после проверки ввода.',status:'Уточнить'};
   if(x.id==='panel-parts'&&x.spec===oldPartsSpec&&x.quantity===1&&x.price===5000&&x.status==='Запланировано')
     return {...x,spec:'Предварительный набор шин N/PE, гребёнок, клемм и маркировки для 20 автоматов и 7 групповых УЗО. Раздельные N-группы; без работ электрика. Состав и цена пока ориентировочные.',status:'Уточнить'};
   return x;
 });
 return {...d,catalogRevision:32,items};
}
const pm=mergeCatalog;mergeCatalog=d=>upgrade(pm(d));
const pi=initial;initial=()=>upgrade(pi());
if(state.catalogRevision<32)commit(upgrade(state));
})();