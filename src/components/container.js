import React from 'react'

export function Container ({children}) {
  return <div class='flex-grow md:max-w-3xl max-w-md shadow-md p-5 rounded-md bg-white'>{children}</div>
}
