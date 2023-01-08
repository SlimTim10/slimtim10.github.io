const mobileMenu = () => {
  const button = document.querySelector('header #toggle-menu')
  const menu = document.querySelector('header nav')
  button.onclick = () => {
    menu.classList.toggle('collapsed')
    button.classList.toggle('opened')
  }
}

mobileMenu()

const collapsibleCurriculum = () => {
  const sections = document.querySelectorAll('section#curriculum .content > ul > li')
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

const getNextSessionDate = () => {
  const now = new Date()
  
  const nextWeek = new Date()
  nextWeek.setUTCDate(now.getUTCDate() + 7)

  // Sunday - Saturday : 0 - 6
  const day = 3 // Wednesday
  const diff = (day - nextWeek.getUTCDay()) < 0
        ? (3 - nextWeek.getUTCDay()) + 7
        : (3 - nextWeek.getUTCDay())
  
  const nextSessionDate = new Date()
  nextSessionDate.setUTCDate(now.getUTCDate() + diff)
  const hour = 18 + 5 // 18:00 EST = 23:00 UTC-5
  nextSessionDate.setUTCHours(hour)
  nextSessionDate.setUTCMinutes(0)
  nextSessionDate.setUTCSeconds(0)
  
  return nextSessionDate
}

// e.g., "2 days, 23 hour, 33 minutes", or null for being currently live
const nextHappyHourTime = () => {
  const nextSessionDate = getNextSessionDate()
  const now = new Date()

  const diffMillis = nextSessionDate.getTime() - now.getTime()
  const diffSeconds = Math.floor(diffMillis / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  const minutesLeft = diffMinutes - (diffHours * 60)
  const hoursLeft = diffHours - (diffDays * 24)
  const daysLeft = diffDays < 0
        ? diffDays + 8
        : diffDays

  const diffToText = (d, word) => d === 0
        ? null
        : (d === 1 ? `1 ${word}` : `${d} ${word}s`)
  const dayText = diffToText(daysLeft, 'day')
  const hoursText = diffToText(hoursLeft, 'hour')
  const minutesText = diffToText(minutesLeft, 'minute')
  const allParts = [dayText, hoursText, minutesText]
        .filter(x => x !== null)
        .join(', ')

  return diffHours === -1
    ? null
    : allParts
}

const nextHappyHourText = () => {
  const nextSessionDate = getNextSessionDate()
  const now = new Date()

  const diffMillis = nextSessionDate.getTime() - now.getTime()
  const diffSeconds = Math.floor(diffMillis / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  const minutesLeft = diffMinutes - (diffHours * 60)
  const hoursLeft = diffHours - (diffDays * 24)
  const daysLeft = diffDays < 0
        ? diffDays + 8
        : diffDays

  const diffToText = (d, word) => d === 0
        ? null
        : (d === 1 ? `1 ${word}` : `${d} ${word}s`)
  const dayText = diffToText(daysLeft, 'day')
  const hoursText = diffToText(hoursLeft, 'hour')
  const minutesText = diffToText(minutesLeft, 'minute')
  const allParts = [dayText, hoursText, minutesText]
        .filter(x => x !== null)
        .join(', ')

  return nextHappyHourTime() === null
    ? `The session is currently live!`
    : `Next session starts in ${allParts}.`
}

const displayNextHappyHour = () => {
  const elFullText = document.querySelector('#next-happy-hour')
  if (elFullText) {
    elFullText.innerText = nextHappyHourText()
  }

  const elTime = document.querySelector('#next-happy-hour-banner')
  if (elTime) {
    const t = nextHappyHourTime()
    elTime.innerText = t === null
      ? `Happy Hour is currently live!`
      : `${t} until next Happy Hour!`
  }
}

displayNextHappyHour()

setInterval(() => {
  displayNextHappyHour()
}, 1000)
