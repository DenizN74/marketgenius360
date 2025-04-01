describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show login form by default', () => {
    cy.get('form').should('exist');
    cy.contains('Sign in to your account').should('be.visible');
  });

  it('should switch between login and signup forms', () => {
    cy.contains("Don't have an account? Sign up").click();
    cy.contains('Create a new account').should('be.visible');
    cy.contains('Already have an account? Sign in').click();
    cy.contains('Sign in to your account').should('be.visible');
  });

  it('should show validation errors for invalid input', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email address').should('be.visible');
  });

  it('should handle successful login', () => {
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Successfully signed in!').should('be.visible');
  });
});