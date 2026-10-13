'use strict';
(function(){
 const changes=[
  ['initial-1',125,150,100,'Предварительно 100–150 м, для бюджета 125 м','Предварительно 130–170 м, для бюджета 150 м'],
  ['initial-2',300,450,132,'Предварительно 250–350 м, для бюджета 300 м','Предварительно 400–500 м, для бюджета 450 м'],
  ['initial-13',75,100,80,'Предварительно 50–100 м, для бюджета 75 м','Предварительно 85–115 м, для бюджета 100 м']
 ];
 function upgrade(d){
  if(d.catalogRevision>=26)return d;
  const items=d.items.map(x=>{
   const c=changes.find(a=>a[0]===x.id);
   if(!c||x.quantity!==c[1]||x.price!==c[3]||x.status!=='Уточнить'||!x.spec.includes(c[4]))return x;
   return {...x,quantity:c[2],quantityApprox:true,spec:x.spec.replace(c[4],c[5])+' Запас по итоговой схеме групп, перед заказом перемерить трассы.'};
  });
  return {...d,catalogRevision:26,items};
 }
 const pm=mergeCatalog;mergeCatalog=d=>upgrade(pm(d));
 const pi=initial;initial=()=>upgrade(pi());
 if(state.catalogRevision<26)commit(upgrade(state));
})();