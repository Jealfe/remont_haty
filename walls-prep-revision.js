'use strict';
// Ревизия 33: стены подготовлены застройщиком. Один слой грунта вне санузлов,
// 25 кг смеси только на штробы. Цена грунтовки и ремонтной смеси ещё не выбрана.
(function(){
const oldId='discussed-20261013-fugen-10kg';
const oldName='Шпаклёвка КНАУФ Фуген, 10 кг';
const oldSpec='Лемана ПРО, цена 420 ₽ со слов владельца. По карточке слой 0,2–5 мм. Кандидат для тонкого финишного выравнивания; не закладывать как основную смесь для глубоких штроб или установки подрозетников.';
function oldFugen(x){
 return x.id===oldId&&x.name===oldName&&x.spec===oldSpec&&x.quantity===1&&x.unit==='мешок'&&x.price===420&&x.status==='Уточнить'&&x.category==='Стены'&&x.room==='Общие';
}
const entries=[
 {id:'walls-primer-one-coat',name:'Грунтовка стен под обои — один слой',quantity:35,unit:'л',spec:'Только стены спальни, кухни-гостиной, двух детских, Г-образного коридора и мини-кабинета; санузлы исключены. При расчётной высоте 2,70 м около 246 м² без вычета проёмов, ориентир после дверей и окон 220–230 м². Расход 0,1–0,2 л/м², для бюджета 35 л (предположительно 30 л + 5 л). Марка и цена не выбраны, после пробного нанесения уточнить. Потолки не включены.',shop:''},
 {id:'walls-chases-25kg',name:'Смесь для заделки штроб',quantity:25,unit:'кг',spec:'Только заделка штроб после прокладки кабеля, без сплошного шпаклевания подготовленных стен. Для глубокой заделки нужна подходящая гипсовая штукатурная/ремонтная смесь; финишная шпаклёвка — тонким слоем. Тип, фасовка, цена и расход по фактическим штробам ещё не определены. Старый кандидат Фуген 10 кг/420 ₽ не подходит как основная смесь для глубоких штроб.',shop:''}
];
function alreadyHas(items,e){
 return items.some(x=>x.id===e.id||(x.room==='Общие'&&x.category==='Стены'&&(
   (e.id==='walls-primer-one-coat'&&/грунтовк.*(?:обои|стен)|(?:стен).*грунтовк/i.test(x.name))||
   (e.id==='walls-chases-25kg'&&(/штроб/i.test(x.name)||(/фуген|шпакл|шпатл/i.test(x.name)&&x.quantity===25&&x.unit==='кг')))
  )));
}
function upgrade(data){
 if(data.catalogRevision>=33)return data;
 let items=[...data.items];
 if(!alreadyHas(items,entries[1]))items=items.filter(x=>!oldFugen(x));
 for(const e of entries){
  if(alreadyHas(items,e))continue;
  items.push({...e,room:'Общие',category:'Стены',stage:'Стены и обои',kind:'material',price:null,priceApprox:false,quantityApprox:true,status:'Запланировано',url:''});
 }
 return {...data,catalogRevision:33,items};
}
const prevMerge=mergeCatalog;mergeCatalog=d=>upgrade(prevMerge(d));
const prevInitial=initial;initial=()=>upgrade(prevInitial());
if(state.catalogRevision<33)commit(upgrade(state));
})();