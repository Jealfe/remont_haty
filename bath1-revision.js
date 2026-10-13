'use strict';
(function(){
const room='Санузел 1';
const entries=[
{id:'bath1-sockets',name:'Розетки 230 В — малый санузел',category:'Электрика',quantity:2,price:550,spec:'2 розетки общим блоком возле зеркала. Размещение уточнить с учётом душевых зон.'},
{id:'bath1-switch',name:'Двухклавишный выключатель — малый санузел',category:'Электрика',quantity:1,price:550,spec:'Снаружи возле двери. Первая клавиша — потолочный свет, вторая — вытяжка.'},
{id:'bath1-boxes',name:'Подрозетники — малый санузел',category:'Электрика',quantity:3,price:20,spec:'2 розетки и один двухклавишный выключатель.'},
{id:'bath1-light',name:'Потолочный светильник — малый санузел',category:'Освещение',quantity:1,price:3000,spec:'Один светильник, ориентировочная стоимость 3000 ₽.'},
{id:'bath1-fan',name:'Вытяжной вентилятор — малый санузел',category:'Электрика',quantity:1,price:null,spec:'Питание прямым выводом, отдельная клавиша у двери. Модель и цена не выбраны. Дополнительно предусмотреть вывод под зеркало со своей кнопкой и резерв под полотенцесушитель без добавочных розеток.'}
];
const patterns=[/розетк.*230/i,/двухклавишн.*выключ/i,/подрозетник/i,/потолочн.*светильник/i,/вытяжн.*вентилятор/i];
function upgrade(data){
 if(data.catalogRevision>=23)return data;
 const items=[...data.items];
 entries.forEach((e,i)=>{
  if(items.some(x=>x.id===e.id||(x.room===room&&x.category===e.category&&patterns[i].test(x.name))))return;
  items.push({...e,room,stage:e.category==='Освещение'?'Потолки и освещение':'Электрика',kind:'material',unit:'шт.',status:'Запланировано',priceApprox:e.price!==null,quantityApprox:false,shop:'',url:''});
 });
 return {...data,catalogRevision:23,items};
}
const pm=mergeCatalog;mergeCatalog=function(d){return upgrade(pm(d));};
const pi=initial;initial=function(){return upgrade(pi());};
if(state.catalogRevision<23)commit(upgrade(state));
})();
