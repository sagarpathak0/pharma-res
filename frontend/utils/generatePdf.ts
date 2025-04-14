// Import type only to avoid server-side execution

export const generatePDF = async (contentRef: React.RefObject<HTMLElement>): Promise<void> => {
  // Only run on the client side
  if (typeof window === 'undefined' || !contentRef.current) return;

  try {
    // Apply temporary styles to remove extra padding/margins for PDF generation
    if (contentRef.current) {
    //   const originalStyles = { ...contentRef.current.style };
      
      // Apply PDF-specific styles before generating
      contentRef.current.style.padding = '0';
      contentRef.current.style.margin = '0';
      
      // Add a style element with specific print styles
      const styleElement = document.createElement('style');
      styleElement.textContent = ``;
      document.head.appendChild(styleElement);

      // Dynamically import html2pdf only on client side
      const html2pdfModule = await import('html2pdf.js');
      const html2pdfJs = html2pdfModule.default || html2pdfModule;

      const opt = {
        margin: 0, // Remove margins completely
        filename: 'student_result.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: { 
          unit: "in",
          format: 'a4',
          orientation: "portrait",
        //   compress: true,
        //   precision: 16
        }
      };

      await html2pdfJs().from(contentRef.current).set(opt).save();

      // Clean up by restoring original styles and removing the style element
    //   Object.assign(contentRef.current.style, originalStyles);
      document.head.removeChild(styleElement);
    }
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
};
