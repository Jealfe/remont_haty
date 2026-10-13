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
    {id:'bath1',name:'Санузел 1',shape:'rectangle',lengthMm:1750,widthMm:2870,openings:[]},
    {id:'bath2',name:'Санузел 2',shape:'rectangle',lengthMm:2030,widthMm:3330,openings:[]},
    {id:'storage',name:'Кладовая / мини-офис',shape:'rectangle',lengthMm:2270,widthMm:1770,openings:[]},
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
  const linoleumRooms=new Set(['bedroom','kitchen','child1','child2','hall']);
  const dry=rooms.filter(r=>!bathIds.has(r.id)).reduce((s,r)=>s+squareMeters(r),0);
  const base=rooms.filter(r=>linoleumRooms.has(r.id)).reduce((s,r)=>s+squareMeters(r),0);
  byId('total-area').textContent=precision(total)+' м²';
  byId('dry-area').textContent=precision(dry)+' м²';
  byId('linoleum-area').textContent=precision(base)+' м²';
  byId('height').textContent=precision(APARTMENT_DIMENSIONS.ceilingHeightMm/1000,2)+' м';
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
  const stripsPerRoll=Math.floor(10000/(heightMm+100)); // 100 мм на подрезку, только для предварительной оценки
  const wallpaperIds=new Set(['bedroom','kitchen','child1','child2']);
  const estimates=byId('wallpaper-rows');
  for(const room of rooms.filter(r=>wallpaperIds.has(r.id))){
    const lines=Math.ceil(perimeterMm(room)/1060);
    const rolls=Math.ceil(lines/stripsPerRoll);
    const tr=create('tr');
    for(const value of [room.name,precision(perimeterMm(room)/1000)+' м',lines+' полос',rolls+' рул. (макс. грубо)']){
      tr.append(create('td',value));
    }
    estimates.append(tr);
  }
  byId('wallpaper-rule').textContent='Ориентир: рулон 1,06×10 м, полоса '+precision((heightMm+100)/1000,2)+' м (высота + 10 см на подрезку), по '+stripsPerRoll+' полосы из рулона. Окна и двери пока не вычтены.';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',main);
else main();
