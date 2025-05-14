export default {
editor: {
label: {
en: 'Country Selector',
},
icon: 'globe',
},
properties: {
initialCountry: {
label: { en: 'Default country' },
type: 'TextSelect',
bindable: true,
defaultValue: 'cl',
section: 'settings',
options: {
options: [
{ value: 'cl', label: 'Chile' },    
{ value: 'us', label: 'United States' },
{ value: 'gb', label: 'United Kingdom' },
{ value: 'ca', label: 'Canada' },
{ value: 'au', label: 'Australia' },
{ value: 'de', label: 'Germany' },
{ value: 'fr', label: 'France' },
{ value: 'jp', label: 'Japan' },
{ value: 'br', label: 'Brazil' },
{ value: 'ru', label: 'Russia' },
{ value: 'in', label: 'India' },
{ value: 'cn', label: 'China' },
{ value: 'es', label: 'Spain' },
{ value: 'mx', label: 'Mexico' },
{ value: 'it', label: 'Italy' },
{ value: 'kr', label: 'South Korea'}
]
},
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'A string that defines the default country code (ISO 2-letter code)',
},
propertyHelp: {
tooltip: 'The default country to be selected when the component loads',
},
/* wwEditor:end */
}
},
triggerEvents: [
{
name: 'change',
label: { en: 'On change' },
event: { value: {} },
default: true
},
{
name: 'initValueChange',
label: { en: 'On init value change' },
event: { value: {} }
}
],
actions: [
{
action: 'setCountry',
label: { en: 'Set country' },
args: [
{
name: 'country',
type: 'string',
label: { en: 'Country code (ISO 2-letter)' }
}
]
}
]
};
