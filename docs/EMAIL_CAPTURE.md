# Email Capture Feature - 10% Discount Offer

## Overview
This feature implements a GDPR-compliant email capture system with a 10% discount offer for first-time customers. The implementation includes multiple trigger points and integrates directly with Shopify's customer management system.

## Features

### Core Components

1. **EmailCapturePopup** (`app/components/EmailCapturePopup.tsx`)
   - Modal popup for email capture
   - GDPR-compliant marketing consent checkbox (optional, unticked by default)
   - Success state with confirmation message
   - Tracks if popup has been shown via localStorage
   - 365-day cookie expiry

2. **EmailCaptureCTA** (`app/components/EmailCaptureCTA.tsx`)
   - Inline call-to-action component for blog posts
   - Same GDPR compliance as popup
   - Styled to match blog design system
   - Success state handling

3. **useEmailCapturePopup Hook** (`app/lib/hooks/useEmailCapturePopup.ts`)
   - Manages popup triggers:
     - Exit intent (mouse leaving viewport)
     - Timer-based (default 30 seconds)
     - Immediate display (for search page)
   - Respects "already shown" cookie
   - Tracks analytics events

4. **API Route** (`app/routes/api.email-capture.tsx`)
   - Creates customers in Shopify via Admin API
   - Checks for existing customers before creation
   - Adds customer tags:
     - `email_capture_10_discount` - for discount eligibility
     - `marketing_consent` - if user opts in
     - `capture_trigger:{trigger}` - tracks acquisition source
   - Handles marketing consent preferences

## Integration Points

### Blog Posts
- CTA component added to `app/routes/blog.$slug.tsx`
- Displays after article content, before tags section
- Inline form submission with success state

### Search Page
- Popup displays immediately on landing (`app/routes/search.tsx`)
- Trigger: `search`

### Global (All Pages)
- Added to root layout (`app/root.tsx`)
- Triggers:
  - Exit intent: Activated when mouse leaves top of viewport
  - Timer: Shows after 30 seconds on site
- Does not display on search page (to avoid double popup)

## GDPR Compliance

### Email Subscription
- **All customers are set to SUBSCRIBED** in Shopify when they submit their email
- This allows sending the discount code and transactional emails
- This is a business requirement to deliver the promised 10% discount

### Marketing Consent
- Checkbox is **optional** and **unticked by default**
- Clear labeling: "I'd like to receive marketing emails..."
- User can submit without accepting marketing
- Consent preference stored via `marketing_consent` customer tag
- Tag is used to segment marketing campaigns (only users with tag receive promotional emails)

### Privacy
- Minimal data collection (email only)
- Clear privacy notice with link to Privacy Policy
- 365-day cookie expiry for "already shown" tracking
- Cookie can be cleared by user

### User Control
- X button to close/dismiss popup
- "Only shown once" guarantee via cookie
- Success message confirms action taken

## Customer Flow

1. **New Customer**
   - User enters email
   - Optionally checks marketing consent
   - Submits form
   - API creates Shopify customer with:
     - Email subscription: **SUBSCRIBED** (always, to send discount code)
     - Tags: `email_capture_10_discount` (always), `marketing_consent` (if checked)
   - Success message with "Check your inbox" prompt
   - Popup marked as shown (won't appear again for 365 days)

2. **Existing Customer**
   - User enters email
   - API checks for existing customer
   - If found:
     - Sets email subscription to **SUBSCRIBED** (to send discount code)
     - Adds discount tag if not already present
     - Adds marketing consent tag if user checked the box
   - Same success message as new customer
   - Graceful handling (no "already exists" error shown to user)

## Technical Details

### Storage
- **Key**: `vapourism_email_capture_shown`
- **Location**: localStorage
- **Structure**:
  ```json
  {
    "timestamp": "2024-01-03T23:00:00.000Z",
    "shown": true
  }
  ```
- **Expiry**: 365 days from timestamp

### Analytics Tracking
All events tracked via Google Analytics 4:
- `email_capture_view` - When popup is displayed
- `email_capture_success` - Successful submission
- `email_capture_existing` - Existing customer resubmission
- `email_capture_dismissed` - User closes without submitting

Event parameters:
- `trigger`: Source of popup display (exit/timer/search/blog_cta)
- `marketing_consent`: Boolean indicating consent status

### Shopify Integration

#### Customer Creation
Uses Shopify Admin API GraphQL mutations:
- `customerCreate` - For new customers
- `customerUpdate` - To add tags to existing customers

#### Required Environment Variables
- `PUBLIC_STORE_DOMAIN` - Shopify store domain
- `SHOPIFY_ADMIN_TOKEN` or `PRIVATE_SHOPIFY_ADMIN_TOKEN` - Admin API access token

#### Customer Tags
- `email_capture_10_discount` - Main discount eligibility tag
- `marketing_consent` - Indicates user opted into marketing
- `capture_trigger:{trigger}` - Source tracking (e.g., `capture_trigger:search`)

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Semantic HTML structure

## Testing

### Unit Tests
Located in `tests/unit/email-capture.test.ts`:
- Storage persistence and expiry
- Corrupted data handling
- Email validation
- Cookie lifecycle

Run tests:
```bash
npm test -- tests/unit/email-capture.test.ts
```

### Manual Testing Checklist
- [ ] Popup displays on exit intent
- [ ] Popup displays after 30 seconds
- [ ] Popup displays on search page landing
- [ ] Blog CTA displays and functions correctly
- [ ] Only shows once per 365 days
- [ ] Marketing checkbox defaults to unticked
- [ ] Marketing checkbox is optional
- [ ] Form validation works
- [ ] Success state displays correctly
- [ ] Customer creation in Shopify works
- [ ] Existing customer handling works
- [ ] Tags applied correctly
- [ ] Analytics events fire
- [ ] Mobile responsive
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

## Future Enhancements

1. **Discount Code Automation**
   - Auto-generate unique discount codes
   - Email delivery via Shopify Flow or external service
   - Code expiry management

2. **A/B Testing**
   - Test different trigger timings
   - Test different copy variations
   - Measure conversion rates

3. **Advanced Targeting**
   - Segment by page type
   - Exclude certain user segments
   - Cart value thresholds

4. **Email Service Integration**
   - Klaviyo integration for email campaigns
   - Welcome series automation
   - Abandoned cart recovery

## Maintenance

### Monitoring
- Track conversion rate in Analytics
- Monitor API errors in server logs
- Check Shopify customer creation success rate

### Updates
- Review trigger timing based on user behavior
- Update copy based on performance
- Adjust cookie expiry as needed

## Support

For issues or questions:
1. Check Shopify Admin API logs
2. Verify environment variables are set
3. Check browser console for client-side errors
4. Review Analytics events for tracking issues

## Dependencies

- `lucide-react` - Icon library for UI elements
- `@shopify/remix-oxygen` - Remix framework for route handling
- Shopify Admin API - Customer management
- Google Analytics 4 - Event tracking
