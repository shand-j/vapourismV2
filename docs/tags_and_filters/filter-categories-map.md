# 🗺️ Filter Categories & Options Map

## **Primary Filter Categories** (Data Analyst Priority)

### 1️⃣ **Product Type** (`category`)
- `e-liquid`
- `disposable`  
- `device`
- `pod_system`
- `box_mod`
- `tank`
- `coil`
- `accessory`

### 2️⃣ **Bottle Size** (`bottle_size`)
- `10ml`
- `50ml`
- `30ml`
- `100ml`
- `shortfill`

### 3️⃣ **Device Style** (`device_style`)
- `pen_style`
- `pod_style`
- `box_style`
- `stick_style`
- `compact`
- `mini`

### 4️⃣ **Nicotine Strength** (`nicotine_strength`)
- `20mg`
- `10mg`
- `0mg`
- `18mg`
- `12mg`
- `6mg`
- `3mg`

### 5️⃣ **Flavour Type** (`flavour_type`)
- `fruit`
- `ice`
- `sweet`
- `dessert`
- `menthol`
- `tobacco`
- `cool`

### 6️⃣ **Nicotine Type** (`nicotine_type`)
- `nic_salt`
- `freebase_nicotine`
- `nicotine_salt`
- `traditional_nicotine`

### 7️⃣ **Power Supply** (`power_supply`)
- `rechargeable`
- `internal_battery`
- `usb-c`
- `type-c`
- `removable_battery`

### 8️⃣ **VG Ratio** (`vg_ratio`)
- `50/50`
- `70/30`
- `high_vg`
- `max_vg`

### 9️⃣ **Vaping Style** (`vaping_style`)
- `mtl`
- `mouth_to_lung`
- `dtl`
- `direct_to_lung`

---

## **Additional Filter Categories**

### 🔟 **Brand** (`brand`)
- `elf_bar`
- `lost_mary`
- `geek_vape`
- `vaporesso`
- `smok`
- `dinner_lady`
- `vampire_vape`
- *(Plus other brands detected from product data)*

### 1️⃣1️⃣ **Promotions** (`promo`)
- `sale`
- `clearance`
- `new_arrival`
- `featured`
- `bundle_deal`

### 1️⃣2️⃣ **Curated Sets** (`curation`)
- `starter_kit`
- `advanced_setup`
- `beginner_friendly`
- `premium_collection`

---

## **Built-in System Filters**

### **Availability**
- `in-stock`
- `out-of-stock`

### **Price Range**
- Dynamic min/max values based on product data
- Currency formatting (GBP)

---

## **Filter Logic**

### **Within Categories** (OR Logic)
```
Flavour Type: [Fruit] OR [Ice] OR [Sweet]
→ Shows products with ANY of these flavors
```

### **Across Categories** (AND Logic)
```
Product Type: [E-liquid] AND Nicotine Strength: [20mg] AND Brand: [Vampire Vape]
→ Shows products matching ALL criteria
```

### **URL Persistence**
```
/search?q=Fruit&tag=filter:flavour_type:fruit&tag=filter:nicotine_strength:20mg
```

---

## **Tag Format**
All filter tags follow the format: `filter:group_key:value`

**Examples:**
- `filter:category:disposable`
- `filter:nicotine_strength:20mg`
- `filter:flavour_type:fruit`
- `filter:brand:elf_bar`