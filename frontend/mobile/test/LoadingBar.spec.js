import { mount } from '@vue/test-utils'
import loading from '@/components/layouts/LoadingBar'

describe('LoadingBar', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(loading)
    expect(wrapper.vm).toBeTruthy()
  })
})
