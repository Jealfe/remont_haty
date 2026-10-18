'use strict';
// Ревизия 35: бюджетный образец для заделки штроб — штукатурка Волма Слой Ультра.
// Один мешок 25 кг, смета 600 ₽ (24 ₽/кг). Не считать окончательным выбором.
(function(){
const id='walls-chases-25kg';
const original='Смесь для заделки штроб';
const name='Штукатурка гипсовая «Волма Слой Ультра» — для штроб';
function upgrade(data){
 if(data.catalogRevision>=35)return data;
 const items=data.items.map(x=>{
  if(x.id!==id||x.name!==original||x.room!=='Общие'||x.quantity!==25||x.unit!=='кг'||x.price!==null||x.status!=='Запланировано')return x;
  return {...x,name,price:24,priceApprox:true,status:'Уточнить',spec:'Примерный вариант для бюджета: 1 мешок гипсовой штукатурки Волма Слой Ультра 25 кг ≈600 ₽ (24 ₽/кг). Заделка штроб в сухих помещениях, не сплошная шпаклёвка стен. При выборе проверить допустимую толщину слоя и основание, в глубоких штробах наносить послойно по инструкции. Фактический расход может отличаться; марку и цену согласуем перед покупкой.'};
 });
 return {...data,catalogRevision:35,items};
}
const pm=mergeCatalog;mergeCatalog=d=>upgrade(pm(d));
const pi=initial;initial=()=>upgrade(pi());
if(state.catalogRevision<35)commit(upgrade(state));
})();