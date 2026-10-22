export const assessmentTypes = ['interests','work_values','skill_evidence','learning_readiness'] as const;
export type AssessmentType = typeof assessmentTypes[number];
type Question = {id:string; domain:string; text:string};
const rows: Record<AssessmentType, [string,string,string][]> = {
 interests:[
 ['i1','Helping','Coach someone through a difficult decision.'],['i2','Helping','Explain a new process patiently to someone.'],['i3','Helping','Support someone in reaching a personal goal.'],
 ['i4','Investigating','Find patterns in a dataset.'],['i5','Investigating','Research why a process is not working.'],['i6','Investigating','Compare evidence before recommending a solution.'],
 ['i7','Creating','Develop a visual design or written story.'],['i8','Creating','Invent a new way to communicate an idea.'],['i9','Creating','Experiment with different designs or approaches.'],
 ['i10','Building','Build or repair something useful.'],['i11','Building','Work directly with tools, equipment, or physical materials.'],['i12','Building','Test a practical solution by making a prototype.'],
 ['i13','Organizing','Turn a confusing project into clear steps.'],['i14','Organizing','Maintain accurate records and schedules.'],['i15','Organizing','Improve how a team tracks tasks and deadlines.'],
 ['i16','Leading','Persuade others to support an idea.'],['i17','Leading','Coordinate a group toward a shared goal.'],['i18','Leading','Take responsibility for a decision with tradeoffs.']],
 work_values:[['v1','Autonomy','Have freedom to choose how I complete my work.'],['v2','Security','Have predictable employment and income.'],['v3','Purpose','See a positive impact from my work.'],['v4','Growth','Learn new skills and advance.'],['v5','Flexibility','Have flexibility in when or where I work.'],['v6','Compensation','Earn compensation that meets my goals.'],['v7','Connection','Work with supportive colleagues.'],['v8','Clarity','Have clear expectations and reliable processes.']],
 skill_evidence:[['s1','Communication','Explain a complex idea clearly to the intended audience.'],['s2','Analysis','Use information or data to support a decision.'],['s3','Digital tools','Learn and use software to complete a task.'],['s4','Coordination','Organize tasks, people, and deadlines.'],['s5','Coaching','Help another person learn or improve.'],['s6','Problem solving','Identify a root cause and test a solution.'],['s7','Writing','Write a clear document for a specific purpose.'],['s8','Collaboration','Work through a disagreement respectfully.'],['s9','Leadership','Guide a project or initiative to a result.'],['s10','Adaptability','Adjust my approach when conditions change.']],
 learning_readiness:[['l1','Target clarity','Describe a target role and its essential requirements.'],['l2','Gap identification','Distinguish a missing skill from a skill I have not documented.'],['l3','Learning plan','Break a skill goal into manageable practice tasks.'],['l4','Practice','Make regular time to practice a new skill.'],['l5','Feedback','Get useful feedback on my work.'],['l6','Evidence','Create a work sample that demonstrates a skill.'],['l7','Opportunity research','Compare learning options by cost, time, access, and relevance.'],['l8','Application readiness','Explain how a new skill applies to a real job task.']]
};
export const learningActions:Record<string,string> = {
 Communication:'Record a two-minute explanation of a complex topic; ask a peer to summarize it and revise for clarity.',
 Analysis:'Analyze a small public dataset, state your question, document your method, and present one supported recommendation.',
 'Digital tools':'Choose one tool named in a target posting and complete a small practical task with it; save a walkthrough.',
 Coordination:'Create a project plan with owners, milestones, risks, and a weekly update.',
 Coaching:'Design and run a short teaching session; collect feedback and revise the instructions.',
 'Problem solving':'Write a root-cause analysis and compare two possible solutions using explicit criteria.',
 Writing:'Create a one-page brief for a real audience; revise it after feedback.',
 Collaboration:'Document a team project with your contribution, a disagreement, and how it was resolved.',
 Leadership:'Lead a small initiative and document decisions, stakeholder feedback, and results.',
 Adaptability:'Describe a change in requirements, the approach you revised, and what you learned.',
 'Target clarity':'Compare three current postings for one role and list recurring essential requirements.',
 'Gap identification':'Map each requirement to a verified example; mark unknown evidence separately from missing experience.',
 'Learning plan':'Choose one priority skill and define a two-week practice milestone.',
 Practice:'Schedule two short practice sessions this week and record what you complete.',
 Feedback:'Identify a peer, mentor, or rubric and request feedback on one work sample.',
 Evidence:'Create a small portfolio artifact based on a realistic task from your target role.',
 'Opportunity research':'Compare three learning resources; verify cost, duration, accessibility, and whether they include practice.',
 'Application readiness':'Write a short interview example connecting your new skill to a job requirement.'
};
export function getAssessment(type:AssessmentType) {
 const anchors = type==='interests' ? ['Strongly dislike','Dislike','Neutral / unsure','Enjoy','Strongly enjoy'] : type==='work_values' ? ['Low priority','Slight priority','Moderate priority','High priority','Essential priority'] : type==='skill_evidence' ? ['No experience yet','Learning the basics','Can do with support','Can do independently','Can teach or guide others'] : ['Not yet','Rarely / limited clarity','Sometimes / some clarity','Usually / clear','Consistently / very clear'];
 return {type,version:'1.0.0',title:{interests:'Activities you enjoy',work_values:'What matters at work',skill_evidence:'Transferable skills and evidence',learning_readiness:'Your next learning opportunities'}[type],
  description:'Original, exploratory self-report questionnaire. It is not a validated psychological test, aptitude test, diagnosis, or predictor of hiring outcomes. No fixed learning-style labels are assigned.',
  instructions:'Rate each item from 1 to 5. You may skip an item by answering null. For skills, add a specific example when possible. Results describe current self-reports and can change.',
  anchors,questions:rows[type].map(([id,domain,text])=>({id,domain,text}))};
}
export function scoreAssessment(type:AssessmentType, answers:Record<string,number|null>, evidence:Record<string,string>={}) {
 const assessment=getAssessment(type); const ids=new Set(assessment.questions.map(q=>q.id));
 for(const [id,value] of Object.entries(answers)) if(!ids.has(id)|| (value!==null&&(!Number.isInteger(value)||value<1||value>5))) throw new Error('Invalid assessment answer: '+id);
 for(const id of Object.keys(evidence)) if(!ids.has(id)) throw new Error('Unknown evidence item: '+id);
 const groups: Record<string,{values:number[];total:number;examples:string[]}>={};
 for(const q of assessment.questions){ const g=groups[q.domain]??={values:[],total:0,examples:[]}; g.total++; const v=answers[q.id]; if(v!==null&&v!==undefined)g.values.push(v); if(evidence[q.id]?.trim())g.examples.push(evidence[q.id].trim()); }
 const answered=Object.values(groups).reduce((n,g)=>n+g.values.length,0);
 if(!answered)throw new Error('Answer at least one question before submitting.');
 const domains=Object.entries(groups).map(([domain,g])=>{const coverage=g.values.length/g.total;const mean=g.values.length?g.values.reduce((a,b)=>a+b,0)/g.values.length:null;return {domain,answered:g.values.length,total:g.total,mean:mean===null?null:Math.round(mean*100)/100,score:mean!==null&&coverage>=0.5?Math.round((mean-1)*25):null,insufficientData:coverage<0.5,evidence:g.examples,evidenceStatus:g.examples.length?'User-provided example; not independently verified':'No example supplied',nextStep:learningActions[domain]??'Explore roles with this feature, then compare them with your constraints and actual experience.'};});
 return {type,version:assessment.version,answered,total:assessment.questions.length,completion:Math.round(answered/assessment.questions.length*100),domains,
  learningPriorities:['skill_evidence','learning_readiness'].includes(type)?domains.filter(d=>d.mean!==null&&d.mean<4).sort((a,b)=>a.mean!-b.mean!).map(d=>({domain:d.domain,action:d.nextStep,reason:'Self-reported score below independent/consistent practice. Confirm relevance to the target role before prioritizing.'})):[],
  interpretation:'Scores rescale the available 1–5 item means to 0–100 using (mean−1)×25. Domains below 50% answered have no score. These are descriptive self-reports, not population percentiles. Unknown evidence is not proof of inability. Do not use for employer screening.'};
}
