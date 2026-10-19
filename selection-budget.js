'use strict';
// Выбор позиций для отдельного расчёта — не влияет на саму смету и статус «Куплено».
// Отдельный localStorage-ключ; выбор сохранится после обновления страницы.
(function(){
 const PICK_KEY='remont-haty-picked-v1';
 let picked=new Set();
 try{
   const old=JSON.parse(localStorage.getItem(PICK_KEY)||'[]');
   if(Array.isArray(old))picked=new Set(old.filter(id=>typeof id==='string'&&id.length<=100));
 }catch(_){}
 let onlyPicked=false;
 const panel=document.createElement('section');
 panel.className='selection-panel';
 panel.id='selection-panel';
 panel.setAttribute('aria-label','Отдельный расчёт отмеченных материалов');
 panel.innerHTML=
 '<div class="selection-head"><div><h2>Расчёт выбранного</h2><p>Галочки нужны только для отдельного подсчёта. Общая смета не меняется.</p></div>'+
 '<label class="selection-show"><input id="picked-only" type="checkbox"> Только выбранные</label></div>'+
 '<div class="selection-overview"><strong id="picked-total">0 ₽</strong><span id="picked-info">0 позиций</span></div>'+
 '<div class="selection-filters">'+
 '<label>Комната<select id="pick-room"></select></label>'+
 '<label>Категория<select id="pick-category"></select></label>'+
 '<label>Этап<select id="pick-stage"></select></label>'+
 '</div>'+
 '<div class="selection-actions">'+
 '<button id="pick-add" type="button" class="primary">Отметить по условиям</button>'+
 '<button id="pick-remove" type="button">Снять по условиям</button>'+
 '<button id="pick-visible" type="button">Отметить найденное</button>'+
 '<button id="pick-unmark-visible" type="button">Снять найденное</button>'+
 '<button id="pick-reset" type="button">Сбросить галочки</button></div>'+
 '<p class="selection-hint" id="picked-hint">Выбирай строки галочками или укажи комнату, категорию и/или этап. Несколько условий действуют вместе.</p>';
 document.querySelector('.stage-breakdown').insertAdjacentElement('afterend',panel);

 const style=document.createElement('style');
 style.textContent=[
 '.selection-panel{border:1px solid #d5e4d8;border-radius:10px;background:#f8faf8;padding:15px;margin:14px 0 17px}',
 '.selection-head{display:flex;align-items:start;justify-content:space-between;gap:12px;flex-wrap:wrap}',
 '.selection-head h2{font-size:16px;margin:0 0 4px}',
 '.selection-head p{margin:0;color:var(--muted);font-size:12px}',
 '.selection-show{display:flex;align-items:center;gap:8px;font-size:12px;white-space:nowrap;cursor:pointer}',
 '.selection-show input{width:17px;height:17px;accent-color:var(--accent)}',
 '.selection-overview{display:flex;align-items:baseline;gap:15px;flex-wrap:wrap;margin:10px 0}',
 '.selection-overview strong{font-size:25px;color:var(--ink);font-variant-numeric:tabular-nums}',
 '.selection-overview span{font-size:12px;color:var(--muted)}',
 '.selection-filters{display:grid;grid-template-columns:repeat(3,minmax(130px,1fr));gap:9px}',
 '.selection-filters label{font-size:11px;color:var(--muted)}',
 '.selection-filters select{display:block;margin-top:4px;width:100%;padding:7px}',
 '.selection-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}',
 '.selection-actions button{font-size:12px}',
 '.selection-hint{margin:10px 0 0;color:var(--muted);font-size:11px}',
 '.selection-check{width:18px!important;min-width:18px!important;height:18px!important;accent-color:var(--accent);cursor:pointer;vertical-align:middle;padding:0!important}',
 '.selection-item-td{position:relative;padding-left:42px}',
 '.selection-item-td>.selection-check{position:absolute;top:10px;left:12px;margin:0}',
 '.nested-row .selection-item-td{padding-left:56px}',
 '.nested-row .selection-item-td>.selection-check{left:26px}',
 '.selection-header-td>.selection-check{margin:0 10px 0 12px}',
 '.selection-header-td>.group-button{width:calc(100% - 45px);display:inline-flex;vertical-align:middle;padding-left:0}',
 '.selection-item-td .item-name{width:100%}',
 '@media(max-width:680px){.selection-panel{padding:11px}.selection-filters{grid-template-columns:1fr 1fr}.selection-overview strong{font-size:22px}.selection-actions button{flex:1 1 auto}}'
 ].join('\n');
 document.head.append(style);

 function fill(id,initial,options){
   const box=document.getElementById(id);
   box.append(new Option(initial,''));
   for(const option of options)box.append(new Option(option[1],option[0]));
 }
 fill('pick-room','Любая комната',ROOMS.map(room=>[room,nameOfRoom(room)]));
 fill('pick-category','Любая категория',CATEGORIES.map(v=>[v,v]));
 fill('pick-stage','Любой этап',STAGES.map(v=>[v,v]));

 const originalFiltered=getFiltered;
 getFiltered=function(){
   const result=originalFiltered();
   return onlyPicked?result.filter(item=>picked.has(item.id)):result;
 };

 function save(){
   try{localStorage.setItem(PICK_KEY,JSON.stringify([...picked]));}
   catch(e){document.getElementById('picked-hint').textContent='Не удалось сохранить галочки в браузере. Можно продолжить без сохранения.';}
 }
 function setPicked(items,checked){
   for(const item of items){if(checked)picked.add(item.id);else picked.delete(item.id);}
   save();
   render();
 }
 function checkFor(items,label){
   const cb=document.createElement('input');
   cb.type='checkbox';
   cb.className='selection-check';
   cb.setAttribute('aria-label','Включить в отдельный расчёт: '+label);
   cb.title='Добавить или исключить из отдельной суммы: '+label;
   cb.checked=items.length>0&&items.every(item=>picked.has(item.id));
   cb.indeterminate=items.some(item=>picked.has(item.id))&&!cb.checked;
   cb.addEventListener('click',event=>event.stopPropagation());
   cb.addEventListener('pointerdown',event=>event.stopPropagation());
   cb.addEventListener('change',event=>{
     event.stopPropagation();
     setPicked(items,cb.checked);
   });
   return cb;
 }
 const originalMaterialRow=materialRow;
 materialRow=function(item,options){
   const row=originalMaterialRow(item,options);
   const title=row.querySelector('td');
   title.classList.add('selection-item-td');
   title.prepend(checkFor([item],item.name+' — '+nameOfRoom(item.room)));
   return row;
 };
 const originalHeaderRow=headerRow;
 headerRow=function(label,items,expanded,onclick,kind){
   const row=originalHeaderRow(label,items,expanded,onclick,kind);
   const first=row.querySelector('td');
   first.classList.add('selection-header-td');
   first.prepend(checkFor(items,label));
   return row;
 };
 const originalBundleRow=bundleRow;
 bundleRow=function(items){
   const rows=originalBundleRow(items);
   if(items.length>1){
     const first=rows[0].querySelector('td');
     first.classList.add('selection-item-td');
     first.prepend(checkFor(items,items[0].name+' — все помещения'));
   }
   return rows;
 };

 function conditions(){
   const room=document.getElementById('pick-room').value;
   const cat=document.getElementById('pick-category').value;
   const stage=document.getElementById('pick-stage').value;
   if(!room&&!cat&&!stage){
     document.getElementById('picked-hint').textContent='Для массового выбора укажи хотя бы одну комнату, категорию или этап.';
     return null;
   }
   return materials().filter(item=>(!room||item.room===room)&&(!cat||item.category===cat)&&(!stage||item.stage===stage));
 }
 document.getElementById('pick-add').onclick=()=>{const list=conditions();if(list)setPicked(list,true);};
 document.getElementById('pick-remove').onclick=()=>{const list=conditions();if(list)setPicked(list,false);};
 document.getElementById('pick-visible').onclick=()=>setPicked(originalFiltered(),true);
 document.getElementById('pick-unmark-visible').onclick=()=>setPicked(originalFiltered(),false);
 document.getElementById('pick-reset').onclick=()=>{picked.clear();save();render();};
 document.getElementById('picked-only').onchange=event=>{onlyPicked=event.target.checked;render();};

 const previousRender=render;
 render=function(){
   // Удалённые из каталога позиции больше не влияют на расчёт.
   const ids=new Set(materials().map(item=>item.id));
   const size=picked.size;
   for(const id of picked)if(!ids.has(id))picked.delete(id);
   if(picked.size!==size)save();
   previousRender();
   const marked=materials().filter(item=>picked.has(item.id));
   const incomplete=marked.filter(item=>amount(item)===null).length;
   document.getElementById('picked-total').textContent=money.format(sum(marked));
   document.getElementById('picked-info').textContent=
     marked.length+' позиций'+(incomplete?' · '+incomplete+' без полной суммы':'');
   document.getElementById('picked-hint').textContent=incomplete
      ?'Внимание: '+incomplete+' выбранных позиций пока без цены или количества. Итог неполный.'
      :'Отмеченные строки, комнаты и группы считаются один раз, даже если выбор пересекается. Данные сохраняются в этом браузере.';
 };
 render();
})();
