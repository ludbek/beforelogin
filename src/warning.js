import React from 'react'
import { render } from 'react-dom'
import { filterByOrigin } from './shared/filterByOrigin'
import { Header } from './components/header'

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

const App = function () {
  const searchParams = new URLSearchParams(window.location.search)
  const origin = searchParams.get('origin')
  const tabId = searchParams.get('tab')

  return (
    <div className='flex-grow md:max-w-3xl max-w-md shadow-md p-5 rounded-md bg-white'>
      <Header>You haven't visited this site before.</Header>
      <p>Before you enter any sensitive information (password, date of birth, card number), we highly recommend you to make sure this is not a fake website</p>
      <p>To spot a fake website we suggest you to 1. check the domain of the website 2. explore the site to make sure it is what you think it is.</p>
      <p>The site is <a className='text-blue-500' href="google.com">{origin}</a>.</p>
      <ActionRow origin={origin} tabId={tabId} />
    </div>
  )
}

render(<App/>, document.body);
