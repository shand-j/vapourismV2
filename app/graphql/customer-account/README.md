# Customer Account GraphQL (V2)

V2 reuses the legacy customer account GraphQL documents that live in the root `app/graphql/customer-account` directory. The Hydrogen codegen config in this workspace (`/.graphqlrc.ts`) points to those files so we only have a single source of truth while we migrate.

This directory exists to satisfy tooling expectations (Hydrogen looks for `app/graphql/customer-account`), but the actual documents remain upstream until the account area is fully ported into V2.
