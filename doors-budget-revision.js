'use strict';
// Ревизия 38: двери единым комплектом, ориентир 113 000 ₽ по просьбе владельца.
// Двери, коробки, наличники/доборы и фурнитура объединены в одну строку.
// Стоимость монтажа не включена, если она не входит в предложение.
// Не добавлять вторую комплектную цену при наличии вручную внесённого заказа дверей.
(function(){
const ITEM={
  id:'doors-20261018-all-113000',
  category:'Двери',room:'Общие',stage:'Двери и завершение',
  name:'Межкомнатные двери — комплект',
  spec:'Один комплект на всю квартиру: дверные полотна, коробки, доборы/наличники и фурнитура по ранее рассматривавшемуся предложению. 113 000 ₽ — ориентир владельца от 18.10.2026. Количество дверей и состав заказа сверить с КП перед оплатой. Монтаж не включён, если отдельно не указан в КП. Не добавлять отдельными строками полотна и фурнитуру во избежание двойного учёта.',
  quantity:1,unit:'комплект',price:113000,kind:'material',
  status:'Запланировано',priceApprox:true,quantityApprox:false,
  shop:'',url:''
};
function isPreviouslyPricedDoor(i){
  return i.category==='Двери'&&i.kind==='material'&&
    i.quantity!==null&&i.price!==null&&i.quantity*i.price>0;
}
function upgrade(data){
 if(data.catalogRevision>=38)return data;
 const exists=data.items.some(i=>i.id===ITEM.id||isPreviouslyPricedDoor(i));
 return {...data,catalogRevision:38,items:exists?data.items:[...data.items,{...ITEM}]};
}
const previousMerge=mergeCatalog;mergeCatalog=data=>upgrade(previousMerge(data));
const previousInitial=initial;initial=()=>upgrade(previousInitial());
if(state.catalogRevision<38)commit(upgrade(state));
})();