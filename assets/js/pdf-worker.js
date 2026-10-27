/* ==========================================================================
   SlowPDF High-Performance Background Web Worker (pdf-worker.js)
   Zero-Server, 100% Client-Side Private PDF Engine
   Target: Process 50+ PDF pages in ~2-3 seconds with 0 main thread lag.
   ========================================================================== */

self.onmessage = async function (e) {
  const { id, action, payload } = e.data || {};
  if (!id || !action) return;

  // 1. Ensure pdf-lib is loaded inside worker environment
  if (!self.PDFLib) {
    const libPaths = [
      '/assets/js/pdf-lib.min.js',
      '../assets/js/pdf-lib.min.js',
      '../../assets/js/pdf-lib.min.js',
      './pdf-lib.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'
    ];
    let loaded = false;
    for (const path of libPaths) {
      try {
        importScripts(path);
        if (self.PDFLib) {
          loaded = true;
          break;
        }
      } catch (err) {
        // try next path
      }
    }
    if (!loaded) {
      self.postMessage({ id, success: false, error: 'Could not load PDFLib script inside worker.' });
      return;
    }
  }

  const { PDFDocument, degrees, rgb } = self.PDFLib;

  function reportProgress(percent, statusMessage) {
    self.postMessage({
      id,
      type: 'progress',
      progress: Math.min(99, Math.max(1, Math.round(percent))),
      message: statusMessage || `Processing... ${Math.round(percent)}%`
    });
  }

  try {
    // ----------------------------------------------------
    // ACTION: MERGE
    // ----------------------------------------------------
    if (action === 'MERGE') {
      reportProgress(10, 'Initializing high-speed PDF merge...');
      const mergedPdf = await PDFDocument.create();
      const files = payload.files || [];
      const totalFiles = files.length;

      for (let i = 0; i < totalFiles; i++) {
        const item = files[i];
        const srcPdf = await PDFDocument.load(item.arrayBuffer, { ignoreEncryption: true });
        const indices = item.pageIndices || srcPdf.getPageIndices();

        // Copy raw page streams directly without re-encoding
        const copiedPages = await mergedPdf.copyPages(srcPdf, indices);
        copiedPages.forEach(page => mergedPdf.addPage(page));

        const pct = 10 + Math.round(((i + 1) / totalFiles) * 75);
        reportProgress(pct, `Merged file ${i + 1} of ${totalFiles} (${copiedPages.length} pages)...`);
      }

      reportProgress(90, 'Finalizing merged document buffer...');
      const pdfBytes = await mergedPdf.save({ useObjectStreams: true });
      reportProgress(100, 'Done!');

      // Transfer ArrayBuffer back to main thread to eliminate clone latency
      const buffer = pdfBytes.buffer;
      self.postMessage({ id, success: true, pdfBytes: buffer, pageCount: mergedPdf.getPageCount() }, [buffer]);
    }

    // ----------------------------------------------------
    // ACTION: SPLIT
    // ----------------------------------------------------
    else if (action === 'SPLIT') {
      reportProgress(10, 'Loading PDF for splitting...');
      const srcPdf = await PDFDocument.load(payload.arrayBuffer, { ignoreEncryption: true });
      const ranges = payload.ranges || [];
      const results = [];
      const transferables = [];

      for (let i = 0; i < ranges.length; i++) {
        const indices = ranges[i];
        const newPdf = await PDFDocument.create();
        const copied = await newPdf.copyPages(srcPdf, indices);
        copied.forEach(p => newPdf.addPage(p));

        const bytes = await newPdf.save({ useObjectStreams: true });
        results.push({
          name: payload.fileNames ? payload.fileNames[i] : `split_part_${i + 1}.pdf`,
          buffer: bytes.buffer,
          pageCount: indices.length
        });
        transferables.push(bytes.buffer);

        const pct = 10 + Math.round(((i + 1) / ranges.length) * 80);
        reportProgress(pct, `Extracted chunk ${i + 1} of ${ranges.length}...`);
      }

      reportProgress(100, 'Done!');
      self.postMessage({ id, success: true, results }, transferables);
    }

    // ----------------------------------------------------
    // ACTION: COMPRESS
    // ----------------------------------------------------
    else if (action === 'COMPRESS') {
      reportProgress(15, 'Analyzing PDF stream objects...');
      const srcPdf = await PDFDocument.load(payload.arrayBuffer, { ignoreEncryption: true });
      const pageIndices = srcPdf.getPageIndices();

      reportProgress(40, 'Re-building optimized page streams...');
      const compressedPdf = await PDFDocument.create();
      const copiedPages = await compressedPdf.copyPages(srcPdf, pageIndices);
      copiedPages.forEach(p => compressedPdf.addPage(p));

      reportProgress(75, 'Compressing document structure...');
      const pdfBytes = await compressedPdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 100
      });

      reportProgress(100, 'Done!');
      const buffer = pdfBytes.buffer;
      self.postMessage(
        {
          id,
          success: true,
          pdfBytes: buffer,
          originalSize: payload.arrayBuffer.byteLength,
          newSize: pdfBytes.byteLength
        },
        [buffer]
      );
    }

    // ----------------------------------------------------
    // ACTION: DELETE_PAGES
    // ----------------------------------------------------
    else if (action === 'DELETE_PAGES') {
      reportProgress(20, 'Loading document pages...');
      const srcPdf = await PDFDocument.load(payload.arrayBuffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(srcPdf, payload.pagesToKeep);
      copied.forEach(p => newPdf.addPage(p));

      reportProgress(80, 'Saving modified document...');
      const pdfBytes = await newPdf.save({ useObjectStreams: true });
      reportProgress(100, 'Done!');
      const buffer = pdfBytes.buffer;
      self.postMessage({ id, success: true, pdfBytes: buffer }, [buffer]);
    }

    // ----------------------------------------------------
    // ACTION: ROTATE
    // ----------------------------------------------------
    else if (action === 'ROTATE') {
      reportProgress(20, 'Applying page rotations...');
      const pdfDoc = await PDFDocument.load(payload.arrayBuffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      const rotations = payload.rotations || {};

      for (const [pageIdxStr, deg] of Object.entries(rotations)) {
        const idx = parseInt(pageIdxStr, 10);
        if (pages[idx]) {
          const currentRotation = pages[idx].getRotation().angle;
          pages[idx].setRotation(degrees((currentRotation + deg) % 360));
        }
      }

      reportProgress(80, 'Saving rotated document...');
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      reportProgress(100, 'Done!');
      const buffer = pdfBytes.buffer;
      self.postMessage({ id, success: true, pdfBytes: buffer }, [buffer]);
    }

    // ----------------------------------------------------
    // ACTION: IMAGES_TO_PDF
    // ----------------------------------------------------
    else if (action === 'IMAGES_TO_PDF') {
      reportProgress(10, 'Creating PDF document from images...');
      const pdfDoc = await PDFDocument.create();
      const images = payload.images || [];
      const total = images.length;

      for (let i = 0; i < total; i++) {
        const imgItem = images[i];
        let embeddedImg;
        if (imgItem.type === 'image/png' || (imgItem.name && imgItem.name.endsWith('.png'))) {
          embeddedImg = await pdfDoc.embedPng(imgItem.arrayBuffer);
        } else {
          embeddedImg = await pdfDoc.embedJpg(imgItem.arrayBuffer);
        }

        const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
        page.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: embeddedImg.width,
          height: embeddedImg.height
        });

        const pct = 10 + Math.round(((i + 1) / total) * 80);
        reportProgress(pct, `Converted image ${i + 1} of ${total}...`);
      }

      reportProgress(95, 'Generating PDF document...');
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      reportProgress(100, 'Done!');
      const buffer = pdfBytes.buffer;
      self.postMessage({ id, success: true, pdfBytes: buffer }, [buffer]);
    }

    // ----------------------------------------------------
    // ACTION: UNKNOWN
    // ----------------------------------------------------
    else {
      throw new Error(`Unsupported worker action: ${action}`);
    }
  } catch (err) {
    self.postMessage({
      id,
      success: false,
      error: err.message || String(err)
    });
  }
};
