'use strict';
(function(){
const room='Кладовая';
const entries=[
{id:'office-sockets',name:'Розетки 230 В — мини-кабинет',category:'Электрика',quantity:3,price:550,spec:'1 под компьютерным столом для ПК и монитора через удлинитель; 2 левее рабочего места для зарядок и инструментов.'},
{id:'office-rj45',name:'Интернет-розетка RJ45 — мини-кабинет',category:'Электрика',quantity:1,price:550,spec:'1 порт RJ45 Cat.6 рядом с ПК для проводного подключения.'},
{id:'office-switch',name:'Одноклавишный выключатель — мини-кабинет',category:'Электрика',quantity:1,price:550,spec:'1 выключатель у входа для обычного потолочного светильника.'},
{id:'office-boxes',name:'Подрозетники — мини-кабинет',category:'Электрика',quantity:5,price:20,spec:'3 розетки 230 В, 1 RJ45, 1 выключатель = 5 подрозетников.'},
{id:'office-light',name:'Потолочный светильник — мини-кабинет',category:'Освещение',quantity:1,price:null,spec:'Одна обычная потолочная лампа, модель и стоимость не согласованы. Отдельно заложить резервный кабель вентилятора для воздухообмена при закрытой двери, без покупки вентилятора.'}
];
const tests=[/розетк.*230|силов.*розетк/i,/rj.?45|интернет.розетк/i,/одноклавишн.*выключ/i,/подрозетник/i,/потолочн.*светильник|обычн.*ламп/i];
function upgrade(data){
 if(data.catalogRevision>=25)return data;
 const items=[...data.items];
 entries.forEach((e,i)=>{
  if(items.some(x=>x.id===e.id||(x.room===room&&x.category===e.category&&tests[i].test(x.name))))return;
  items.push({...e,room,stage:e.category==='Освещение'?'Потолки и освещение':'Электрика',kind:'material',unit:'шт.',status:'Запланировано',priceApprox:e.price!==null,quantityApprox:false,shop:'',url:''});
 });
 return {...data,catalogRevision:25,items};
}
const previousMerge=mergeCatalog;mergeCatalog=d=>upgrade(previousMerge(d));
const previousInitial=initial;initial=()=>upgrade(previousInitial());
if(state.catalogRevision<25)commit(upgrade(state));
})();
