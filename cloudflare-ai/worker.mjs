const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export default {async fetch(request,env){
 try{
  if(!env.BRIDGE_TOKEN||request.headers.get('Authorization')!=='Bearer '+env.BRIDGE_TOKEN)return json({error:'Unauthorized'},401);
  if(request.method!=='POST')return json({error:'Use POST'},405);
  const limit=await env.AI_LIMIT.limit({key:'private-bridge'});if(!limit.success)return json({error:'Request limit reached'},429);
  if(Number(request.headers.get('Content-Length')||0)>128*1024)return json({error:'Request too large'},413);
  const raw=await request.text();if(raw.length>128*1024)return json({error:'Request too large'},413);
  const data=JSON.parse(raw),route=new URL(request.url).pathname;
  if(route==='/complete'){
   if(!Array.isArray(data.messages)||data.messages.length>8||data.messages.some(m=>!['system','user','assistant'].includes(m.role)||typeof m.content!=='string'||m.content.length>60000))return json({error:'Invalid messages'},400);
   const result=await env.AI.run('@cf/meta/llama-3.2-3b-instruct',{messages:data.messages,max_tokens:Math.min(Number(data.max_tokens)||1024,2048),temperature:0.2,...(data.jsonMode?{response_format:{type:'json_object'}}:{})});return json(result);
  }
  return json({error:'Not found'},404);
 }catch{return json({error:'AI service could not finish. Read the source information and retry later.'},503);}
}};
