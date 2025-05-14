<template>
  <div class="country-selector" :class="{ 'is-open': isDropdownOpen }">
    <div 
      class="selected-country" 
      @click="toggleDropdown"
      ref="selectedCountryRef"
    >
      <div class="flag-container">
        <img v-if="selectedCountry?.flag" :src="selectedCountry?.flag" alt="flag" class="country-flag" />
      </div>
      <div class="dial-code">{{ selectedCountry?.dial_code }}</div>
      <div class="dropdown-arrow">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <div v-if="isDropdownOpen" class="countries-dropdown">
      <div class="search-container" @click.stop>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar..." 
          class="search-input"
          ref="searchInputRef"
        />
      </div>
      <div class="countries-list">
        <div 
          v-for="country in filteredCountries" 
          :key="country.code" 
          class="country-item"
          @click="selectCountry(country)"
        >
          <div class="flag-container">
            <img :src="country.flag" alt="flag" class="country-flag" />
          </div>
          <div class="country-name">{{ country.name }}</div>
          <div class="country-dial-code">{{ country.dial_code }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

// Country data with flags, dial codes, and masks
const countries = [
  { name: 'Afghanistan', code: 'af', dial_code: '+93', mask: '999 999 999' },
  { name: 'Albania', code: 'al', dial_code: '+355', mask: '999 999 999' },
  { name: 'Algeria', code: 'dz', dial_code: '+213', mask: '999 99 99 99' },
  { name: 'American Samoa', code: 'as', dial_code: '+1684', mask: '999 9999' },
  { name: 'Andorra', code: 'ad', dial_code: '+376', mask: '999 999' },
  { name: 'Angola', code: 'ao', dial_code: '+244', mask: '999 999 999' },
  { name: 'Anguilla', code: 'ai', dial_code: '+1264', mask: '999 9999' },
  { name: 'Antarctica', code: 'aq', dial_code: '+672', mask: '999 999' },
  { name: 'Antigua and Barbuda', code: 'ag', dial_code: '+1268', mask: '999 9999' },
  { name: 'Argentina', code: 'ar', dial_code: '+54', mask: '99 9999 9999' },
  { name: 'Armenia', code: 'am', dial_code: '+374', mask: '99 999999' },
  { name: 'Aruba', code: 'aw', dial_code: '+297', mask: '999 9999' },
  { name: 'Australia', code: 'au', dial_code: '+61', mask: '9999 999 999' },
  { name: 'Austria', code: 'at', dial_code: '+43', mask: '999 999999' },
  { name: 'Azerbaijan', code: 'az', dial_code: '+994', mask: '99 999 99 99' },
  { name: 'Bahamas', code: 'bs', dial_code: '+1242', mask: '999 9999' },
  { name: 'Bahrain', code: 'bh', dial_code: '+973', mask: '9999 9999' },
  { name: 'Bangladesh', code: 'bd', dial_code: '+880', mask: '9999 999999' },
  { name: 'Barbados', code: 'bb', dial_code: '+1246', mask: '999 9999' },
  { name: 'Belarus', code: 'by', dial_code: '+375', mask: '99 999 99 99' },
  { name: 'Belgium', code: 'be', dial_code: '+32', mask: '999 99 99 99' },
  { name: 'Belize', code: 'bz', dial_code: '+501', mask: '999 9999' },
  { name: 'Benin', code: 'bj', dial_code: '+229', mask: '99 99 99 99' },
  { name: 'Bermuda', code: 'bm', dial_code: '+1441', mask: '999 9999' },
  { name: 'Bhutan', code: 'bt', dial_code: '+975', mask: '99 99 99 99' },
  { name: 'Bolivia', code: 'bo', dial_code: '+591', mask: '9 999 9999' },
  { name: 'Bosnia and Herzegovina', code: 'ba', dial_code: '+387', mask: '99 999 999' },
  { name: 'Botswana', code: 'bw', dial_code: '+267', mask: '99 999 999' },
  { name: 'Brazil', code: 'br', dial_code: '+55', mask: '99 99999 9999' },
  { name: 'British Indian Ocean Territory', code: 'io', dial_code: '+246', mask: '999 9999' },
  { name: 'Brunei Darussalam', code: 'bn', dial_code: '+673', mask: '999 9999' },
  { name: 'Bulgaria', code: 'bg', dial_code: '+359', mask: '999 999 999' },
  { name: 'Burkina Faso', code: 'bf', dial_code: '+226', mask: '99 99 99 99' },
  { name: 'Burundi', code: 'bi', dial_code: '+257', mask: '99 99 99 99' },
  { name: 'Cambodia', code: 'kh', dial_code: '+855', mask: '99 999 999' },
  { name: 'Cameroon', code: 'cm', dial_code: '+237', mask: '9 99 99 99 99' },
  { name: 'Canada', code: 'ca', dial_code: '+1', mask: '999 999 9999' },
  { name: 'Cape Verde', code: 'cv', dial_code: '+238', mask: '999 99 99' },
  { name: 'Cayman Islands', code: 'ky', dial_code: '+1345', mask: '999 9999' },
  { name: 'Central African Republic', code: 'cf', dial_code: '+236', mask: '99 99 99 99' },
  { name: 'Chad', code: 'td', dial_code: '+235', mask: '99 99 99 99' },
  { name: 'Chile', code: 'cl', dial_code: '+56', mask: '9 9999 9999' },
  { name: 'China', code: 'cn', dial_code: '+86', mask: '999 9999 9999' },
  { name: 'Christmas Island', code: 'cx', dial_code: '+61', mask: '9 9999 9999' },
  { name: 'Cocos (Keeling) Islands', code: 'cc', dial_code: '+61', mask: '9 9999 9999' },
  { name: 'Colombia', code: 'co', dial_code: '+57', mask: '999 999 9999' },
  { name: 'Comoros', code: 'km', dial_code: '+269', mask: '999 99 99' },
  { name: 'Congo', code: 'cg', dial_code: '+242', mask: '99 999 9999' },
  { name: 'Congo, The Democratic Republic of the', code: 'cd', dial_code: '+243', mask: '999 999 999' },
  { name: 'Cook Islands', code: 'ck', dial_code: '+682', mask: '99 999' },
  { name: 'Costa Rica', code: 'cr', dial_code: '+506', mask: '9999 9999' },
  { name: 'Cote d\'Ivoire', code: 'ci', dial_code: '+225', mask: '99 99 99 99' },
  { name: 'Croatia', code: 'hr', dial_code: '+385', mask: '99 999 9999' },
  { name: 'Cuba', code: 'cu', dial_code: '+53', mask: '9 999 9999' },
  { name: 'Cyprus', code: 'cy', dial_code: '+357', mask: '99 999999' },
  { name: 'Czech Republic', code: 'cz', dial_code: '+420', mask: '999 999 999' },
  { name: 'Denmark', code: 'dk', dial_code: '+45', mask: '99 99 99 99' },
  { name: 'Djibouti', code: 'dj', dial_code: '+253', mask: '99 99 99 99' },
  { name: 'Dominica', code: 'dm', dial_code: '+1767', mask: '999 9999' },
  { name: 'Dominican Republic', code: 'do', dial_code: '+1849', mask: '999 999 9999' },
  { name: 'Ecuador', code: 'ec', dial_code: '+593', mask: '99 999 9999' },
  { name: 'Egypt', code: 'eg', dial_code: '+20', mask: '999 999 9999' },
  { name: 'El Salvador', code: 'sv', dial_code: '+503', mask: '9999 9999' },
  { name: 'Equatorial Guinea', code: 'gq', dial_code: '+240', mask: '999 999 999' },
  { name: 'Eritrea', code: 'er', dial_code: '+291', mask: '9 999 999' },
  { name: 'Estonia', code: 'ee', dial_code: '+372', mask: '9999 9999' },
  { name: 'Ethiopia', code: 'et', dial_code: '+251', mask: '99 999 9999' },
  { name: 'Falkland Islands (Malvinas)', code: 'fk', dial_code: '+500', mask: '99999' },
  { name: 'Faroe Islands', code: 'fo', dial_code: '+298', mask: '999999' },
  { name: 'Fiji', code: 'fj', dial_code: '+679', mask: '999 9999' },
  { name: 'Finland', code: 'fi', dial_code: '+358', mask: '99 999 9999' },
  { name: 'France', code: 'fr', dial_code: '+33', mask: '9 99 99 99 99' },
  { name: 'French Guiana', code: 'gf', dial_code: '+594', mask: '9999 99 99 99' },
  { name: 'French Polynesia', code: 'pf', dial_code: '+689', mask: '99 99 99' },
  { name: 'Gabon', code: 'ga', dial_code: '+241', mask: '9 99 99 99' },
  { name: 'Gambia', code: 'gm', dial_code: '+220', mask: '999 9999' },
  { name: 'Georgia', code: 'ge', dial_code: '+995', mask: '999 99 99 99' },
  { name: 'Germany', code: 'de', dial_code: '+49', mask: '999 999999999' },
  { name: 'Ghana', code: 'gh', dial_code: '+233', mask: '99 999 9999' },
  { name: 'Gibraltar', code: 'gi', dial_code: '+350', mask: '99999999' },
  { name: 'Greece', code: 'gr', dial_code: '+30', mask: '999 999 9999' },
  { name: 'Greenland', code: 'gl', dial_code: '+299', mask: '99 99 99' },
  { name: 'Grenada', code: 'gd', dial_code: '+1473', mask: '999 9999' },
  { name: 'Guadeloupe', code: 'gp', dial_code: '+590', mask: '9999 99 99 99' },
  { name: 'Guam', code: 'gu', dial_code: '+1671', mask: '999 9999' },
  { name: 'Guatemala', code: 'gt', dial_code: '+502', mask: '9999 9999' },
  { name: 'Guernsey', code: 'gg', dial_code: '+44', mask: '9999 999999' },
  { name: 'Guinea', code: 'gn', dial_code: '+224', mask: '999 99 99 99' },
  { name: 'Guinea-Bissau', code: 'gw', dial_code: '+245', mask: '999 999999' },
  { name: 'Guyana', code: 'gy', dial_code: '+592', mask: '999 9999' },
  { name: 'Haiti', code: 'ht', dial_code: '+509', mask: '99 99 9999' },
  { name: 'Holy See (Vatican City State)', code: 'va', dial_code: '+379', mask: '999 999 9999' },
  { name: 'Honduras', code: 'hn', dial_code: '+504', mask: '9999 9999' },
  { name: 'Hong Kong', code: 'hk', dial_code: '+852', mask: '9999 9999' },
  { name: 'Hungary', code: 'hu', dial_code: '+36', mask: '99 999 9999' },
  { name: 'Iceland', code: 'is', dial_code: '+354', mask: '999 9999' },
  { name: 'India', code: 'in', dial_code: '+91', mask: '99999 99999' },
  { name: 'Indonesia', code: 'id', dial_code: '+62', mask: '999 9999 9999' },
  { name: 'Iran, Islamic Republic of', code: 'ir', dial_code: '+98', mask: '999 999 9999' },
  { name: 'Iraq', code: 'iq', dial_code: '+964', mask: '999 999 9999' },
  { name: 'Ireland', code: 'ie', dial_code: '+353', mask: '99 999 9999' },
  { name: 'Isle of Man', code: 'im', dial_code: '+44', mask: '9999 999999' },
  { name: 'Israel', code: 'il', dial_code: '+972', mask: '999 999 9999' },
  { name: 'Italy', code: 'it', dial_code: '+39', mask: '999 999 9999' },
  { name: 'Jamaica', code: 'jm', dial_code: '+1876', mask: '999 9999' },
  { name: 'Japan', code: 'jp', dial_code: '+81', mask: '99 9999 9999' },
  { name: 'Jersey', code: 'je', dial_code: '+44', mask: '9999 999999' },
  { name: 'Jordan', code: 'jo', dial_code: '+962', mask: '9 9999 9999' },
  { name: 'Kazakhstan', code: 'kz', dial_code: '+7', mask: '999 999 9999' },
  { name: 'Kenya', code: 'ke', dial_code: '+254', mask: '999 999999' },
  { name: 'Kiribati', code: 'ki', dial_code: '+686', mask: '99999' },
  { name: 'Korea, Democratic People\'s Republic of', code: 'kp', dial_code: '+850', mask: '9999 999 999' },
  { name: 'Korea, Republic of', code: 'kr', dial_code: '+82', mask: '99 9999 9999' },
  { name: 'Kuwait', code: 'kw', dial_code: '+965', mask: '999 99999' },
  { name: 'Kyrgyzstan', code: 'kg', dial_code: '+996', mask: '999 999 999' },
  { name: 'Lao People\'s Democratic Republic', code: 'la', dial_code: '+856', mask: '99 99 999 999' },
  { name: 'Latvia', code: 'lv', dial_code: '+371', mask: '99 999 999' },
  { name: 'Lebanon', code: 'lb', dial_code: '+961', mask: '99 999 999' },
  { name: 'Lesotho', code: 'ls', dial_code: '+266', mask: '9999 9999' },
  { name: 'Liberia', code: 'lr', dial_code: '+231', mask: '999 999 9999' },
  { name: 'Libyan Arab Jamahiriya', code: 'ly', dial_code: '+218', mask: '99 999 9999' },
  { name: 'Liechtenstein', code: 'li', dial_code: '+423', mask: '999 999 999' },
  { name: 'Lithuania', code: 'lt', dial_code: '+370', mask: '999 99999' },
  { name: 'Luxembourg', code: 'lu', dial_code: '+352', mask: '999 999 999' },
  { name: 'Macao', code: 'mo', dial_code: '+853', mask: '9999 9999' },
  { name: 'Macedonia, The Former Yugoslav Republic of', code: 'mk', dial_code: '+389', mask: '99 999 999' },
  { name: 'Madagascar', code: 'mg', dial_code: '+261', mask: '99 99 999 99' },
  { name: 'Malawi', code: 'mw', dial_code: '+265', mask: '999 99 99 99' },
  { name: 'Malaysia', code: 'my', dial_code: '+60', mask: '99 999 9999' },
  { name: 'Maldives', code: 'mv', dial_code: '+960', mask: '999 9999' },
  { name: 'Mali', code: 'ml', dial_code: '+223', mask: '99 99 99 99' },
  { name: 'Malta', code: 'mt', dial_code: '+356', mask: '9999 9999' },
  { name: 'Marshall Islands', code: 'mh', dial_code: '+692', mask: '999 9999' },
  { name: 'Martinique', code: 'mq', dial_code: '+596', mask: '9999 99 99 99' },
  { name: 'Mauritania', code: 'mr', dial_code: '+222', mask: '99 99 99 99' },
  { name: 'Mauritius', code: 'mu', dial_code: '+230', mask: '9999 9999' },
  { name: 'Mayotte', code: 'yt', dial_code: '+262', mask: '9999 99 99 99' },
  { name: 'Mexico', code: 'mx', dial_code: '+52', mask: '999 999 9999' },
  { name: 'Micronesia, Federated States of', code: 'fm', dial_code: '+691', mask: '999 9999' },
  { name: 'Moldova, Republic of', code: 'md', dial_code: '+373', mask: '9999 9999' },
  { name: 'Monaco', code: 'mc', dial_code: '+377', mask: '99 99 99 99 99' },
  { name: 'Mongolia', code: 'mn', dial_code: '+976', mask: '99 99 9999' },
  { name: 'Montenegro', code: 'me', dial_code: '+382', mask: '99 999 999' },
  { name: 'Montserrat', code: 'ms', dial_code: '+1664', mask: '999 9999' },
  { name: 'Morocco', code: 'ma', dial_code: '+212', mask: '999 999999' },
  { name: 'Mozambique', code: 'mz', dial_code: '+258', mask: '99 999 9999' },
  { name: 'Myanmar', code: 'mm', dial_code: '+95', mask: '9 999 999' },
  { name: 'Namibia', code: 'na', dial_code: '+264', mask: '99 999 9999' },
  { name: 'Nauru', code: 'nr', dial_code: '+674', mask: '999 9999' },
  { name: 'Nepal', code: 'np', dial_code: '+977', mask: '999 999 9999' },
  { name: 'Netherlands', code: 'nl', dial_code: '+31', mask: '9 99 99 99 99' },
  { name: 'Netherlands Antilles', code: 'an', dial_code: '+599', mask: '9999 9999' },
  { name: 'New Caledonia', code: 'nc', dial_code: '+687', mask: '99 99 99' },
  { name: 'New Zealand', code: 'nz', dial_code: '+64', mask: '99 999 9999' },
  { name: 'Nicaragua', code: 'ni', dial_code: '+505', mask: '9999 9999' },
  { name: 'Niger', code: 'ne', dial_code: '+227', mask: '99 99 99 99' },
  { name: 'Nigeria', code: 'ng', dial_code: '+234', mask: '999 999 9999' },
  { name: 'Niue', code: 'nu', dial_code: '+683', mask: '9999' },
  { name: 'Norfolk Island', code: 'nf', dial_code: '+672', mask: '9 99999' },
  { name: 'Northern Mariana Islands', code: 'mp', dial_code: '+1670', mask: '999 9999' },
  { name: 'Norway', code: 'no', dial_code: '+47', mask: '999 99 999' },
  { name: 'Oman', code: 'om', dial_code: '+968', mask: '9999 9999' },
  { name: 'Pakistan', code: 'pk', dial_code: '+92', mask: '999 999 9999' },
  { name: 'Palau', code: 'pw', dial_code: '+680', mask: '999 9999' },
  { name: 'Palestinian Territory, Occupied', code: 'ps', dial_code: '+970', mask: '999 999 999' },
  { name: 'Panama', code: 'pa', dial_code: '+507', mask: '999 9999' },
  { name: 'Papua New Guinea', code: 'pg', dial_code: '+675', mask: '999 9999' },
  { name: 'Paraguay', code: 'py', dial_code: '+595', mask: '999 999999' },
  { name: 'Peru', code: 'pe', dial_code: '+51', mask: '999 999 999' },
  { name: 'Philippines', code: 'ph', dial_code: '+63', mask: '999 999 9999' },
  { name: 'Pitcairn', code: 'pn', dial_code: '+64', mask: '999 9999' },
  { name: 'Poland', code: 'pl', dial_code: '+48', mask: '999 999 999' },
  { name: 'Portugal', code: 'pt', dial_code: '+351', mask: '999 999 999' },
  { name: 'Puerto Rico', code: 'pr', dial_code: '+1939', mask: '999 999 9999' },
  { name: 'Qatar', code: 'qa', dial_code: '+974', mask: '9999 9999' },
  { name: 'Reunion', code: 're', dial_code: '+262', mask: '9999 99 99 99' },
  { name: 'Romania', code: 'ro', dial_code: '+40', mask: '999 999 999' },
  { name: 'Russian Federation', code: 'ru', dial_code: '+7', mask: '999 999 9999' },
  { name: 'Rwanda', code: 'rw', dial_code: '+250', mask: '999 999 999' },
  { name: 'Saint Barthelemy', code: 'bl', dial_code: '+590', mask: '9999 99 99 99' },
  { name: 'Saint Helena, Ascension and Tristan Da Cunha', code: 'sh', dial_code: '+290', mask: '9999' },
  { name: 'Saint Kitts and Nevis', code: 'kn', dial_code: '+1869', mask: '999 9999' },
  { name: 'Saint Lucia', code: 'lc', dial_code: '+1758', mask: '999 9999' },
  { name: 'Saint Martin', code: 'mf', dial_code: '+590', mask: '9999 99 99 99' },
  { name: 'Saint Pierre and Miquelon', code: 'pm', dial_code: '+508', mask: '99 99 99' },
  { name: 'Saint Vincent and the Grenadines', code: 'vc', dial_code: '+1784', mask: '999 9999' },
  { name: 'Samoa', code: 'ws', dial_code: '+685', mask: '99 9999' },
  { name: 'San Marino', code: 'sm', dial_code: '+378', mask: '999 999 9999' },
  { name: 'Sao Tome and Principe', code: 'st', dial_code: '+239', mask: '999 9999' },
  { name: 'Saudi Arabia', code: 'sa', dial_code: '+966', mask: '999 999 9999' },
  { name: 'Senegal', code: 'sn', dial_code: '+221', mask: '99 999 99 99' },
  { name: 'Serbia', code: 'rs', dial_code: '+381', mask: '99 999 9999' },
  { name: 'Seychelles', code: 'sc', dial_code: '+248', mask: '9 999 999' },
  { name: 'Sierra Leone', code: 'sl', dial_code: '+232', mask: '99 999999' },
  { name: 'Singapore', code: 'sg', dial_code: '+65', mask: '9999 9999' },
  { name: 'Slovakia', code: 'sk', dial_code: '+421', mask: '999 999 999' },
  { name: 'Slovenia', code: 'si', dial_code: '+386', mask: '99 999 999' },
  { name: 'Solomon Islands', code: 'sb', dial_code: '+677', mask: '99 99999' },
  { name: 'Somalia', code: 'so', dial_code: '+252', mask: '9 999 999' },
  { name: 'South Africa', code: 'za', dial_code: '+27', mask: '99 999 9999' },
  { name: 'South Georgia and the South Sandwich Islands', code: 'gs', dial_code: '+500', mask: '99999' },
  { name: 'Spain', code: 'es', dial_code: '+34', mask: '999 99 99 99' },
  { name: 'Sri Lanka', code: 'lk', dial_code: '+94', mask: '99 999 9999' },
  { name: 'Sudan', code: 'sd', dial_code: '+249', mask: '99 999 9999' },
  { name: 'Suriname', code: 'sr', dial_code: '+597', mask: '999 9999' },
  { name: 'Svalbard and Jan Mayen', code: 'sj', dial_code: '+47', mask: '999 99 999' },
  { name: 'Swaziland', code: 'sz', dial_code: '+268', mask: '9999 9999' },
  { name: 'Sweden', code: 'se', dial_code: '+46', mask: '99 999 9999' },
  { name: 'Switzerland', code: 'ch', dial_code: '+41', mask: '99 999 99 99' },
  { name: 'Syrian Arab Republic', code: 'sy', dial_code: '+963', mask: '99 9999 999' },
  { name: 'Taiwan', code: 'tw', dial_code: '+886', mask: '9 9999 9999' },
  { name: 'Tajikistan', code: 'tj', dial_code: '+992', mask: '999 99 9999' },
  { name: 'Tanzania, United Republic of', code: 'tz', dial_code: '+255', mask: '999 999 999' },
  { name: 'Thailand', code: 'th', dial_code: '+66', mask: '9 9999 9999' },
  { name: 'Timor-Leste', code: 'tl', dial_code: '+670', mask: '9999 9999' },
  { name: 'Togo', code: 'tg', dial_code: '+228', mask: '99 99 99 99' },
  { name: 'Tokelau', code: 'tk', dial_code: '+690', mask: '9999' },
  { name: 'Tonga', code: 'to', dial_code: '+676', mask: '99999' },
{ name: 'Trinidad and Tobago', code: 'tt', dial_code: '+1868', mask: '999 9999' },
{ name: 'Tunisia', code: 'tn', dial_code: '+216', mask: '99 999 999' },
{ name: 'Turkey', code: 'tr', dial_code: '+90', mask: '999 999 9999' },
{ name: 'Turkmenistan', code: 'tm', dial_code: '+993', mask: '9 99 999999' },
{ name: 'Turks and Caicos Islands', code: 'tc', dial_code: '+1649', mask: '999 9999' },
{ name: 'Tuvalu', code: 'tv', dial_code: '+688', mask: '999999' },
{ name: 'Uganda', code: 'ug', dial_code: '+256', mask: '999 999999' },
{ name: 'Ukraine', code: 'ua', dial_code: '+380', mask: '99 999 9999' },
{ name: 'United Arab Emirates', code: 'ae', dial_code: '+971', mask: '99 999 9999' },
{ name: 'United Kingdom', code: 'gb', dial_code: '+44', mask: '9999 999999' },
{ name: 'United States', code: 'us', dial_code: '+1', mask: '999 999 9999' },
{ name: 'Uruguay', code: 'uy', dial_code: '+598', mask: '9 999 99 99' },
{ name: 'Uzbekistan', code: 'uz', dial_code: '+998', mask: '99 999 9999' },
{ name: 'Vanuatu', code: 'vu', dial_code: '+678', mask: '99 99999' },
{ name: 'Venezuela, Bolivarian Republic of', code: 've', dial_code: '+58', mask: '999 999 9999' },
{ name: 'Viet Nam', code: 'vn', dial_code: '+84', mask: '99 9999 9999' },
{ name: 'Virgin Islands, British', code: 'vg', dial_code: '+1284', mask: '999 9999' },
{ name: 'Virgin Islands, U.S.', code: 'vi', dial_code: '+1340', mask: '999 9999' },
{ name: 'Wallis and Futuna', code: 'wf', dial_code: '+681', mask: '99 99 99' },
{ name: 'Western Sahara', code: 'eh', dial_code: '+212', mask: '999 999999' },
{ name: 'Yemen', code: 'ye', dial_code: '+967', mask: '999 999 999' },
{ name: 'Zambia', code: 'zm', dial_code: '+260', mask: '99 999 9999' },
{ name: 'Zimbabwe', code: 'zw', dial_code: '+263', mask: '9 999 9999' }
].map(country => ({
...country,
flag: `https://flagcdn.com/w20/${country.code}.png`
}));

export default {
props: {
content: { 
type: Object, 
required: true 
},
uid: { 
type: String, 
required: true 
},
/* wwEditor:start */
wwEditorState: { type: Object, required: true },
/* wwEditor:end */
},
emits: ['trigger-event'],
setup(props, { emit }) {
// Editor state
const isEditing = computed(() => {
/* wwEditor:start */
return props.wwEditorState.isEditing;
/* wwEditor:end */
// eslint-disable-next-line no-unreachable
return false;
});

// Refs
const selectedCountryRef = ref(null);
const searchInputRef = ref(null);
const isDropdownOpen = ref(false);
const searchQuery = ref('');

// Component variables
const { value: selectedCountryValue, setValue: setSelectedCountryValue } = wwLib.wwVariable.useComponentVariable({
uid: props.uid,
name: 'value',
type: 'object',
defaultValue: computed(() => {
const initialCountry = props.content.initialCountry || 'cl';
return countries.find(country => country.code === initialCountry) || countries.find(country => country.code === 'cl');
}),
});

// Computed properties
const selectedCountry = computed(() => {
return selectedCountryValue.value;
});

const filteredCountries = computed(() => {
if (!searchQuery.value) {
return countries;
}
const query = searchQuery.value.toLowerCase();
return countries.filter(country => 
country.name.toLowerCase().includes(query) || 
country.dial_code.includes(query)
);
});

// Methods
const toggleDropdown = () => {
if (isEditing.value) return;


isDropdownOpen.value = !isDropdownOpen.value;


if (isDropdownOpen.value) {
// Focus search input when dropdown opens
setTimeout(() => {
if (searchInputRef.value) {
searchInputRef.value.focus();
}
}, 100);
}
};

const selectCountry = (country) => {
if (isEditing.value) return;


setSelectedCountryValue(country);
isDropdownOpen.value = false;
searchQuery.value = '';

emit('trigger-event', {
name: 'change',
event: { value: country }
});
};

const handleClickOutside = (event) => {
if (isDropdownOpen.value && 
selectedCountryRef.value && 
!selectedCountryRef.value.contains(event.target)) {
isDropdownOpen.value = false;
searchQuery.value = '';
}
};

// Watch for initial country changes
watch(() => props.content.initialCountry, (newCountry) => {
if (newCountry && (!selectedCountryValue.value || newCountry !== selectedCountryValue.value.code)) {
const country = countries.find(c => c.code === newCountry);
if (country) {
setSelectedCountryValue(country);
emit('trigger-event', {
name: 'initValueChange',
event: { value: country }
});
}
}
});

// Lifecycle hooks
onMounted(() => {
document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
document.removeEventListener('click', handleClickOutside);
});

// Actions
const setCountry = (countryCode) => {
if (!countryCode) return;
const country = countries.find(c => c.code === countryCode.toLowerCase());
if (country) {
selectCountry(country);
}
};

return {
isDropdownOpen,
selectedCountry,
filteredCountries,
searchQuery,
selectedCountryRef,
searchInputRef,
toggleDropdown,
selectCountry,
setCountry,
isEditing
};
}
};
</script>

<style lang="scss" scoped>
.country-selector {
position: relative;
width: 250px;
font-family: inherit;


.selected-country {
display: flex;
align-items: center;
padding: 16px 12px;
border: 1px solid #d9d9d9;
border-radius: 8px;
cursor: pointer;
background-color: #fff;
transition: all 0.3s;
height: 48px;
justify-content: space-between;

&:hover {
border-color: #CCCCCC;
}

.flag-container {
display: flex;
align-items: center;
margin-right: 8px;

.country-flag {
width: 20px;
height: auto;
border-radius: 2px;
}
}

.dial-code {
flex: 1;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
/* Body 1 */
font-family: 'Poppins';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 24px;
/* Neutros/Gris 1 */
color: #333333;
}

.dropdown-arrow {
margin-left: 4px;
color: #666666;
transition: transform 0.3s;
}
}

&.is-open {
.dropdown-arrow {
transform: rotate(180deg);
}
}

.countries-dropdown {
position: absolute;
top: 100%;
left: 0;
width: 250px;
max-height: 300px;
overflow-y: auto;
background-color: #fff;
border: 1px solid #CCCCCC;
border-radius: 8px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
z-index: 1000;
margin-top: 4px; 

.search-container {
padding: 8px;
border-bottom: 1px solid #CCCCCC;

.search-input {
width: 100%;
padding: 6px 8px;
border: 1px solid #CCCCCC;
border-radius: 4px;
font-size: 14px;

&:focus {
border-color: #87CEEB;
outline: none;
box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
}
}

.countries-list {
.country-item {
display: flex;
align-items: center;
padding: 8px;
cursor: pointer;
transition: background-color 0.3s;

&:hover {
background-color: #f5f5f5;
}

.flag-container {
margin-right: 8px;

.country-flag {
width: 20px;
height: auto;
border-radius: 2px;
}
}

.country-name {
font-size: 14px;
flex: 1;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.country-dial-code {
font-size: 14px;
color:#333333;
margin-left: 8px;
}
}
}
}
}
</style>
