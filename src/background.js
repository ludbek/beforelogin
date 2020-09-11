import { filterByOrigin } from './shared/filterByOrigin'

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    warnOnNewSite: true,
    warnOnNewLoginPage: true,
    warnOnEveryLoginPage: false
  })
})

function openWarningPage({pwdFieldCount, origin}) {
	chrome.tabs.query({'active': true}, function(tabs) {
		const {id, index} = tabs[0]
		const warningPageUrl = chrome.extension.getURL('warning.html')
		const fullUrl = `${warningPageUrl}?origin=${origin}&tab=${id}&pwdFieldCount=${pwdFieldCount}`
		chrome.tabs.create({url: fullUrl, active: true, index: index + 1})
	});
}

function checkPhising({url, origin, pwdFieldCount}) {
	chrome.history.search({text: origin, startTime: 0, maxResults: 99999}, (visits) => {
    const trueVisits = filterByOrigin({origin, visits})
    return openWarningPage({pwdFieldCount, origin})
		if(trueVisits.length === 1) {
			return openWarningPage({pwdFieldCount, origin})
		}

		chrome.history.getVisits({url}, (visits) => {
			if(visits.length === 1 && pwdFieldCount > 0) {
				return openWarningPage({pwdFieldCount, origin})
			}
		})
		// visits.forEach(visit  => {
		// 	chrome.history.getVisits({url: visit.url}, (visits) => {
		// 		console.log({visits})
		// 	});
		// })
	})
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		// the request is not from the conent script
		if(!sender.tab) return

		// console.log({request, sender, sendResponse })
		const { url, origin } = sender
		const { pwdFieldCount } = request
		checkPhising({url, origin, pwdFieldCount})
	}
)
