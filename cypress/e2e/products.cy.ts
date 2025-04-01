describe('Product Management', () => {
  beforeEach(() => {
    cy.login(); // Custom command to handle authentication
    cy.visit('/products');
  });

  it('should display product list', () => {
    cy.get('[data-testid="product-list"]').should('exist');
  });

  it('should create a new product', () => {
    cy.contains('Add Product').click();
    cy.get('input[name="name"]').type('Test Product');
    cy.get('input[name="sku"]').type('TEST-001');
    cy.get('input[name="price"]').type('99.99');
    cy.get('input[name="stock"]').type('10');
    cy.get('button[type="submit"]').click();
    cy.contains('Product created successfully').should('be.visible');
  });

  it('should update product details', () => {
    cy.get('[data-testid="edit-product"]').first().click();
    cy.get('input[name="price"]').clear().type('149.99');
    cy.get('button[type="submit"]').click();
    cy.contains('Product updated successfully').should('be.visible');
  });

  it('should delete a product', () => {
    cy.get('[data-testid="delete-product"]').first().click();
    cy.contains('Are you sure?').should('be.visible');
    cy.contains('button', 'Yes, delete it').click();
    cy.contains('Product deleted successfully').should('be.visible');
  });
});