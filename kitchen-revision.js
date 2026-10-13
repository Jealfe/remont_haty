'use strict';
// Миграция каталога 19: две дополнительные настенные розетки у окна.
// Выполнена отдельно от основного каталога, чтобы сохранить пользовательские записи.
(function(){
  const changes={
    'kitchen-20261013-sockets':{
      quantity:16,
      spec:'16 розеток 230 В: холодильник 1, посудомойка 1, измельчитель 1, фартук 2, вытяжка 1, за пеналом 2, телевизор 2, обеденный стол 2, диван 2, у пола возле окна 2 (торшер, очиститель воздуха, гирлянда). Встроенные в пенал 3 мебельные розетки (чайник, кофемашина, тостер) не входят в число настенных. Цена 550 ₽/шт. — предварительная.'
    },
    'kitchen-20261013-underboxes':{
      quantity:18,
      spec:'18 подрозетников: для 16 обычных розеток 230 В, одной RJ45 и одного двухклавишного выключателя у входа. Цена 20 ₽/шт. предварительная. Диаметр около 68 мм, глубина по основанию. Прямые выводы плиты, духовки и кондиционера, а также встроенные мебельные розетки в число подрозетников не входят.'
    }
  };
  function upgrade(data){
    if(data.catalogRevision>=19)return data;
    const items=data.items.map(item=>{
      const replacement=changes[item.id];
      if(!replacement||item.status==='Куплено')return item;
      const original=KITCHEN_ELECTRICAL_PLAN.find(i=>i.id===item.id);
      if(item.spec!==original.spec)return item; // сохранить изменения владельца
      return {...item,spec:replacement.spec,
        quantity:item.quantity===original.quantity?replacement.quantity:item.quantity};
    });
    return {...data,catalogRevision:19,items};
  }
  const oldMerge=mergeCatalog;
  mergeCatalog=function(data){return upgrade(oldMerge(data));};
  const oldInitial=initial;
  initial=function(){return upgrade(oldInitial());};
  if(state.catalogRevision<19)commit(upgrade(state));
})();
