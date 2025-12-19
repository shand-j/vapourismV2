/**
 * Tests for Structured Data Utilities
 * Testing schema generation functions for FAQ, ItemList, CollectionPage, and AboutPage
 */

import {describe, it, expect} from 'vitest';
import {
  generateFAQSchema,
  generateItemListSchema,
  generateCollectionPageSchema,
  generateAboutPageSchema,
  type FAQItem,
  type ItemListProduct,
} from '../../app/lib/structured-data';

describe('generateFAQSchema', () => {
  it('should generate valid FAQPage schema with single FAQ', () => {
    const faqs: FAQItem[] = [
      {
        question: 'What is CBD?',
        answer: 'CBD is a natural compound found in hemp plants.',
      },
    ];

    const schema = generateFAQSchema(faqs);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0]['@type']).toBe('Question');
    expect(schema.mainEntity[0].name).toBe('What is CBD?');
    expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe(
      'CBD is a natural compound found in hemp plants.'
    );
  });

  it('should generate valid FAQPage schema with multiple FAQs', () => {
    const faqs: FAQItem[] = [
      {
        question: 'What is CBD?',
        answer: 'CBD is a natural compound found in hemp plants.',
      },
      {
        question: 'Is CBD legal in the UK?',
        answer: 'Yes, CBD is legal in the UK when it contains less than 0.2% THC.',
      },
      {
        question: 'How do I use CBD oil?',
        answer: 'CBD oil can be taken sublingually or added to food and drinks.',
      },
    ];

    const schema = generateFAQSchema(faqs);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(3);
    
    // Verify all questions are included
    schema.mainEntity.forEach((entity, index) => {
      expect(entity['@type']).toBe('Question');
      expect(entity.name).toBe(faqs[index].question);
      expect(entity.acceptedAnswer['@type']).toBe('Answer');
      expect(entity.acceptedAnswer.text).toBe(faqs[index].answer);
    });
  });

  it('should handle empty FAQ array', () => {
    const faqs: FAQItem[] = [];
    const schema = generateFAQSchema(faqs);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(0);
  });

  it('should handle FAQs with special characters', () => {
    const faqs: FAQItem[] = [
      {
        question: 'What\'s the difference between "Full Spectrum" & "Broad Spectrum"?',
        answer: 'Full Spectrum contains <0.2% THC, while Broad Spectrum contains 0% THC.',
      },
    ];

    const schema = generateFAQSchema(faqs);

    expect(schema.mainEntity[0].name).toContain('Full Spectrum');
    expect(schema.mainEntity[0].acceptedAnswer.text).toContain('<0.2% THC');
  });
});

describe('generateItemListSchema', () => {
  it('should generate valid ItemList schema with minimal product data', () => {
    const items: ItemListProduct[] = [
      {
        name: 'CBD Oil 1000mg',
        url: 'https://www.vapourism.co.uk/products/cbd-oil-1000mg',
      },
      {
        name: 'CBD Gummies',
        url: 'https://www.vapourism.co.uk/products/cbd-gummies',
      },
    ];

    const schema = generateItemListSchema({
      name: 'CBD Products',
      items,
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('ItemList');
    expect(schema.name).toBe('CBD Products');
    expect(schema.numberOfItems).toBe(2);
    expect(schema.itemListElement).toHaveLength(2);
    
    // Verify first item
    expect(schema.itemListElement[0]['@type']).toBe('ListItem');
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[0].item['@type']).toBe('Product');
    expect(schema.itemListElement[0].item.name).toBe('CBD Oil 1000mg');
    expect(schema.itemListElement[0].item.url).toBe(
      'https://www.vapourism.co.uk/products/cbd-oil-1000mg'
    );
  });

  it('should generate ItemList schema with full product data', () => {
    const items: ItemListProduct[] = [
      {
        name: 'CBD Oil 1000mg',
        url: 'https://www.vapourism.co.uk/products/cbd-oil-1000mg',
        image: 'https://www.vapourism.co.uk/images/cbd-oil.jpg',
        description: 'Premium full spectrum CBD oil',
        price: '29.99',
        priceCurrency: 'GBP',
      },
    ];

    const schema = generateItemListSchema({
      name: 'Premium CBD Products',
      description: 'Our collection of premium CBD products',
      items,
    });

    expect(schema.name).toBe('Premium CBD Products');
    expect(schema.description).toBe('Our collection of premium CBD products');
    expect(schema.numberOfItems).toBe(1);
    
    const item = schema.itemListElement[0].item;
    expect(item.image).toBe('https://www.vapourism.co.uk/images/cbd-oil.jpg');
    expect(item.description).toBe('Premium full spectrum CBD oil');
    expect(item.offers).toBeDefined();
    expect(item.offers['@type']).toBe('Offer');
    expect(item.offers.price).toBe('29.99');
    expect(item.offers.priceCurrency).toBe('GBP');
  });

  it('should omit optional fields when not provided', () => {
    const items: ItemListProduct[] = [
      {
        name: 'CBD Oil',
        url: 'https://www.vapourism.co.uk/products/cbd-oil',
      },
    ];

    const schema = generateItemListSchema({
      name: 'Products',
      items,
    });

    const item = schema.itemListElement[0].item;
    expect(item.image).toBeUndefined();
    expect(item.description).toBeUndefined();
    expect(item.offers).toBeUndefined();
  });

  it('should handle empty items array', () => {
    const schema = generateItemListSchema({
      name: 'Empty Collection',
      items: [],
    });

    expect(schema.numberOfItems).toBe(0);
    expect(schema.itemListElement).toHaveLength(0);
  });

  it('should correctly position items in list', () => {
    const items: ItemListProduct[] = [
      { name: 'Product 1', url: '/p1' },
      { name: 'Product 2', url: '/p2' },
      { name: 'Product 3', url: '/p3' },
    ];

    const schema = generateItemListSchema({
      name: 'Test Products',
      items,
    });

    schema.itemListElement.forEach((element, index) => {
      expect(element.position).toBe(index + 1);
      expect(element.item.name).toBe(`Product ${index + 1}`);
    });
  });

  it('should not include offers when price is missing', () => {
    const items: ItemListProduct[] = [
      {
        name: 'Product',
        url: '/product',
        priceCurrency: 'GBP',
      },
    ];

    const schema = generateItemListSchema({
      name: 'Products',
      items,
    });

    expect(schema.itemListElement[0].item.offers).toBeUndefined();
  });

  it('should not include offers when priceCurrency is missing', () => {
    const items: ItemListProduct[] = [
      {
        name: 'Product',
        url: '/product',
        price: '29.99',
      },
    ];

    const schema = generateItemListSchema({
      name: 'Products',
      items,
    });

    expect(schema.itemListElement[0].item.offers).toBeUndefined();
  });
});

describe('generateCollectionPageSchema', () => {
  it('should generate valid CollectionPage schema', () => {
    const schema = generateCollectionPageSchema({
      name: 'CBD Oils',
      description: 'Premium CBD oil products',
      url: 'https://www.vapourism.co.uk/collections/cbd-oils',
      numberOfItems: 24,
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('CollectionPage');
    expect(schema.name).toBe('CBD Oils');
    expect(schema.description).toBe('Premium CBD oil products');
    expect(schema.url).toBe('https://www.vapourism.co.uk/collections/cbd-oils');
    expect(schema.mainEntity['@type']).toBe('ItemList');
    expect(schema.mainEntity.name).toBe('CBD Oils');
    expect(schema.mainEntity.description).toBe('Premium CBD oil products');
    expect(schema.mainEntity.numberOfItems).toBe(24);
  });

  it('should handle zero items in collection', () => {
    const schema = generateCollectionPageSchema({
      name: 'Empty Collection',
      description: 'No products yet',
      url: 'https://www.vapourism.co.uk/collections/empty',
      numberOfItems: 0,
    });

    expect(schema.mainEntity.numberOfItems).toBe(0);
  });

  it('should handle large collections', () => {
    const schema = generateCollectionPageSchema({
      name: 'All Vape Products',
      description: 'Complete range of vaping products',
      url: 'https://www.vapourism.co.uk/collections/all-vape',
      numberOfItems: 500,
    });

    expect(schema.mainEntity.numberOfItems).toBe(500);
  });

  it('should maintain consistency between page and mainEntity properties', () => {
    const params = {
      name: 'CBD Edibles',
      description: 'Delicious CBD-infused treats',
      url: 'https://www.vapourism.co.uk/collections/edibles',
      numberOfItems: 12,
    };

    const schema = generateCollectionPageSchema(params);

    // Page level properties
    expect(schema.name).toBe(params.name);
    expect(schema.description).toBe(params.description);
    expect(schema.url).toBe(params.url);
    
    // MainEntity should have same name and description
    expect(schema.mainEntity.name).toBe(params.name);
    expect(schema.mainEntity.description).toBe(params.description);
    expect(schema.mainEntity.numberOfItems).toBe(params.numberOfItems);
  });
});

describe('generateAboutPageSchema', () => {
  it('should generate valid AboutPage schema with minimal data', () => {
    const schema = generateAboutPageSchema({
      name: 'Vapourism',
      description: 'Leading UK retailer of CBD and vaping products',
      url: 'https://www.vapourism.co.uk/about',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('AboutPage');
    expect(schema.name).toBe('Vapourism');
    expect(schema.description).toBe('Leading UK retailer of CBD and vaping products');
    expect(schema.url).toBe('https://www.vapourism.co.uk/about');
    expect(schema.mainEntity['@type']).toBe('Organization');
    expect(schema.mainEntity.name).toBe('Vapourism');
  });

  it('should include founding date when provided', () => {
    const schema = generateAboutPageSchema({
      name: 'Vapourism',
      description: 'Leading UK retailer',
      url: 'https://www.vapourism.co.uk/about',
      foundingDate: '2015-01-01',
    });

    expect(schema.mainEntity.foundingDate).toBe('2015-01-01');
  });

  it('should include founders when provided', () => {
    const schema = generateAboutPageSchema({
      name: 'Vapourism',
      description: 'Leading UK retailer',
      url: 'https://www.vapourism.co.uk/about',
      founders: ['John Smith', 'Jane Doe'],
    });

    expect(schema.mainEntity.founders).toBeDefined();
    expect(schema.mainEntity.founders).toHaveLength(2);
    expect(schema.mainEntity.founders[0]['@type']).toBe('Person');
    expect(schema.mainEntity.founders[0].name).toBe('John Smith');
    expect(schema.mainEntity.founders[1]['@type']).toBe('Person');
    expect(schema.mainEntity.founders[1].name).toBe('Jane Doe');
  });

  it('should include both founding date and founders', () => {
    const schema = generateAboutPageSchema({
      name: 'Vapourism',
      description: 'Leading UK retailer',
      url: 'https://www.vapourism.co.uk/about',
      foundingDate: '2015-01-01',
      founders: ['John Smith'],
    });

    expect(schema.mainEntity.foundingDate).toBe('2015-01-01');
    expect(schema.mainEntity.founders).toBeDefined();
    expect(schema.mainEntity.founders).toHaveLength(1);
  });

  it('should not include founders property when array is empty', () => {
    const schema = generateAboutPageSchema({
      name: 'Vapourism',
      description: 'Leading UK retailer',
      url: 'https://www.vapourism.co.uk/about',
      founders: [],
    });

    expect(schema.mainEntity.founders).toBeUndefined();
  });

  it('should not include founding date when not provided', () => {
    const schema = generateAboutPageSchema({
      name: 'Vapourism',
      description: 'Leading UK retailer',
      url: 'https://www.vapourism.co.uk/about',
    });

    expect(schema.mainEntity.foundingDate).toBeUndefined();
  });

  it('should handle single founder', () => {
    const schema = generateAboutPageSchema({
      name: 'Vapourism',
      description: 'Leading UK retailer',
      url: 'https://www.vapourism.co.uk/about',
      founders: ['John Smith'],
    });

    expect(schema.mainEntity.founders).toHaveLength(1);
    expect(schema.mainEntity.founders[0].name).toBe('John Smith');
  });

  it('should handle multiple founders correctly', () => {
    const founders = ['Alice', 'Bob', 'Charlie', 'Diana'];
    const schema = generateAboutPageSchema({
      name: 'Company',
      description: 'Description',
      url: 'https://example.com/about',
      founders,
    });

    expect(schema.mainEntity.founders).toHaveLength(4);
    founders.forEach((founder, index) => {
      expect(schema.mainEntity.founders[index]['@type']).toBe('Person');
      expect(schema.mainEntity.founders[index].name).toBe(founder);
    });
  });
});

describe('Schema validity', () => {
  it('all schemas should have required @context and @type', () => {
    const faqSchema = generateFAQSchema([
      { question: 'Q?', answer: 'A.' },
    ]);
    expect(faqSchema['@context']).toBe('https://schema.org');
    expect(faqSchema['@type']).toBeTruthy();

    const itemListSchema = generateItemListSchema({
      name: 'List',
      items: [{ name: 'Item', url: '/item' }],
    });
    expect(itemListSchema['@context']).toBe('https://schema.org');
    expect(itemListSchema['@type']).toBeTruthy();

    const collectionSchema = generateCollectionPageSchema({
      name: 'Collection',
      description: 'Desc',
      url: '/collection',
      numberOfItems: 1,
    });
    expect(collectionSchema['@context']).toBe('https://schema.org');
    expect(collectionSchema['@type']).toBeTruthy();

    const aboutSchema = generateAboutPageSchema({
      name: 'About',
      description: 'Desc',
      url: '/about',
    });
    expect(aboutSchema['@context']).toBe('https://schema.org');
    expect(aboutSchema['@type']).toBeTruthy();
  });

  it('schemas should be JSON serializable', () => {
    const schemas = [
      generateFAQSchema([{ question: 'Q?', answer: 'A.' }]),
      generateItemListSchema({
        name: 'List',
        items: [{ name: 'Item', url: '/item' }],
      }),
      generateCollectionPageSchema({
        name: 'Collection',
        description: 'Desc',
        url: '/collection',
        numberOfItems: 1,
      }),
      generateAboutPageSchema({
        name: 'About',
        description: 'Desc',
        url: '/about',
      }),
    ];

    schemas.forEach((schema) => {
      expect(() => JSON.stringify(schema)).not.toThrow();
      const serialized = JSON.stringify(schema);
      expect(serialized).toBeTruthy();
      expect(serialized.length).toBeGreaterThan(0);
    });
  });
});
