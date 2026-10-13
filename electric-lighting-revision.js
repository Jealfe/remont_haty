'use strict';
(function(){
const setPrices=[
 ['questionnaire-20261013-bed-spots','Точечные светильники спальни',650],
 ['hall-20261013-ceiling-light','Потолочный светильник — прихожая',2500],
 ['hall-20261013-wall-lights','Настенные светильники — длинный коридор',2000],
 ['bath1-fan','Вытяжной вентилятор — малый санузел',3000],
 ['bath2-ceiling-lines','Световые линии — два уголка большого санузла',6500],
 ['bath2-fan','Вытяжной вентилятор — большой санузел',3500],
 ['bath2-thermostat','Терморегулятор тёплого пола — большой санузел',4000],
 ['bath2-heating-mat','Нагревательный мат — большой санузел',12000],
 ['office-light','Потолочный светильник — мини-кабинет',2500]
];
const extras=[
 ['lighting-bed-line','Спальня: комплект световой линии около 2 м','Спальня',4000,'Комплект одной световой линии 2 м: профиль, рассеиватель, COB-лента 24 В и блок питания. Примерный бюджет, параметры уточнить.'],
 ['lighting-kitchen-track','Кухня: комплект трекового освещения','Кухня',7000,'Трек над рабочей зоной кухни, одна группа с уже имеющейся люстрой обеденного стола. Длина и число трековых светильников после проекта. Не добавлять люстру повторно.'],
 ['lighting-sofa-track','Гостиная: комплект трекового освещения','Кухня',7000,'Отдельная группа над диваном, ориентир четыре светильника; примерный комплект с шинопроводом.'],
 ['lighting-bath2-timer','Таймер вытяжки по нажатию кнопки — резерв','Санузел 2',1800,'Только если выбранный вентилятор не обеспечивает импульсный пуск с отключением через 15 минут. Если функция встроена, убрать дополнительный таймер.']
];
function upgrade(data){
 if(data.catalogRevision>=28)return data;
 const items=data.items.map(x=>{
  const c=setPrices.find(t=>t[0]===x.id);
  if(!c||x.name!==c[1]||x.price!==null||x.status==='Куплено')return x;
  return {...x,price:c[2],priceApprox:true,spec:x.spec+' Цена — предварительный бюджет без выбранной модели, монтажа и проверки комплектации.'};
 });
 for(const [id,name,room,price,spec] of extras){
  if(items.some(x=>x.id===id||(x.room===room&&x.name===name)))continue;
  items.push({id,name,room,category:name.includes('Таймер')?'Электрика':'Освещение',stage:name.includes('Таймер')?'Электрика':'Потолки и освещение',quantity:1,unit:'компл.',price,spec,kind:'material',priceApprox:true,quantityApprox:false,status:'Запланировано',shop:'',url:''});
 }
 return {...data,catalogRevision:28,items};
}
const pm=mergeCatalog;mergeCatalog=d=>upgrade(pm(d));
const pi=initial;initial=()=>upgrade(pi());
if(state.catalogRevision<28)commit(upgrade(state));
})();