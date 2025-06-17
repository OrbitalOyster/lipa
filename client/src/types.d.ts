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
    orgId: null | string
    rememberMe: boolean
    role: null | string
    username: null | string
  }

  /* Accordion */
  interface AccordionItem {
    icon: IconDefinition
    id: string
    title: string
  }

  interface Accordion {
    items: AccordionItem[]
    opened: string
  }

  /* Tabs */
  interface TabSlot {
    icon: IconDefinition
    id: string
    title: string
  }

  /* Tree */
  interface TreeLeaf {
    id: string
    matched?: boolean
    opened: Ref<boolean>
    sub: TreeLeaf[]
    title: string
    toggled: Ref<boolean>
  }

  /* FloatingUI options */
  interface FloatingUIOptions {
    active: Ref<boolean>
    fitTargetWidth?: boolean
    side?: Side
  }

  /* TODO: Shared types */
  interface ApiOrg {
    id: string
    name: string
    parent?: string
  }

  /* Select item */
  interface SelectItem {
    id: string
    title: string
  }
}
