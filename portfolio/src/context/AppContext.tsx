import { createContext, useContext } from 'react'
import type { SiteConfig } from '../hooks/useSiteConfig'
import { defaultSiteConfig } from '../hooks/useSiteConfig'

export interface AppContextValue {
  config: SiteConfig
  /** True once the preloader has finished and the hero reveal may play. */
  ready: boolean
}

export const AppContext = createContext<AppContextValue>({
  config: defaultSiteConfig,
  ready: false,
})

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  return useContext(AppContext)
}
