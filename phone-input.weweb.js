const waitForVueTheMask = () => {
  return new Promise((resolve) => {
    const check = () => {
      if (window.VueTheMask) resolve();
      else setTimeout(check, 50);
    };
    check();
  });
};

export default async () => {
  await waitForVueTheMask();

  return {
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
      };
    },
    directives: {
      mask: VueTheMask.mask,
    },
    async mounted() {
      const res = await fetch('./combined_countries_with_masks_filled.json');
      this.countries = await res.json();
      this.setMask();
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
    template: `
      <div class="phone-input">
        <select v-model="selectedCountryCode" @change="onCountryChange">
          <option v-for="country in countries" :key="country.code" :value="country.code">
            {{ country.flag }} {{ country.dial_code }}
          </option>
        </select>
        <input
          type="text"
          v-model="phone"
          v-mask="currentMask"
          placeholder="Ingrese su número"
        />
      </div>
    `,
  };
};
