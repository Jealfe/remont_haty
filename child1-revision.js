'use strict';
// Ревизия 20: согласованная электрика детской №1 (Комната 2).
// 7 силовых розеток + 2 RJ45 + 1 выключатель = 10 подрозетников.
// Потолочный светильник уже учтён другой строкой сметы, без дубликата.
(function(){
  const room='Комната 2';
  const stock=[
    {
      id:'child1-20261013-sockets',
      name:'Розетки 230 В — детская №1',
      spec:'7 розеток: у кровати 1, для ПК через удлинитель 1, дополнительная у письменного стола 1, за возможным телевизором 2, у окна 1, резервная на свободной стене примерно посередине комнаты 1. Точное место резервной розетки уточнить после расстановки мебели. Цена 550 ₽/шт. предварительная.',
      quantity:7,price:550
    },
    {
      id:'child1-20261013-rj45',
      name:'Интернет-розетки RJ45 — детская №1',
      spec:'2 интернет-розетки: одна рядом с ПК на письменном столе, другая за возможным телевизором. Телевизор пока не выбран, кабель проложить с запасом. Цена 550 ₽/шт. условная.',
      quantity:2,price:550
    },
    {
      id:'child1-20261013-switch',
      name:'Одноклавишный выключатель — детская №1',
      spec:'Один выключатель у входа для одного основного потолочного светильника. Светильник уже заложен в смете отдельно, не дублируем.',
      quantity:1,price:550
    },
    {
      id:'child1-20261013-underboxes',
      name:'Подрозетники — детская №1',
      spec:'10 подрозетников: 7 силовых розеток 230 В, 2 интернет-розетки RJ45, 1 одноклавишный выключатель. Ориентировочно 68 мм, глубину выбрать по фактическим стенам. Кондиционер не планируется.',
      quantity:10,price:20
    }
  ];
  const patterns=[
    /(?:розетк.*230|силов.*розетк|электрическ.*розетк)/i,
    /(?:интернет.розетк|розетк.*rj.?45|rj.?45.*розетк)/i,
    /(?:одноклавиш.*выключ|выключ.*одноклавиш)/i,
    /подрозетник/i
  ];
  function add(data){
    if(data.catalogRevision>=20)return data;
    const items=[...data.items];
    stock.forEach((i,index)=>{
      const alreadyExists=items.some(x=>x.id===i.id||
        (x.room===room&&x.category==='Электрика'&&patterns[index].test(x.name)));
      if(alreadyExists)return;
      items.push({...i,room,category:'Электрика',stage:'Электрика',
        unit:'шт.',kind:'material',status:'Запланировано',priceApprox:true,
        quantityApprox:false,shop:'',url:''});
    });
    return {...data,catalogRevision:20,items};
  }
  const originalMerge=mergeCatalog;
  mergeCatalog=function(data){return add(originalMerge(data));};
  const originalInitial=initial;
  initial=function(){return add(originalInitial());};
  if(state.catalogRevision<20)commit(add(state));
})();
