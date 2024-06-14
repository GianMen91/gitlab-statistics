import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

jest.mock('axios')

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login page when not authenticated', () => {
    render(<App />)
    expect(screen.getByText(/login/i)).toBeInTheDocument()
  })
})
