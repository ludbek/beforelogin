import { filterByOrigin, getOrigin, mapOrigins } from './shared/misc'
import {
  WARN_ON_NEW_SITE,
  WARN_ON_NEW_FORM_PAGE,
  WARN_ON_EVERY_FORM_PAGE,
  BOOKMARKS
} from './shared/constants'

chrome.runtime.onInstalled.addListener(() => {
  // todo skip is settings already exists
  chrome.storage.sync.set({
    [WARN_ON_NEW_SITE]: true,
    [WARN_ON_NEW_FORM_PAGE]: true,
    [WARN_ON_EVERY_FORM_PAGE]: false
  })
})

function openWarningPage({pwdFieldCount, origin, type}) {
	chrome.tabs.query({'active': true}, function(tabs) {
		const {id, index} = tabs[0]
		const warningPageUrl = chrome.extension.getURL('warning.html')
		const fullUrl = `${warningPageUrl}?origin=${origin}&tab=${id}&pwdFieldCount=${pwdFieldCount}&type=${type}`
		chrome.tabs.create({url: fullUrl, active: true, index: index + 1})
	});
}

function checkPhishing({url, origin, pwdFieldCount}) {
  chrome.storage.sync.get([
    WARN_ON_NEW_SITE,
    WARN_ON_NEW_FORM_PAGE,
    WARN_ON_EVERY_FORM_PAGE,
    BOOKMARKS,
  ], ({warnOnNewSite, warnOnNewFormPage, warnOnEveryFormPage, bookmarks}) => {
    if(mapOrigins(bookmarks).includes(getOrigin(origin))) return

    chrome.history.search({text: origin, startTime: 0, maxResults: 99999}, (visits) => {
      const trueVisits = filterByOrigin({origin, visits})
      // user visits a site for the first time
      if(warnOnNewSite && trueVisits.length === 1) {
        return openWarningPage({pwdFieldCount, origin, type: WARN_ON_NEW_SITE})
      }

      if(warnOnNewFormPage && pwdFieldCount > 0) {
        return openWarningPage({pwdFieldCount, origin, type: WARN_ON_EVERY_FORM_PAGE})
      }

      chrome.history.getVisits({url}, (visits) => {
        // user visits a login page for the first time
        if(warnOnEveryFormPage && visits.length === 1 && pwdFieldCount > 0) {
          return openWarningPage({pwdFieldCount, origin, type: WARN_ON_NEW_FORM_PAGE})
        }
      })
    })
  })
}

chrome.runtime.onMessage.addListener(
	function(request, sender) {
		if(!sender.tab) return

		const { url, origin } = sender
		const { pwdFieldCount } = request
		checkPhishing({url, origin, pwdFieldCount})
	}
)
