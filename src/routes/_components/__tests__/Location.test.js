import { describe, it, assert } from 'vitest'
import Location from '../Location.svelte'
import { render } from '@testing-library/svelte'

describe('Location.svelte', () => {
  it('renders the Location Component', async () => {
    const result = render(Location, {
      world: { name: 'World Name', id: 'World id' }
    })

    assert.isDefined(await result.findAllByText('World Name'))
  })
})
