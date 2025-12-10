// Customer Account API query for fetching a single order
// This file is excluded from Storefront API codegen validation

export const CUSTOMER_ORDER_QUERY = `#graphql
  fragment OrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment OrderLineItemFull on LineItem {
    id
    title
    quantity
    price {
      ...OrderMoney
    }
    totalDiscount {
      ...OrderMoney
    }
    image {
      altText
      height
      url
      id
      width
    }
    variantTitle
  }
  fragment OrderFragment on Order {
    id
    name
    confirmationNumber
    statusPageUrl
    fulfillmentStatus
    processedAt
    fulfillments(first: 1) {
      nodes {
        status
      }
    }
    totalTax {
      ...OrderMoney
    }
    totalPrice {
      ...OrderMoney
    }
    subtotal {
      ...OrderMoney
    }
    lineItems(first: 100) {
      nodes {
        ...OrderLineItemFull
      }
    }
  }
  query CustomerOrder($orderId: ID!) {
    order(id: $orderId) {
      ...OrderFragment
    }
  }
` as const;
