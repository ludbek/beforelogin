import { render, h as o } from 'preact'

function filterByOrigin ({origin, visits}) {
  return visits.filter(({url}) => {
    return RegExp(`^${origin}`).test(url)
  })
}

function closeThisTab () {
  window.close()
}

function removeHistory({origin, tabId}) {
  return () => {
    alert(`This will remove all the histories related to ${origin}.`)
    chrome.tabs.remove(parseInt(tabId, 10))
    chrome.history.search({text: origin, startTime: 0, maxResults: 99999}, (visits) => {
      filterByOrigin({origin, visits}).forEach(({url}) => {
        chrome.history.deleteUrl({url})
      })
    })
    closeThisTab()
  }
}

function header ({children}) {
		return o('h1', {class: 'text-3xl'}, children)
}

function actionRow ({origin, tabId}) {
	return o('div', {class: "flex flex-row"},
		o('div', {class: "flex-1"},
      o('button', {
        class: "text-lg shadow-md p-2 bg-red-500 rounded-md text-white",
        onclick: removeHistory({origin, tabId})
      },
        'I dont know this site')
		),
		o('div', {class: "flex-1 text-right", onclick: closeThisTab},
      o('button', {
        class:"text-lg shadow-md p-2 bg-green-500 rounded-md text-white"
      },
        'I know this site') 
		)
	)
}

const app = function () {
  const searchParams = new URLSearchParams(window.location.search)
  const origin = searchParams.get('origin')
  const tabId = searchParams.get('tab')

	return o('div', {class: 'flex-grow md:max-w-3xl max-w-md shadow-md p-5 rounded-md bg-white'},
    o(header, null, "You haven't visited this site before."),
		o('p', null, 'Before you enter any sensitive information (password, date of birth, card number), we highly recommend you to make sure this is not a fake website'),
		o('p', null, 'To spot a fake website we suggest you to 1. check the domain of the website 2. explore the site to make sure it is what you think it is.'),
		o('p', null,
			'The site is ',
			o('a', {class: 'text-blue-500', href:"google.com"}, null, origin),
			'.'
		),
		o(actionRow, {origin, tabId})
	)
}

render(o(app), document.body);
