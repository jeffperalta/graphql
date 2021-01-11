import {getFirstName , isValidPassword}  from '../src/utils/user'

test('Should return first name when given full name', () => {
    const firstName = getFirstName("Jeff Peralta")
    expect(firstName).toBe('Jeff')
})

test('Should return first name when given first name', ()=> {
    const firstName = getFirstName("Jeff")
    expect(firstName).toBe('Jeff')
})

test('Should reject password shorter than 8 characters', () => {
    expect(isValidPassword('short')).toBe(false)
})

test('Should reject password that contacts the word \'password\'', () => {
    expect(isValidPassword('longPassword')).toBe(false)
})

test('Should correctly validate a valid password', () => {
    expect(isValidPassword('longPass123')).toBe(true)
})