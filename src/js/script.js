const collapsibleCurriculum = () => {
  const sections = document.querySelectorAll('section#curriculum > ul > li')
  sections.forEach(section => {
    const details = section.querySelector('ul')
    details?.classList.add('hidden')
    const title = section.querySelector('h3')
    title?.classList.add('pointer')
    title?.classList.add('collapsed')
    title.onclick = () => {
      section.querySelector('ul')?.classList.toggle('hidden')
      title.classList.toggle('collapsed')
      title.classList.toggle('expanded')
    }
  })
}

collapsibleCurriculum()
