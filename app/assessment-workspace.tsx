'use client';
import {useState} from 'react';
import {ArrowRight,Check,Plus,Pencil,ArrowLeft} from 'lucide-react';
import type {AssessmentTemplate} from '@/lib/career/assessment-templates';

type Row={id:string;kind:string;data:any;revision:number;updatedAt:string};
type Questionnaire=AssessmentTemplate&{type:string;templateId?:string;templateRevision?:number};
type Editor={id:string;revision?:number;template:AssessmentTemplate};
type Props={signedIn:boolean;records:Row[];call:(name:string,args?:any)=>Promise<any>;onSaved:()=>Promise<void>};
const builtIns=[
 ['interests','01','Activities you enjoy','18 questions · Explore the work that energizes you'],
 ['work_values','02','What matters at work','8 questions · Clarify your priorities'],
 ['skill_evidence','03','Transferable skills','10 questions · Recognize skills and find evidence'],
 ['learning_readiness','04','Learning opportunities','8 questions · Turn gaps into a practical next step']
];
// getRandomValues also works in HTTP development previews. IDs are not credentials.
const newId=()=>Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
const newQuestion=()=>({id:'q-'+newId(),domain:'Overall',text:''});
function blankTemplate():AssessmentTemplate{return {title:'',description:'',instructions:'Rate each statement from 1 to 5 based on your experience. You may skip any question.',anchors:['Strongly disagree','Disagree','Neutral / unsure','Agree','Strongly agree'],questions:[newQuestion()]};}

export default function AssessmentWorkspace({signedIn,records,call,onSaved}:Props){
 const [active,setActive]=useState<Questionnaire|null>(null);
 const [editor,setEditor]=useState<Editor|null>(null);
 const [answers,setAnswers]=useState<Record<string,number|null>>({});
 const [evidence,setEvidence]=useState<Record<string,string>>({});
 const [result,setResult]=useState<any>(null);
 const [attemptId,setAttemptId]=useState('');
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const templates=records.filter(r=>r.kind==='assessment_template');
 const completed=records.filter(r=>r.kind==='assessment');
 async function run(action:()=>Promise<void>){setBusy(true);setMessage('');try{await action();}catch(e){setMessage(e instanceof Error?e.message:'Please try again.');}finally{setBusy(false);}}
 function begin(definition:Questionnaire){setActive(definition);setEditor(null);setAnswers({});setEvidence({});setResult(null);setAttemptId(newId());setMessage('');}
 function catalog(){setActive(null);setEditor(null);setResult(null);setMessage('');}
 function updateTemplate(patch:Partial<AssessmentTemplate>){setEditor(current=>current?{...current,template:{...current.template,...patch}}:null);}
 function updateQuestion(index:number,patch:Partial<AssessmentTemplate['questions'][number]>){if(editor)updateTemplate({questions:editor.template.questions.map((q,i)=>i===index?{...q,...patch}:q)});}
 function moveQuestion(index:number,delta:number){if(!editor)return;const questions=[...editor.template.questions];[questions[index],questions[index+delta]]=[questions[index+delta],questions[index]];updateTemplate({questions});}
 async function loadTemplate(record:Row,edit=false){const current=await call('get_record',{kind:'assessment_template',id:record.id});if(!current)throw new Error('This assessment was deleted. Refresh your workspace.');if(edit){setEditor({id:current.id,revision:current.revision,template:structuredClone(current.data)});setActive(null);}else begin({...current.data,type:'custom',templateId:current.id,templateRevision:current.revision});}

 return <>
  <div className="eyebrow">KNOW YOURSELF. GROW YOUR OPTIONS.</div>
  <h1>Explore yourself.</h1>
  <p className="lede">A few thoughtful questions can reveal a useful next step.</p>
  <p className="muted assessment-note">These self-reflection questionnaires describe your current answers. They are not validated psychological tests or predictors of job performance.</p>
  {message&&<div role="status" className="notice">{message}</div>}
  {busy&&<p role="status" className="loading">Saving or loading your assessment…</p>}

  {editor?<section className="panel assessment-editor" aria-label="Assessment editor">
   <button className="text-btn" disabled={busy} onClick={catalog}><ArrowLeft size={14}/> All assessments</button>
   <h2>{editor.revision?'Edit assessment':'Create an assessment'}</h2>
   <p>Write your own reflection and group related questions into scoring categories. Your assessments are private to your signed-in account.</p>
   <form onSubmit={e=>{e.preventDefault();run(async()=>{const saved=await call('save_assessment_template',{id:editor.id,...(editor.revision?{expectedRevision:editor.revision}:{}),template:editor.template});setEditor({...editor,revision:saved.revision,template:saved.data});await onSaved();setEditor(null);setMessage('Assessment saved. You can take it below or use it with NextJobber in chat.');});}}>
    <fieldset className="editor-fields" disabled={busy}>
     <label>Assessment title<input autoFocus required maxLength={160} value={editor.template.title} onChange={e=>updateTemplate({title:e.target.value})} placeholder="e.g. My career change readiness"/></label>
     <label>Short description (optional)<textarea maxLength={1500} value={editor.template.description} onChange={e=>updateTemplate({description:e.target.value})}/></label>
     <label>Instructions<textarea required maxLength={1500} value={editor.template.instructions} onChange={e=>updateTemplate({instructions:e.target.value})}/></label>
     <h3>Rating labels</h3><p className="muted small">Ratings run from 1 to 5. Write questions so higher ratings consistently mean more of the quality being described.</p>
     <div className="anchor-editor">{editor.template.anchors.map((anchor,index)=><label key={index}>Rating {index+1}<input required maxLength={80} value={anchor} onChange={e=>updateTemplate({anchors:editor.template.anchors.map((value,i)=>i===index?e.target.value:value)})}/></label>)}</div>
     <div className="section-title"><h3>Questions</h3><span>{editor.template.questions.length} of 50</span></div>
     {editor.template.questions.map((question,index)=><div className="question-editor" key={question.id}>
      <div className="section-title"><strong>Question {index+1}</strong><div className="editor-actions">
       <button className="text-btn" type="button" disabled={index===0} aria-label={'Move question '+(index+1)+' up'} onClick={()=>moveQuestion(index,-1)}>Move up</button>
       <button className="text-btn" type="button" disabled={index===editor.template.questions.length-1} aria-label={'Move question '+(index+1)+' down'} onClick={()=>moveQuestion(index,1)}>Move down</button>
       <button className="text-btn danger" type="button" disabled={editor.template.questions.length===1} aria-label={'Remove question '+(index+1)} onClick={()=>updateTemplate({questions:editor.template.questions.filter((_,i)=>i!==index)})}>Remove</button>
      </div></div>
      <label>Question text<textarea required maxLength={500} value={question.text} onChange={e=>updateQuestion(index,{text:e.target.value})} placeholder="e.g. I can describe what I want from my next role."/></label>
      <label>Scoring category<input required maxLength={80} value={question.domain} onChange={e=>updateQuestion(index,{domain:e.target.value})} placeholder="e.g. Clarity"/></label>
     </div>)}
     <button className="button secondary" type="button" disabled={editor.template.questions.length>=50} onClick={()=>updateTemplate({questions:[...editor.template.questions,newQuestion()]})}><Plus size={16}/> Add question</button>
     <div className="scoring-explainer"><h3>How results work</h3><p>Each category averages its answered questions, then scales that average to 0–100. At least half the questions in a category must be answered to show a score. Skipped questions are excluded. These are descriptive self-reports.</p><p>Saved results keep the wording and rating labels used for that attempt. Later edits apply to future attempts.</p></div>
     <div className="form-footer"><button className="button primary">Save assessment <Check size={16}/></button><button className="text-btn" type="button" onClick={catalog}>Cancel</button></div>
    </fieldset>
   </form>
  </section>:active?<section className="panel questionnaire">
   <button className="text-btn" disabled={busy} onClick={catalog}><ArrowLeft size={14}/> All assessments</button>
   <h2>{active.title}</h2>
   <p>{active.description}</p><p>{active.instructions}</p>
   {active.templateRevision&&<p className="small muted">Your custom assessment · Version {active.templateRevision}</p>}
   {result?<>
    <div className="success"><Check size={18}/> Results saved · {result.completion}% complete</div>
    {result.domains.map((d:any)=><div className="score-row" key={d.domain}><div><strong>{d.domain}</strong><p>{d.answered}/{d.total} answered{d.insufficientData?' · Not enough answers to score':''}</p></div><b>{d.score??'—'}{d.score!==null&&<small>/100</small>}</b>{d.score!==null&&<progress max={100} value={d.score}/>}</div>)}
    {result.learningPriorities?.length>0&&<><h3>Possible next steps</h3>{result.learningPriorities.map((p:any)=><div className="learning-task" key={p.domain}><strong>{p.domain}</strong><p>{p.action}</p></div>)}</>}
    <p className="muted">{result.interpretation}</p>
    {result.definition&&<details className="saved-wording"><summary>View the questions and responses saved with this result</summary>{result.definition.questions.map((q:any)=><div className="saved-response" key={q.id}><strong>{q.text}</strong><p>{result.answers[q.id]!=null?`${result.answers[q.id]} · ${result.definition.anchors[result.answers[q.id]-1]}`:'Skipped'}{result.evidence[q.id]?' · Example: '+result.evidence[q.id]:''}</p></div>)}</details>}
   </>:<form onSubmit={e=>{e.preventDefault();run(async()=>{const args=active.type==='custom'?{templateId:active.templateId,templateRevision:active.templateRevision}:{type:active.type};const r=await call(active.type==='custom'?'submit_custom_assessment':'submit_assessment',{...args,id:attemptId,answers,evidence});setResult(r.data);await onSaved();});}}>
    {active.questions.map((q,index)=><fieldset key={q.id} disabled={busy}>
     <legend><span>{String(index+1).padStart(2,'0')}</span> {q.text}</legend>
     <div className="rating-options">{active.anchors.map((anchor,i)=><label key={i} className={answers[q.id]===i+1?'rating selected':'rating'}><input type="radio" name={q.id} value={i+1} checked={answers[q.id]===i+1} onChange={()=>setAnswers({...answers,[q.id]:i+1})}/><b>{i+1}</b><span>{anchor}</span></label>)}</div>
     <button className="text-btn skip" type="button" onClick={()=>setAnswers({...answers,[q.id]:null})}>{answers[q.id]===null?'Skipped':'Skip this question'}</button>
     {(active.type==='skill_evidence'||active.type==='custom')&&<label className="evidence-label">Optional: a specific example<input value={evidence[q.id]??''} maxLength={3000} onChange={e=>setEvidence({...evidence,[q.id]:e.target.value})} placeholder="A project, work task, volunteer role, or everyday example"/></label>}
    </fieldset>)}
    <button className="button primary" disabled={busy||!Object.values(answers).some(value=>value!==null)}>Save my reflection <ArrowRight size={16}/></button>
   </form>}
  </section>:<>
   <div className="assessment-grid">{builtIns.map(([type,num,title,description])=><button key={type} className="assessment-card" disabled={!signedIn||busy} onClick={()=>run(async()=>begin(await call('get_assessment',{type})))}><span className="assessment-num">{num}</span><h2>{title}</h2><p>{description}</p><span className="card-link">Begin reflection <ArrowRight size={17}/></span></button>)}</div>
   <section className="custom-assessments" aria-label="Your custom assessments">
    <div className="section-title"><div><h2>Your custom assessments</h2><p className="muted small">Create, edit, and take your own reflections here. They are also available in NextJobber chat.</p></div><button className="button primary" disabled={!signedIn||busy} onClick={()=>{setEditor({id:newId(),template:blankTemplate()});setMessage('');}}><Plus size={16}/> Create assessment</button></div>
    {!templates.length?<div className="empty"><Pencil size={26}/><h2>Make room for your own questions.</h2><p>Add a title, five rating labels, and questions. Group them into categories to see a score for each.</p></div>:<div className="assessment-grid">{templates.map(record=><article className="assessment-card custom-card" key={record.id}><span className="tag">Your reflection · Version {record.revision}</span><h2>{record.data.title}</h2><p>{record.data.description||`${record.data.questions.length} questions · Your own reflection`}</p><div className="editor-actions"><button className="button primary" disabled={busy} onClick={()=>run(()=>loadTemplate(record))}>Take assessment <ArrowRight size={16}/></button><button className="button secondary" disabled={busy} onClick={()=>run(()=>loadTemplate(record,true))}><Pencil size={14}/> Edit</button><button className="text-btn danger" disabled={busy} onClick={()=>{if(window.confirm('Delete this custom assessment? Your completed results will be kept.'))run(async()=>{await call('delete_record',{kind:'assessment_template',id:record.id,expectedRevision:record.revision});await onSaved();setMessage('Assessment deleted. Saved results are still available.');});}}>Delete</button></div></article>)}</div>}
   </section>
   {completed.length>0&&<section className="panel reflection-history"><h2>Your saved reflections</h2><p>Review previous results, including the exact questions used for custom assessments.</p>{completed.map(record=><div className="reflection-history-row" key={record.id}><div><strong>{record.data.title??builtIns.find(a=>a[0]===record.data.type)?.[2]??'Career reflection'}</strong><p className="small muted">{new Date(record.updatedAt).toLocaleDateString()} · {record.data.completion}% complete{record.data.templateRevision?` · Version ${record.data.templateRevision}`:''}</p></div><button className="button secondary" onClick={()=>{setActive({...record.data.definition,type:'saved',title:record.data.title??builtIns.find(a=>a[0]===record.data.type)?.[2]??'Career reflection',description:'',instructions:'Your saved reflection results.'});setResult(record.data);setMessage('');}}>View results</button></div>)}</section>}
  </>}
 </>;
}
