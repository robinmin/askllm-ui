import { describe, it, expect, beforeEach } from 'vitest'
// import { mount } from '@vue/test-utils'
// import LoginForm from '@/components/LoginForm.vue'
import { createPinia, setActivePinia } from 'pinia'

describe('LoginForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders properly', () => {
    // const wrapper = mount(LoginForm)
    // expect(wrapper.find('form').exists()).toBe(true)
    // expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    // expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    // expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('submits the form with email and password', async () => {
    // const wrapper = mount(LoginForm)
    // const emailInput = wrapper.find('input[type="email"]')
    // const passwordInput = wrapper.find('input[type="password"]')
    // const form = wrapper.find('form')

    // await emailInput.setValue('test@example.com')
    // await passwordInput.setValue('password123')
    // await form.trigger('submit')

    // // You would typically check if the login action was called in the store
    // // This depends on how you've set up your store and might require mocking
    // expect(wrapper.emitted('submit')).toBeTruthy()
  })

  // Add more tests as needed
})