import type { IconDefinition } from '@fortawesome/fontawesome-common-types'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}

declare global {
  /* Form store */
  type FormCheck = 'required' | 'lessThanTo' | 'moreThanFrom' | 'notBogus'
  type FormInput = string | boolean | null

  /* User store */
  interface UserStore {
    username: null | string
    role: null | string
    sideBarWidth: number
    selectedOrgs: string[]
  }

  /* Accordion */
  interface AccordionItem {
    id: string
    title: string
    icon: IconDefinition
  }

  interface Accordion {
    items: AccordionItem[]
    toggled: string
  }

  /* Tabs */
  interface TabSlot {
    id: string
    title: string
    icon: IconDefinition
  }

  /* Tree */
  interface GooseTreeLeaf {
    checked: RemovableRef<boolean>
    id: string
    matched?: boolean
    sub?: GooseTreeLeaf[]
    title: string
    toggled: RemovableRef<boolean>
  }

  /* FloatingUI options */
  interface FloatingUIOptions {
    active: Ref<boolean>
    side?: Side
    fitTargetWidth?: boolean
  }

  /* Login form */
  interface LoginFormCheck {
    username: string
    password: string
    rememberMe: boolean
  }
}
