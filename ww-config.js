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
