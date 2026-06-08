#!/usr/bin/env python3
# Build a styled .xlsx packing list using only the standard library.
import zipfile, datetime

def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

# ---- Data ----
sections = [
    ("01  Sun & On-Water Gear", [
        ("Polarised sunglasses", "1", "Cut glare, spot fish"),
        ("Sunglasses strap", "1", "So they do not go overboard"),
        ("Hat with chin-strap", "1", "Wide brim; strap for windy boats"),
        ("UV long-sleeve / rash guard", "2", "Long sun days; one to wear, one drying"),
        ("Fishing gloves", "1 pair", "Grip and sun"),
        ("Reef-safe sunscreen, high SPF", "1-2", "Reapply often; protected waters"),
        ("SPF lip balm", "1", "Lips burn too"),
    ]),
    ("02  Clothing & Footwear", [
        ("Non-slip deck shoes", "1 pair", "Wet, moving decks"),
        ("Reef / water shoes", "1 pair", "Onto rocky volcanic marks"),
        ("Sandals", "1 pair", "Around the lodge"),
        ("Quick-dry t-shirts", "4-5", "Humidity dries clothes slowly"),
        ("Long trousers / chinos", "2", "Evenings, dinner, mosquitoes"),
        ("Shorts", "3", "Daytime"),
        ("Casual shirt for dinner / town", "1", "Pairs with trousers"),
        ("AIBOS polo (dinner)", "1-2", "Service uniform"),
        ("Underwear", "8-10", "One per day plus spares"),
        ("Socks", "6-8", "For deck shoes"),
        ("Swimwear", "1", "Quick dip or wet work"),
        ("Light warm layer / fleece", "1", "Evenings, deck, ship air-con"),
        ("Packable rain jacket", "1", "Rainwear beats an umbrella here"),
        ("Belt", "1", "For trousers and chinos"),
        ("Sleepwear", "1 set", "You change on the ferry"),
    ]),
    ("03  Ferry & Comfort", [
        ("Eye mask and earplugs", "1", "Open shared cabin, lights and noise"),
        ("Refillable water bottle", "1", "Few vending; carry water on boats"),
    ]),
    ("04  Health & Toiletries", [
        ("Seasickness pills", "1 supply", "Take before boarding; none sold on board"),
        ("Personal prescriptions", "full supply", "No refills on-island; bring 8+ days"),
        ("Painkillers", "1 pack", "Headaches, aches"),
        ("Spare glasses / lens supplies", "as needed", "Cannot buy on-island"),
        ("Insect repellent", "1", "Subtropical and rainy in June"),
        ("Wash kit (soap, shampoo)", "1", "Travel size; team has bulk refill"),
        ("Quick-dry towel", "1-2", "Salt and sweat"),
        ("Toothbrush and paste", "1", ""),
        ("Deodorant", "1", ""),
        ("Razor / shaving kit", "1", "If you shave"),
        ("Comb and nail clippers", "1", "Basic grooming"),
        ("Pocket tissues and hand towel", "1", "Many Japan toilets lack paper towels"),
    ]),
    ("05  Tech, Documents & Money", [
        ("Phone", "1", ""),
        ("Charger", "1", ""),
        ("Power bank", "1", "Few outlets, shared cabin"),
        ("Waterproof phone pouch", "1", "Boat and spray"),
        ("Earphones", "1", "Also for the ferry"),
        ("ID", "1", "Keep on you"),
        ("Personal ticket copy", "1", "Team holds the master"),
        ("Yen cash", "-", "Draw enough before Tokyo; limited ATM"),
    ]),
    ("06  Bags", [
        ("Small dry daypack", "1", "Day trips"),
        ("Dry bag", "1", "Valuables on the boat"),
        ("Zip / plastic bags", "a few", "Wet and salty clothes"),
    ]),
]
team_text = ("Provided by the team (you do not pack these): sleeping bags and mats, blankets, "
             "bulk sunscreen and repellent, team first-aid kit, coolers and ice boxes, large water "
             "containers, group snacks, headlamps, and the master itinerary and tickets.")

# ---- Build rows ----
# Style ids (defined in styles.xml below):
# 1 title | 2 section | 3 colhead | 4 item | 5 checkbox | 6 qty | 7 note | 8 teamhdr | 9 teamtext
rows_xml = []
merges = []
r = 1

def cell(col, row, style, text):
    return ('<c r="%s%d" s="%d" t="inlineStr"><is><t xml:space="preserve">%s</t></is></c>'
            % (col, row, style, esc(text)))

# Title
rows_xml.append('<row r="%d" ht="22" customHeight="1">%s</row>' % (r,
    cell("A", r, 1, "PERSONAL PACKING LIST")))
merges.append("A%d:D%d" % (r, r)); r += 1
r += 1  # spacer

for title, items in sections:
    rows_xml.append('<row r="%d" ht="18" customHeight="1">%s%s%s%s</row>' % (r,
        cell("A", r, 2, title), cell("B", r, 2, ""), cell("C", r, 2, ""), cell("D", r, 2, "")))
    merges.append("A%d:D%d" % (r, r)); r += 1
    rows_xml.append('<row r="%d">%s%s%s%s</row>' % (r,
        cell("A", r, 3, "✓"), cell("B", r, 3, "ITEM"), cell("C", r, 3, "QTY"), cell("D", r, 3, "NOTE")))
    r += 1
    for item, qty, note in items:
        rows_xml.append('<row r="%d" ht="15" customHeight="1">%s%s%s%s</row>' % (r,
            cell("A", r, 5, ""), cell("B", r, 4, item), cell("C", r, 6, qty), cell("D", r, 7, note)))
        r += 1
    r += 1  # spacer

# Team box
r += 1
rows_xml.append('<row r="%d" ht="40" customHeight="1">%s%s%s%s</row>' % (r,
    cell("A", r, 9, team_text), cell("B", r, 9, ""), cell("C", r, 9, ""), cell("D", r, 9, "")))
merges.append("A%d:D%d" % (r, r)); r += 1

sheet_data = "".join(rows_xml)
merge_xml = ('<mergeCells count="%d">%s</mergeCells>' %
             (len(merges), "".join('<mergeCell ref="%s"/>' % m for m in merges)))

cols = ('<cols>'
        '<col min="1" max="1" width="6" customWidth="1"/>'
        '<col min="2" max="2" width="34" customWidth="1"/>'
        '<col min="3" max="3" width="12" customWidth="1"/>'
        '<col min="4" max="4" width="46" customWidth="1"/>'
        '</cols>')

sheet_xml = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" state="frozen"/></sheetView></sheetViews>'
    '<sheetFormatPr defaultRowHeight="15"/>'
    + cols +
    '<sheetData>' + sheet_data + '</sheetData>'
    + merge_xml +
    '<pageMargins left="0.5" right="0.5" top="0.5" bottom="0.5" header="0.3" footer="0.3"/>'
    '</worksheet>')

# ---- styles.xml ----
styles_xml = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
 '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
 '<fonts count="7">'
   '<font><sz val="11"/><name val="Calibri"/></font>'                                  # 0
   '<font><b/><sz val="14"/><name val="Calibri"/></font>'                              # 1 title
   '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>'       # 2 section
   '<font><b/><sz val="9"/><color rgb="FF595959"/><name val="Calibri"/></font>'        # 3 colhead
   '<font><sz val="10"/><name val="Calibri"/></font>'                                  # 4 item
   '<font><sz val="9"/><color rgb="FF808080"/><name val="Calibri"/></font>'            # 5 note
   '<font><b/><sz val="9"/><color rgb="FF808080"/><name val="Calibri"/></font>'        # 6 teamhdr (unused split)
 '</fonts>'
 '<fills count="4">'
   '<fill><patternFill patternType="none"/></fill>'                                    # 0
   '<fill><patternFill patternType="gray125"/></fill>'                                 # 1
   '<fill><patternFill patternType="solid"><fgColor rgb="FF1A1A1A"/></patternFill></fill>'  # 2 dark
   '<fill><patternFill patternType="solid"><fgColor rgb="FFF2F2F2"/></patternFill></fill>'  # 3 light
 '</fills>'
 '<borders count="4">'
   '<border><left/><right/><top/><bottom/></border>'                                   # 0 none
   '<border><left/><right/><top/><bottom style="thin"><color rgb="FFD9D9D9"/></bottom></border>'  # 1 light bottom
   '<border><left style="thin"><color rgb="FF808080"/></left><right style="thin"><color rgb="FF808080"/></right>'
     '<top style="thin"><color rgb="FF808080"/></top><bottom style="thin"><color rgb="FF808080"/></bottom></border>'  # 2 box
   '<border><left/><right/><top/><bottom style="medium"><color rgb="FF1A1A1A"/></bottom></border>'  # 3 medium bottom
 '</borders>'
 '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
 '<cellXfs count="10">'
   '<xf xfId="0" fontId="0" fillId="0" borderId="0"/>'                                                                  # 0 default
   '<xf xfId="0" fontId="1" fillId="0" borderId="0" applyFont="1"><alignment vertical="center"/></xf>'                  # 1 title
   '<xf xfId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1"><alignment vertical="center" indent="1"/></xf>'  # 2 section
   '<xf xfId="0" fontId="3" fillId="3" borderId="3" applyFont="1" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf>'  # 3 colhead
   '<xf xfId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyBorder="1"><alignment vertical="center"/></xf>'  # 4 item
   '<xf xfId="0" fontId="4" fillId="0" borderId="2" applyFont="1" applyBorder="1"><alignment vertical="center" horizontal="center"/></xf>'  # 5 checkbox
   '<xf xfId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyBorder="1"><alignment vertical="center" horizontal="left"/></xf>'  # 6 qty
   '<xf xfId="0" fontId="5" fillId="0" borderId="1" applyFont="1" applyBorder="1"><alignment vertical="center"/></xf>'  # 7 note
   '<xf xfId="0" fontId="1" fillId="0" borderId="0"/>'                                                                  # 8 (reserved)
   '<xf xfId="0" fontId="5" fillId="3" borderId="0" applyFont="1" applyFill="1"><alignment vertical="center" wrapText="1"/></xf>'  # 9 teamtext
 '</cellXfs>'
 '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
 '</styleSheet>')

content_types = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
 '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
 '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
 '<Default Extension="xml" ContentType="application/xml"/>'
 '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
 '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
 '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
 '</Types>')

root_rels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
 '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
 '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
 '</Relationships>')

workbook = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
 '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
 '<sheets><sheet name="Packing List" sheetId="1" r:id="rId1"/></sheets>'
 '</workbook>')

wb_rels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
 '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
 '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
 '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
 '</Relationships>')

out = "Ogasawara_Personal_Packing_List_Ambrose.xlsx"
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", root_rels)
    z.writestr("xl/workbook.xml", workbook)
    z.writestr("xl/_rels/workbook.xml.rels", wb_rels)
    z.writestr("xl/styles.xml", styles_xml)
    z.writestr("xl/worksheets/sheet1.xml", sheet_xml)
print("wrote", out)
