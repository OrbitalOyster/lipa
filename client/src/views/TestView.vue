<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import GooseButton from '#components/GooseButton.vue'
import GooseCheckbox from '#components/GooseCheckbox.vue'
import GooseConfirm from '#components/GooseConfirm.vue'
import GooseForm from '#components/GooseForm.vue'
import GooseFormInput from '#components/GooseFormInput.vue'
import GooseInput from '#components/GooseInput.vue'
import GoosePopover from '#components/GoosePopover.vue'
import GooseSelect from '#components/GooseSelect.vue'
import GooseSwitch from '#components/GooseSwitch.vue'

const items = [
    '1 Macao',
    '2 Madagascar',
    '3 Malawi',
    '4 Malaysia',
    '5 Maldives',
    '6 Mali',
    '7 Malta',
    '8 Marshall Islands (the)',
    '9 Martinique',
    '10 Mauritania',
    '11 Mauritius',
    '12 Mayotte',
    '13 Mexico',
    '14 Micronesia (Federated States of)',
    '15 Moldova (the Republic of)',
    '16 Monaco',
    '17 Mongolia',
    '18 Montenegro',
    '19 Montserrat',
    '20 Morocco',
  ],
  selectedItem = ref('')

const s0 = ref('foo')
const cb = ref(true)

const confirmModal = useTemplateRef('confirmModal')

function throwError() {
  throw new Error('Test Error')
}

const toggleChecked = ref(false)
</script>

<template>
  <GooseConfirm
    ref="confirmModal"
    title="Are you sure you want to log out?"
    @submit="console.log('modal ok')"
  />

  <div style="padding: 2rem">
    <GooseForm
      id="mySampleForm"
      class="validated"
    >
      <GooseFormInput
        placeholder="From"
        name="sampleInput1"
        form="mySampleForm"
      />
      <hr>
      <GooseFormInput
        name="sampleInput2"
        form="mySampleForm"
        password
      />
      <hr>
      <div class="validated">
        <GooseInput
          v-model="s0"
          validation="invalid"
          error="Invalid input here"
        />
      </div>
      <p>{{ s0 }}</p>
      <hr>
      <GooseSelect
        v-model="selectedItem"
        placeholder="Select something"
        :items
        disabled
      />
      {{ selectedItem }}
      <hr>
      <div style="display: flex; gap: 1rem">
        <GoosePopover
          click-toggle
        >
          <GooseButton title="Click me" />
          <template #popover>
            <div style="padding: 1rem">
              Hello World!
            </div>
          </template>
        </GoosePopover>
        <GooseButton
          title="Alert"
          @click="confirmModal?.show"
        />
        <GooseButton
          title="Hover me"
          disabled
          tooltip="This is tooltip"
        />
        <GooseButton
          title="Error"
          danger
          @click="throwError"
        />
        <GooseButton
          title="Ы"
          tooltip="top"
          tooltip-side="top"
        />
        <GooseButton
          title="Ы"
          tooltip="left"
          tooltip-side="left"
        />
        <GooseButton
          title="Ы"
          tooltip="bottom"
          tooltip-side="bottom"
        />
        <GooseButton
          title="Ы"
          tooltip="right"
          tooltip-side="right"
        />
        <GooseButton
          title="Ы"
          tooltip="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
        />
      </div>
      <hr>
      <GooseCheckbox
        v-model="cb"
        name="testCheckbox"
        indeterminate
      >
        <i>Click me!</i>
      </GooseCheckbox>
      <GooseSwitch v-model="toggleChecked" />
      <hr>
      <div
        class="card"
        style="padding: 1rem"
      />
    </GooseForm>
  </div>
  <!--
  <div>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </div>
  -->
</template>

<style lang="sass" scoped>
</style>
