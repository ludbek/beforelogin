import React from 'react'
import { render } from 'react-dom'
import { filterByOrigin } from './shared/filterByOrigin'
import { Header } from './components/header'
import { WARN_ON_NEW_SITE, WARN_ON_NEW_FORM_PAGE, WARN_ON_EVERY_FORM_PAGE  } from './shared/constants'

function closeThisTab () {
  window.close()
}

function removeHistory({origin, tabId}) {
  return () => {
    alert(`This will remove all the histories related to ${origin}.`)
    chrome.tabs.remove(parseInt(tabId, 10))
    chrome.history.search({text: origin, startTime: 0, maxResults: 99999}, (visits) => {
      filterByOrigin({origin, visits}).forEach(({url}) => {
        console.log({url})
        chrome.history.deleteUrl({url})
      })
    })
    // closeThisTab()
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
          I dont know this site
        </button>
      </div>
      <div className="flex-1 text-right">
        <button
          className="text-lg shadow-md p-2 bg-green-500 rounded-md text-white"
          onClick={closeThisTab}
        >
          I know this site
        </button>
      </div>
    </div>
  )
}

function FirstTimeSiteMsg() {

}

function FirstTimePageMsg() {

}

const App = function () {
  const searchParams = new URLSearchParams(window.location.search)
  const origin = searchParams.get('origin')
  const tabId = searchParams.get('tab')
  const type = searchParams.get('type')
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
      <a className='text-blue-500 text-3xl' href={origin}>{origin}</a>
      {header}
      <p className="text-xl">Before you enter any sensitive information (password, date of birth, card number), we highly recommend you to make sure this is not a fake website</p>
      <p className="text-xl">To spot a fake website we suggest you to 1. check the domain of the website 2. explore the site to make sure it is what you think it is.</p>
      <ActionRow origin={origin} tabId={tabId} />
    </div>
  )
}

render(<App/>, document.body);
