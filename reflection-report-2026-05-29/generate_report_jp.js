// Japanese version of the May 29 Executive Session reflection report.
// Same layout as v4: all text black, hub-and-spoke diagram, polished monochrome.

const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  convertInchesToTwip,
} = require('docx');
const fs = require('fs');

// ---------- Style tokens -----------------------------------------------------

// Yu Mincho carries both Latin and Japanese glyphs and is bundled with modern
// Windows. Setting the same name for ascii/hAnsi/eastAsia keeps rendering
// consistent across mixed-script text.
const FONT_NAME = 'Yu Mincho';
const FONT = { ascii: FONT_NAME, hAnsi: FONT_NAME, eastAsia: FONT_NAME, cs: FONT_NAME };

const BLACK = '000000';

const BORDER_GRAY   = '595959';
const RULE_GRAY     = '404040';
const FILL_LIGHT    = 'F2F2F2';
const FILL_MID      = 'E7E6E6';
const FILL_EMPHASIS = 'D9D9D9';

const BORDER    = { style: BorderStyle.SINGLE, size: 8, color: BORDER_GRAY };
const NO_BORDER = { style: BorderStyle.NIL,    size: 0, color: 'FFFFFF' };

// ---------- Helpers ----------------------------------------------------------

function run(text, opts = {}) {
  return new TextRun({
    text, font: FONT,
    size: opts.size || 22,
    bold: !!opts.bold,
    italics: !!opts.italics,
    color: BLACK,
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    children: [run(text)],
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { after: opts.after === undefined ? 160 : opts.after, line: 320 },
  });
}

function title(text) {
  return new Paragraph({
    children: [run(text, { size: 36, bold: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
  });
}

function subtitle(text) {
  return new Paragraph({
    children: [run(text, { size: 22, italics: true })],
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
    children: [run(text, { size: 26, bold: true })],
    spacing: { before: 280, after: 100 },
  });
}

function caption(text) {
  return new Paragraph({
    children: [run(text, { size: 18, italics: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 140, after: 280 },
  });
}

// ---------- Diagram (hub-and-spoke) ------------------------------------------

function diagramBox({ label, sub, fill, widthDxa, columnSpan, emphasis = false }) {
  const children = [
    new Paragraph({
      children: [run(label, { size: emphasis ? 24 : 22, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: sub ? 40 : 80 },
    }),
  ];
  if (sub) {
    children.push(new Paragraph({
      children: [run(sub, { size: 18 })],
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
    children: [new Paragraph({ children: [run('')] })],
    width: { size: widthDxa, type: WidthType.DXA },
    columnSpan,
    borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER },
    margins: { top: 20, bottom: 20, left: 40, right: 40 },
  });
}

function arrow({ char, widthDxa, columnSpan, size = 28 }) {
  return new TableCell({
    children: [new Paragraph({
      children: [run(char, { size, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 40 },
    })],
    width: { size: widthDxa, type: WidthType.DXA },
    columnSpan,
    borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER },
    margins: { top: 20, bottom: 20, left: 40, right: 40 },
  });
}

const COL = [2400, 600, 2600, 600, 2400];
const TOTAL = COL.reduce((a, b) => a + b, 0);

function diagramTable() {
  const rows = [];

  // Row 1: 投資家 (centered)
  rows.push(new TableRow({ children: [
    spacer({ widthDxa: COL[0], columnSpan: 1 }),
    spacer({ widthDxa: COL[1], columnSpan: 1 }),
    diagramBox({
      label: '投資家',
      sub: '資本・信頼・リターン',
      fill: FILL_LIGHT,
      widthDxa: COL[2], columnSpan: 1,
    }),
    spacer({ widthDxa: COL[3], columnSpan: 1 }),
    spacer({ widthDxa: COL[4], columnSpan: 1 }),
  ]}));

  // Row 2: arrow down
  rows.push(new TableRow({ children: [
    spacer({ widthDxa: COL[0], columnSpan: 1 }),
    spacer({ widthDxa: COL[1], columnSpan: 1 }),
    arrow({ char: '▼', widthDxa: COL[2], columnSpan: 1 }),
    spacer({ widthDxa: COL[3], columnSpan: 1 }),
    spacer({ widthDxa: COL[4], columnSpan: 1 }),
  ]}));

  // Row 3: hub-and-spoke: 従業員 → 予算 ← 顧客
  rows.push(new TableRow({ children: [
    diagramBox({
      label: '従業員',
      sub: '業務・給与・安定',
      fill: FILL_LIGHT,
      widthDxa: COL[0], columnSpan: 1,
    }),
    arrow({ char: '▶', widthDxa: COL[1], columnSpan: 1, size: 22 }),
    diagramBox({
      label: '予算・ルール・根拠',
      sub: '企業の共通言語',
      fill: FILL_EMPHASIS,
      widthDxa: COL[2], columnSpan: 1,
      emphasis: true,
    }),
    arrow({ char: '◀', widthDxa: COL[3], columnSpan: 1, size: 22 }),
    diagramBox({
      label: '顧客',
      sub: '価値・信頼・需要',
      fill: FILL_LIGHT,
      widthDxa: COL[4], columnSpan: 1,
    }),
  ]}));

  // Row 4: arrow down
  rows.push(new TableRow({ children: [
    spacer({ widthDxa: COL[0], columnSpan: 1 }),
    spacer({ widthDxa: COL[1], columnSpan: 1 }),
    arrow({ char: '▼', widthDxa: COL[2], columnSpan: 1, size: 30 }),
    spacer({ widthDxa: COL[3], columnSpan: 1 }),
    spacer({ widthDxa: COL[4], columnSpan: 1 }),
  ]}));

  // Row 5: 製品・サービス・価値
  rows.push(new TableRow({ children: [
    diagramBox({
      label: '製品・サービス・価値',
      sub: '企業が創造し提供するもの',
      fill: FILL_MID,
      widthDxa: TOTAL, columnSpan: 5,
    }),
  ]}));

  // Row 6: arrow
  rows.push(new TableRow({ children: [
    arrow({ char: '▼', widthDxa: TOTAL, columnSpan: 5, size: 30 }),
  ]}));

  // Row 7: 収益・成長・イノベーション
  rows.push(new TableRow({ children: [
    diagramBox({
      label: '収益・成長・イノベーション',
      sub: '投資家・従業員・顧客へ還元される成果',
      fill: FILL_LIGHT,
      widthDxa: TOTAL, columnSpan: 5,
    }),
  ]}));

  // Row 8: cycle indicator
  rows.push(new TableRow({ children: [
    new TableCell({
      children: [new Paragraph({
        children: [run('↻   サイクルは循環を続け、投資家・従業員・顧客へと還ってゆきます   ↻', { size: 18, italics: true })],
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

const content = [
  title('予算、バランス、そして持続可能な企業づくりに関する考察'),
  subtitle('エグゼクティブセッション（2026年5月29日）を受けて'),
  rule(),

  body('渡辺様'),
  body('先日のお打ち合わせにおきまして、貴重なお時間とご経験を共有いただき、誠にありがとうございました。今回のお話は、日々の製品づくりの業務を超えた視点から物事を捉え直す上で、私にとって大変有意義なものでございました。企業を個別の活動の集まりとしてではなく、注意深く設計され、保たれるべき一つのバランスの取れたシステムとして理解する視点を、改めて学ぶ機会となりました。'),

  section('企業をバランスの取れた一つのシステムとして理解する'),
  body('最も強く印象に残った教えの一つは、企業が単に製品やプロジェクト、部署の集まりではないということでございました。企業とは、投資家、従業員、顧客、製品、収益、そして成長が互いに影響を与え合う一つのシステムであり、その強さは個々の要素にではなく、それらが互いにどれだけよく機能し合っているかによって決まるということを学びました。'),
  body('投資家は、企業が始動し運営を続けるための資本を提供してくださり、従業員は製品をつくり業務を遂行いたします。顧客は価値を受け取り、その対価として収益が生まれます。その収益はさらに人材、運営、そして将来への投資を支え、企業の成長を可能にしてゆきます。それぞれの要素が他の要素に依存しており、ある領域での変化は必ず他の領域にも影響を及ぼすということを、改めて実感いたしました。'),
  body('この視点は、ビジネス上の意思決定を企業の一部だけを見て下すことができない理由を、より明確にしてくれました。あらゆる意思決定はシステムのどこかを動かすものであり、システム全体を健全なバランスに保つことこそが経営の務めであると、深く理解いたしました。'),

  diagramTable(),
  caption('システムの各要素は相互に依存しており、持続可能な企業は、すべての要素が時を経てもバランスを保てるよう設計されている。'),

  section('予算、信頼、そして長期的な意思決定'),
  body('もう一つの重要な気づきは、予算が単なる財務文書をはるかに超えた意味を持つということでございました。予算とは、企業が自らの将来をどう捉え、どのようにそこへ向かおうとしているかを伝える、共通の言語であると理解いたしました。'),
  body('投資家は、企業がその約束を守るに足るかどうかを判断するために予算を見ます。従業員は優先順位や方向性を理解するために予算を見ます。経営はその双方に関わる意思決定のために予算を用います。数字がどのように算出されたか、どのような前提に基づいているか、そして時を経てどのように推移してきたか、その明確な根拠を示すことができる企業は、自らに関わるすべての人々の信頼を得ることができる、ということを学びました。'),
  body('同じ原則は、企業がどのように成長していくかというより大きな意思決定にも当てはまります。株式公開、より大きな企業との連携、あるいは独力での成長など、いずれの道も企業の姿を異なる形へと導きますが、いずれも事業が安定し持続可能であることを裏付ける根拠を必要といたします。長期にわたって成功する企業とは、必ずしも最も優れた発想を持つ企業ではなく、長年にわたり一貫性と予測可能性を示すことができる企業である、と感じました。'),

  section('異なる立場と時間軸のバランスをとる'),
  body('もう一つ強く心に残った教えは、企業に関わるそれぞれの立場が、自然と異なる時間軸で物事を捉えているということでございました。'),
  body('投資家は、資本にはリスクが伴い、相応の期間内にリターンが求められるため、比較的短い時間軸で物事を考えます。一方で従業員は、キャリアや生活の安定が長い年月にわたる重要事項であるため、長い時間軸で考えます。どちらの見方も誤っているわけではなく、同じ企業を異なる視点から見ているにすぎません。経営の務めは、その両方を尊重した形で企業を設計し、投資家にとって十分に着実な成長を保ちつつ、従業員にとっても十分に安定した環境を保つことにあると理解いたしました。'),
  body('それぞれの役割にふさわしい報酬のあり方についてのお話も、この点をさらに明確にしてくれました。個人の貢献が直接的に測定可能な成果を生み出す役割は、成果に応じた報酬がふさわしく、一方で安定性と継続性が最も重要となる役割は、変動の少ない確実な報酬の方がふさわしい、ということを学びました。最も印象に残ったのは、報酬制度の設計が単に努力に報いるためのものではなく、それぞれの役割を、その役割が生み出す価値の性質と整合させるための仕組みであり、それによって企業が公平かつ持続的に成長できる、という考え方でございました。'),

  section('私自身の振り返り'),
  body('今回の議論から最も強く受け取ったのは、一つひとつの意思決定だけを見るのではなく、それが影響を及ぼす全体のシステムを見ることの大切さでございました。'),
  body('日々、技術的な実行に集中することの多い立場として、一歩立ち止まり、予算、報酬、投資家、従業員、顧客、成長といったものが一つの大きな絵の中でどう繋がっているのかを俯瞰する機会を得られたことは、大変有意義でございました。いかなる意思決定もそれ単独で存在することはなく、企業の長期的な強さは、明確な思考と根拠に支えられた多くの要素間のバランスにかかっているということを、改めて確認いたしました。'),
  body('より広い視点でとらえれば、持続可能な成長とは、一つの製品、一つの意思決定、あるいは一時期の好調によってもたらされるものではなく、企業に関わるすべての人々に対して公平であり、健全な根拠に支えられ、そして時を経ても揺るがない構造として企業を設計していくことから生まれるものであると感じました。'),

  body('改めまして、貴重なご経験と知見をご共有いただきましたこと、心より御礼申し上げます。今回の議論で得た学びは、これからの私のビジネスや意思決定、そして長く残るものを築いていくという長期的な仕事への向き合い方を、引き続き形づくってゆくものと考えております。'),

  new Paragraph({ children: [run('')], spacing: { before: 240 } }),
  new Paragraph({ children: [run('何卒よろしくお願い申し上げます。', { size: 22 })], spacing: { after: 240 } }),
  new Paragraph({ children: [run('アンブロース・アランダ', { size: 22, bold: true })] }),
];

// ---------- Document ---------------------------------------------------------

const doc = new Document({
  creator: 'Ambrose Alanda',
  title: '予算、バランス、そして持続可能な企業づくりに関する考察（2026年5月29日）',
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
  const out = 'Reflection Report — Executive Session 2026-05-29 (v4-jp).docx';
  fs.writeFileSync(out, buf);
  console.log(`wrote ${out} (${buf.length} bytes)`);
});
