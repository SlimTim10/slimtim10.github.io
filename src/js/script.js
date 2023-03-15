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
  const sections = document.querySelectorAll('#curriculum .content > ul > li')
  sections.forEach(section => {
    const details = section.querySelector('ul')
    details?.classList.add('hidden')
    section?.classList.add('pointer')
    section?.classList.add('collapsed')
    section.onclick = () => {
      section.querySelector('ul')?.classList.toggle('hidden')
      section.classList.toggle('collapsed')
      section.classList.toggle('expanded')
    }
  })
}

collapsibleCurriculum()

const getNextSessionDate = () => {
  const now = new Date()
  
  const nextWeek = new Date()
  nextWeek.setUTCDate(now.getUTCDate() + 7)

  // Sunday - Saturday : 0 - 6
  const day = 4 // Thursday
  const diff = (day - nextWeek.getUTCDay()) < 0
        ? (day - nextWeek.getUTCDay()) + 7
        : (day - nextWeek.getUTCDay())
  
  const nextSessionDate = new Date()
  nextSessionDate.setUTCDate(now.getUTCDate() + diff)
  const hour = 19 + 5 // 19:00 EST = 24:00 UTC-5
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
