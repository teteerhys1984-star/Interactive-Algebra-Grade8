# TEMP — Grade 4 book: internal page inventory

> Temporary addition (TEMP tab). Source: attached PDF
> `رياضيات_الصف_الرابع_صفحات_8_الى_28_الصحيحة.pdf` — **21 pages**.
> Each PDF page was rendered once at 200 DPI to
> `public/temp/grade4/page-NN.jpg` and is displayed in original order.
> Nothing is re-typed, summarized, corrected, or guessed.

## Source file

| | |
|---|---|
| File | `رياضيات_الصف_الرابع_صفحات_8_الى_28_الصحيحة.pdf` |
| Size | 2,902,732 bytes |
| SHA-256 | `7191f114c3b871ce197951461c2da9e7741bb0dc385286194eefa7b67714c00d` |
| Format | PDF 1.4, not encrypted, no outline, no page labels |
| Pages | **21** — the same count from three independent PDF libraries (PyMuPDF/MuPDF, pypdf, pdfium) |
| Page size | 581.10 × 793.70 pt (205 × 280 mm) on every page, rotation 0, MediaBox = CropBox |

**The page count is 21, not 29.** The request expected 29 pages. The attached
file holds 21: printed pages 8 to 28 inclusive (28 − 8 + 1 = 21), which is
also what the file name says. No page is missing inside that range. If a
29-page file was intended, it is a different file from the one attached.

## What kind of PDF this is

Not a pure scan and not a text PDF. Every page is **one full-page raster
image** (JPEG, CMYK, 582 × 795 px, about 72 DPI) under a soft mask. The only
live text objects in the file are:

- the page number inside the footer badge — on all 21 pages;
- the chapter running header — on PDF pages 9 and 21 only.

The lesson content itself has no text layer, so the book is displayed as page
images, exactly like the Grade 6 book. No OCR was run and no text was rebuilt.

## Conversion

PyMuPDF 2.1 (MuPDF 1.28.6), Python 3.11:

```python
import pymupdf

doc = pymupdf.open(SOURCE_PDF)
for index, page in enumerate(doc, start=1):  # original order, no page skipped
    pix = page.get_pixmap(dpi=200, colorspace=pymupdf.csRGB, alpha=False)
    pix.save(f"public/temp/grade4/page-{index:02d}.jpg", jpg_quality=88)
```

- Output: 21 files, each 1615 × 2205 px RGB, progressive JPEG, quality 88,
  4:4:4 chroma, tagged 200 dpi — the same encoding as the Grade 6 images.
  127–376 KB per page, 5.18 MB in total.
- The full page box is rendered. No cropping, rotation, deskewing, colour or
  contrast adjustment, sharpening, or retouching.
- Cross-check with a second renderer (pdfium): same pixel size and matching
  page content on all 21 pages (mean per-pixel difference 0.4–3.0 on a 0–255
  scale, from the two engines' different CMYK conversion and smoothing).

## Coverage check (PDF pages 1–21)

| PDF page | Printed page | Image | Verified |
|----------|--------------|-------|----------|
| 1  | 8  | `page-01.jpg` | ✓ |
| 2  | 9  | `page-02.jpg` | ✓ |
| 3  | 10 | `page-03.jpg` | ✓ |
| 4  | 11 | `page-04.jpg` | ✓ |
| 5  | 12 | `page-05.jpg` | ✓ |
| 6  | 13 | `page-06.jpg` | ✓ |
| 7  | 14 | `page-07.jpg` | ✓ |
| 8  | 15 | `page-08.jpg` | ✓ |
| 9  | 16 | `page-09.jpg` | ✓ |
| 10 | 17 | `page-10.jpg` | ✓ |
| 11 | 18 | `page-11.jpg` | ✓ |
| 12 | 19 | `page-12.jpg` | ✓ |
| 13 | 20 | `page-13.jpg` | ✓ |
| 14 | 21 | `page-14.jpg` | ✓ |
| 15 | 22 | `page-15.jpg` | ✓ |
| 16 | 23 | `page-16.jpg` | ✓ |
| 17 | 24 | `page-17.jpg` | ✓ |
| 18 | 25 | `page-18.jpg` | ✓ |
| 19 | 26 | `page-19.jpg` | ✓ |
| 20 | 27 | `page-20.jpg` | ✓ |
| 21 | 28 | `page-21.jpg` | ✓ |

"Verified" means all of the following hold for that row: the image was
rendered from that PDF page, the final JPEG was opened and looked at, and its
printed number was read in the two ways described below.

The same list lives in code as `GRADE4_PAGE_INVENTORY`
(`src/temp/grade4Book.ts`); `src/test/temp-grade4.test.tsx` checks that this
table, the code, and the files in `public/temp/grade4/` agree.

### How the printed page numbers were established

Each of the 21 numbers was read twice, independently, and the two readings
agree on every page:

1. from the page's own text object in the PDF (the footer number is live
   text): 8, 9, 10, … 28;
2. by eye, from the footer badge of each final JPEG (the book prints them in
   Arabic-Indic digits, ٨ … ٢٨).

They are recorded page by page in `GRADE4_PRINTED_PAGES`, not derived from a
formula. They happen to run 8 → 28 with no gap and no repeat.

### Visual check of the final images

All 21 JPEGs in `public/temp/grade4/` were looked at after conversion.

- **None missing** — 21 files for 21 PDF pages.
- **None duplicated** — 21 different SHA-256 digests; the 21 rasters embedded
  in the PDF are also all different. The two most alike pages (PDF 6 and 8,
  both sparse exercise pages) are clearly different pages.
- **None blank.**
- **None cropped by the conversion** — every image covers the whole page box.
  Apart from the thin edge marks listed below, the content of every page
  stays at least 7 mm away from all four edges, and the footer badge is
  fully visible.
- **Order** — printed numbers and lesson numbers rise continuously from the
  first image to the last (see the sections below).

Thin marks on the page edges that are part of the source raster, left as
they are:

- PDF 3 and PDF 14: a grey hairline along the bottom edge;
- PDF 7: small tick marks at the left and right edges;
- PDF 9: a green hairline at the top edge (right part);
- PDF 15: a short green hairline at the bottom edge (left part);
- PDF 16: a green hairline along the top edge.

## Limits — what could not be verified

1. **Source resolution.** The page rasters inside the PDF are only about
   72 DPI. Rendering at 200 DPI cannot add detail that the file does not
   contain: body text is legible but soft, with the source's own JPEG
   artefacts, and small print is hard to read when zoomed in. Rendering the
   same area at 400 DPI looks the same. Only the page numbers and the two
   chapter headers (live text) are sharp. A sharper display needs a
   higher-resolution source file.
2. **Fidelity to the printed book.** Everything above was checked against the
   attached PDF only. Whether that PDF matches the physical book page for
   page, including its page numbers, cannot be verified from the file.
3. **Origin of the file.** The PDF was written by `pypdf` and carries an
   embedded Content Credentials (C2PA) manifest that names ChatGPT as the
   tool that produced the file (dated 2026-11-11). The pages look like
   ordinary typeset textbook pages, and nothing in the display depends on
   this; it is recorded here for traceability only.

## Book sections observed (for orientation only)

Headings as printed, read from the page images. They are not shown in the
app. The excerpt starts in the middle of a chapter, so the first chapter's
own title is not in the file.

- PDF 1–8 (printed 8–15) — end of the chapter before «الفصل الثاني»
  - PDF 1–2: الدرس ٢ — إنشاء تمثيل بيانيّ بالأعمدة
  - PDF 3–6: الدرس ٣ — شبكة الإحداثيات
  - PDF 7–8: الدرس ٤ — حلّ المسائل (ابحث عن نمط)
- PDF 9–20 (printed 16–27) — «الفصل الثاني: الأعداد»
  - PDF 9–11: الدرس ١ — الأعداد حتى ٩٩٩٩٩
  - PDF 12–14: الدرس ٢ — موازنة الأعداد وترتيبها
  - PDF 15–16: الدرس ٣ — التقريب إلى أقرب عشرة
  - PDF 17–18: الدرس ٤ — التقريب إلى أقرب مئة
  - PDF 19: مراجعة الفصل
  - PDF 20: مرح الرياضيات
- PDF 21 (printed 28) — «الفصل الثالث: جمع الأعداد وطرحها حتى ٩٩٩»
  - PDF 21: الدرس ١ — جمع أعداد مؤلفة من خمس منازل

## Routes and files

- Routes: `#/temp/grade4` (opens PDF page 1) and `#/temp/grade4/:page`
  (1–21; a number outside that range opens the nearest end of the book).
- Images: `public/temp/grade4/page-01.jpg` … `page-21.jpg`.
- Data: `src/temp/grade4Book.ts`.
- Reader: `src/temp/Grade4BookReader.tsx` hands the Grade 4 book to the
  existing TEMP reader (`src/temp/Grade6BookReader.tsx`), which gained one
  optional `book` prop. Without that prop it reads Grade 6 exactly as before.
- Tests: `src/test/temp-grade4.test.tsx`.

## How to remove later

Grade 4 only: delete `public/temp/grade4/`, `src/temp/grade4Book.ts`,
`src/temp/Grade4BookReader.tsx`, `src/test/temp-grade4.test.tsx`, and this
doc; then remove the Grade 4 card from `src/temp/TempArea.tsx`, the
`grade4` branch from `src/app/useHashRoute.ts`, and the Grade 4 lines from
`src/app/App.tsx`. The optional `book` prop in `Grade6BookReader.tsx` can
stay or be reverted; Grade 6 does not use it.

The whole TEMP tab: follow `docs/temp-grade6-inventory.md`, and also delete
`src/test/temp-grade4.test.tsx` and this doc. No Grade 8 data, lesson
engine, or test is touched either way.
