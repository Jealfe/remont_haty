'use strict';

/*
 * Ремонт Хаты — предварительные размеры квартиры.
 * Единственный источник данных для страницы dimensions.html.
 * Значения переданы владельцем 13 октября 2026 года.
 * Все размеры в миллиметрах. Высота 2700 мм — временный расчётный ориентир.
 * После получения ключей измерения и привязку дверей нужно проверить.
 */
const APARTMENT_DIMENSIONS={
  updated:'2026-10-13',
  ceilingHeightMm:2700,
  status:'Предварительно, до получения ключей',
  rooms:[
    {id:'bedroom',name:'Наша спальня',shape:'rectangle',lengthMm:5150,widthMm:3120,
      openings:[{kind:'Дверной проём',widthMm:900},{kind:'Дверной проём',widthMm:800},{kind:'Балконное окно / проём',widthMm:1570}],
      note:'У балконного проёма известна ширина 1570 мм; тип и высота уточняются.'},
    {id:'kitchen',name:'Кухня-гостиная',shape:'rectangle',lengthMm:6500,widthMm:3180,
      openings:[{kind:'Окно',widthMm:1830},{kind:'Дверной проём',widthMm:900}]},
    {id:'child1',name:'Детская 1',shape:'rectangle',lengthMm:4480,widthMm:2950,
      openings:[{kind:'Окно',widthMm:1830},{kind:'Дверной проём',widthMm:800}]},
    {id:'child2',name:'Детская 2',shape:'rectangle',lengthMm:3870,widthMm:3350,
      openings:[{kind:'Окно',widthMm:1440},{kind:'Дверной проём',widthMm:800}]},
    {id:'bath1',name:'Санузел 1 · душ',shape:'rectangle',lengthMm:1750,widthMm:2870,openings:[],
      note:'Малый санузел при спальне: душевая кабина Loranto 120×80, унитаз от застройщика, раковина предположительно тоже. Нужно запустить первым для переезда.'},
    {id:'bath2',name:'Санузел 2 · ванна',shape:'rectangle',lengthMm:2030,widthMm:3330,openings:[],
      note:'Большой основной санузел с ванной, тёплым полом, стиральной машиной, будущей сушильной машиной и бойлером. Полную отделку можно сделать позднее.'},
    {id:'storage',name:'Кладовая / мини-офис',shape:'rectangle',lengthMm:2270,widthMm:1770,openings:[],
      note:'Подтверждено: тот же линолеум, что и во всех жилых помещениях. По предварительному раскрою вырезается из остатка коридорного отреза, без дополнительной закупки. Требуется проверка геометрии, направления рисунка и пригодности обрезка.'},
    {id:'hall',name:'Коридор (Г-образный)',shape:'L',openings:[],
      // Площадь по формуле пользователя: 5880×1100 + 2370×(3080−1100).
      first:{lengthMm:5880,widthMm:1100},
      second:{lengthMm:2370,fullWidthMm:3080,subtractWidthMm:1100},
      note:'Со слов владельца, к коридору относятся все дверные проёмы, кроме санузла 1. Без расположения плеч Г и дверей точный периметр стен пока не определён.'}
  ]
};
function floorAreaMm2(room){
  if(room.shape==='rectangle')return room.lengthMm*room.widthMm;
  return room.first.lengthMm*room.first.widthMm+
    room.second.lengthMm*(room.second.fullWidthMm-room.second.subtractWidthMm);
}
function perimeterMm(room){
  return room.shape==='rectangle'?2*(room.lengthMm+room.widthMm):null;
}
function squareMeters(room){return floorAreaMm2(room)/1000000;}
function wallArea(room){
  const perimeter=perimeterMm(room);
  return perimeter===null?null:perimeter*APARTMENT_DIMENSIONS.ceilingHeightMm/1000000;
}

const FLOORING_COMPARE={
  trimMm:100, // +10 см к размеру каждой цельной заготовки
  options:[
    {id:'roberta',name:'Tarkett «Дуб Роберта»',article:'231116003',rollWidthMm:3500,priceRubSqM:875,thicknessMm:3.5,wearLayerMm:0.4,class:32},
    {id:'kasli',name:'Kreaforta «Касли»',article:'89441404',rollWidthMm:4000,priceRubSqM:915,thicknessMm:4.6,wearLayerMm:0.4,class:32}
  ]
};
function flooringCutPlan(option){
  const trim=FLOORING_COMPARE.trimMm;
  const byName=new Map(APARTMENT_DIMENSIONS.rooms.map(r=>[r.id,r]));
  const cuts=['bedroom','kitchen','child1','child2'].map(id=>{
    const r=byName.get(id);
    const usual={cutLengthMm:Math.max(r.lengthMm,r.widthMm)+trim,cutAcrossMm:Math.min(r.lengthMm,r.widthMm)+trim};
    const alternative={cutLengthMm:Math.min(r.lengthMm,r.widthMm)+trim,cutAcrossMm:Math.max(r.lengthMm,r.widthMm)+trim};
    const chosen=alternative.cutAcrossMm<=option.rollWidthMm?alternative:usual;
    return {id,name:r.name,...chosen,fit:chosen.cutAcrossMm<=option.rollWidthMm};
  });
  const hall=byName.get('hall'),store=byName.get('storage');
  const hallCutLengthMm=hall.first.lengthMm+trim;
  const hallCutAcrossMm=hall.second.fullWidthMm+trim;
  const spacePastSecondMm=hallCutLengthMm-(hall.second.lengthMm+trim);
  const freeSideMm=option.rollWidthMm-(hall.first.widthMm+trim);
  const storeFits=spacePastSecondMm>=store.lengthMm+trim&&freeSideMm>=store.widthMm+trim;
  cuts.push({
    id:'hall-and-storage',
    name:'Коридор + кладовая*',
    cutLengthMm:hallCutLengthMm,
    cutAcrossMm:hallCutAcrossMm,
    fit:hallCutAcrossMm<=option.rollWidthMm&&storeFits
  });
  const totalLm=cuts.reduce((s,c)=>s+c.cutLengthMm,0)/1000;
  const buySqM=totalLm*option.rollWidthMm/1000;
  return {option,cuts,totalLm,buySqM,priceRub:buySqM*option.priceRubSqM,
    allFit:cuts.every(c=>c.fit),hallAndStoreFromOneCut:storeFits};
}
function drawFlooringCompare(){
  const [roberta,kasli]=FLOORING_COMPARE.options.map(flooringCutPlan);
  const rub=n=>new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0}).format(n);
  byId('floor-roberta').textContent=rub(roberta.priceRub);
  byId('floor-kasli').textContent=rub(kasli.priceRub);
  byId('floor-savings').textContent=rub(kasli.priceRub-roberta.priceRub);
  byId('floor-roberta-buy').textContent=precision(roberta.buySqM)+' м²';
  byId('floor-kasli-buy').textContent=precision(kasli.buySqM)+' м²';
  const table=byId('flooring-rows');
  for(let index=0;index<roberta.cuts.length;index++){
    const a=roberta.cuts[index],b=kasli.cuts[index];
    const tr=create('tr');
    const length=precision(a.cutLengthMm/1000);
    for(const value of [a.name,length,precision(a.cutLengthMm*roberta.option.rollWidthMm/1e6),rub(a.cutLengthMm*roberta.option.rollWidthMm/1e6*roberta.option.priceRubSqM),precision(b.cutLengthMm*kasli.option.rollWidthMm/1e6),rub(b.cutLengthMm*kasli.option.rollWidthMm/1e6*kasli.option.priceRubSqM)])
      tr.append(create('td',value));
    table.append(tr);
  }
  if(!roberta.allFit||!kasli.allFit)
    byId('floor-fit-note').textContent='ВНИМАНИЕ: одна из заготовок не помещается в выбранную ширину рулона. Требуется другой раскрой.';
  else
    byId('floor-fit-note').textContent='*Кладовая 2,27×1,77 м тоже покрывается тем же линолеумом. В расчёте она предполагается из остатка от Г-образного коридора, без дополнительного отреза. Это возможно только при подходящих реальных размерах, геометрии; подтвердить раскрой до покупки.';
}

const precision=(n,digits=2)=>n.toLocaleString('ru-RU',{minimumFractionDigits:digits,maximumFractionDigits:digits});
const byId=id=>document.getElementById(id);
const create=(tag,value,cls)=>{
  const item=document.createElement(tag);
  if(value!==undefined)item.textContent=value;
  if(cls)item.className=cls;
  return item;
};
function main(){
  const rooms=APARTMENT_DIMENSIONS.rooms;
  const total=rooms.reduce((s,r)=>s+squareMeters(r),0);
  const bathIds=new Set(['bath1','bath2']);
  const linoleumRooms=new Set(['bedroom','kitchen','child1','child2','hall','storage']);
  const dry=rooms.filter(r=>!bathIds.has(r.id)).reduce((s,r)=>s+squareMeters(r),0);
  const base=rooms.filter(r=>linoleumRooms.has(r.id)).reduce((s,r)=>s+squareMeters(r),0);
  byId('total-area').textContent=precision(total)+' м²';
  byId('dry-area').textContent=precision(dry)+' м²';
  byId('linoleum-area').textContent=precision(base)+' м²';
  byId('height').textContent=precision(APARTMENT_DIMENSIONS.ceilingHeightMm/1000,2)+' м';
  drawFlooringCompare();
  const target=byId('dimension-rows');
  for(const room of rooms){
    const tr=create('tr',undefined,'dimension-row');
    const shape=room.shape==='rectangle'
      ?room.lengthMm+' × '+room.widthMm
      :room.first.lengthMm+' × '+room.first.widthMm+' + '+room.second.lengthMm+' × ('+room.second.fullWidthMm+' − '+room.second.subtractWidthMm+')';
    const values=[
      ['Помещение',room.name],
      ['Размер, мм',shape],
      ['Пол, м²',precision(squareMeters(room))],
      ['Периметр, м',perimeterMm(room)===null?'Уточнить':precision(perimeterMm(room)/1000)],
      ['Стены, м²',wallArea(room)===null?'Уточнить':precision(wallArea(room))]
    ];
    for(let col=0;col<values.length;col++){
      const td=create('td',values[col][1],col===0?'room-name':col>1?'number-cell':'size-cell');
      td.dataset.label=values[col][0];
      tr.append(td);
    }
    target.append(tr);
  }
  const openings=byId('opening-list');
  for(const room of rooms){
    const item=create('li');
    item.append(create('strong',room.name+': '));
    const entries=room.openings.length
      ?room.openings.map(o=>o.kind+' '+o.widthMm+' мм').join('; ')
      :'размеры проёмов не указаны';
    item.append(document.createTextNode(entries+(room.note?'. '+room.note:'')));
    openings.append(item);
  }
  const heightMm=APARTMENT_DIMENSIONS.ceilingHeightMm;
  const rollWidthMm=1060,rollLengthMm=10000,trimMm=100;
  const stripsPerRoll=Math.floor(rollLengthMm/(heightMm+trimMm));
  // Ориентиры по ранее сохранённым артикулам; бюджет детских условный.
  // Кладовая: рисунок и цена ещё не обсуждались, сумму не подставлять.
  // Коридор: периметр Г-образной фигуры пока НЕ подтверждён.
  const wallpaperPlans=[
    {id:'bedroom',price:1290,priceState:'Сочетание двух артикулов, 6 рулонов суммарно'},
    {id:'kitchen',price:2300,priceState:'9294-17, без подгонки по данным владельца'},
    {id:'child1',price:1500,priceState:'Только бюджетный ориентир, обои не выбраны',provisional:true},
    {id:'child2',price:1500,priceState:'Только бюджетный ориентир, обои не выбраны',provisional:true},
    {id:'hall',price:2500,perimeterGuessMm:17920,priceState:'60977-04, периметр и число проёмов уточнить',perimeterProvisional:true},
    {id:'storage',price:null,priceState:'Обои и цена не выбраны'}
  ];
  const rub=n=>new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0}).format(n);
  const estimateTable=byId('wallpaper-rows');
  let totalRolls=0,pricedTotal=0,provisionalTotal=0;
  for(const plan of wallpaperPlans){
    const room=rooms.find(r=>r.id===plan.id);
    const perimeter=plan.perimeterGuessMm||perimeterMm(room);
    const stripes=Math.ceil(perimeter/rollWidthMm);
    const rolls=Math.ceil(stripes/stripsPerRoll);
    totalRolls+=rolls;
    if(plan.price!==null){
      if(plan.provisional)provisionalTotal+=rolls*plan.price;
      else pricedTotal+=rolls*plan.price;
    }
    const tr=create('tr');
    const cells=[
      room.name,
      (plan.perimeterProvisional?'≈ ':'')+precision(perimeter/1000)+' м',
      stripes+' полос',
      rolls+' рул.',
      plan.price===null?'Не выбраны':(plan.provisional?'≈ ':'')+rub(plan.price),
      plan.price===null?'—':(plan.provisional?'≈ ':'')+rub(rolls*plan.price)
    ];
    for(let i=0;i<cells.length;i++){
      const td=create('td',cells[i]);
      if(i===0)td.title=plan.priceState;
      tr.append(td);
    }
    estimateTable.append(tr);
  }
  byId('wallpaper-rule').textContent='Грубый расчёт на весь периметр: '+stripsPerRoll+' полных полосы из рулона '+precision(rollWidthMm/1000,2)+' × '+precision(rollLengthMm/1000,2)+' м, высота '+precision(heightMm/1000,2)+' м + 10 см на подрезку. ВСЕГО ≈'+totalRolls+' рулонов, включая 3 рулона кабинета без цены. Выбранные артикулы спальни, кухни и коридора: '+rub(pricedTotal)+'; детские по условной цене: ещё ≈'+rub(provisionalTotal)+'. Для предварительного сравнения: ≈'+rub(pricedTotal+provisionalTotal)+' без кабинета. В смету количество рулонов пока не перенесено.';

}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',main);
else main();
