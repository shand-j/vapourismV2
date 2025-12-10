# Product Tagging Reference - Data Analyst Requirements

## Tag Structure Format
All tags must follow: `filter:group_key:value`

## Filter Categories by Priority

### 📂 CATEGORY (Product Types)
**Tag Format:** `filter:category:value`

**Required Values:**
- `filter:category:e-liquid` (680+ products)
- `filter:category:disposable` (450+ products)  
- `filter:category:device` (400+ products)
- `filter:category:pod_system` (300+ products)
- `filter:category:box_mod` (150+ products)
- `filter:category:tank` (120+ products)
- `filter:category:coil` (100+ products)
- `filter:category:accessory` (80+ products)

### 📂 BOTTLE_SIZE
**Tag Format:** `filter:bottle_size:value`

**Required Values:**
- `filter:bottle_size:10ml` (520+ products)
- `filter:bottle_size:50ml` (180+ products)
- `filter:bottle_size:30ml` (120+ products)
- `filter:bottle_size:100ml` (90+ products)
- `filter:bottle_size:shortfill` (150+ products)

### 📂 DEVICE_STYLE  
**Tag Format:** `filter:device_style:value`

**Required Values:**
- `filter:device_style:pen_style` (280+ products)
- `filter:device_style:pod_style` (250+ products)
- `filter:device_style:box_style` (180+ products)
- `filter:device_style:stick_style` (160+ products)
- `filter:device_style:compact` (140+ products)
- `filter:device_style:mini` (80+ products)

### 📂 NICOTINE_STRENGTH
**Tag Format:** `filter:nicotine_strength:value`

**Required Values:**
- `filter:nicotine_strength:20mg` (340+ products)
- `filter:nicotine_strength:10mg` (280+ products)
- `filter:nicotine_strength:0mg` (260+ products)
- `filter:nicotine_strength:18mg` (180+ products)
- `filter:nicotine_strength:12mg` (150+ products)
- `filter:nicotine_strength:6mg` (120+ products)
- `filter:nicotine_strength:3mg` (80+ products)

### 📂 FLAVOUR_TYPE
**Tag Format:** `filter:flavour_type:value`

**Required Values:**
- `filter:flavour_type:fruit` (420+ products)
- `filter:flavour_type:ice` (380+ products)
- `filter:flavour_type:sweet` (320+ products)
- `filter:flavour_type:dessert` (280+ products)
- `filter:flavour_type:menthol` (240+ products)
- `filter:flavour_type:tobacco` (180+ products)
- `filter:flavour_type:cool` (160+ products)

### 📂 NICOTINE_TYPE
**Tag Format:** `filter:nicotine_type:value`

**Required Values:**
- `filter:nicotine_type:nic_salt` (450+ products)
- `filter:nicotine_type:freebase_nicotine` (380+ products)
- `filter:nicotine_type:nicotine_salt` (320+ products)
- `filter:nicotine_type:traditional_nicotine` (180+ products)

### 📂 POWER_SUPPLY
**Tag Format:** `filter:power_supply:value`

**Required Values:**
- `filter:power_supply:rechargeable` (280+ products)
- `filter:power_supply:internal_battery` (180+ products)
- `filter:power_supply:usb-c` (120+ products)
- `filter:power_supply:type-c` (100+ products)
- `filter:power_supply:removable_battery` (80+ products)

### 📂 VG_RATIO
**Tag Format:** `filter:vg_ratio:value`

**Required Values:**
- `filter:vg_ratio:50/50` (420+ products)
- `filter:vg_ratio:70/30` (280+ products)
- `filter:vg_ratio:high_vg` (180+ products)
- `filter:vg_ratio:max_vg` (120+ products)

### 📂 VAPING_STYLE
**Tag Format:** `filter:vaping_style:value`

**Required Values:**
- `filter:vaping_style:mtl` (320+ products)
- `filter:vaping_style:dtl` (180+ products)
- `filter:vaping_style:mouth_to_lung` (280+ products)
- `filter:vaping_style:direct_to_lung` (160+ products)

### 📂 BRAND (Additional)
**Tag Format:** `filter:brand:value`

**Common Values:**
- `filter:brand:elf_bar`
- `filter:brand:lost_mary`
- `filter:brand:geek_vape`
- `filter:brand:vaporesso`
- `filter:brand:smok`
- `filter:brand:dinner_lady`
- `filter:brand:vampire_vape`

## Example Product Tagging

### Disposable Vape Example
**Product:** Elf Bar 600 Blue Razz Lemonade
```
filter:category:disposable
filter:nicotine_strength:20mg
filter:nicotine_type:nic_salt
filter:flavour_type:fruit
filter:flavour_type:ice
filter:power_supply:rechargeable
filter:brand:elf_bar
```

### E-Liquid Example  
**Product:** Vampire Vape Heisenberg 10ml
```
filter:category:e-liquid
filter:bottle_size:10ml
filter:nicotine_strength:20mg
filter:nicotine_type:nic_salt
filter:vg_ratio:50/50
filter:flavour_type:menthol
filter:flavour_type:cool
filter:brand:vampire_vape
```

### Pod System Example
**Product:** Vaporesso XROS 3 Pod Kit
```
filter:category:pod_system
filter:device_style:pod_style
filter:vaping_style:mtl
filter:power_supply:usb-c
filter:brand:vaporesso
```

## Multiple Selection Logic (AND Queries)

When multiple filters are selected, they form AND queries:

**Example URL:** `/collections/e-liquids?tag=filter:nicotine_strength:20mg&tag=filter:flavour_type:fruit&tag=filter:brand:vampire_vape`

**Result:** Products that are:
- 20mg nicotine strength
- AND fruit flavour
- AND Vampire Vape brand

## Implementation Notes

1. **Consistent Formatting:** Use underscores for multi-word values (`nic_salt`, `freebase_nicotine`)
2. **Case Sensitivity:** All tag values should be lowercase
3. **Product Count Validation:** Expected product counts provided by Data Analyst
4. **Filter Persistence:** Selected filters persist in URL for sharing/bookmarking
5. **Performance:** System supports up to ~50 simultaneous filter combinations
6. **Brand Filter UI:** Displays as dropdown when >10 options, individual checkboxes when ≤10 options

## Testing Checklist

- [ ] All 9 filter categories appear in faceted search
- [ ] Multiple selections within categories work (OR logic)
- [ ] Multiple selections across categories work (AND logic)
- [ ] Filter counts match expected product volumes
- [ ] URL state updates correctly with selections
- [ ] Mobile filter dialog shows all categories
- [ ] Clear filters functionality works
- [ ] Page loads remain under 500ms with filters applied