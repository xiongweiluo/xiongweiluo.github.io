"""Rebuild the one-page website CV with ReportLab (pip install reportlab)."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
FONT_DIR = Path('/System/Library/Fonts/Supplemental')
for name, filename in [('CV', 'Arial.ttf'), ('CV-Bold', 'Arial Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / filename)))
pdfmetrics.registerFontFamily('CV', normal='CV', bold='CV-Bold')

W, H = A4
LEFT, RIGHT = 38, W - 38
WIDTH = RIGHT - LEFT
INK = colors.HexColor('#202923')
MUTED = colors.HexColor('#5D6861')
ACCENT = colors.HexColor('#385B4C')
RULE = colors.HexColor('#D7DFD9')
c = canvas.Canvas(str(ROOT / 'assets/cv-industry.pdf'), pagesize=A4)
c.setTitle('Xiongwei Luo | CV')
c.setAuthor('Xiongwei Luo')
c.setSubject('AI Product and Application Development')
y = H - 37


def text(value, size=9.1, leading=12.1, color=INK, bold=False, gap=0, indent=0):
    global y
    style = ParagraphStyle('cv', fontName='CV-Bold' if bold else 'CV',
                           fontSize=size, leading=leading, textColor=color)
    p = Paragraph(value, style)
    _, height = p.wrap(WIDTH - indent, H)
    p.drawOn(c, LEFT + indent, y - height)
    y -= height + gap


def pair(left, right, bold=False, gap=1):
    global y
    size = 9.1
    rw = pdfmetrics.stringWidth(right, 'CV', 8.5)
    p = Paragraph(left, ParagraphStyle('pair', fontName='CV-Bold' if bold else 'CV',
                  fontSize=size, leading=12.1, textColor=INK))
    _, h = p.wrap(WIDTH - rw - 15, H)
    p.drawOn(c, LEFT, y - h)
    c.setFillColor(MUTED)
    c.setFont('CV', 8.5)
    c.drawRightString(RIGHT, y - 9.1, right)
    y -= h + gap


def section(label):
    global y
    y -= 12
    c.setFont('CV-Bold', 8.2)
    c.setFillColor(ACCENT)
    c.drawString(LEFT, y - 8.2, label.upper())
    start = LEFT + pdfmetrics.stringWidth(label.upper(), 'CV-Bold', 8.2) + 13
    c.setStrokeColor(RULE)
    c.setLineWidth(.6)
    c.line(start, y - 5, RIGHT, y - 5)
    y -= 18


def bullet(value):
    global y
    c.setFillColor(ACCENT)
    c.circle(LEFT + 2.3, y - 5.4, 1.15, stroke=0, fill=1)
    text(value, indent=10, gap=2)


def link(label, url):
    return f'<a href="{url}" color="#385B4C">{label}</a>'


def skill(label, value, gap=2):
    global y
    before = y
    text(label, bold=True)
    label_bottom = y
    y = before
    text(value, indent=105, gap=gap)
    y = min(y, label_bottom - gap)


text('Xiongwei Luo', size=25, leading=29, bold=True, gap=5)
text('AI Product &amp; Application Development', size=11.2, leading=14, color=ACCENT, gap=5)
text('Zurich, Switzerland  |  +86 137 8924 2010  |  ' +
     link('xiongweiluo1@gmail.com', 'mailto:xiongweiluo1@gmail.com'), size=8.6, leading=11.3, color=MUTED)
text('Internship / Working Student  |  ' + link('GitHub', 'https://github.com/xiongweiluo') +
     '  |  ' + link('Portfolio', 'https://xiongweiluo.github.io/'), size=8.6, leading=11.3, color=MUTED)

section('Education')
pair('ETH Zurich <font color="#5D6861">| MSc Integrated Building Systems</font>', 'Sep 2025 - Jul 2027 (expected)', bold=True)
text('Coursework: Introduction to Machine Learning; Building Agentic AI Systems for Industry Transformation; Scientific Machine and Deep Learning for Design and Construction; Hands-On Deep Learning.', size=8.6, leading=11.4, color=MUTED, gap=5)
pair('Tongji University <font color="#5D6861">| Bachelor of Architecture</font>', 'Sep 2019 - Jul 2025', bold=True)
text('Urban data analysis and human-computer interaction; academic scholarships in four consecutive years.', size=8.6, leading=11.4, color=MUTED, gap=5)
pair('National University of Singapore <font color="#5D6861">| Young Fellowship</font>', 'Jul 2025', bold=True)
text('Summer programme on interdisciplinary AI.', size=8.6, leading=11.4, color=MUTED)

section('Technical skills')
skill('Programming', 'Python, SQL')
skill('AI and agents', 'MCP/FastMCP, Function Calling, JSON Schema, QLoRA, Harness evals, paired evaluation')
skill('Frameworks and tools', 'React, FastAPI, Node.js, Docker, Git, GitHub Actions, Figma')
skill('Data and systems', 'MySQL, SQLite, Redis, Celery, WebSocket, automated testing', gap=0)

section('Professional experience')
pair('JD.com <font color="#5D6861">| Product Design and Prototyping Intern</font>', 'Jun 2026 - Sep 2026', bold=True)
text('Autonomous Vehicle Product Team', size=8.5, leading=11, color=MUTED, gap=4)
bullet('Built a unified B2B prototype with <b>17 top-level menus and 91 navigation entries</b>; integrated 54 entries with existing prototypes and documented requirements for the remaining 37.')
bullet('Implemented deep links, history navigation and unsaved-form protection; established <b>91-page screenshot audits</b> and interaction checks, and delivered an offline HTML export.')

section('Selected projects')
pair('RhinoCoder <font color="#5D6861">| Verifiable AI Agent for 3D Modelling</font>', '', bold=True)
text('Independent project  |  ' + link('GitHub', 'https://github.com/xiongweiluo/RhinoCoder'), size=8.5, leading=11, color=MUTED, gap=4)
bullet('Designed a planning, execution and verification loop with <b>23 versioned MCP tools</b>, scene inspection and geometric assertions; added cancellation, undo, rollback, idempotency and privacy checks.')
bullet('Passed <b>270/270 real-Rhino runs</b> on a fixed benchmark of 30 tasks, three configurations and three repetitions; broader generalisation remains unverified.')
bullet('QLoRA improved exact tool-call sequences from <b>20/80 to 77/80</b> on offline tasks. The real-Rhino quality gate remains unmet; the default production route is unchanged.')
y -= 6
pair('LabelHub <font color="#5D6861">| AI Annotation and Quality Platform</font>', '', bold=True)
text('Team project  |  Schema architecture, core development &amp; integration  |  ' +
     link('Mock demo', 'https://peilinpeng.github.io/labelhub/'), size=8.5, leading=11, color=MUTED, gap=4)
bullet('Built shared schema contracts and a designer-compiler-renderer pipeline; applied preflight checks to field suggestions and Function Calling to AI pre-review, with reviewer diffs for oversight.')
bullet('Implemented asynchronous pre-review and exports with retries, idempotency and status tracking; delivered Docker Compose deployment and CI with <b>nine real-backend E2E scenarios passing</b>.')
y -= 6
pair('Family Garden <font color="#5D6861">| Collaborative AI Game</font>', '', bold=True)
text('Team project  |  AI, backend &amp; game systems  |  ' +
     link('Live demo', 'https://familygarden-d7gy18huh87fd41d2-1449262000.tcloudbaseapp.com/'), size=8.5, leading=11, color=MUTED, gap=4)
bullet('Built AI memory and image-analysis workflows with schema validation and moderation; implemented member identity, family data isolation, private photo storage and WebSocket presence.')
bullet('Used transactions and operation identifiers for inventory, planting and harvesting; validated the Web release with <b>26/26 regression checks, 4/4 production E2E scenarios</b> and iPhone Safari checks.')

section('Languages')
text('Chinese <font color="#5D6861">(native)</font>  |  English <font color="#5D6861">(IELTS 7.0)</font>  |  German <font color="#5D6861">(B1)</font>')

if y < 30:
    raise RuntimeError(f'CV exceeds the one-page layout: bottom at {y:.1f} pt')
c.showPage()
c.save()
print(f'Written one A4 page. Bottom content edge: {y:.1f} pt.')
