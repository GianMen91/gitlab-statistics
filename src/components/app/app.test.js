import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App' // Adjust the path as per your project structure

jest.mock('axios')

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login page when not authenticated', () => {
    render(<App />)
    expect(screen.getByText(/login/i)).toBeInTheDocument()
  })

  // Add more tests as needed for different components and states
})
