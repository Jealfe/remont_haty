'use strict';
// Ревизия 31: владелец решил пока НЕ учитывать декоративные рамки.
// Убираем только добавленный автоматически, неизменённый резерв 7 000 ₽.
// Если пользователь редактировал/купил эту позицию, не трогаем его запись.
(function(){
 const id='panel-frames';
 const originalName='Декоративные рамки розеток и выключателей — резерв';
 const originalSpec='Отдельно от ранее внесённых механизмов и подрозетников. Число одинарных и многопостовых рамок после группировки 72 мест под устройства.';
 function isUnmodified(item){
   return item.id===id&&item.name===originalName&&item.spec===originalSpec&&
     item.room==='Общие'&&item.category==='Электрика'&&item.quantity===1&&
     item.unit==='компл.'&&item.price===7000&&item.status==='Запланировано'&&
     item.kind==='material'&&item.priceApprox===true;
 }
 function upgrade(data){
   if(data.catalogRevision>=31)return data;
   return {...data,catalogRevision:31,items:data.items.filter(item=>!isUnmodified(item))};
 }
 const previousMerge=mergeCatalog;mergeCatalog=data=>upgrade(previousMerge(data));
 const previousInitial=initial;initial=()=>upgrade(previousInitial());
 if(state.catalogRevision<31)commit(upgrade(state));
})();