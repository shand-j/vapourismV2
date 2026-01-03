/**
 * Email Capture API Route
 * 
 * Handles email capture submissions and creates customers in Shopify.
 * Features:
 * - Creates customer in Shopify with 10% discount tag
 * - Checks for existing customers before creating
 * - Stores marketing consent preference
 * - Returns appropriate responses for success/error/duplicate
 */

import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {adminGraphQL} from '~/lib/admin-client';
import {isValidEmail, normalizeEmail} from '~/lib/email-validation';

// GraphQL mutation to create a customer
const CREATE_CUSTOMER_MUTATION = `#graphql
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        tags
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// GraphQL query to check if customer exists
const CHECK_CUSTOMER_QUERY = `#graphql
  query checkCustomer($email: String!) {
    customers(first: 1, query: $email) {
      edges {
        node {
          id
          email
          tags
        }
      }
    }
  }
`;

// GraphQL mutation to update customer tags and metafields
const UPDATE_CUSTOMER_MUTATION = `#graphql
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        email
        tags
      }
      userErrors {
        field
        message
      }
    }
  }
`;

interface EmailCaptureRequest {
  email: string;
  marketingConsent: boolean;
  trigger: 'exit' | 'timer' | 'search' | 'blog_cta' | 'manual';
}

interface ShopifyUserError {
  field?: string[];
  message: string;
}

interface CustomerResponse {
  customer?: {
    id: string;
    email: string;
    tags?: string[];
  };
  userErrors?: ShopifyUserError[];
}

export async function action({request, context}: ActionFunctionArgs) {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    // Parse request body
    const body = await request.json() as EmailCaptureRequest;
    const {email, marketingConsent, trigger} = body;

    // Validate email
    if (!isValidEmail(email)) {
      return json({error: 'Invalid email address'}, {status: 400});
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = normalizeEmail(email);

    // Check if customer already exists
    const checkQuery = `email:${normalizedEmail}`;
    const existingCustomerResponse = await adminGraphQL(
      CHECK_CUSTOMER_QUERY,
      {email: checkQuery},
      context.env
    );

    const existingCustomers = existingCustomerResponse?.data?.customers?.edges || [];
    
    if (existingCustomers.length > 0) {
      const existingCustomer = existingCustomers[0].node;
      
      // Check if customer already has the discount tag
      const hasDiscountTag = existingCustomer.tags?.includes('email_capture_10_discount');
      
      if (!hasDiscountTag) {
        // Add the discount tag to existing customer
        const existingTags = existingCustomer.tags || [];
        const newTags = [...existingTags, 'email_capture_10_discount'];
        
        // Also add marketing consent tag if provided
        if (marketingConsent && !existingTags.includes('marketing_consent')) {
          newTags.push('marketing_consent');
        }
        
        await adminGraphQL(
          UPDATE_CUSTOMER_MUTATION,
          {
            input: {
              id: existingCustomer.id,
              tags: newTags,
            },
          },
          context.env
        );
      }
      
      // Return success but indicate customer already existed
      return json({
        success: true,
        alreadyExists: true,
        message: 'Welcome back! Check your email for your discount code.',
      });
    }

    // Create new customer
    const customerTags = ['email_capture_10_discount'];
    if (marketingConsent) {
      customerTags.push('marketing_consent');
    }
    
    // Add trigger tag for analytics
    customerTags.push(`capture_trigger:${trigger}`);

    const createResponse = await adminGraphQL(
      CREATE_CUSTOMER_MUTATION,
      {
        input: {
          email: normalizedEmail,
          tags: customerTags,
          emailMarketingConsent: marketingConsent ? {
            marketingState: 'SUBSCRIBED',
            marketingOptInLevel: 'SINGLE_OPT_IN',
          } : undefined,
        },
      },
      context.env
    );

    // Check for errors with proper typing
    const userErrors: ShopifyUserError[] = createResponse?.data?.customerCreate?.userErrors || [];
    if (userErrors.length > 0) {
      console.error('Customer creation errors:', userErrors);
      
      // Check if it's a duplicate email error (shouldn't happen due to our check, but just in case)
      const duplicateError = userErrors.find((err) => 
        err.message?.toLowerCase().includes('email') && 
        err.message?.toLowerCase().includes('taken')
      );
      
      if (duplicateError) {
        return json({
          success: true,
          alreadyExists: true,
          message: 'Welcome back! Check your email for your discount code.',
        });
      }
      
      return json({
        error: userErrors[0].message || 'Failed to create customer',
      }, {status: 400});
    }

    const customer = createResponse?.data?.customerCreate?.customer;
    
    if (!customer) {
      return json({
        error: 'Failed to create customer',
      }, {status: 500});
    }

    // Success!
    return json({
      success: true,
      customerId: customer.id,
      message: 'Check your email for your discount code!',
    });

  } catch (error) {
    console.error('Email capture error:', error);
    return json({
      error: 'An unexpected error occurred. Please try again.',
    }, {status: 500});
  }
}
