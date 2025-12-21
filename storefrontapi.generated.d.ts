/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type FeaturedShowcaseProductsQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FeaturedShowcaseProductsQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'vendor'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type NewArrivalsShowcaseProductsQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type NewArrivalsShowcaseProductsQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'vendor'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type BestSellersShowcaseProductsQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type BestSellersShowcaseProductsQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'vendor'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type CategoryHeroProductsQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
  metafieldQuery: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CategoryHeroProductsQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'vendor'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type FallbackFeaturedProductsQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FallbackFeaturedProductsQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'vendor'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type ProductCardFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'vendor'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'url' | 'altText'>
  >;
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
};

export type ProductsByVendorQueryVariables = StorefrontAPI.Exact<{
  vendor: StorefrontAPI.Scalars['String']['input'];
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type ProductsByVendorQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'vendor'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type ProductsByTypeQueryVariables = StorefrontAPI.Exact<{
  productType: StorefrontAPI.Scalars['String']['input'];
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type ProductsByTypeQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'vendor'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type ProductsByTagQueryVariables = StorefrontAPI.Exact<{
  tag: StorefrontAPI.Scalars['String']['input'];
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type ProductsByTagQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'vendor'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type PopularProductsQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type PopularProductsQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'vendor'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type PredictiveSearchQueryVariables = StorefrontAPI.Exact<{
  query: StorefrontAPI.Scalars['String']['input'];
  limit?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  types?: StorefrontAPI.InputMaybe<
    | Array<StorefrontAPI.PredictiveSearchType>
    | StorefrontAPI.PredictiveSearchType
  >;
}>;

export type PredictiveSearchQuery = {
  predictiveSearch?: StorefrontAPI.Maybe<{
    products: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'vendor'> & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        variants: {
          edges: Array<{
            node: Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>;
          }>;
        };
      }
    >;
    collections: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'>
    >;
    queries: Array<
      Pick<StorefrontAPI.SearchQuerySuggestion, 'text' | 'styledText'>
    >;
  }>;
};

export type SearchProductsQueryVariables = StorefrontAPI.Exact<{
  query: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  after?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.SearchSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
}>;

export type SearchProductsQuery = {
  search: Pick<StorefrontAPI.SearchResultItemConnection, 'totalCount'> & {
    edges: Array<{
      node: Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'handle'
        | 'vendor'
        | 'productType'
        | 'tags'
        | 'description'
        | 'availableForSale'
      > & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
      };
    }>;
    pageInfo: Pick<StorefrontAPI.PageInfo, 'hasNextPage' | 'endCursor'>;
  };
};

export type FacetDataQueryVariables = StorefrontAPI.Exact<{
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  after?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
}>;

export type FacetDataQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'vendor' | 'productType' | 'tags'>
    >;
    pageInfo: Pick<StorefrontAPI.PageInfo, 'hasNextPage' | 'endCursor'>;
  };
};

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartLineComponentFragment = Pick<
  StorefrontAPI.ComponentizableCartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  appliedGiftCards: Array<
    Pick<StorefrontAPI.AppliedGiftCard, 'lastCharacters'> & {
      amountUsed: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    }
  >;
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
        })
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
  discountAllocations: Array<{
    discountedAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
  }>;
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  headerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FooterQuery = {
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type ArticleFragment = Pick<
  StorefrontAPI.Article,
  | 'id'
  | 'title'
  | 'handle'
  | 'content'
  | 'contentHtml'
  | 'excerpt'
  | 'excerptHtml'
  | 'publishedAt'
  | 'tags'
> & {
  authorV2?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ArticleAuthor, 'name'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
  >;
  seo?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Seo, 'title' | 'description'>>;
  blog: Pick<StorefrontAPI.Blog, 'id' | 'handle' | 'title'>;
};

export type BlogQueryVariables = StorefrontAPI.Exact<{
  blogHandle: StorefrontAPI.Scalars['String']['input'];
}>;

export type BlogQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'id' | 'handle' | 'title'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'title' | 'description'>
      >;
    }
  >;
};

export type BlogArticlesQueryVariables = StorefrontAPI.Exact<{
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  after?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
}>;

export type BlogArticlesQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'id' | 'handle' | 'title'> & {
      articles: {
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
        >;
        edges: Array<
          Pick<StorefrontAPI.ArticleEdge, 'cursor'> & {
            node: Pick<
              StorefrontAPI.Article,
              | 'id'
              | 'title'
              | 'handle'
              | 'content'
              | 'contentHtml'
              | 'excerpt'
              | 'excerptHtml'
              | 'publishedAt'
              | 'tags'
            > & {
              authorV2?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ArticleAuthor, 'name'>
              >;
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              seo?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Seo, 'title' | 'description'>
              >;
              blog: Pick<StorefrontAPI.Blog, 'id' | 'handle' | 'title'>;
            };
          }
        >;
      };
    }
  >;
};

export type ArticleQueryVariables = StorefrontAPI.Exact<{
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  articleHandle: StorefrontAPI.Scalars['String']['input'];
}>;

export type ArticleQuery = {
  blog?: StorefrontAPI.Maybe<{
    articleByHandle?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Article,
        | 'id'
        | 'title'
        | 'handle'
        | 'content'
        | 'contentHtml'
        | 'excerpt'
        | 'excerptHtml'
        | 'publishedAt'
        | 'tags'
      > & {
        authorV2?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.ArticleAuthor, 'name'>
        >;
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'title' | 'description'>
        >;
        blog: Pick<StorefrontAPI.Blog, 'id' | 'handle' | 'title'>;
      }
    >;
  }>;
};

export type ShopInfoQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type ShopInfoQuery = {
  shop: Pick<StorefrontAPI.Shop, 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  };
};

export type StoreRobotsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type StoreRobotsQuery = {shop: Pick<StorefrontAPI.Shop, 'id'>};

export type ProductsCountQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type ProductsCountQuery = {
  products: {pageInfo: Pick<StorefrontAPI.PageInfo, 'hasNextPage'>};
};

export type AllProductHandlesQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
  after?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
}>;

export type AllProductHandlesQuery = {
  products: {
    pageInfo: Pick<StorefrontAPI.PageInfo, 'hasNextPage' | 'endCursor'>;
    nodes: Array<Pick<StorefrontAPI.Product, 'handle'>>;
  };
};

export type ContactHeaderQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type ContactHeaderQuery = {shop: Pick<StorefrontAPI.Shop, 'name'>};

export type ContactFooterQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type ContactFooterQuery = {shop: Pick<StorefrontAPI.Shop, 'name'>};

export type FaqHeaderQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type FaqHeaderQuery = {shop: Pick<StorefrontAPI.Shop, 'name'>};

export type FaqFooterQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type FaqFooterQuery = {shop: Pick<StorefrontAPI.Shop, 'name'>};

export type PageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Page, 'handle' | 'id' | 'title' | 'body'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'description' | 'title'>
      >;
    }
  >;
};

export type PolicyFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'body' | 'handle' | 'id' | 'title' | 'url'
>;

export type PolicyQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  privacyPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  refundPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  shippingPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  termsOfService: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type PolicyQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
  };
};

export type CookiePolicyHeaderQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type CookiePolicyHeaderQuery = {shop: Pick<StorefrontAPI.Shop, 'name'>};

export type CookiePolicyFooterQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type CookiePolicyFooterQuery = {shop: Pick<StorefrontAPI.Shop, 'name'>};

export type DeliveryInformationHeaderQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type DeliveryInformationHeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'name'>;
};

export type DeliveryInformationFooterQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type DeliveryInformationFooterQuery = {
  shop: Pick<StorefrontAPI.Shop, 'name'>;
};

export type PrivacyPolicyHeaderQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type PrivacyPolicyHeaderQuery = {shop: Pick<StorefrontAPI.Shop, 'name'>};

export type PrivacyPolicyFooterQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type PrivacyPolicyFooterQuery = {shop: Pick<StorefrontAPI.Shop, 'name'>};

export type ReturnsPolicyHeaderQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type ReturnsPolicyHeaderQuery = {shop: Pick<StorefrontAPI.Shop, 'name'>};

export type ReturnsPolicyFooterQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type ReturnsPolicyFooterQuery = {shop: Pick<StorefrontAPI.Shop, 'name'>};

export type TermsOfServiceHeaderQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type TermsOfServiceHeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'name'>;
};

export type TermsOfServiceFooterQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type TermsOfServiceFooterQuery = {
  shop: Pick<StorefrontAPI.Shop, 'name'>;
};

export type ProductsFeedQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
  after?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
}>;

export type ProductsFeedQuery = {
  products: {
    pageInfo: Pick<StorefrontAPI.PageInfo, 'hasNextPage' | 'endCursor'>;
    edges: Array<{
      node: Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'handle'
        | 'description'
        | 'vendor'
        | 'productType'
        | 'availableForSale'
      > & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
        variants: {
          edges: Array<{
            node: Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'sku' | 'barcode'
            > & {price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>};
          }>;
        };
      };
    }>;
  };
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'handle'
      | 'vendor'
      | 'description'
      | 'descriptionHtml'
      | 'productType'
      | 'tags'
      | 'availableForSale'
    > & {
      priceRange: {
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      compareAtPriceRange: {
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
      >;
      images: {
        edges: Array<{
          node: Pick<
            StorefrontAPI.Image,
            'url' | 'altText' | 'width' | 'height'
          >;
        }>;
      };
      variants: {
        edges: Array<{
          node: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'title' | 'availableForSale' | 'barcode' | 'sku'
          > & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
          };
        }>;
      };
      seo: Pick<StorefrontAPI.Seo, 'title' | 'description'>;
    }
  >;
};

export type ProductsSitemapQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
  after?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
}>;

export type ProductsSitemapQuery = {
  products: {
    pageInfo: Pick<StorefrontAPI.PageInfo, 'hasNextPage' | 'endCursor'>;
    nodes: Array<
      Pick<StorefrontAPI.Product, 'handle' | 'updatedAt' | 'availableForSale'>
    >;
  };
};

export type PagesSitemapQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
  after?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
}>;

export type PagesSitemapQuery = {
  pages: {
    pageInfo: Pick<StorefrontAPI.PageInfo, 'hasNextPage' | 'endCursor'>;
    nodes: Array<Pick<StorefrontAPI.Page, 'handle' | 'updatedAt'>>;
  };
};

interface GeneratedQueryTypes {
  '#graphql\n  query FeaturedShowcaseProducts(\n    $first: Int!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    products(\n      first: $first\n      sortKey: BEST_SELLING\n      query: "metafield:custom.showcase_featured:true"\n    ) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    handle\n    vendor\n    featuredImage {\n      url\n      altText\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n': {
    return: FeaturedShowcaseProductsQuery;
    variables: FeaturedShowcaseProductsQueryVariables;
  };
  '#graphql\n  query NewArrivalsShowcaseProducts(\n    $first: Int!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    products(\n      first: $first\n      sortKey: CREATED_AT\n      reverse: true\n      query: "metafield:custom.showcase_new_arrival:true"\n    ) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    handle\n    vendor\n    featuredImage {\n      url\n      altText\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n': {
    return: NewArrivalsShowcaseProductsQuery;
    variables: NewArrivalsShowcaseProductsQueryVariables;
  };
  '#graphql\n  query BestSellersShowcaseProducts(\n    $first: Int!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    products(\n      first: $first\n      sortKey: BEST_SELLING\n      query: "metafield:custom.showcase_best_seller:true"\n    ) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    handle\n    vendor\n    featuredImage {\n      url\n      altText\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n': {
    return: BestSellersShowcaseProductsQuery;
    variables: BestSellersShowcaseProductsQueryVariables;
  };
  '#graphql\n  query CategoryHeroProducts(\n    $first: Int!\n    $metafieldQuery: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    products(\n      first: $first\n      sortKey: BEST_SELLING\n      query: $metafieldQuery\n    ) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    handle\n    vendor\n    featuredImage {\n      url\n      altText\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n': {
    return: CategoryHeroProductsQuery;
    variables: CategoryHeroProductsQueryVariables;
  };
  '#graphql\n  query FallbackFeaturedProducts(\n    $first: Int!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    products(first: $first, sortKey: BEST_SELLING) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    handle\n    vendor\n    featuredImage {\n      url\n      altText\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n': {
    return: FallbackFeaturedProductsQuery;
    variables: FallbackFeaturedProductsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    handle\n    vendor\n    featuredImage {\n      url\n      altText\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  query ProductsByVendor($vendor: String!, $first: Int!) {\n    products(first: $first, query: $vendor) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n': {
    return: ProductsByVendorQuery;
    variables: ProductsByVendorQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    handle\n    vendor\n    featuredImage {\n      url\n      altText\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  query ProductsByType($productType: String!, $first: Int!) {\n    products(first: $first, query: $productType) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n': {
    return: ProductsByTypeQuery;
    variables: ProductsByTypeQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    handle\n    vendor\n    featuredImage {\n      url\n      altText\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  query ProductsByTag($tag: String!, $first: Int!) {\n    products(first: $first, query: $tag) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n': {
    return: ProductsByTagQuery;
    variables: ProductsByTagQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    handle\n    vendor\n    featuredImage {\n      url\n      altText\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  query PopularProducts($first: Int!) {\n    products(first: $first, sortKey: BEST_SELLING) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n': {
    return: PopularProductsQuery;
    variables: PopularProductsQueryVariables;
  };
  '#graphql\n  query PredictiveSearch(\n    $query: String!\n    $limit: Int\n    $types: [PredictiveSearchType!]\n  ) {\n    predictiveSearch(\n      query: $query\n      limit: $limit\n      limitScope: EACH\n      searchableFields: [TITLE, PRODUCT_TYPE, VARIANTS_TITLE, VENDOR, TAG]\n      types: $types\n      unavailableProducts: HIDE\n    ) {\n      products {\n        id\n        title\n        handle\n        vendor\n        priceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n        featuredImage {\n          url\n          altText\n        }\n        variants(first: 1) {\n          edges {\n            node {\n              id\n              availableForSale\n            }\n          }\n        }\n      }\n      collections {\n        id\n        title\n        handle\n      }\n      queries {\n        text\n        styledText\n      }\n    }\n  }\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
  '#graphql\n  query SearchProducts(\n    $query: String!\n    $first: Int\n    $after: String\n    $sortKey: SearchSortKeys\n    $reverse: Boolean\n  ) {\n    search(\n      query: $query\n      first: $first\n      after: $after\n      sortKey: $sortKey\n      reverse: $reverse\n      types: PRODUCT\n      unavailableProducts: HIDE\n    ) {\n      edges {\n        node {\n          ... on Product {\n            id\n            title\n            handle\n            vendor\n            productType\n            tags\n            description\n            priceRange {\n              minVariantPrice {\n                amount\n                currencyCode\n              }\n            }\n            featuredImage {\n              url(transform: {maxWidth: 500})\n              altText\n            }\n            availableForSale\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      totalCount\n    }\n  }\n': {
    return: SearchProductsQuery;
    variables: SearchProductsQueryVariables;
  };
  '#graphql\n    query FacetData($first: Int, $after: String) {\n      products(first: $first, after: $after) {\n        nodes {\n          id\n          vendor\n          productType\n          tags\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ': {
    return: FacetDataQuery;
    variables: FacetDataQueryVariables;
  };
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  query Header(\n    $country: CountryCode\n    $headerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      ...Shop\n    }\n    menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n  query Footer(\n    $country: CountryCode\n    $footerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n  query Blog($blogHandle: String!) {\n    blog(handle: $blogHandle) {\n      id\n      handle\n      title\n      seo {\n        title\n        description\n      }\n    }\n  }\n': {
    return: BlogQuery;
    variables: BlogQueryVariables;
  };
  '#graphql\n  query BlogArticles(\n    $blogHandle: String!\n    $first: Int\n    $after: String\n  ) {\n    blog(handle: $blogHandle) {\n      id\n      handle\n      title\n      articles(first: $first, after: $after) {\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n        edges {\n          cursor\n          node {\n            ...Article\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment Article on Article {\n    id\n    title\n    handle\n    content\n    contentHtml\n    excerpt\n    excerptHtml\n    publishedAt\n    authorV2 {\n      name\n    }\n    image {\n      url\n      altText\n      width\n      height\n    }\n    seo {\n      title\n      description\n    }\n    tags\n    blog {\n      id\n      handle\n      title\n    }\n  }\n\n': {
    return: BlogArticlesQuery;
    variables: BlogArticlesQueryVariables;
  };
  '#graphql\n  query Article($blogHandle: String!, $articleHandle: String!) {\n    blog(handle: $blogHandle) {\n      articleByHandle(handle: $articleHandle) {\n        ...Article\n      }\n    }\n  }\n  #graphql\n  fragment Article on Article {\n    id\n    title\n    handle\n    content\n    contentHtml\n    excerpt\n    excerptHtml\n    publishedAt\n    authorV2 {\n      name\n    }\n    image {\n      url\n      altText\n      width\n      height\n    }\n    seo {\n      title\n      description\n    }\n    tags\n    blog {\n      id\n      handle\n      title\n    }\n  }\n\n': {
    return: ArticleQuery;
    variables: ArticleQueryVariables;
  };
  '#graphql\n  query ShopInfo {\n    shop {\n      name\n      description\n      primaryDomain {\n        url\n      }\n    }\n  }\n': {
    return: ShopInfoQuery;
    variables: ShopInfoQueryVariables;
  };
  '#graphql\n  query StoreRobots($country: CountryCode, $language: LanguageCode)\n   @inContext(country: $country, language: $language) {\n    shop {\n      id\n    }\n  }\n': {
    return: StoreRobotsQuery;
    variables: StoreRobotsQueryVariables;
  };
  '#graphql\n  query ProductsCount {\n    products(first: 1) {\n      pageInfo {\n        hasNextPage\n      }\n    }\n  }\n': {
    return: ProductsCountQuery;
    variables: ProductsCountQueryVariables;
  };
  '#graphql\n  query AllProductHandles($first: Int!, $after: String) {\n    products(first: $first, after: $after) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      nodes {\n        handle\n      }\n    }\n  }\n': {
    return: AllProductHandlesQuery;
    variables: AllProductHandlesQueryVariables;
  };
  '#graphql\n      query ContactHeader {\n        shop {\n          name\n        }\n      }\n    ': {
    return: ContactHeaderQuery;
    variables: ContactHeaderQueryVariables;
  };
  '#graphql\n      query ContactFooter {\n        shop {\n          name\n        }\n      }\n    ': {
    return: ContactFooterQuery;
    variables: ContactFooterQueryVariables;
  };
  '#graphql\n      query FAQHeader {\n        shop {\n          name\n        }\n      }\n    ': {
    return: FAQHeaderQuery;
    variables: FAQHeaderQueryVariables;
  };
  '#graphql\n      query FAQFooter {\n        shop {\n          name\n        }\n      }\n    ': {
    return: FAQFooterQuery;
    variables: FAQFooterQueryVariables;
  };
  '#graphql\n  query Page(\n    $language: LanguageCode,\n    $country: CountryCode,\n    $handle: String!\n  )\n  @inContext(language: $language, country: $country) {\n    page(handle: $handle) {\n      handle\n      id\n      title\n      body\n      seo {\n        description\n        title\n      }\n    }\n  }\n': {
    return: PageQuery;
    variables: PageQueryVariables;
  };
  '#graphql\n  fragment Policy on ShopPolicy {\n    body\n    handle\n    id\n    title\n    url\n  }\n  query Policy(\n    $country: CountryCode\n    $language: LanguageCode\n    $privacyPolicy: Boolean!\n    $refundPolicy: Boolean!\n    $shippingPolicy: Boolean!\n    $termsOfService: Boolean!\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      privacyPolicy @include(if: $privacyPolicy) {\n        ...Policy\n      }\n      shippingPolicy @include(if: $shippingPolicy) {\n        ...Policy\n      }\n      termsOfService @include(if: $termsOfService) {\n        ...Policy\n      }\n      refundPolicy @include(if: $refundPolicy) {\n        ...Policy\n      }\n    }\n  }\n': {
    return: PolicyQuery;
    variables: PolicyQueryVariables;
  };
  '#graphql\n      query CookiePolicyHeader {\n        shop {\n          name\n        }\n      }\n    ': {
    return: CookiePolicyHeaderQuery;
    variables: CookiePolicyHeaderQueryVariables;
  };
  '#graphql\n      query CookiePolicyFooter {\n        shop {\n          name\n        }\n      }\n    ': {
    return: CookiePolicyFooterQuery;
    variables: CookiePolicyFooterQueryVariables;
  };
  '#graphql\n      query DeliveryInformationHeader {\n        shop {\n          name\n        }\n      }\n    ': {
    return: DeliveryInformationHeaderQuery;
    variables: DeliveryInformationHeaderQueryVariables;
  };
  '#graphql\n      query DeliveryInformationFooter {\n        shop {\n          name\n        }\n      }\n    ': {
    return: DeliveryInformationFooterQuery;
    variables: DeliveryInformationFooterQueryVariables;
  };
  '#graphql\n      query PrivacyPolicyHeader {\n        shop {\n          name\n        }\n      }\n    ': {
    return: PrivacyPolicyHeaderQuery;
    variables: PrivacyPolicyHeaderQueryVariables;
  };
  '#graphql\n      query PrivacyPolicyFooter {\n        shop {\n          name\n        }\n      }\n    ': {
    return: PrivacyPolicyFooterQuery;
    variables: PrivacyPolicyFooterQueryVariables;
  };
  '#graphql\n      query ReturnsPolicyHeader {\n        shop {\n          name\n        }\n      }\n    ': {
    return: ReturnsPolicyHeaderQuery;
    variables: ReturnsPolicyHeaderQueryVariables;
  };
  '#graphql\n      query ReturnsPolicyFooter {\n        shop {\n          name\n        }\n      }\n    ': {
    return: ReturnsPolicyFooterQuery;
    variables: ReturnsPolicyFooterQueryVariables;
  };
  '#graphql\n      query TermsOfServiceHeader {\n        shop {\n          name\n        }\n      }\n    ': {
    return: TermsOfServiceHeaderQuery;
    variables: TermsOfServiceHeaderQueryVariables;
  };
  '#graphql\n      query TermsOfServiceFooter {\n        shop {\n          name\n        }\n      }\n    ': {
    return: TermsOfServiceFooterQuery;
    variables: TermsOfServiceFooterQueryVariables;
  };
  '#graphql\n  query ProductsFeed($first: Int!, $after: String) {\n    products(first: $first, after: $after) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          id\n          title\n          handle\n          description\n          vendor\n          productType\n          availableForSale\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n          featuredImage {\n            url\n          }\n          variants(first: 1) {\n            edges {\n              node {\n                id\n                sku\n                barcode\n                price {\n                  amount\n                  currencyCode\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: ProductsFeedQuery;
    variables: ProductsFeedQueryVariables;
  };
  '#graphql\n  query Product($handle: String!) {\n    product(handle: $handle) {\n      id\n      title\n      handle\n      vendor\n      description\n      descriptionHtml\n      productType\n      tags\n      availableForSale\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n      compareAtPriceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n      featuredImage {\n        url\n        altText\n        width\n        height\n      }\n      images(first: 10) {\n        edges {\n          node {\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n      variants(first: 50) {\n        edges {\n          node {\n            id\n            title\n            availableForSale\n            barcode\n            sku\n            image {\n              url\n              altText\n              width\n              height\n            }\n            selectedOptions {\n              name\n              value\n            }\n            price {\n              amount\n              currencyCode\n            }\n            compareAtPrice {\n              amount\n              currencyCode\n            }\n          }\n        }\n      }\n      seo {\n        title\n        description\n      }\n    }\n  }\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  query ProductsSitemap($first: Int!, $after: String) {\n    products(first: $first, after: $after) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      nodes {\n        handle\n        updatedAt\n        availableForSale\n      }\n    }\n  }\n': {
    return: ProductsSitemapQuery;
    variables: ProductsSitemapQueryVariables;
  };
  '#graphql\n  query PagesSitemap($first: Int!, $after: String) {\n    pages(first: $first, after: $after) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      nodes {\n        handle\n        updatedAt\n      }\n    }\n  }\n': {
    return: PagesSitemapQuery;
    variables: PagesSitemapQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
