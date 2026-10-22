from pathlib import Path
import sys,re,shutil
kit=Path(__file__).resolve().parents[1]
root=Path(sys.argv[1]).resolve()
for directory in ['app','lib']:
 for p in (root/directory).rglob('*.ts*'):
  p.write_text(p.read_text().replace('Career Compass','NextJobber'))
p=root/'scripts/prepare-career-skills.mjs'
p.write_text(p.read_text().replace('Career Compass','NextJobber').replace("${name.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' ')}","${name==='career-compass-start'?'NextJobber Start':name.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' ')}"))
p=root/'app/dashboard.tsx';s=p.read_text()
old='<a className="brand" href="/"><span className="brand-icon"><Compass size={24}/></span><span>career<span className="brand-light">compass</span><small>YOUR NEXT CHAPTER</small></span></a>'
new='<a className="brand" href="/" aria-label="NextJobber home"><img className="brand-wordmark" src="/brand/nextjobber-wordmark-primary.svg" alt="NextJobber"/><small>YOUR NEXT CAREER STEP</small></a>'
if old in s:s=s.replace(old,new)
elif new not in s:raise ValueError('Brand header changed; reconcile it before applying.')
s=re.sub(r'<div className="compass-art" aria-hidden="true">.*?<span className="art-dot"/></div>','<div className="nj-hero-mark" aria-hidden="true"><img src="/brand/nextjobber-symbol.svg" alt=""/></div>',s)
p.write_text(s)
dest=root/'public/brand';dest.mkdir(parents=True,exist_ok=True)
for name in ['nextjobber-wordmark-primary.svg','nextjobber-symbol.svg']:
 shutil.copy2(kit/'logos'/name,dest/name)
shutil.copy2(kit/'icons/nextjobber-favicon.svg',root/'public/favicon.svg')
p=root/'app/globals.css';s=p.read_text()
if '/* NextJobber identity */' not in s:
 colors=set(re.findall(r'#[a-fA-F0-9]{6}',s))
 for c in colors:
  if c.lower()=='#9a4343':continue
  lum=sum(int(c[i:i+2],16) for i in [1,3,5])/3
  target=('#FBF7F9' if lum>240 else '#F4EBF0' if lum>220 else '#E5D5DE' if lum>190 else '#D6B2C4' if lum>155 else '#8D6E80' if lum>115 else '#766B70' if lum>80 else '#4C1734')
  s=s.replace(c,target)
 s+='\n/* NextJobber identity */\n.brand{display:block;margin:0 3px 45px}.brand-wordmark{display:block;width:210px;max-width:100%;height:auto}.brand small{color:#766B70;margin-top:13px;letter-spacing:1.6px}.nj-hero-mark{width:230px;max-width:30%;opacity:.9;margin-right:25px}.nj-hero-mark img{width:100%;height:auto}:root{--ink:#241C24;--muted:#766B70;--line:#E5D5DE;--paper:#FBF7F9;--green:#4C1734;--lime:#E3B4C6;--gold:#9A6F85}.button.primary{color:#FFFFFF}.nav.active{background:#F4EBF0;color:#4C1734}button:focus-visible,a:focus-visible{outline-color:#9D4C73}@media(max-width:700px){.brand{margin-bottom:20px}.brand-wordmark{width:180px}.nj-hero-mark{display:none}}\n'
 p.write_text(s)
print('Applied NextJobber branding to '+str(root))
