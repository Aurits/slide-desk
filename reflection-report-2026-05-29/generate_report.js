// Generates the May 29 Executive Session reflection report as a .docx.
// v4: all text black, em-dashes removed, hub-and-spoke diagram, polished layout.

const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  convertInchesToTwip,
} = require('docx');
const fs = require('fs');

// ---------- Style tokens -----------------------------------------------------

const FONT  = 'Calibri';
const BLACK = '000000';

// Decorative (non-text) palette: monochrome, executive-report feel.
const BORDER_GRAY    = '595959';
const RULE_GRAY      = '404040';
const FILL_LIGHT     = 'F2F2F2';        // very light gray
const FILL_MID       = 'E7E6E6';        // slightly darker
const FILL_EMPHASIS  = 'D9D9D9';        // emphasis box

const BORDER    = { style: BorderStyle.SINGLE, size: 8, color: BORDER_GRAY };
const NO_BORDER = { style: BorderStyle.NIL,    size: 0, color: 'FFFFFF' };

// ---------- Paragraph helpers ------------------------------------------------

function body(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 22, color: BLACK })],
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { after: opts.after === undefined ? 160 : opts.after, line: 300 },
  });
}

function title(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 36, bold: true, color: BLACK })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
  });
}

function subtitle(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 22, italics: true, color: BLACK })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
  });
}

function rule() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: RULE_GRAY, space: 1 } },
    spacing: { before: 0, after: 280 },
  });
}

function section(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: BLACK })],
    spacing: { before: 280, after: 100 },
  });
}

function caption(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 18, italics: true, color: BLACK })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 140, after: 280 },
  });
}

// ---------- Diagram: hub-and-spoke -------------------------------------------
// 5-column grid. Three stakeholders meet at the central hub (Budget · Rules ·
// Evidence). Products and revenue flow down from the hub. Cycle is named below.

function diagramBox({ label, sub, fill, widthDxa, columnSpan, emphasis = false }) {
  const children = [
    new Paragraph({
      children: [new TextRun({
        text: label, font: FONT, size: emphasis ? 24 : 22, bold: true, color: BLACK,
      })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: sub ? 40 : 80 },
    }),
  ];
  if (sub) {
    children.push(new Paragraph({
      children: [new TextRun({ text: sub, font: FONT, size: 18, color: BLACK })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
    }));
  }
  return new TableCell({
    children, columnSpan,
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill, color: 'auto' },
    borders: { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER },
    margins: { top: 140, bottom: 140, left: 140, right: 140 },
  });
}

function spacer({ widthDxa, columnSpan }) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: '' })] })],
    width: { size: widthDxa, type: WidthType.DXA },
    columnSpan,
    borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER },
    margins: { top: 20, bottom: 20, left: 40, right: 40 },
  });
}

function arrow({ char, widthDxa, columnSpan, size = 28 }) {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text: char, font: FONT, size, bold: true, color: BLACK })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 40 },
    })],
    width: { size: widthDxa, type: WidthType.DXA },
    columnSpan,
    borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER },
    margins: { top: 20, bottom: 20, left: 40, right: 40 },
  });
}

// 5 columns: stakeholder | arrow | hub | arrow | stakeholder
const COL = [2400, 600, 2600, 600, 2400];
const TOTAL = COL.reduce((a, b) => a + b, 0); // 8600

function diagramTable() {
  const rows = [];

  // Row 1: INVESTORS at top (centered, hub column only)
  rows.push(new TableRow({ children: [
    spacer({ widthDxa: COL[0], columnSpan: 1 }),
    spacer({ widthDxa: COL[1], columnSpan: 1 }),
    diagramBox({
      label: 'INVESTORS',
      sub: 'Capital. Trust. Returns.',
      fill: FILL_LIGHT,
      widthDxa: COL[2], columnSpan: 1,
    }),
    spacer({ widthDxa: COL[3], columnSpan: 1 }),
    spacer({ widthDxa: COL[4], columnSpan: 1 }),
  ]}));

  // Row 2: arrow down toward the hub
  rows.push(new TableRow({ children: [
    spacer({ widthDxa: COL[0], columnSpan: 1 }),
    spacer({ widthDxa: COL[1], columnSpan: 1 }),
    arrow({ char: '▼', widthDxa: COL[2], columnSpan: 1 }),
    spacer({ widthDxa: COL[3], columnSpan: 1 }),
    spacer({ widthDxa: COL[4], columnSpan: 1 }),
  ]}));

  // Row 3: hub-and-spoke. EMPLOYEES → HUB ← CUSTOMERS
  rows.push(new TableRow({ children: [
    diagramBox({
      label: 'EMPLOYEES',
      sub: 'Work. Salary. Stability.',
      fill: FILL_LIGHT,
      widthDxa: COL[0], columnSpan: 1,
    }),
    arrow({ char: '▶', widthDxa: COL[1], columnSpan: 1, size: 22 }),
    diagramBox({
      label: 'BUDGET. RULES. EVIDENCE.',
      sub: 'The shared language of the company',
      fill: FILL_EMPHASIS,
      widthDxa: COL[2], columnSpan: 1,
      emphasis: true,
    }),
    arrow({ char: '◀', widthDxa: COL[3], columnSpan: 1, size: 22 }),
    diagramBox({
      label: 'CUSTOMERS',
      sub: 'Value. Loyalty. Demand.',
      fill: FILL_LIGHT,
      widthDxa: COL[4], columnSpan: 1,
    }),
  ]}));

  // Row 4: single arrow down from the hub
  rows.push(new TableRow({ children: [
    spacer({ widthDxa: COL[0], columnSpan: 1 }),
    spacer({ widthDxa: COL[1], columnSpan: 1 }),
    arrow({ char: '▼', widthDxa: COL[2], columnSpan: 1, size: 30 }),
    spacer({ widthDxa: COL[3], columnSpan: 1 }),
    spacer({ widthDxa: COL[4], columnSpan: 1 }),
  ]}));

  // Row 5: Products and Services (full width)
  rows.push(new TableRow({ children: [
    diagramBox({
      label: 'PRODUCTS. SERVICES. VALUE.',
      sub: 'What the company creates and delivers',
      fill: FILL_MID,
      widthDxa: TOTAL, columnSpan: 5,
    }),
  ]}));

  // Row 6: arrow down
  rows.push(new TableRow({ children: [
    arrow({ char: '▼', widthDxa: TOTAL, columnSpan: 5, size: 30 }),
  ]}));

  // Row 7: Revenue, Growth, Innovation (full width)
  rows.push(new TableRow({ children: [
    diagramBox({
      label: 'REVENUE. GROWTH. INNOVATION.',
      sub: 'The outcome that returns to investors, employees, and customers',
      fill: FILL_LIGHT,
      widthDxa: TOTAL, columnSpan: 5,
    }),
  ]}));

  // Row 8: cycle indicator
  rows.push(new TableRow({ children: [
    new TableCell({
      children: [new Paragraph({
        children: [new TextRun({
          text: '↻   the cycle continues, returning to investors, employees, and customers   ↻',
          font: FONT, size: 18, italics: true, color: BLACK,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 40 },
      })],
      width: { size: TOTAL, type: WidthType.DXA },
      columnSpan: 5,
      borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER },
      margins: { top: 60, bottom: 60, left: 40, right: 40 },
    }),
  ]}));

  return new Table({
    rows,
    width: { size: TOTAL, type: WidthType.DXA },
    alignment: AlignmentType.CENTER,
    layout: 'fixed',
    borders: {
      top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
    },
  });
}

// ---------- Report body ------------------------------------------------------
// No em-dashes. Simple, observational, executive voice.

const content = [
  title('Reflection Report on Budget, Balance, and Sustainable Companies'),
  subtitle('Executive Session, 29 May 2026'),
  rule(),

  body('Dear Mr. Watanabe,'),
  body('Thank you for taking the time to share your insights during our recent discussion. I found the conversation particularly valuable because it changed how I think about decisions that go beyond the day to day work of building products. The session helped me see the company not as a set of separate activities, but as a balanced system that must be designed and maintained with care.'),

  section('Understanding the Company as a Balanced System'),
  body('One of the strongest lessons I took away is that a company is not simply a collection of products, projects, or departments. It is a system in which investors, employees, customers, products, revenue, and growth all influence one another. The strength of the company depends not on any single part, but on how well these parts work together.'),
  body('Investors provide the capital that allows the company to begin and operate. Employees create the products and deliver the work. Customers receive value and, in return, generate revenue. Revenue then supports the people, the operations, and the future investments that allow the company to grow. Each part depends on the others, and changes in one area inevitably affect the rest.'),
  body('This view made it clearer to me why business decisions cannot be made by looking at one part of the company in isolation. Every decision moves something else in the system, and the work of leadership is to keep the system in healthy balance.'),

  diagramTable(),
  caption('Each part of the system depends on the others. Sustainable companies are designed so that all parts remain in balance over time.'),

  section('Budget, Trust, and Long-Term Decisions'),
  body('Another important insight was understanding that the budget is much more than a financial document. It is the shared language through which a company communicates what it believes about its future and how it plans to get there.'),
  body('Investors look at the budget to decide whether the company can be trusted to keep its promises. Employees look at it to understand priorities and direction. Management uses it to make decisions that affect both. When a company can show clear evidence behind its numbers, including how they are calculated, what assumptions support them, and how they have held up over time, it earns the trust of everyone who depends on it.'),
  body('The same principle applies to larger decisions, such as how a company eventually grows, whether by listing publicly, partnering with a larger company, or continuing to grow on its own. Each path shapes the company in different ways, and each requires evidence that the business is steady and sustainable. The companies that succeed over time are not necessarily those with the best ideas, but those that can demonstrate consistency and predictability across many years.'),

  section('Balancing Different Interests Across Time'),
  body('A third lesson that stayed with me was that different participants in a company are naturally focused on different timeframes.'),
  body('Investors think in shorter periods, because capital carries risk and returns are expected within a reasonable time. Employees think in longer periods, because careers and stability matter across many years. Neither view is wrong. They are simply different perspectives on the same company, and the work of management is to design the company in a way that respects both, so that growth is steady enough for investors and stable enough for employees.'),
  body('The discussion of how different roles should be rewarded also gave me a clearer picture of this. Some roles, where individual contribution directly produces measurable results, benefit from performance based incentives. Other roles, where stability and consistency matter most, are better supported by reliable compensation. What I appreciated most is that incentive design is not simply about rewarding effort. It is about aligning each role with the kind of value it creates, so that the company can grow fairly and sustainably.'),

  section('Personal Reflection'),
  body('My main takeaway from this discussion was the importance of looking beyond individual decisions and considering the system they affect.'),
  body('As someone who often focuses on execution, I found it valuable to step back and see how budgets, incentives, investors, employees, customers, and growth all connect into a single picture. The discussion reinforced that no decision exists on its own, and that the long term strength of a company depends on the balance between many parts that must be supported by clear thinking and evidence.'),
  body('More broadly, it highlighted that sustainable growth is not the result of one product, one decision, or one strong period. It comes from designing a company in a way that is fair to everyone who depends on it, supported by sound reasoning, and capable of holding together across time.'),

  body('Thank you again for sharing your experience and perspectives. The discussion provided lessons that will continue to shape how I think about business, decision making, and the long term work of building something that lasts.'),

  new Paragraph({ children: [new TextRun({ text: '', font: FONT })], spacing: { before: 240 } }),
  new Paragraph({ children: [new TextRun({ text: 'Respectfully,', font: FONT, size: 22, color: BLACK })], spacing: { after: 240 } }),
  new Paragraph({ children: [new TextRun({ text: 'Ambrose Alanda', font: FONT, size: 22, bold: true, color: BLACK })] }),
];

// ---------- Document ---------------------------------------------------------

const doc = new Document({
  creator: 'Ambrose Alanda',
  title: 'Reflection Report on Budget, Balance, and Sustainable Companies. 29 May 2026',
  styles: { default: { document: { run: { font: FONT, size: 22, color: BLACK } } } },
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(0.9), right: convertInchesToTwip(1),
          bottom: convertInchesToTwip(0.9), left: convertInchesToTwip(1),
        },
      },
    },
    children: content,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = 'Reflection Report — Executive Session 2026-05-29 (v4).docx';
  fs.writeFileSync(out, buf);
  console.log(`wrote ${out} (${buf.length} bytes)`);
});
