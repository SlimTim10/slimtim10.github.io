const mobileMenu = () => {
  const openButton = document.querySelector('header #toggle-menu-open')
  const closeButton = document.querySelector('header #toggle-menu-close')
  const menu = document.querySelector('header nav')
  menu.classList.add('collapsed')
  openButton.onclick = () => {
    menu.classList.remove('collapsed')
    openButton.classList.add('hidden')
    closeButton.classList.remove('hidden')
  }
  closeButton.onclick = () => {
    menu.classList.add('collapsed')
    openButton.classList.remove('hidden')
    closeButton.classList.add('hidden')
  }
}

mobileMenu()

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
