---
name: country-selector
description: A compact country selector component that displays a flag and dial code with a searchable dropdown for country selection
keywords: country, selector, flag, dial code, international, dropdown, search, phone
---

#### Country Selector

Properties:
- `initialCountry`: `string` - The default country to be selected (ISO 2-letter code). Default: `'us'`

Events:
- `change`: {value: object} - Triggered when a country is selected, returns the complete country object
- `initValueChange`: {value: object} - Triggered when the initial country changes externally

Actions:
- `setCountry`: Set the selected country. Args: country (string) - ISO 2-letter country code

Variables:
- `value`: object - The currently selected country object containing:
  - `code`: string - The country's ISO 2-letter code
  - `dial_code`: string - The country's international dial code (with + prefix)
  - `mask`: string - The phone number mask format without dial code
  - `flag`: string - URL to the country's flag image
  - `name`: string - The full country name

Special features:
- Compact design with maximum width of 130px
- Displays country flag and dial code in the selector
- Searchable dropdown for easy country selection
- Search by country name or dial code
- Returns complete country data object when a selection is made
- Supports all standard countries with proper formatting
