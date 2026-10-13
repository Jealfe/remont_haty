'use strict';
// Ревизия 22: согласованная электрическая схема прихожей и коридора.
// 4 розетки 230 В + 2 одноклавишных выключателя = 6 подрозетников.
// Для Wi-Fi-роутера RJ45 НЕ нужен: прямой вывод кабеля Cat.6.
// Светильники 1 потолочный и 4 настенных: количество известно, цена пока не выбрана.
(function(){
  const room='Коридор';
  const itemsToAdd=[
    {
      id:'hall-20261013-sockets',
      category:'Электрика',
      name:'Розетки 230 В — коридор',
      spec:'4 настенные розетки: 1 возле зеркала, 1 в зоне полок, 1 возле шкафа для основного Wi-Fi-роутера, 1 у пола возле входной двери (сушка обуви, пылесос). Роутеру нужен также прямой вывод кабеля Cat.6 без розетки RJ45. Цена 550 ₽/шт. предварительная.',
      quantity:4,price:550,
      pattern:/розетк.*(?:230|силов|электрическ)/i
    },
    {
      id:'hall-20261013-switch',
      category:'Электрика',
      name:'Одноклавишные выключатели — коридор',
      spec:'2 отдельных одноклавишных выключателя: первый сразу у входной двери для одного потолочного светильника прихожей; второй возле поворота длинного коридора для четырёх настенных светильников. Не объединяем в двухклавишный механизм. Цена 550 ₽/шт. предварительная.',
      quantity:2,price:550,
      pattern:/одноклавиш.*выключ|выключ.*одноклавиш/i
    },
    {
      id:'hall-20261013-underboxes',
      category:'Электрика',
      name:'Подрозетники — коридор',
      spec:'6 подрозетников: 4 розетки 230 В и 2 отдельных одноклавишных выключателя. Для прямого вывода интернет-кабеля Cat.6 к роутеру отдельный RJ45 и подрозетник не предусматриваются. Диаметр ориентировочно 68 мм, глубина по состоянию стен. Цена 20 ₽/шт. предварительная.',
      quantity:6,price:20,
      pattern:/подрозетник/i
    },
    {
      id:'hall-20261013-ceiling-light',
      category:'Освещение',
      name:'Потолочный светильник — прихожая',
      spec:'1 потолочный светильник непосредственно у входной двери; первая отдельная зона освещения с выключателем у входа. Модель и цена пока не выбраны.',
      quantity:1,price:null,
      pattern:/(?:потолочн|основн).*(?:светильник|свет)/i
    },
    {
      id:'hall-20261013-wall-lights',
      category:'Освещение',
      name:'Настенные светильники — длинный коридор',
      spec:'4 настенных светильника вдоль стены длинного коридора; вторая отдельная зона освещения с выключателем у поворота коридора. Модель и цена пока не выбраны.',
      quantity:4,price:null,
      pattern:/настенн.*светильник|светильник.*настенн|светильники коридора/i
    }
  ];
  function upgrade(data){
    if(data.catalogRevision>=22)return data;
    const items=[...data.items];
    for(const {pattern,...info} of itemsToAdd){
      if(items.some(i=>i.id===info.id||
        (i.room===room&&i.category===info.category&&pattern.test(i.name))))continue;
      items.push({
        ...info,room,stage:info.category==='Освещение'?'Потолки и освещение':'Электрика',
        kind:'material',unit:'шт.',priceApprox:info.price!==null,
        quantityApprox:false,status:'Запланировано',shop:'',url:''
      });
    }
    return {...data,catalogRevision:22,items};
  }
  const previousMerge=mergeCatalog;
  mergeCatalog=function(data){return upgrade(previousMerge(data));};
  const previousInitial=initial;
  initial=function(){return upgrade(previousInitial());};
  if(state.catalogRevision<22)commit(upgrade(state));
})();
