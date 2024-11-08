describe('template spec', () => {
  it('documents', () => {

    cy.visit('http://localhost:3000')

    cy.contains('Sign in').click()

    cy.contains('Documents').click()

  })
})