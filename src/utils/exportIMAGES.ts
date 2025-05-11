import html2canvas from 'html2canvas-pro'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export async function exportIMAGES() {
  const sections = document.querySelectorAll('.pdf-section')
  const zip = new JSZip()

  for (let i = 0; i < sections.length; i++) {
    const canvas = await html2canvas(sections[i] as HTMLElement)
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'))

    zip.file(`slide-${i + 1}.png`, blob)
    console.log(i + 1, '/', sections.length)
  }

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'md-slides.zip')
}
