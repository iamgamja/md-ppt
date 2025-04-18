import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

export async function exportPDF() {
  const sections = document.querySelectorAll('.pdf-section')

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1920, 1080],
  })

  for (let i = 0; i < sections.length; i++) {
    const canvas = await html2canvas(sections[i] as HTMLElement)
    const imgData = canvas.toDataURL('image/png')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    if (i > 0) pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  }

  pdf.save('md-ppt.pdf')
}
