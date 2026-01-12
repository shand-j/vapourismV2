const brands = [
  "4NX", "77", "Aroma King", "Artic7", "CLEW", "CUBA", "Camo", "Candys",
  "Crown", "EGP", "EOS", "FEDRS", "FUMI", "Garant", "Ghost", "Gilo",
  "Glitch", "Greatest", "HELWIT", "IGNITE", "Ice", "Iceberg", "Kelly White",
  "Kingston", "Kurwa", "MI3", "Mafia", "Maggie", "Max Kick", "Morko",
  "Muse", "NOIS", "NOR", "Nic Nac", "Nordic Spirit", "On!", "Poke",
  "Puff & Pouch", "SYKE", "Snoose", "Stripe", "Tick Tock", "Übbs",
  "V&YOU", "VITO", "Vapes Bars", "Velo", "Wham", "Zeus"
];

// GraphQL mutation for creating a smart collection
const createCollectionMutation = `
mutation collectionCreate($input: CollectionInput!) {
  collectionCreate(input: $input) {
    collection {
      id
      title
      handle
      ruleSet {
        rules {
          column
          condition
          relation
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
`;

// Generate the input for each brand
brands.forEach((brand, index) => {
  const handle = brand
    .toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[!]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  const input = {
    title: brand,
    handle: handle,
    descriptionHtml: `<p>Shop all ${brand} nicotine pouches. Premium quality tobacco-free pouches from ${brand}.</p>`,
    ruleSet: {
      appliedDisjunctively: false,
      rules: [
        {
          column: "VENDOR",
          relation: "EQUALS",
          condition: brand
        }
      ]
    }
  };
  
  console.log(`--- Collection ${index + 1}: ${brand} ---`);
  console.log(JSON.stringify({ input }, null, 2));
  console.log('');
});

console.log('Total collections to create:', brands.length);
