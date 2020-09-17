import React from 'react'
import { render } from 'react-dom'
import { getOrigin, mapOrigins, markSiteTrusted } from './shared/misc'

const localStore = {
  bookmarks: [],
  origin: '',
  favIconUrl: ''
}

chrome.tabs.query({'active': true}, function(tabs) {
  localStore.origin = getOrigin(tabs[0].url)
  localStore.favIconUrl = tabs[0].favIconUrl
  redraw()
})

chrome.storage.sync.get('bookmarks', ({bookmarks}) => {
  localStore.bookmarks = bookmarks
  redraw()
})

function removeBookmark(origin) {
  if(!confirm(`Are you sure to remove ${origin} from bookmarks ?`)) {
    return
  }

  localStore.bookmarks = localStore.bookmarks.filter( bookmark => bookmark.origin !== origin)

  chrome.storage.sync.set({bookmarks: localStore.bookmarks }, () => {
    redraw()
  })
}

function addBookmark(bookmark) {
  localStore.bookmarks.unshift(bookmark)
  chrome.storage.sync.set({bookmarks: localStore.bookmarks}, () => {
    redraw()
  })
}

function Header() {
  const imgUrl = chrome.runtime.getURL('images/Icon-16.png')

  return (
    <div className="text-center text-xl flex flex-col header m-2">
      <div>
        <img className="inline" src={imgUrl} />
        <span className="ml-2">beforelogin</span>
      </div>
    </div>
  )
}

function AddBookmark() {
  const { origin, favIconUrl } = localStore
  return (
    <div>
      <button className="text-base bg-green-500 text-white w-full rounded-sm hover:bg-green-700" onClick={() => addBookmark({origin, favIconUrl})}>+ Add to trust list</button>
    </div>
  )
}

function TrustItem({origin, favIconUrl}) {
  return (
    <div className="flex items-center p-2" key={origin}>
      <img className="favicon" src={favIconUrl} />
      <a className="flex-grow text-base pl-2 text-blue-500" href={origin} target="_blank">{origin}</a>
      <button className="text-base text-red-500 hover:text-red-700" onClick={() => removeBookmark(origin)}>Remove</button>
    </div>
  )
}

function Bookmarks() {
  return (
    <div className="trust-list">
      {localStore.bookmarks.map(({origin, favIconUrl}) => {
        return <TrustItem origin={origin} favIconUrl={favIconUrl} />
        })
      }
    </div>
  )
}

function Main() {
  const origins = mapOrigins(localStore.bookmarks)
  const { origin } = localStore
  return (
    <div className="">
      {!origins.includes(origin) && <AddBookmark />}
      <Bookmarks />
    </div>
  )
}

function Footer() {
  const settingsUrl = chrome.runtime.getURL('options.html')
  return (
    <div className="text-center">
      <a className="text-blue-500 text-sm" href={settingsUrl} target="_blank">Settings</a>
    </div>
  )
}

function Popup() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  )
}

function redraw() {
  render(<Popup />, document.body)
}

redraw()
