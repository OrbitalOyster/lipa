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
    userId: null | string
    isOrg: null | boolean
    role: null | string
    rememberMe: boolean
  }

  /*
  interface UserTokenPayload {
    userId?: string | null
    isOrg?: boolean | null
    rememberMe?: boolean | null
  }
  */

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
    useArrow?: boolean
  }

  /* TODO: Shared types */
  interface ApiOrg {
    id: string
    name: string
    parent?: string
  }

  interface APIReport {
    date: string
    org: string
    year: number
    status: string
  }

  interface FetchReportsResult {
    page: number
    size: number
    sortBy: string
    desc: boolean
    total: number
    rows: APIReport[]
  }

  /* Select item */
  type SelectId = string | number

  interface SelectItem {
    id: SelectId
    title: string
  }

  /* Table */
  interface TableHeader {
    title: string
    sortable?: boolean
    prop: string
  }

  interface TableModel {
    headers: TableHeader[]
    rows: Record<string, any>[]
    sortBy: string
    desc: boolean
  }
}
