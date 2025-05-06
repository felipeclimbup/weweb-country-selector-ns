export default async () => {
  await new Promise((resolve) => {
    const check = () => {
      if (window.VueTheMask?.mask) resolve();
      else setTimeout(check, 50);
    };
    check();
  });

  const countries = [];

  return {
    props: {
      modelValue: String,
    },
    emits: ["update:modelValue", "update:country"],
    data() {
      return {
        countries,
        selectedCountryCode: "CL",
        phone: "",
        currentMask: "",
      };
    },
    directives: {
      mask: window.VueTheMask.mask,
    },
    mounted() {
      this.setMask();
    },
    methods: {
      onCountryChange() {
        this.setMask();
        this.$emit("update:country", this.selectedCountryCode);
      },
      setMask() {
        const country = this.countries.find(
          (c) => c.code === this.selectedCountryCode
        );
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
            { country.flag } { country.dial_code }
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