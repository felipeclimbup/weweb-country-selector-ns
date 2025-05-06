export default {
  props: {
    modelValue: String,
  },
  emits: ["update:modelValue", "update:country"],
  data() {
    return {
      countries: [],
      selectedCountryCode: "CL",
      phone: "",
      currentMask: "",
      maskDirective: null,
    };
  },
  async mounted() {
    // Cargar países embebidos
    this.countries = COUNTRIES;
    this.setMask();

    // Esperar a que VueTheMask esté disponible y aplicar directiva
    const waitForMask = () => {
      if (window.VueTheMask?.mask) {
        this.maskDirective = window.VueTheMask.mask;
        this.$forceUpdate();
      } else {
        setTimeout(waitForMask, 50);
      }
    };
    waitForMask();
  },
  methods: {
    onCountryChange() {
      this.setMask();
      this.$emit("update:country", this.selectedCountryCode);
    },
    setMask() {
      const country = this.countries.find(c => c.code === this.selectedCountryCode);
      this.currentMask = country?.mask || "####################";
    },
  },
  watch: {
    phone(val) {
      this.$emit("update:modelValue", val);
    },
  },
  directives: {
    // se inyecta dinámicamente al montar
  },
  render(h) {
    return h('div', { class: 'phone-input' }, [
      h('select', {
        domProps: { value: this.selectedCountryCode },
        on: {
          change: (e) => {
            this.selectedCountryCode = e.target.value;
            this.onCountryChange();
          }
        }
      }, this.countries.map(country =>
        h('option', {
          domProps: {
            value: country.code,
            innerText: `${country.flag} ${country.dial_code}`
          },
          key: country.code
        })
      )),
      h('input', {
        attrs: { type: 'text', placeholder: 'Ingrese su número' },
        directives: this.maskDirective ? [{
          name: 'mask',
          value: {
            mask: this.currentMask,
            tokens: window.VueTheMask.tokens
          }
        }] : [],
        domProps: { value: this.phone },
        on: {
          input: (e) => { this.phone = e.target.value; }
        }
      })
    ]);
  }
};

// Países embebidos (placeholder, será reemplazado)
const COUNTRIES = [];