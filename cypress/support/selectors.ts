// selectors.ts
// Centralizes every data-test selector used across the smoke suite.
// Keeping selectors in a single file means a UI change only requires
// one edit here instead of hunting through every spec file.

export const selectors = {
  auth: {
    usernameInput: '[data-test=signin-username]', // Username field on the sign-in form
    passwordInput: '[data-test=signin-password]', // Password field on the sign-in form
    submitButton: '[data-test=signin-submit]', // Sign-in form submit button
    errorMessage: '[data-test=signin-error]', // Error banner shown on invalid credentials
    signOutButton: '[data-test=sidenav-signout]', // Sign-out entry in the side navigation
    sideNavUsername: '[data-test=sidenav-username]', // Username displayed once authenticated
  },
  onboarding: {
    bankNameInput: '[data-test=bankaccount-bankName-input]', // Bank name field
    routingNumberInput: '[data-test=bankaccount-routingNumber-input]', // Routing number field
    accountNumberInput: '[data-test=bankaccount-accountNumber-input]', // Account number field
    submitButton: '[data-test=bankaccount-submit]', // Submit button for the bank account form
    accountList: '[data-test=bankaccount-list]', // List of saved bank accounts
  },
  transaction: {
    newTransactionButton: '[data-test=nav-top-new-transaction]', // "New" button that opens the transaction form
    userListSearch: '[data-test=user-list-search-input]', // Contact search field inside the new transaction form
    userListItem: '[data-test=user-list-item]', // Individual contact entry in the search results
    amountInput: '[data-test=transaction-create-amount-input]', // Amount field
    descriptionInput: '[data-test=transaction-create-description-input]', // Description field
    payButton: '[data-test=transaction-create-submit-payment]', // "Pay" submit button
    requestButton: '[data-test=transaction-create-submit-request]', // "Request" submit button
    feedItem: '[data-test=transaction-item]', // Single transaction entry in a feed
    feedTabMine: '[data-test=nav-personal-tab]', // "Mine" feed tab
    feedTabPublic: '[data-test=nav-public-tab]', // "Public" feed tab
  },
  search: {
    searchInput: '[data-test=nav-top-search]', // Global search input in the top navigation
    searchResultItem: '[data-test=transaction-list-item]', // Individual result row in the search results
  },
  social: {
    likeButton: '[data-test=transaction-like-button]', // Like icon on a transaction
    likeCount: '[data-test=transaction-like-count]', // Like counter next to the like icon
    commentInput: '[data-test=transaction-comment-input]', // Comment input field on a transaction
    commentSubmit: '[data-test=transaction-comment-submit]', // Comment submit button
    commentItem: '[data-test=comments-list-item]', // Individual comment entry
  },
  notifications: {
    bellIcon: '[data-test=nav-top-notifications-link]', // Notification bell icon in the top navigation
    unreadBadge: '[data-test=nav-top-notifications-count]', // Unread notifications counter badge
  },
};
