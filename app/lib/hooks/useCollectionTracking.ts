/**
 * useCollectionTracking Hook
 * 
 * Tracks GA4 view_item_list events for collection pages
 */

import {useEffect} from 'react';
import {trackViewItemList, shopifyProductToGA4Item} from '../analytics';

interface CollectionProduct {
  id: string;
  title: string;
  vendor?: string;
  productType?: string;
  priceRange?: {
    minVariantPrice?: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface UseCollectionTrackingOptions {
  products: CollectionProduct[];
  listId: string;
  listName: string;
}

/**
 * Track collection page view with GA4 item list event
 * 
 * @param products - Array of products in the collection
 * @param listId - Unique identifier for the collection (e.g., 'collection_hayati_pro_ultra')
 * @param listName - Human-readable collection name (e.g., 'Hayati Pro Ultra Collection')
 */
export function useCollectionTracking({
  products,
  listId,
  listName,
}: UseCollectionTrackingOptions): void {
  useEffect(() => {
    if (products.length > 0) {
      const ga4Items = products.map(product =>
        shopifyProductToGA4Item({
          id: product.id,
          title: product.title,
          vendor: product.vendor,
          productType: product.productType,
          price: product.priceRange?.minVariantPrice,
        })
      );

      trackViewItemList(ga4Items, listId, listName);
    }
  }, [products, listId, listName]);
}
