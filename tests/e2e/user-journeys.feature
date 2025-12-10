Feature: Vapourism V2 user journeys

  # Homepage discovery
  Scenario: Visitor explores Vapourism hero
    Given a visitor loads the "/" route
    Then they see the gradient hero with vape compliance badge
    And they can click primary and secondary CTAs leading to featured collection and PDP
    And scrolling reveals predictive search CTA, featured collections, innovation rail, and newsletter panel

  # Predictive search experience
  Scenario: Shopper searches from header pill input
    Given the visitor focuses the header search pill
    When they type at least two characters
    Then predictive results show trending terms, products, and collections
    And selecting "View all results" navigates to "/search?q=<term>"
    And the GA4 CTA rail is displayed beneath search suggestions

  # Collections navigation
  Scenario: Desktop user opens mega menu
    Given the visitor hovers the "Collections" trigger in the header
    Then the radial-backed mega menu appears with featured tile and curated lists
    And clicking a featured collection takes them to "/collections/<handle>"

  Scenario: Mobile user opens drawer
    Given the visitor taps the mobile menu button
    Then the gradient drawer slides in showing quick search access and accordion sections
    And tapping a collection group expands its children
    And selecting a child navigates to the matching collection route

  # Collections directory page
  Scenario: Visitor browses curated collections
    Given the visitor opens "/collections"
    Then they see the hero banner with breadcrumbs and description
    And filter pills allow switching between featured sets
    And collection cards show product counts and CTA buttons

  # Collection detail page
  Scenario: Shopper views a collection
    Given the visitor opens "/collections/<handle>"
    Then the hero displays the collection image, description, and compliance tag
    And filter/sort controls appear beneath the hero
    And the product grid shows Shopify-backed products with quick actions
    And empty states render the compliance-friendly illustration when no products match

  # Product detail page
  Scenario: Shopper evaluates a product
    Given the visitor opens "/products/<handle>"
    Then the gallery renders lifestyle imagery plus thumbnails
    And a sticky purchase card shows price, variant selector, stock status, and add-to-cart
    And compliance banners (shipping, age) appear below add-to-cart
    And brand media pack content renders via BrandSection when available
    And FAQ accordion plus "Vapourism Promise" tiles appear further down the page

  # Product filtering within a collection
  Scenario: Shopper narrows products by filters
    Given the visitor opens "/collections/<handle>"
    And filter facets (strength, format, brand, price) are visible
    When they toggle any filter pill
    Then the product grid updates via Remix loader data
    And the active filter count appears above the grid
    And clearing filters resets the grid to all products

  # Add to cart flow
  Scenario: Shopper adds a product to cart from PDP
    Given the visitor is on "/products/<handle>"
    And the variant selector is set
    When they click "Add to cart"
    Then the Hydrogen cart mutation succeeds
    And the CartSlideout opens showing the added line item
    And free-shipping progress updates in real time

  # Cart navigation to verification page
  Scenario: Checkout is gated by AgeVerif validation
    Given the CartSlideout is open
    And the shopper has not completed the AgeVerif flow
    When they click the "Checkout" button
    Then the storefront routes them to "/age-verification" instead of Shopify checkout
    And the cart contents persist in session for return flow

  # Cart slideout
  Scenario: Shopper views and edits cart
    Given the visitor clicks the cart icon in the header
    Then the CartSlideout opens with order summary, threshold progress, and compliance copy
    And quantity controls mutate the Hydrogen cart
    And "Checkout" redirects to Shopify hosted checkout

  # Age verification on entry
  Scenario: First-time visitor meets DOB compliance
    Given localStorage lacks a valid age verification token
    When the visitor lands on any page
    Then the AgeVerificationModal appears with date-of-birth form
    And submitting a valid DOB dismisses the modal for 30 days
    And invalid entries show inline error messages

  # Predictive search page
  Scenario: Shopper reviews full search results
    Given the visitor navigates to "/search?q=<term>"
    Then predictive summary chips appear at the top
    And products, collections, and articles sections display per Shopify results
    And empty states highlight alternate suggestions with CTA buttons

  # Full search results page with pagination and comprehensive filtering
  Scenario: Shopper searches with complete result set and filtering
    Given the visitor searches for "Vape"
    Then all products in the Shopify store matching the criteria are loaded
    And the UI paginates results to pages of up to 24 items
    And the count shows "X of Y products" where X is visible and Y is total matching
    And brand filter shows all brands that have products matching the search criteria
    And all filter options work regardless of current page (not limited to visible products)
    And pagination controls allow navigation through all result pages

  # About & marketing content
  Scenario: Visitor opens About page
    Given the visitor navigates to "/about"
    Then the page mirrors the Figma layout with founder story, compliance stats, and CTA cards
    And all imagery uses ImageWithFallback for resilience

  # Authentication
  Scenario: Customer signs in
    Given the visitor goes to "/account/login"
    Then the login form matches the Figma LoginPage styling
    And submitting credentials calls Hydrogen customer account APIs
    And errors show styled alerts beneath the form

  # 404 and error handling
  Scenario: User hits unknown route
    Given the visitor navigates to an unknown path
    Then the NotFoundPage renders with illustration, copy, and CTA buttons

  # Age verification follow-up
  Scenario: Post-payment verification link
    Given a user visits "/age-verification?order=<id>&confirmationCode=<code>"
    Then the VerifyPage layout appears displaying the variables
    When the user clicks start
    Then AgeVerif Modal is loaded
