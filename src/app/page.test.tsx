import { render } from '@testing-library/react'
import Home from './page'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('Home', () => {
  it('redireciona para /login', () => {
    const push = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push })

    render(<Home />)

    expect(push).toHaveBeenCalledWith('/login')
  })
})
