Cypress.Commands.add('login', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('supabase.auth.token', JSON.stringify({
      currentSession: {
        access_token: 'test-token',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      },
    }));
  });
});