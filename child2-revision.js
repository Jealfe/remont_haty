'use strict';
// Ревизия 21: детская №2 (Комната 3), по аналогии с детской №1.
// 7 силовых розеток + 2 RJ45 + 1 одноклавишный выключатель = 10 подрозетников.
// Телевизор точно предусмотрен; светильник уже внесён в исходную смету.
(function(){
  const room='Комната 3';
  const entries=[
    {
      id:'child2-20261013-sockets',
      name:'Розетки 230 В — детская №2',
      spec:'7 розеток: у кровати 1, для ПК через удлинитель 1, дополнительная у письменного стола 1, за телевизором 2 (телевизор планируется), у окна 1, запасная на свободной стене ближе к середине комнаты 1. Размещение по аналогии с первой детской; точные высоты и места уточним после расстановки мебели. Цена 550 ₽/шт. приблизительная.',
      quantity:7,price:550
    },
    {
      id:'child2-20261013-rj45',
      name:'Интернет-розетки RJ45 — детская №2',
      spec:'2 интернет-розетки: одна возле ПК/письменного стола, вторая за телевизором. Проводка Cat.6. Цена 550 ₽/шт. приблизительная.',
      quantity:2,price:550
    },
    {
      id:'child2-20261013-switch',
      name:'Одноклавишный выключатель — детская №2',
      spec:'1 выключатель у входа, управляет основным потолочным светильником. Светильник уже внесён в смету отдельно, не учитывать повторно. Цена 550 ₽/шт. приблизительная.',
      quantity:1,price:550
    },
    {
      id:'child2-20261013-underboxes',
      name:'Подрозетники — детская №2',
      spec:'10 шт.: 7 для розеток 230 В, 2 для RJ45 и 1 для выключателя. Диаметр ориентировочно 68 мм, глубину выбрать после проверки стен. Цена 20 ₽/шт. приблизительная.',
      quantity:10,price:20
    }
  ];
  const matchers=[
    /(?:розетк.*230|силов.*розетк|электрическ.*розетк)/i,
    /(?:интернет.розетк|розетк.*rj.?45|rj.?45.*розетк)/i,
    /(?:одноклавиш.*выключ|выключ.*одноклавиш)/i,
    /подрозетник/i
  ];
  function upgrade(data){
    if(data.catalogRevision>=21)return data;
    const items=[...data.items];
    entries.forEach((item,index)=>{
      if(items.some(x=>x.id===item.id||(x.room===room&&x.category==='Электрика'&&matchers[index].test(x.name))))return;
      items.push({...item,room,category:'Электрика',stage:'Электрика',
        unit:'шт.',kind:'material',status:'Запланировано',
        priceApprox:true,quantityApprox:false,shop:'',url:''});
    });
    return {...data,catalogRevision:21,items};
  }
  const previousMerge=mergeCatalog;
  mergeCatalog=function(data){return upgrade(previousMerge(data));};
  const previousInitial=initial;
  initial=function(){return upgrade(previousInitial());};
  if(state.catalogRevision<21)commit(upgrade(state));
})();
