import { test, expect } from '@playwright/test'
import { time_out } from '../src/plugins/utilities.mjs'
//import { timeout } from '../playwright.config.js';
//import pkg from '../playwright.config.js'
//const { timeout } = pkg
test.describe.configure({ mode: 'parallel' })
const hang_on_timer = 8000

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('div.greetings > h1')).toHaveText('You did it!')
})

const test_tries = [...Array(60).keys()] //the number of users
const size = 10; //the number of requests per user

for (const i of test_tries) {
  test(`axios of ${i}` , async ({ page }) => {
    test.setTimeout(470_000)
    await page.goto('/axios')
  
    for (let index = i * size; index < i * size + size; index++) {
      // await expect(await page.getByTestId('new_field1').inputValue()).toBe('')
      // await expect(await page.getByTestId('new_field2').inputValue()).toBe('')
      await wait_until_input_appear(page, 'new_field1', '')
      await wait_until_input_appear(page, 'new_field2', '')
      await page.getByTestId('new_field1').fill(`${index}`)
      await page.getByTestId('new_field2').fill('ttttttt' + index)
      await page.getByTestId('buttons_for_inputs').click()
      //await time_out(10)
    }
  })






}

// test('axios 1', async ({ page }) => {
//   test.setTimeout(470_000)
//   await page.goto('/axios')

//   for (let index = i1; index <= i1 + 100; index++) {
//     // await expect(await page.getByTestId('new_field1').inputValue()).toBe('')
//     // await expect(await page.getByTestId('new_field2').inputValue()).toBe('')
//     await wait_until_input_appear(page, 'new_field1', '')
//     await wait_until_input_appear(page, 'new_field2', '')
//     await page.getByTestId('new_field1').fill(`${index}`)
//     await page.getByTestId('new_field2').fill('ttttttt' + index)
//     await page.getByTestId('buttons_for_inputs').click()
//     //await time_out(10)
//   }
// })

// test('axios 2', async ({ page }) => {
//   test.setTimeout(470_000)
//   await page.goto('/axios')

//   for (let index = 201; index <= 300; index++) {
//     await wait_until_input_appear(page, 'new_field1', '')
//     await wait_until_input_appear(page, 'new_field2', '')
//     await page.getByTestId('new_field1').fill(`${index}`)
//     await page.getByTestId('new_field2').fill('ttttttt' + index)
//     await page.getByTestId('buttons_for_inputs').click()
//     //await time_out(10)
//   }
// })

// test('axios 3', async ({ page }) => {
//   test.setTimeout(470_000)
//   await page.goto('/axios')

//   for (let index = 201; index <= 300; index++) {
//     await wait_until_input_appear(page, 'new_field1', '')
//     await wait_until_input_appear(page, 'new_field2', '')
//     await page.getByTestId('new_field1').fill(`${index}`)
//     await page.getByTestId('new_field2').fill('ttttttt' + index)
//     await page.getByTestId('buttons_for_inputs').click()
//     //await time_out(10)
//   }
// })



//helpers-------------------------------------------------------------------------
const wait_until_input_appear = async (page, selector, expected_text) => {
  //console.log('wait')
  let i = 0
  let result
  let time_is_up = false
  let start_timer = performance.now()
  let end_timer

  do {
    i++
    result = undefined
    //console.log('wait', i, selector, expected_text)
    result = await page.getByTestId(selector).inputValue()
    //console.log('wait', result)
    end_timer = performance.now()
    if (end_timer - start_timer > hang_on_timer) {
      time_is_up = true
      break
    }
  } while (result != expected_text)

  if (time_is_up == true) {
    expect(777).toBe(999)
  }
}
