/* Reminders are local. Delivery requires this app to remain open and the computer awake. */
(() => {
 'use strict';
 const key='medicare_reminders_enabled',sentKey='medicare_reminders_delivered';let busy=false;
 const button=document.createElement('button');button.type='button';button.className='btn btn-secondary';button.id='medicine-reminder-settings';button.setAttribute('aria-label','Medicine reminder settings');button.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg><span>Reminders</span>';button.title='Enable or test local medicine reminders';
 const target=document.querySelector('header .header-actions')||document.querySelector('header')||document.body;target.append(button);
 const dialog=document.createElement('dialog');dialog.id='medicineReminderDialog';dialog.style.cssText='max-width:480px;width:calc(100% - 32px);border:0;border-radius:20px;padding:24px;box-shadow:0 20px 60px #162d4f22';
 dialog.innerHTML='<h2>Local medicine reminders</h2><p>This app can show reminders for the times you entered. Keep it open and your computer awake. It cannot guarantee alerts while closed or asleep.</p><p>Notifications show a private message by default, without medicine names.</p><p id="medicineReminderStatus" role="status"></p><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="enableMedicineReminders">Enable</button><button type="button" id="testMedicineReminder">Test notification</button><button type="button" id="disableMedicineReminders">Disable</button><button type="button" id="closeMedicineReminders">Close</button></div>';document.body.append(dialog);
 const status=message=>dialog.querySelector('#medicineReminderStatus').textContent=message;
 button.onclick=()=>{status(localStorage.getItem(key)==='yes'?'Reminders enabled while this app is open.':'Reminders are off. Enable them to request notification permission.');dialog.showModal();};
 dialog.querySelector('#closeMedicineReminders').onclick=()=>dialog.close();
 async function notify(test=false){
  const options={body:test?'Your local reminder test worked.':'A scheduled medicine reminder is due. Open your schedule to review it.',tag:test?'medicare-test':'medicare-due',icon:'assets/medicare-logo.svg'};
  if('serviceWorker' in navigator){try{const registration=await navigator.serviceWorker.register('/reminder-sw.js');await navigator.serviceWorker.ready;await registration.showNotification('MediCare reminder',options);return;}catch{}}
  const notification=new Notification('MediCare reminder',options);notification.onclick=()=>{window.focus();notification.close();};
 }
 dialog.querySelector('#enableMedicineReminders').onclick=async()=>{
  if(!('Notification' in window)){status('This browser does not support notifications. Use the open schedule as your reminder.');return;}
  const permission=await Notification.requestPermission();if(permission!=='granted'){status('Permission was not granted. Change browser notification settings if you want alerts.');return;}
  localStorage.setItem(key,'yes');status('Enabled. Keep this app open; use Test notification to check delivery.');await tick();
 };
 dialog.querySelector('#disableMedicineReminders').onclick=()=>{localStorage.removeItem(key);status('Reminders disabled. Your medicine schedule is unchanged.');};
 dialog.querySelector('#testMedicineReminder').onclick=async()=>{try{if(!('Notification' in window)||Notification.permission!=='granted')throw Error('Enable notifications first.');await notify(true);status('Test sent. Check your system notification centre.');}catch(e){status(e.message||'Could not send the test.');}};
 async function tick(){
  if(busy||localStorage.getItem(key)!=='yes'||!('Notification' in window)||Notification.permission!=='granted'||!window.medicareData)return;
  busy=true;try{
   const now=new Date(),date=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'),minute=now.getHours()*60+now.getMinutes(),data=window.medicareData.capture();let sent=JSON.parse(localStorage.getItem(sentKey)||'{}');sent=Object.fromEntries(Object.entries(sent).filter(([id])=>id.startsWith(date+':')));
   const due=[];for(const med of data.medications||[])for(const time of med.times||[]){if(!/^\d{2}:\d{2}$/.test(time))continue;const [h,m]=time.split(':').map(Number),scheduled=h*60+m,id=med.id+'_'+time,stamp=date+':'+id;if(minute<scheduled||minute-scheduled>5||sent[stamp])continue;
    // Match the schedule's local calendar date, including around midnight.
    if(data.logs?.[date]?.[id]==='taken')continue;due.push(stamp);
   }
   if(due.length){await notify();for(const id of due)sent[id]=true;localStorage.setItem(sentKey,JSON.stringify(sent));}
  }catch{status('Reminder delivery failed. Check the schedule and browser settings.');}finally{busy=false;}
 }
 window.medicareReminders={check:tick};setInterval(tick,15000);window.addEventListener('focus',tick);document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});tick();
})();
