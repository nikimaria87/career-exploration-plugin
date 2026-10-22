import {toolList,callTool} from '@/lib/career/tools';
export const dynamic='force-dynamic';
function respond(body:unknown,status=200){return Response.json(body,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}
export async function POST(req:Request){
 const length=Number(req.headers.get('content-length')||0);if(length>200000)return respond({error:'Request too large'},413);
 let p:any;try{const raw=await req.text();if(raw.length>200000)return respond({error:'Request too large'},413);p=JSON.parse(raw);}catch{return respond({jsonrpc:'2.0',id:null,error:{code:-32700,message:'Invalid JSON'}},400);}
 if(!p||Array.isArray(p)||p.jsonrpc!=='2.0'||typeof p.method!=='string')return respond({jsonrpc:'2.0',id:p?.id??null,error:{code:-32600,message:'Invalid JSON-RPC request'}},400);
 const result=(value:unknown)=>respond({jsonrpc:'2.0',id:p.id??null,result:value});
 if(p.method==='server/discover')return result({supportedVersions:['2026-07-28'],capabilities:{tools:{}}});
 if(p.method==='initialize')return result({protocolVersion:'2025-03-26',capabilities:{tools:{}},serverInfo:{name:'NextJobber',version:'0.1.0'},instructions:'Start with get_workflow. All private records belong to the authenticated caller. Never fabricate qualifications or assessment responses.'});
 if(p.method==='notifications/initialized'||p.method==='notifications/cancelled')return new Response(null,{status:202});
 if(p.method==='ping')return result({});
 if(p.method==='tools/list')return result({tools:toolList()});
 if(p.method==='tools/call'){
  const owner=req.headers.get('oai-authenticated-user-id');
  if(!owner)return result({content:[{type:'text',text:'Sign in with ChatGPT to use NextJobber. No private data was read or written.'}],isError:true});
  try{const r=await callTool(p.params?.name,p.params?.arguments,owner);return result({content:[{type:'text',text:JSON.stringify(r)}],...(r&&typeof r==='object'?{structuredContent:r}:{}),isError:false});}
  catch(e){return result({content:[{type:'text',text:e instanceof Error?e.message:'The operation failed. Please try again.'}],isError:true});}
 }
 return respond({jsonrpc:'2.0',id:p.id??null,error:{code:-32601,message:'Method not found'}});
}
