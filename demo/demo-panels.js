document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('demoReminderForm');
  const status=document.getElementById('demoReminderStatus');
  const getSample=data=>data.medications.find(item=>item.id==='example-reminder');
  function refresh(){
    const data=BUYER_DATA_ADAPTER.capture();
    form.elements.time.value=getSample(data)?.times[0]||'09:00';
    const activity=document.getElementById('demoActivity');
    activity.replaceChildren();
    let taken=0;
    for(const [date,entries] of Object.entries(data.logs).sort((a,b)=>b[0].localeCompare(a[0]))){
      for(const [key,state] of Object.entries(entries)){
        if(!key.startsWith('example-reminder_'))continue;
        const row=document.createElement('p');
        row.textContent=date+' · '+key.split('_').at(-1)+' · '+(state==='taken'?'Taken':'Pending');
        activity.append(row);
        if(state==='taken')taken++;
      }
    }
    document.getElementById('demoActivitySummary').textContent=activity.children.length?taken+' sample reminder(s) marked taken.':'No activity recorded. Try marking your example reminder taken.';
  }
  form.onsubmit=async event=>{
    event.preventDefault();
    const data=BUYER_DATA_ADAPTER.capture();
    const sample=getSample(data);
    if(!sample) return;
    sample.times=[form.elements.time.value];
    try{await BUYER_DATA_ADAPTER.restore(data);refresh();status.textContent='Sample reminder updated.';}
    catch{status.textContent='The time could not be saved in this browser.';}
  };
  document.querySelector('[data-tab=tab-demo-activity]').addEventListener('click',refresh);
  document.querySelector('[data-tab=tab-demo-reminders]').addEventListener('click',refresh);
  document.getElementById('resetExample').onclick=async()=>{
    if(!confirm('Reset this browser’s sample activity?'))return;
    const data=BUYER_DATA_ADAPTER.capture();
    data.logs={};
    try{await BUYER_DATA_ADAPTER.restore(data);refresh();}
    catch{status.textContent='Sample activity could not be reset.';}
  };
  refresh();
});
