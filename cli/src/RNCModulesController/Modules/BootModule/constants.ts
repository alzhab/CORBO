import { ICopyToProject, IInsertoIntoProjectFileParams } from '../../../Base'

export const BOOT_MODULE_DEPENDENCIES = ['@alzhan/rncore-boot-module']

export const BOOT_MODULE_TEMPLATE_PATH = './templates/Modules/Boot'

export const BOOT_MODULE_CONFIG: ICopyToProject[] = [
  {
    type: 'folder',
    pathTo: '/src/UI/components/templates',
    pathFrom: BOOT_MODULE_TEMPLATE_PATH + '/components/templates/Boot',
  },
]

export const BOOT_MODULE_BIND: IInsertoIntoProjectFileParams[] = [
  {
    path: '/src/binders.ts',
    type: 'before',
    text: "import { bindBootModule } from '@alzhan/rncore-boot-module'",
    searchRegex: /export const BINDERS = \[/,
  },
  {
    path: '/src/binders.ts',
    type: 'after',
    text: `  // boot module
  bindBootModule,`,
    searchRegex: /export const BINDERS = \[/,
  },
]

export const BOOT_MODULE_FLOW_CONFIG: IInsertoIntoProjectFileParams[] = [
  {
    path: '/src/BusinessLogic/flow/flow.ts',
    searchRegex: /import \{ autorun \} from 'mobx'/,
    text: `import { BootBlmId, IBootBlm } from '@alzhan/rncore-boot-module'`,
    type: 'after',
  },
  {
    path: '/src/BusinessLogic/flow/flow.ts',
    searchRegex: /constructor\(/,
    text: `@inject(BootBlmId) private bootBlm: IBootBlm,`,
    type: 'after',
  },
  {
    path: '/src/BusinessLogic/flow/flow.ts',
    searchRegex: / onAppInit\(\) \{/,
    text: `onHideBoot() {
    this.bootBlm.hideBoot()
    this.appEventsStore.removeEvent()
  }`,
    type: 'before',
  },
  {
    path: '/src/EntryPoint.tsx',
    searchRegex: /import \{ Navigation \} from 'navigations\/Navigation'/,
    type: 'after',
    text: "import { useBootBlm } from '@alzhan/rncore-boot-module'\nimport { Boot } from 'templates/Boot'",
  },
  {
    path: '/src/EntryPoint.tsx',
    searchRegex: /const EntryPoint = observer\(\(\) => \{/,
    type: 'after',
    text: 'const { hideBoot } = useBootBlm()',
  },
  {
    path: '/src/EntryPoint.tsx',
    searchRegex: /return <Navigation \/>/,
    type: 'replace',
    text: `  return (
    <>
      {hideBoot && <Navigation />}

      <Boot hide={hideBoot} />
    </>
  )`,
  },
]
