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

// String -> Number
const dayNum = d => (
  d.toLowerCase() === 'sunday' ? 0
    : d.toLowerCase() === 'monday' ? 1
    : d.toLowerCase() === 'tuesday' ? 2
    : d.toLowerCase() === 'wednesday' ? 3
    : d.toLowerCase() === 'thursday' ? 4
    : d.toLowerCase() === 'friday' ? 5
    : d.toLowerCase() === 'saturday' ? 6
    : 0
)

/*
  DiffTime :: {
    millis :: Number,
    seconds :: Number,
    minutes :: Number,
    hours :: Number,
    days :: Number,
  }
*/

// Calculate the time difference between two dates.
// (Date, Date) -> DiffTime
const diffTime = (x, y) => {
  const diffMillis = Math.abs(x.getTime() - y.getTime())
  return {
    millis: diffMillis,
    seconds: Math.floor(diffMillis / 1000),
    minutes: Math.floor(diffMillis / 1000 / 60),
    hours: Math.floor(diffMillis / 1000 / 60 / 60),
    days: Math.floor(diffMillis / 1000 / 60 / 60 / 24),
  }
}

/*
  WeeklyDate :: {
    day :: 0 - 6 (Sunday - Saturday),
    hour :: 0 - 24 (local time),
    minute: 0 - 59,
  }
*/

// Return the date of the next event, given a weekly date.
// WeeklyDate -> Date
const nextWeekly = weeklyDate => {
  const now = new Date()
  
  const thisWeekEvent = new Date()
  thisWeekEvent.setDate(now.getDate() + weeklyDate.day - now.getDay())
  thisWeekEvent.setHours(weeklyDate.hour)
  thisWeekEvent.setMinutes(weeklyDate.minute)
  thisWeekEvent.setSeconds(0)

  const nextEvent = thisWeekEvent
  if (thisWeekEvent.getTime() < now.getTime()) {
    nextEvent.setDate(nextEvent.getDate() + 7)
  }
  
  return nextEvent
}

/*
  Day :: 0 - 6 (Sunday - Saturday)
  Hour :: 0 - 24 (local time)
  Minute :: 0 - 59
*/

// Calculate the remaining time until the next weekly event.
// WeeklyDate -> (Day, Hour, Minute)
const timeUntilWeekly = weeklyDate => {
  const now = new Date()
  const nextEvent = nextWeekly(weeklyDate)
  const dt = diffTime(nextEvent, now)

  const minutesLeft = dt.minutes - (dt.hours * 60)
  const hoursLeft = dt.hours - (dt.days * 24)
  const daysLeft = dt.days < 0
        ? dt.days + 8
        : dt.days

  return [daysLeft, hoursLeft, minutesLeft]
}

// Check if the current time is between two weekly date times.
// (WeeklyDate, WeeklyDate) -> Bool
const nowIsBetween = (weeklyDateBegin, weeklyDateEnd) => {
  const now = new Date()
  
  const thisWeekEventBegin = new Date()
  thisWeekEventBegin.setDate(now.getDate() + weeklyDateBegin.day - now.getDay())
  thisWeekEventBegin.setHours(weeklyDateBegin.hour)
  thisWeekEventBegin.setMinutes(weeklyDateBegin.minute)
  thisWeekEventBegin.setSeconds(0)

  const thisWeekEventEnd = new Date()
  thisWeekEventEnd.setDate(now.getDate() + weeklyDateEnd.day - now.getDay())
  thisWeekEventEnd.setHours(weeklyDateEnd.hour)
  thisWeekEventEnd.setMinutes(weeklyDateEnd.minute)
  thisWeekEventEnd.setSeconds(0)

  return (
    thisWeekEventBegin.getTime() <= now.getTime()
      && now.getTime() <= thisWeekEventEnd.getTime()
  )
}

// e.g., "2 days, 23 hour, 33 minutes"
const nextHappyHourText = weeklyEventBegin => {
  const [daysLeft, hoursLeft, minutesLeft] = timeUntilWeekly(weeklyEventBegin)

  const diffToText = (d, word) => d === 0
        ? null
        : (d === 1 ? `1 ${word}` : `${d} ${word}s`)
  const dayText = diffToText(daysLeft, 'day')
  const hoursText = diffToText(hoursLeft, 'hour')
  const minutesText = diffToText(minutesLeft, 'minute')
  return [dayText, hoursText, minutesText]
        .filter(x => x !== null)
        .join(', ')
}

// Update the DOM with countdowns for the next Happy Hour event.
const displayNextHappyHour = () => {
  const weeklyHappyHourBegin = {
    day: dayNum('Thursday'),
    hour: 19,
    minute: 0,
  }
  
  const weeklyHappyHourEnd = {
    day: dayNum('Thursday'),
    hour: 20,
    minute: 0,
  }
  
  const elFullText = document.querySelector('#next-happy-hour')
  if (elFullText) {
    if (nowIsBetween(weeklyHappyHourBegin, weeklyHappyHourEnd)) {
      elFullText.innerText = `The event is currently live!`
    } else {
      const t = nextHappyHourText(weeklyHappyHourBegin)
      elFullText.innerText = `Next event starts in: ${t}.`
    }
  }

  const elTime = document.querySelector('#next-happy-hour-banner')
  if (elTime) {
    if (nowIsBetween(weeklyHappyHourBegin, weeklyHappyHourEnd)) {
      elTime.innerText = `Happy Hour is currently live!`
    } else {
      const t = nextHappyHourText(weeklyHappyHourBegin)
      elTime.innerText = `${t} until next Happy Hour!`
    }
  }
}

displayNextHappyHour()

// Update every minute
setInterval(() => {
  displayNextHappyHour()
}, 60000)
