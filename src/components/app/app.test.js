import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './app'

// Mock the axios module
jest.mock('axios')

test('renders login page when not authenticated', () => {
  render(<App />)
  expect(screen.getByText(/login/i)).toBeInTheDocument()
})
