import React, { useState } from 'react'
import { render } from 'react-dom'
import { Container } from './components/container'
import { Header } from './components/header'

function ToggleOn({onClick}) {
  return (
    <div onClick={onClick} className='cursor-pointer w-12 h-8 rounded-full  bg-blue-500 relative'>
      <span className='h-8 w-8 absolute bg-blue-700 rounded-full right-0'></span>
    </div>
  )
}

function ToggleOff({onClick}) {
  return (
    <div onClick={onClick} className='cursor-pointer w-12 h-8 rounded-full  bg-gray-500 relative'>
      <span class='h-8 w-8 absolute bg-gray-700 rounded-full' />
    </div>
  )
}

function Setting({node, text}) {
  const [state, setState] = useState()

  function toggle () {
    const newState = !state
    chrome.storage.sync.set({[node]: newState}, () => {
      setState(newState)
    })
  }

  chrome.storage.sync.get(node, (setting) => {
    setState(setting[node])
  })

  return (
    <div class="flex my-5">
      <div class='text-xl flex-1'>{text}</div>
      {state? <ToggleOn onClick={toggle} /> : <ToggleOff onClick={toggle} />}
    </div>
  )
}

function App() {
  return (
    <Container>
      <Header>Settings</Header>
      <Setting node='warnOnNewSite' text='Warn me when I visit a new site.' />
      <Setting node='warnOnNewFormPage' text='Warn me when I visit a form with password field for the first time.' />
      <Setting node='warnOnEveryFormPage' text='Warn me every time I visit a form with password field.' />
    </Container>
  )
}

render(<App/>, document.body);

