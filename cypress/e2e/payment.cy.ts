describe('Payment Processing', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/checkout');
  });

  it('should display payment form', () => {
    cy.get('[data-testid="payment-form"]').should('exist');
  });

  it('should validate payment amount', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Amount must be greater than 0').should('be.visible');
  });

  it('should process successful payment', () => {
    // Mock Stripe Elements
    cy.window().then((win) => {
      win.Stripe = () => ({
        elements: () => ({
          create: () => ({
            mount: () => {},
            on: () => {},
          }),
        }),
        confirmPayment: () => Promise.resolve({ paymentIntent: { status: 'succeeded' } }),
      });
    });

    cy.get('[data-testid="payment-form"]').within(() => {
      cy.get('button[type="submit"]').click();
    });

    cy.contains('Payment processed successfully').should('be.visible');
  });

  it('should handle failed payment', () => {
    // Mock Stripe Elements with error
    cy.window().then((win) => {
      win.Stripe = () => ({
        elements: () => ({
          create: () => ({
            mount: () => {},
            on: () => {},
          }),
        }),
        confirmPayment: () => Promise.reject(new Error('Payment failed')),
      });
    });

    cy.get('[data-testid="payment-form"]').within(() => {
      cy.get('button[type="submit"]').click();
    });

    cy.contains('Payment failed').should('be.visible');
  });
});