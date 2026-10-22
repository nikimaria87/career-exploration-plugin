import {env} from 'cloudflare:workers';
export const kinds=['profile','assessment','application','learning_plan','draft','fit_report'] as const;
export type Kind=typeof kinds[number];
export type CareerRecord={kind:Kind;id:string;data:any;revision:number;createdAt:string;updatedAt:string};
function database(){if(!env.DB)throw new Error('Storage is unavailable. Please try again later.');return env.DB;}
function unpack(r:any):CareerRecord{return {kind:r.kind,id:r.id,data:JSON.parse(r.data),revision:r.revision,createdAt:r.created_at,updatedAt:r.updated_at};}
export async function readRecord(owner:string,kind:Kind,id:string){const row=await database().prepare('SELECT * FROM career_records WHERE owner=? AND kind=? AND id=?').bind(owner,kind,id).first();return row?unpack(row):null;}
export async function listRecords(owner:string,kind?:Kind,offset=0){const args=kind?[owner,kind,101,offset]:[owner,101,offset];const res=await database().prepare('SELECT * FROM career_records WHERE owner=? '+(kind?'AND kind=? ':'')+'ORDER BY updated_at DESC,kind,id LIMIT ? OFFSET ?').bind(...args).all();return {records:res.results.slice(0,100).map(unpack),hasMore:res.results.length>100,nextOffset:res.results.length>100?offset+100:null};}
export async function saveRecord(owner:string,kind:Kind,id:string,data:any,expectedRevision?:number){
 const now=new Date().toISOString();const json=JSON.stringify(data);if(json.length>120000)throw new Error('Record too large; use a shorter document or split it.');
 let result;if(expectedRevision!==undefined){result=await database().prepare('UPDATE career_records SET data=?,revision=revision+1,updated_at=? WHERE owner=? AND kind=? AND id=? AND revision=?').bind(json,now,owner,kind,id,expectedRevision).run();}
 else{result=await database().prepare('INSERT OR IGNORE INTO career_records (owner,kind,id,data,revision,created_at,updated_at) VALUES (?,?,?,?,1,?,?)').bind(owner,kind,id,json,now,now).run();}
 if(result.meta.changes!==1)throw new Error('Record changed or already exists. Read its current revision, reconcile your changes, and retry with expectedRevision.');
 return readRecord(owner,kind,id);
}
export async function deleteRecord(owner:string,kind:Kind,id:string,revision:number){const r=await database().prepare('DELETE FROM career_records WHERE owner=? AND kind=? AND id=? AND revision=?').bind(owner,kind,id,revision).run();if(r.meta.changes!==1)throw new Error('Record changed or not found. Refresh before deleting.');return {deleted:true,kind,id};}
