/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SlowPDF (slowpdf.in) — Master Centralized Banner Configuration
 * Single source of truth for all carousel banners across Homepage & Tool Pages.
 */

const SLOWPDF_BANNERS = {
  // Path resolver for assets (images) whether loaded from root or tools/ subfolder
  resolveAssetPath: function(path, isSubfolder = false) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    const cleanPath = path.replace(/^\.\.\//, '').replace(/^\.\//, '');
    return isSubfolder ? '../' + cleanPath : './' + cleanPath;
  },

  // Path resolver for tool links whether from root or tools/ subfolder
  resolveLink: function(link, isSubfolder = false) {
    if (!link) return '#';
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('#')) {
      return link;
    }
    const cleanLink = link.replace(/^\.\.\//, '').replace(/^\.\//, '');
    if (isSubfolder) {
      if (cleanLink.startsWith('tools/')) {
        return cleanLink.replace(/^tools\//, '');
      }
      return '../' + cleanLink;
    }
    return './' + cleanLink;
  },

  // =========================================================================
  // Section 1: Homepage Banners (10 Master Promotional Slides)
  // =========================================================================
  homepage: [
    {
      id: 1,
      badge: "Zero-Server Security",
      title: "100% In-Browser Memory Processing",
      tagline: "Your documents never touch a remote cloud database. Absolute client-side privacy.",
      image: "assets/images/banners/home/banner-01.jpg",
      link: "tools/merge-pdf.html"
    },
    {
      id: 2,
      badge: "Page Cutter",
      title: "Split PDFs into Custom Ranges",
      tagline: "Extract individual chapters or specific page spans cleanly without quality loss.",
      image: "assets/images/banners/home/banner-02.jpg",
      link: "tools/split-pdf.html"
    },
    {
      id: 3,
      badge: "Smart Optimizer",
      title: "Compress PDF Scans Locally",
      tagline: "Shrink heavy textbook files by up to 85% without ugly raster downsampling.",
      image: "assets/images/banners/home/banner-03.jpg",
      link: "tools/compress-pdf.html"
    },
    {
      id: 4,
      badge: "Document Converter",
      title: "Convert PDF to Editable Word DOCX",
      tagline: "Preserve paragraphs, data tables, and structural typography with zero drift.",
      image: "assets/images/banners/home/banner-04.jpg",
      link: "tools/pdf-to-word.html"
    },
    {
      id: 5,
      badge: "Security Fortress",
      title: "Protect PDF with Military AES-256",
      tagline: "Apply client-side cryptographic passwords to your confidential research papers.",
      image: "assets/images/banners/home/banner-05.jpg",
      link: "tools/protect-pdf.html"
    },
    {
      id: 6,
      badge: "Instant Decryption",
      title: "Unlock PDF Print & Edit Restrictions",
      tagline: "Strip forgotten permissions and lockouts locally with instant RAM decryption.",
      image: "assets/images/banners/home/banner-06.jpg",
      link: "tools/unlock-pdf.html"
    },
    {
      id: 7,
      badge: "Spreadsheet Tool",
      title: "Convert PDF to Native Excel Tables",
      tagline: "Extract financial metrics, research surveys, and disclosures into XLSX sheets.",
      image: "assets/images/banners/home/banner-07.jpg",
      link: "tools/pdf-to-excel.html"
    },
    {
      id: 8,
      badge: "Interactive Canvas",
      title: "Annotate, Draw & Edit PDF Pages",
      tagline: "Type margin notes, add highlight boxes, and sketch diagrams on any document.",
      image: "assets/images/banners/home/banner-08.jpg",
      link: "tools/edit-pdf.html"
    },
    {
      id: 9,
      badge: "Neural OCR Engine",
      title: "Optical Character Recognition (OCR)",
      tagline: "Turn scanned photocopies and mobile phone photos into selectable, searchable text.",
      image: "assets/images/banners/home/banner-09.jpg",
      link: "tools/ocr-pdf.html"
    },
    {
      id: 10,
      badge: "E-Signature Suite",
      title: "Sign & Stamp PDF Documents Online",
      tagline: "Draw transparent signatures or stamp verification badges with pixel precision.",
      image: "assets/images/banners/home/banner-10.jpg",
      link: "tools/sign-pdf.html"
    }
  ],

  // =========================================================================
  // Section 2: Shared Promotional Banners for Dedicated Tool Pages
  // =========================================================================
  toolsPromo: [
    {
      id: 1,
      badge: "Recommended Companion",
      title: "Merge Multi-Part PDF Files",
      tagline: "Stitch lecture notes, appendices, and scanned book sections into one file.",
      image: "assets/images/banners/tools/banner-01.jpg",
      link: "tools/merge-pdf.html"
    },
    {
      id: 2,
      badge: "Extractor",
      title: "Split Heavy PDF Books",
      tagline: "Pull individual assignments from bulky course packs with zero lag.",
      image: "assets/images/banners/tools/banner-02.jpg",
      link: "tools/split-pdf.html"
    },
    {
      id: 3,
      badge: "File Shrinker",
      title: "Compress PDF for Email & Portals",
      tagline: "Meet strict upload size limits easily while keeping high visual clarity.",
      image: "assets/images/banners/tools/banner-03.jpg",
      link: "tools/compress-pdf.html"
    },
    {
      id: 4,
      badge: "Word Converter",
      title: "Convert to Clean Word DOCX",
      tagline: "Export read-only articles back into editable Microsoft Word documents.",
      image: "assets/images/banners/tools/banner-04.jpg",
      link: "tools/pdf-to-word.html"
    },
    {
      id: 5,
      badge: "Confidentiality",
      title: "Lock PDF with AES-256 Password",
      tagline: "Protect transcripts, student grades, and legal forms from unauthorized eyes.",
      image: "assets/images/banners/tools/banner-05.jpg",
      link: "tools/protect-pdf.html"
    },
    {
      id: 6,
      badge: "Permission Tool",
      title: "Unlock Password Restricted PDFs",
      tagline: "Remove forgotten print restrictions securely inside browser memory.",
      image: "assets/images/banners/tools/banner-06.jpg",
      link: "tools/unlock-pdf.html"
    },
    {
      id: 7,
      badge: "Pagination Master",
      title: "Add Sequential Page Numbers",
      tagline: "Insert professional roman or arabic numbering at custom page positions.",
      image: "assets/images/banners/tools/banner-07.jpg",
      link: "tools/add-page-numbers.html"
    },
    {
      id: 8,
      badge: "Brand Protection",
      title: "Add Custom Draft Watermarks",
      tagline: "Stamp copyright warnings, company logos, or 'DRAFT' badges diagonally.",
      image: "assets/images/banners/tools/banner-08.jpg",
      link: "tools/add-watermark.html"
    },
    {
      id: 9,
      badge: "Page Cleaner",
      title: "Delete Unwanted Pages & Errors",
      tagline: "Remove accidental blank sheets and duplicate covers with instant preview.",
      image: "assets/images/banners/tools/banner-09.jpg",
      link: "tools/delete-pages.html"
    },
    {
      id: 10,
      badge: "Paper Saver",
      title: "Grayscale & Monocopy Printing",
      tagline: "Convert color slides to monochrome and save expensive school printer ink.",
      image: "assets/images/banners/tools/banner-10.jpg",
      link: "tools/grayscale-pdf.html"
    }
  ]
};

// Alias for mergePdf and companion pages
SLOWPDF_BANNERS.mergePdf = SLOWPDF_BANNERS.toolsPromo;

// Global export for vanilla scripts
if (typeof window !== 'undefined') {
  window.SLOWPDF_BANNERS = SLOWPDF_BANNERS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SLOWPDF_BANNERS;
}
