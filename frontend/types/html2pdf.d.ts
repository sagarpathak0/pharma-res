declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    enableLinks?: boolean;
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
      backgroundColor?: string;
      logging?: boolean;
      allowTaint?: boolean;
      removeContainer?: boolean;
    };
    jsPDF?: {
      unit?: 'pt' | 'mm' | 'cm' | 'in';
      format?: 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'letter' | 'legal' | [number, number];
      orientation?: 'portrait' | 'landscape';
      compress?: boolean;
    };
  }

  interface Html2PdfInstance {
    from(element: HTMLElement | string): Html2PdfInstance;
    set(options: Html2PdfOptions): Html2PdfInstance;
    save(): Promise<void>;
    toPdf(): any; // jsPDF instance
    toContainer(): Promise<HTMLElement>;
    toCanvas(): Promise<HTMLCanvasElement>;
    toImg(): Promise<HTMLImageElement>;
    output(type: string, options?: any): Promise<any>;
  }

  function html2pdf(): Html2PdfInstance;
  export default html2pdf;
}

const generatePDF = () => {
  if (!resultRef.current) return;
  
  // Apply white background to all elements before generating
  const elements = resultRef.current.querySelectorAll('*');
  const originalStyles = new Map();
  
  // Store and override styles
  elements.forEach(el => {
    if (el instanceof HTMLElement) {
      originalStyles.set(el, el.style.backgroundColor);
      el.style.backgroundColor = '#ffffff';
    }
  });
  
  const options = {
    margin: 10,
    filename: 'student-result.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      backgroundColor: "#ffffff",
      removeContainer: true,
      logging: false,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().from(resultRef.current).set(options).save()
    .then(() => {
      // Restore original styles
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.backgroundColor = originalStyles.get(el) || '';
        }
      });
    });
};