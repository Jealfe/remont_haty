'use strict';
// Ревизия 40: материальные расходники для минимального въезда.
// Все количества/цены ориентировочные, не предназначены для прямого заказа.
(function(){
const entries=[
  {
    "id": "move-supplies-20261019-wallpaper-glue",
    "name": "Клей для флизелиновых обоев — ориентир",
    "category": "Стены",
    "room": "Общие",
    "stage": "Стены и обои",
    "quantity": 7,
    "unit": "уп.",
    "price": 650,
    "priceApprox": true,
    "quantityApprox": true,
    "kind": "material",
    "status": "Запланировано",
    "shop": "",
    "url": "",
    "spec": "28 рулонов обоев. 7 упаковок — временный резерв, если упаковка рассчитана примерно на 4 рулона и соответствует выбранному типу обоев. Реальный расход сверить с маркировкой и площадью стен."
  },
  {
    "id": "move-supplies-20261019-linoleum-adhesive",
    "name": "Клей для сплошного приклеивания линолеума — ориентир",
    "category": "Полы",
    "room": "Общие",
    "stage": "Полы",
    "quantity": 25,
    "unit": "кг",
    "price": 350,
    "priceApprox": true,
    "quantityApprox": true,
    "kind": "material",
    "status": "Запланировано",
    "shop": "",
    "url": "",
    "spec": "78,10 м² чистой площади пола, предварительный расход около 0,32 кг/м². Уточнить совместимость с основой окончательно выбранного линолеума, стяжкой и инструкцией производителя."
  },
  {
    "id": "move-supplies-20261019-skirting",
    "name": "Плинтус напольный — ориентир",
    "category": "Полы",
    "room": "Общие",
    "stage": "Полы",
    "quantity": 85,
    "unit": "м",
    "price": 250,
    "priceApprox": true,
    "quantityApprox": true,
    "kind": "material",
    "status": "Запланировано",
    "shop": "",
    "url": "",
    "spec": "Около 85 пог. м после вычета дверных проёмов, включая кладовую. Фактическая длина и тип плинтуса после замера, стоимость 250 ₽/м ориентировочная."
  },
  {
    "id": "move-supplies-20261019-skirting-parts",
    "name": "Фурнитура и крепёж плинтуса",
    "category": "Полы",
    "room": "Общие",
    "stage": "Полы",
    "quantity": 1,
    "unit": "комплект",
    "price": 2400,
    "priceApprox": true,
    "quantityApprox": true,
    "kind": "material",
    "status": "Запланировано",
    "shop": "",
    "url": "",
    "spec": "Уголки, стыки, заглушки и крепёж под выбранный плинтус. Если плинтус на клипсах, учитывать их количество отдельно при заказе."
  },
  {
    "id": "move-supplies-20261019-shower-silicone",
    "name": "Санитарный силиконовый герметик для душевой",
    "category": "Санузлы",
    "room": "Общие",
    "stage": "Санузлы",
    "quantity": 2,
    "unit": "картридж",
    "price": 500,
    "priceApprox": true,
    "quantityApprox": true,
    "kind": "material",
    "status": "Запланировано",
    "shop": "",
    "url": "",
    "spec": "Для закрытой душевой кабины Loranto 120×80 по инструкции производителя; герметизировать только нужные стыки, не перекрывая штатные дренажные каналы."
  },
  {
    "id": "move-supplies-20261019-shower-connectors",
    "name": "Подключение душевой кабины — шланги и фитинги",
    "category": "Санузлы",
    "room": "Общие",
    "stage": "Санузлы",
    "quantity": 1,
    "unit": "комплект",
    "price": 2500,
    "priceApprox": true,
    "quantityApprox": true,
    "kind": "material",
    "status": "Запланировано",
    "shop": "",
    "url": "",
    "spec": "Ориентир на подводку воды, переходники и выпуск в канализацию. Состав уточнить по комплектации Loranto, фактическим выводам и гидроизоляции помещения. Работы не включены."
  },
  {
    "id": "move-supplies-20261019-connections",
    "name": "Монтажные клеммы, крепёж и расходники для проводки",
    "category": "Электрика",
    "room": "Общие",
    "stage": "Электрика",
    "quantity": 1,
    "unit": "комплект",
    "price": 2500,
    "priceApprox": true,
    "quantityApprox": true,
    "kind": "material",
    "status": "Запланировано",
    "shop": "",
    "url": "",
    "spec": "Предварительный запас: сертифицированные клеммы по схеме соединений, крепёж кабеля, изолирующие материалы, маркировка. Не дублировать состав уже учтённого щитового комплекта; сечение, число линий и соединения проверяет электрик."
  }
];
const equivalentPatterns={
  "wallpaper-glue": "клей.*обо",
  "linoleum-adhesive": "клей.*линолеум|приклеиван.*линолеум",
  "skirting": "^плинтус|напольный плинтус",
  "skirting-parts": "фурнитур.*плинтус|крепёж.*плинтус|уголк.*плинтус",
  "shower-silicone": "санитарн.*герметик|силикон.*душ",
  "shower-connectors": "подключени.*душев|фитинг.*душев|шланг.*душев",
  "connections": "монтажн.*клемм|крепёж.*проводк|соединител.*клемм"
};
function upgrade(data){
 if(data.catalogRevision>=40)return data;
 const items=[...data.items];
 for(const entry of entries){
   const slug=entry.id.slice('move-supplies-20261019-'.length);
   const pattern=new RegExp(equivalentPatterns[slug],'i');
   if(items.some(item=>item.id===entry.id||
     (item.category===entry.category&&item.kind==='material'&&pattern.test(item.name))))continue;
   items.push(entry);
 }
 return {...data,catalogRevision:40,items};
}
const pm=mergeCatalog;mergeCatalog=data=>upgrade(pm(data));
const pi=initial;initial=()=>upgrade(pi());
if(state.catalogRevision<40)commit(upgrade(state));
})();
