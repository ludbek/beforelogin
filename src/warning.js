import React from 'react'
import { render } from 'react-dom'
import { filterByOrigin } from './shared/misc'
import { Header } from './components/header'
import { WARN_ON_NEW_SITE, WARN_ON_NEW_FORM_PAGE, WARN_ON_EVERY_FORM_PAGE  } from './shared/constants'

const searchParams = new URLSearchParams(window.location.search)
const origin = searchParams.get('origin')
const tabId = parseInt(searchParams.get('tab'), 10)
const type = searchParams.get('type')

function closeThisTab () {
  tabId && chrome.tabs.update(tabId, {active: true}, () => {
    window.close()
  })
}

function removeHistory({origin, tabId}) {
  return () => {
    alert(`This will remove all the histories related to ${origin}.`)
    tabId && chrome.tabs.remove(tabId)
    chrome.history.search({text: origin, startTime: 0, maxResults: 99999}, (visits) => {
      const trueVisits = filterByOrigin({origin, visits})
      let count = 0
      trueVisits.forEach(({url}) => {
        chrome.history.deleteUrl({url}, () => {
          count = count + 1
          if(count === trueVisits.length) {
            closeThisTab()
          }
        })
      })
    })
  }
}

function ActionRow ({origin, tabId}) {
  return (
    <div className="flex flex-row">
      <div className="flex-1">
        <button
          className="text-lg shadow-md p-2 bg-red-500 rounded-md text-white"
          onClick={removeHistory({origin, tabId})}
        >
          I don't trust this site
        </button>
      </div>
      <div className="flex-1 text-right">
        <button
          className="text-lg shadow-md p-2 bg-green-500 rounded-md text-white"
          onClick={closeThisTab}
        >
          I trust this site
        </button>
      </div>
    </div>
  )
}

const App = function () {
  let header

  if(type === WARN_ON_NEW_FORM_PAGE) {
    header = <Header>Careful, you are visiting this sensitive page for the first time.</Header>
  }
  else if(type === WARN_ON_EVERY_FORM_PAGE) {
    header = <Header>Careful, this page collects sensitive information.</Header>
  }
  else {
    header = <Header>Careful, you are visiting this site for the first time.</Header>
  }

  return (
    <div className='flex-grow md:max-w-3xl max-w-md shadow-md p-5 rounded-md bg-white'>
      {header}
      <a className='text-blue-500 text-3xl mb-5' href={origin}>{origin}</a>
      <div className="text-xl mb-3">Before you enter any sensitive information (password, card number), we highly recommend you to make sure this is not a fake website</div>
      <div className="mb-3">
        <p className="text-xl">To spot a fake website we suggest you to</p>
        <p className="text-xl">1. check the domain of the website</p>
        <p className="text-xl">2. explore the site to make sure it is what you think it is.</p>
      </div>
      <ActionRow origin={origin} tabId={tabId} />
    </div>
  )
}

render(<App/>, document.body);
