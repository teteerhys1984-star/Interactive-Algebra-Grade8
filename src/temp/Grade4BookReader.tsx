import React from 'react';
import { Grade6BookReader, type TempReaderBook } from './Grade6BookReader';
import {
  GRADE4_BOOK_TITLE,
  GRADE4_PAGE_COUNT,
  grade4PageImageSrc,
  grade4PrintedPageNumber,
} from './grade4Book';

/** The Grade 4 book as the shared TEMP reader sees it. */
const GRADE4_READER_BOOK: TempReaderBook = {
  title: GRADE4_BOOK_TITLE,
  pageCount: GRADE4_PAGE_COUNT,
  imageSrc: grade4PageImageSrc,
  printedPage: grade4PrintedPageNumber,
};

interface Grade4BookReaderProps {
  /** 1-based page index from the route (`#/temp/grade4/:page`). */
  initialPage: number;
  /** Called whenever the visible page changes so the hash stays in sync. */
  onPageChange: (page: number) => void;
  /** Back to the TEMP landing. */
  onBackToTemp: () => void;
}

/**
 * Page-by-page reader for the Grade 4 book (TEMP, temporary addition).
 *
 * Not a second reader: it hands the Grade 4 book to the existing TEMP reader
 * (`Grade6BookReader`), so both books share the same page view, previous/next
 * buttons, page jump, keyboard support, and neighbour-page preloading.
 */
export const Grade4BookReader: React.FC<Grade4BookReaderProps> = (props) => (
  <Grade6BookReader {...props} book={GRADE4_READER_BOOK} />
);
