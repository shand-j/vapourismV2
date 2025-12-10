# Vapourism V2 Product Grouping Strategy

## Current System Analysis

### Tag Structure
The system uses structured tags with the format: `filter:group_key:value`

**Current Filter Groups:**
- `category` - Product categories (disposables, e-liquids, etc.)
- `bottle_size` - E-liquid bottle sizes (10ml, 30ml, etc.)
- `coil_style` - Coil types (mesh, regular, etc.)
- `device_style` - Device form factors 
- `function` - Device functionality
- `nicotine_type` - Freebase, nic salts, etc.
- `pack_size` - Multi-pack quantities
- `power_supply` - Battery/power types
- `puff_count` - Disposable puff counts
- `vaping_style` - MTL, DTL, etc.
- `vg_ratio` - VG/PG ratios
- `battery_capacity` - mAh ratings
- `pod_style` - Fill styles (top-fill, side-fill)
- `pod_style_type` - Coil styles for pods
- `e_liquid_capacity` - Tank/pod capacities
- `flavour_type` - Flavor categories
- `nicotine_strength` - Mg levels
- `promo` - Promotional tags
- `curation` - Curated product sets

### Navigation Structure
Current navigation expects these collection patterns:
- `disposable-vapes` (with children like `disposable-vapes-elf-bar`)
- `e-liquids` (with children like `e-liquids-fruit`)
- `vape-kits` (with children like `vape-kits-starter`)
- `accessories` (with children like `coils-smok`)
- `cbd` (with children like `cbd-oils`)

## Recommendations

### 1. Primary Collection Strategy

**Create Main Category Collections:**
```
disposable-vapes/
├── disposable-vapes-600-puff
├── disposable-vapes-2500-puff  
├── disposable-vapes-5000-puff
└── disposable-vapes-10000-puff

e-liquids/
├── e-liquids-nic-salts
├── e-liquids-freebase
├── e-liquids-shortfills
└── e-liquids-cbd

vape-kits/
├── vape-kits-starter
├── vape-kits-pod-systems
├── vape-kits-sub-ohm
└── vape-kits-squonk

accessories/
├── coils-replacement
├── pods-replacement  
├── batteries-18650
└── tanks-sub-ohm
```

### 2. Tag Implementation Strategy

**For Disposables:**
```
filter:category:disposable-vape
filter:puff_count:600
filter:puff_count:2500
filter:puff_count:5000
filter:puff_count:10000
filter:nicotine_strength:20mg
filter:nicotine_type:nic_salt
filter:flavour_type:fruit
filter:flavour_type:menthol
filter:flavour_type:dessert
```

**For E-liquids:**
```
filter:category:e-liquid
filter:nicotine_type:freebase
filter:nicotine_type:nic_salt
filter:bottle_size:10ml
filter:bottle_size:30ml
filter:bottle_size:100ml
filter:vg_ratio:50_50
filter:vg_ratio:70_30
filter:nicotine_strength:0mg
filter:nicotine_strength:3mg
filter:nicotine_strength:6mg
filter:nicotine_strength:20mg
```

**For Vape Kits:**
```
filter:category:vape-kit
filter:device_style:pod_system
filter:device_style:sub_ohm
filter:vaping_style:mtl
filter:vaping_style:dtl
filter:battery_capacity:1000mah
filter:battery_capacity:3000mah
filter:e_liquid_capacity:2ml
filter:e_liquid_capacity:5ml
```

### 3. Collection Rules

**Use Collections for:**
- Primary navigation (disposables, e-liquids, kits)
- Brand groupings (elf-bar, lost-mary, etc.)
- Curated experiences (starter-packs, best-sellers)
- Promotional groupings (sale, new-arrivals)

**Use Tags for:**
- Fine-grained filtering within collections
- Technical specifications
- Cross-category attributes (flavors, nicotine levels)
- Inventory management (availability, stock levels)

### 4. Example Product Tagging

**Elf Bar 600 Strawberry Ice:**
```
filter:category:disposable-vape
filter:puff_count:600
filter:nicotine_strength:20mg
filter:nicotine_type:nic_salt
filter:flavour_type:fruit
filter:flavour_type:menthol
filter:brand:elf_bar
```

**Dinner Lady 50ml Lemon Tart:**
```
filter:category:e-liquid
filter:nicotine_type:freebase
filter:bottle_size:50ml
filter:vg_ratio:70_30
filter:nicotine_strength:0mg
filter:flavour_type:dessert
filter:brand:dinner_lady
```

### 5. Implementation Priority

**Phase 1: Core Collections**
1. Create main category collections (disposables, e-liquids, kits, accessories)
2. Implement basic tag structure for filtering
3. Test navigation and filtering functionality

**Phase 2: Sub-Collections**
1. Add puff-count based disposable collections
2. Add nicotine-type based e-liquid collections
3. Add device-style based kit collections

**Phase 3: Advanced Features**
1. Brand-specific collections
2. Curated collections (starter packs, etc.)
3. Promotional collections

### 6. SEO Benefits

This structure provides:
- Clean URLs: `/collections/disposable-vapes-600-puff`
- Hierarchical navigation
- Faceted search within collections
- Brand-specific landing pages
- Targeted content opportunities

### 7. Technical Implementation

The current system supports this through:
- `fetchCollection()` with filtering
- `buildTagFacetGroups()` for faceted search
- Collection-based navigation in `CollectionsNav`
- URL-based filter state management

Would you like me to start implementing any specific part of this strategy?