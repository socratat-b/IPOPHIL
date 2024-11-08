describe('template spec', () => {
  it('should login', () => {

    cy.visit('http://localhost:3000')

    cy.contains('Sign in').click()

    cy.contains('Documents').click()

    cy.contains('Completed').click()

    cy.contains('Reports').click()

    cy.contains('user').click()

    cy.contains('Log out').click()

  })
})