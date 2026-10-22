"""Build the original NextJobber vector identity and editable brand templates.
Run with the Codex primary Python runtime, then run rasterize.mjs with its Node runtime.
"""
from pathlib import Path
import json, html, shutil
from reportlab.graphics.barcode.qr import QrCodeWidget

ROOT=Path(__file__).resolve().parents[1]
PLUM='#4C1734'; GRAY='#766B70'; INK='#241C24'; ROSE='#E3B4C6'; PAPER='#FBF7F9'
URL='https://career-compass-explore-1022.fizzy-camel-0518.chatgpt.site'
FONT='DejaVu Sans'
GLYPHS={
 'N':(76,'M4 100V4L72 100V4'),
 'E':(64,'M60 4H4V100H60 M4 51H52'),
 'X':(76,'M4 4L72 100 M72 4L4 100'),
 'T':(68,'M2 4H66 M34 4V100'),
 'J':(62,'M2 4H58V72Q58 100 31 100Q12 100 4 86'),
 'O':(80,'M40 3C17 3 3 23 3 52S17 101 40 101S77 81 77 52S63 3 40 3Z'),
 'B':(69,'M4 4V100H36Q65 100 65 76Q65 52 35 52H4 M4 4H34Q61 4 61 28Q61 52 35 52'),
 'R':(70,'M4 100V4H34Q64 4 64 29Q64 54 34 54H4 M34 54L67 100')}
WORD_W=sum(GLYPHS[c][0] for c in 'NEXTJOBBER')+18*9

def word(x=0,y=0,width=800,light=False,mono=False):
 s=width/WORD_W; parts=[]; dx=0
 for i,c in enumerate('NEXTJOBBER'):
  color='#FFFFFF' if light else (PLUM if mono or i<4 else GRAY)
  parts.append(f'<path d="{GLYPHS[c][1]}" transform="translate({dx} 0)" stroke="{color}"/>'); dx+=GLYPHS[c][0]+18
 return f'<g transform="translate({x} {y}) scale({s})" fill="none" stroke-width="6.2" stroke-linecap="round" stroke-linejoin="round">'+''.join(parts)+'</g>'

def mark(x=0,y=0,size=100,color=PLUM):
 return f'<g transform="translate({x} {y}) scale({size/104})" fill="none" stroke="{color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 80V24L60 80V24H84V62Q84 80 67 80H62"/></g>'

def svg(w,h,body,bg=None,label='NextJobber brand artwork'):
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{html.escape(label)}">'+(f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else '')+body+'</svg>'

def text(x,y,t,size=24,color=INK,weight=400):
 return f'<text x="{x}" y="{y}" font-family="DejaVu Sans, sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}">{html.escape(t)}</text>'

def write(rel,data):
 p=ROOT/rel; p.parent.mkdir(parents=True,exist_ok=True); p.write_text(data); return p

tokens={'name':'NextJobber','version':'1.0.0','tagline':'Your next career step, with a plan.','colors':{'plum':PLUM,'warmGray':GRAY,'ink':INK,'rose':ROSE,'paper':PAPER,'white':'#FFFFFF'},'typography':{'body':'DejaVu Sans','heading':'DejaVu Sans Bold','logo':'Original outlined geometric lettering; no font installation required'},'spacing':{'unit':8,'logoClearSpace':'At least half the capital-letter height on every side','minimumWordmarkWidthPx':180,'minimumSymbolWidthPx':24},'links':{'dashboard':URL,'plugin':'https://chatgpt.com/plugins/plugin_asdk_app_sites_3c1684dd4fb48191b2ae177ea06727a3'},'accessNote':'Current dashboard requires the owner account. Review access before public campaigns.'}
write('brand-settings.json',json.dumps(tokens,indent=2)+'\n')
write('brand.css',':root{--nj-plum:'+PLUM+';--nj-gray:'+GRAY+';--nj-ink:'+INK+';--nj-rose:'+ROSE+';--nj-paper:'+PAPER+';--nj-space:8px;--nj-font:"DejaVu Sans",sans-serif}\n@font-face{font-family:"DejaVu Sans";src:url("fonts/DejaVuSans.ttf")}\n@font-face{font-family:"DejaVu Sans";font-weight:700;src:url("fonts/DejaVuSans-Bold.ttf")}\n')

for name,light,mono,bg in [('primary',False,False,None),('plum',False,True,None),('white',True,False,None),('on-white',False,False,'#FFFFFF'),('on-plum',True,False,PLUM)]:
 write(f'logos/nextjobber-wordmark-{name}.svg',svg(1600,260,word(80,48,1440,light,mono),bg))
write('logos/nextjobber-lockup.svg',svg(1800,360,mark(58,64,225)+word(332,124,1390)))
write('logos/nextjobber-stacked.svg',svg(1200,840,mark(450,70,300)+word(100,540,1000),PAPER))
write('logos/nextjobber-symbol.svg',svg(128,128,mark(12,12,104)))
write('logos/nextjobber-symbol-white.svg',svg(128,128,mark(12,12,104,'#FFFFFF')))

for name,bg,fg in [('plum',PLUM,'#FFFFFF'),('light',PAPER,PLUM),('rose',ROSE,PLUM)]:
 write(f'icons/nextjobber-profile-{name}.svg',svg(1024,1024,f'<rect width="1024" height="1024" rx="220" fill="{bg}"/>'+mark(180,180,664,fg)))
write('icons/nextjobber-favicon.svg',svg(64,64,f'<rect width="64" height="64" rx="14" fill="{PLUM}"/>'+mark(8,8,48,'#FFFFFF')))

# Exact QR modules with a four-module quiet zone; the center stays unobstructed.
q=QrCodeWidget(URL,barLevel='M'); q.draw(); modules=q.qr.modules; n=len(modules); unit=12; margin=4
qrpaths=''.join(f'M{(x+margin)*unit} {(y+margin)*unit}h{unit}v{unit}h-{unit}z' for y,row in enumerate(modules) for x,v in enumerate(row) if v)
qsize=(n+margin*2)*unit
qsvg=svg(qsize,qsize,f'<path d="{qrpaths}" fill="{PLUM}"/>','#FFFFFF','QR code opening the current NextJobber dashboard')
write('qr/nextjobber-dashboard-qr.svg',qsvg)
write('qr/destination.txt',URL+'\nCurrent dashboard is owner-private. Review the destination and access before public printing.\n')

# Social templates use live outlined logos and editable SVG text.
def footer(w,h,dark=False):
 return word(72,h-126,min(w-144,600),dark)+text(72,h-28,'NEXTJOBBER',16,'#E3B4C6' if dark else GRAY)

social=[('instagram-post-introduction',1080,1080,PLUM,['Your next','career step,','with a plan.'],'Explore what fits. Build the evidence.'),('instagram-post-skills',1080,1080,PAPER,['Your experience','has more to offer.'],'Discover the skills you can take with you.'),('instagram-post-learning',1080,1350,'#FFFFFF',['A skill gap','can become','a next step.'],'Build a learning plan you can act on.'),('instagram-story-explore',1080,1920,PLUM,['What could','you do next?'],'Explore careers with NextJobber.'),('instagram-story-apply',1080,1920,PAPER,['Tell your','experience','clearly.'],'Prepare an application grounded in your work.'),('instagram-story-learning',1080,1920,'#FFFFFF',['Make room','for your','next skill.'],'Turn a learning goal into a plan.')]
for name,w,h,bg,lines,sub in social:
 dark=bg==PLUM; fg='#FFFFFF' if dark else PLUM
 body=mark(w-270,120,170,ROSE if dark else PLUM)
 y=390 if h>1500 else 310
 for line in lines: body+=text(72,y,line,88,fg,700); y+=113
 body+=text(76,y+30,sub,27,'#E3B4C6' if dark else GRAY)
 body+=footer(w,h,dark)
 write('social/'+name+'.svg',svg(w,h,body,bg))
for name,w,h,bg,dark in [('facebook-cover-plum',1640,624,PLUM,True),('facebook-cover-light',1640,624,PAPER,False)]:
 body=word(260,185,1110,dark)+text(280,430,'Your next career step, with a plan.',38,'#FFFFFF' if dark else GRAY)
 write('social/'+name+'.svg',svg(w,h,body,bg))
write('social/linkedin-cover.svg',svg(1584,396,word(520,90,980)+text(520,293,'Your next career step, with a plan.',30,GRAY),PAPER))
write('social/social-copy.md','# Social captions\n\n## Introduction\nYour next career step starts with understanding what you bring. NextJobber helps you explore career options, identify transferable skills, and turn your next goal into a plan.\n\n## Skills\nYour experience can apply in more places than you think. Explore the skills you already use and find examples that show them.\n\n## Learning\nChoose one skill that matters for your target role. Set a practice task, decide what evidence you will create, and review your progress.\n\nBefore posting, replace the link with your chosen public destination. The current dashboard requires the owner account.\n')

front=word(100,240,925)+text(105,440,'Your next career step, with a plan.',31,GRAY)
write('print/business-card-front.svg',svg(1125,675,front,PAPER))
back=text(90,150,'[Your name]',45,PLUM,700)+text(92,213,'[Role or title]',29,GRAY)+text(92,330,'[Email address]',26)+text(92,382,'[Phone number]',26)+text(92,434,'[Public website]',26)+word(92,535,500)
back+=f'<g transform="translate(772 285) scale({260/qsize})"><rect width="{qsize}" height="{qsize}" fill="white"/><path d="{qrpaths}" fill="{PLUM}"/></g>'+text(795,585,'Open NextJobber',17,GRAY)
write('print/business-card-back.svg',svg(1125,675,back,'#FFFFFF'))
write('print/PRINT-README.md','# Business card printing\n\nTrim: 3.5 × 2 inches. Artwork: 3.75 × 2.25 inches, including 0.125-inch bleed on every edge. Raster exports are 1125 × 675 pixels for 300 ppi at bleed size. Keep content inside the safe area. Replace bracketed contact fields before printing. Confirm the QR destination and dashboard access.\n\nThe supplied PDFs use RGB artwork. Ask your printer to apply its preferred CMYK conversion/profile and trim settings. SVG masters remain editable.\n')

for filename in ['DejaVuSans.ttf','DejaVuSans-Bold.ttf']:
 shutil.copy2('/usr/share/fonts/truetype/dejavu/'+filename,ROOT/'fonts'/filename)
shutil.copy2('/usr/share/doc/fonts-dejavu-core/copyright',ROOT/'fonts'/'LICENSE.txt')
write('fonts/README.md','# Typography\n\nInstall DejaVuSans.ttf and DejaVuSans-Bold.ttf for the supplied templates. These fonts are redistributed under their included license. The custom NextJobber wordmark is outlined artwork and is not a font. The screenshot font is not included.\n')
write('guidelines/brand-guide.md','# NextJobber brand guidelines\n\n## Identity\nNextJobber helps independent job seekers explore career options, compare opportunities, prepare applications, and plan skill development.\n\nThe original wordmark uses full E and B stems, rounded stroke joins, rebalanced widths, and a custom NJ symbol. The reference informed the airy geometric character and two-tone treatment. The supplied artwork is newly drawn.\n\n## Logo use\nUse the primary two-tone wordmark on white or paper. Use the white version on plum. Keep clear space of half the capital-letter height around the logo. Minimum wordmark width: 180 screen pixels or 45 mm in print. Below that, use the NJ symbol at 24 pixels or larger. Keep its proportions and stroke weights.\n\n## Palette\nPlum #4C1734 is the primary brand color. Warm gray #766B70 is secondary. Ink #241C24 is the main body text. Rose #E3B4C6 is a decorative accent. Paper #FBF7F9 is the light background. Use ink or plum for small text on light backgrounds and white for text on plum. Use rose for accents rather than small text on white.\n\n## Typography\nThe wordmark is custom outlined artwork. Use DejaVu Sans for editable body copy and DejaVu Sans Bold for headings. Font files and the redistribution license are included.\n\n## Voice\nUse clear, practical, encouraging language. Describe the user’s choices and next action. Explain how examples support a job comparison. Avoid claims of guaranteed interviews, validated aptitude scores, or universal ATS scores.\n\n## Templates\nReplace bracketed contact and invoice fields before use. The social canvases are supplied at the named dimensions with editable SVG text. Preview platform cropping before posting. The QR points to the current owner-private dashboard and requires a destination/access review before public printing.\n\n## Motion\nA short, gentle reveal introduces the symbol and wordmark. Respect reduced-motion preferences. Keep a still version wherever the animation appears.\n\n## Service features\nThe studio provides local brand settings, exports, and a simple design editor. Enterprise Chat is a support-widget design and response library, not a staffed support service.\n')
print(json.dumps({'root':str(ROOT),'svg_files':len(list(ROOT.rglob('*.svg'))),'wordmarkWidth':WORD_W}))
