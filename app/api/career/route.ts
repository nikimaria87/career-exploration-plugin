import {callTool} from '@/lib/career/tools';
export const dynamic='force-dynamic';
export async function POST(req:Request){
 const origin=req.headers.get('origin');if(!origin||origin!==new URL(req.url).origin)return Response.json({error:'Same-origin request required'},{status:403});
 const owner=req.headers.get('oai-authenticated-user-id');if(!owner)return Response.json({error:'Please sign in with ChatGPT.'},{status:401});
 try{const raw=await req.text();if(raw.length>200000)return Response.json({error:'Request too large'},{status:413});const p=JSON.parse(raw);const result=await callTool(p.name,p.arguments,owner);return Response.json({result},{headers:{'Cache-Control':'private, no-store'}});}catch(e){return Response.json({error:e instanceof Error?e.message:'Operation failed'},{status:400,headers:{'Cache-Control':'private, no-store'}});}
}
