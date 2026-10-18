'use strict';
// Ревизия 37. Предварительный бюджет линолеума 18.10.2026.
// Раскрой единого декора при условной ширине рулона 3,5 м и цене 1 300 ₽/м².
// Пять отрезов с запасом 10 см, кладовая предполагается из обрезка коридора.
// Чистая площадь 78,097 м²; покупная 92,33 м²; бюджет 120 029 ₽.
// Размеры, геометрию Г-образного коридора, доступную ширину и рисунок проверить до заказа.
(function(){
const rows=[
  {id:'bedroom',room:'Спальня',qty:18.375,cut:'5,25 пог. м × 3,5 м',note:'Комната 5,15×3,12 м, площадь пола 16,068 м².'},
  {id:'kitchen',room:'Кухня',qty:23.1,cut:'6,60 пог. м × 3,5 м',note:'Кухня-гостиная 6,50×3,18 м, площадь пола 20,670 м².'},
  {id:'child1',room:'Комната 2',qty:16.03,cut:'4,58 пог. м × 3,5 м',note:'Детская 1: 4,48×2,95 м, площадь пола 13,216 м².'},
  {id:'child2',room:'Комната 3',qty:13.895,cut:'3,97 пог. м × 3,5 м',note:'Детская 2: 3,87×3,35 м, площадь пола 12,9645 м². Запас по ширине лишь 5 см сверх заложенных 10 см.'},
  {id:'hall-store',room:'Коридор',qty:20.93,cut:'5,98 пог. м × 3,5 м',note:'Коридор площадью 11,1606 м² + кладовая 4,0179 м². Кладовая ориентировочно выкраивается из остатка от коридора — подтвердить раскрой по реальной форме Г.'}
];
const expectedName='Линолеум Kreaforta «Касли» 4 м (арт. 89441404 — проверить)';
function isUntouchedCandidate(i){
  return i.id==='initial-27'&&i.category==='Полы'&&
    i.name===expectedName&&i.quantity===null&&i.unit==='м²'&&
    i.price===915&&i.status!=='Куплено'&&i.room==='Общие'&&
    i.spec.startsWith('Для ширины 4 м в каталоге арт. 89441404;');
}
function upgrade(data){
  if(data.catalogRevision>=37)return data;
  const old=data.items.find(isUntouchedCandidate);
  // Не перезаписываем пользовательский выбор, количество, цену либо закупленное покрытие.
  if(!old)return {...data,catalogRevision:37};
  const ids=new Set(data.items.map(i=>i.id));
  const additions=rows.filter(r=>!ids.has('flooring-20261018-'+r.id)).map(r=>({
    id:'flooring-20261018-'+r.id,
    room:r.room,category:'Полы',stage:'Полы',
    name:'Линолеум — ширина 3,5 м (ориентир)',
    spec:r.note+' Заготовка: '+r.cut+'. Цена 1300 ₽/м² — бюджетный ориентир, не подтверждённая цена конкретной модели. Общий раскрой 26,38 пог. м = 92,33 м². Укладка без порожков: стыки в проёмах и холодную сварку считать отдельно. Точный раскрой после ключей.',
    quantity:r.qty,unit:'м²',price:1300,kind:'material',
    url:'',shop:'',status:'Запланировано',quantityApprox:true,priceApprox:true
  }));
  return {...data,catalogRevision:37,items:[...data.items.filter(i=>i.id!==old.id),...additions]};
}
const previousMerge=mergeCatalog;
mergeCatalog=data=>upgrade(previousMerge(data));
const previousInitial=initial;
initial=()=>upgrade(previousInitial());
if(state.catalogRevision<37)commit(upgrade(state));
})();
