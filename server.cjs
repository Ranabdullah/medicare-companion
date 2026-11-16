// Start with: node --env-file-if-exists=.env.local server.cjs
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = __dirname;
const purchaseLicense=require('./purchase-license.cjs').licenseStore(root,'medicare');
const {readSource}=require(require('node:fs').existsSync(path.join(root,'source-reader.bundle.cjs'))?'./source-reader.bundle.cjs':'./source-reader.cjs');
const folderBackup=require('./local-backup.cjs')(root,'medicare');
const allowed = new Set(['index.html','app.js','health-library.js','workspace.js','styles.css','workspace.css','medicine-safety.js','buyer-adapter.js','buyer-cloud.js','buyer-guide.js','manifest.json','reminders.js','reminder-sw.js','purchase-ui.js']);
http.createServer(async (req,res) => {
  const reply=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  try {
    const host=req.headers.host||'';if(!/^(127\.0\.0\.1|localhost):\d+$/.test(host))return reply(403,{error:'Open this app using its local address.'});
    const url=new URL(req.url,'http://'+host);
    if(url.pathname==='/api/purchase-activation'){if(req.method==='GET')return reply(200,{...await purchaseLicense.status(),canActivate:true});if(req.method!=='POST')return reply(405,{error:'Method not allowed'});if(req.headers.origin&&new URL(req.headers.origin).host!==host)return reply(403,{error:'Origin denied'});let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>2048)return reply(413,{error:'Request too large'});}try{const b=JSON.parse(raw);return reply(200,await purchaseLicense.activate(b.platform,b.purchaseKey));}catch(e){return reply(400,{error:e.message||'Activation failed'});}}
    if(url.pathname.startsWith('/api/')&&process.env.ACTIVATION_REQUIRED==='true'&&!(await purchaseLicense.status()).valid)return reply(402,{error:'Activate this purchased installation first.'});
    if(await folderBackup(req,res,url))return;
    if(url.pathname==='/api/source') {
      if(req.method!=='GET')return reply(405,{error:'Method not allowed'});
      try {return reply(200,await readSource(url.searchParams.get('url')));} catch {return reply(502,{error:'Source text could not be loaded'});}
    }
    if(url.pathname==='/api/health'){
      if(req.method!=='POST')return reply(405,{error:'Method not allowed'});
      if(req.headers.origin&&new URL(req.headers.origin).host!==host)return reply(403,{error:'Origin denied'});
      let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>12000)return reply(413,{error:'Request too large'});}
      try{return reply(200,await require('./health-ai.cjs')(JSON.parse(raw),{readSource}));}catch(e){return reply(e.status||503,{error:e.status?e.message:'AI education could not be completed. Source reading remains available.'});}
    }
    if(req.method!=='GET')return reply(405,{error:'Method not allowed'});
    const file=decodeURIComponent(url.pathname).replace(/^\//,'')||'index.html';
    const resolved=path.resolve(root,file);
    if(!resolved.startsWith(root+path.sep)||(!allowed.has(file)&&!/^assets\/[\w.-]+\.(svg|png|jpg|jpeg|webp)$/.test(file)))return reply(404,{error:'Not found'});
    const data=await fs.readFile(resolved);
    res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'})[path.extname(file)]||'application/octet-stream'});res.end(data);
  } catch {reply(500,{error:'Request could not be completed'});}
}).listen(Number(process.env.PORT)||4177,'127.0.0.1',()=>console.log('MediCare: http://127.0.0.1:4177'));
