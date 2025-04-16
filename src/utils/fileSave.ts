export function exportStores() {
  const data = JSON.stringify({
    'sections-store': localStorage.getItem('sections-store'),
    'page-setting-store': localStorage.getItem('page-setting-store'),
    'assets-store': localStorage.getItem('assets-store'),
  })

  console.log(data)

  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'md-ppt-save.json'
  a.click()

  URL.revokeObjectURL(url)
}

export function importStores(file?: File) {
  if (!file) return
  
  const reader = new FileReader()

  reader.onload = (event) => {
    const result = event.target?.result
    if (typeof result === 'string') {
      const data = JSON.parse(result)
      localStorage.setItem('sections-store', data['sections-store'])
      localStorage.setItem('page-setting-store', data['page-setting-store'])
      localStorage.setItem('assets-store', data['assets-store'])
      window.location.reload()
    }
  }

  reader.readAsText(file)
}