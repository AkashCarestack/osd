/**
 * Utility function to download a file directly without opening in new tab
 */
export function downloadFile(url: string, filename?: string): void {
  try {

    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    
    // Set the download attribute to force download instead of navigation
    link.download = filename || 'download';
    
    // Set target to _self to avoid opening new tab
    link.target = '_self';
    
    // Add rel attribute for security
    link.rel = 'noopener noreferrer';
    
    // Make it invisible
    link.style.display = 'none';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    
    // Remove after a short delay
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    

  } catch (error) {
    console.error('Error downloading file:', error);
    // Fallback: open in new tab if download fails

    window.open(url, '_blank');
  }
}

/**
 * Utility function to download PDF from URL
 */
export function downloadPDF(pdfUrl: string, filename?: string): void {
  // If no filename provided, extract from URL or use default
  if (!filename) {
    const urlParts = pdfUrl.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    filename = lastPart.includes('.pdf') ? lastPart : 'document.pdf';
  }
  

  
  // Try fetch-based download first (better for CORS)
  downloadPDFWithFetch(pdfUrl, filename).catch(() => {

    downloadFile(pdfUrl, filename);
  });
}

/**
 * Download PDF using fetch (better CORS handling)
 */
async function downloadPDFWithFetch(pdfUrl: string, filename: string): Promise<void> {
  try {

    
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    

  } catch (error) {
    console.error('Fetch download failed:', error);
    throw error; // Re-throw to trigger fallback
  }
}
