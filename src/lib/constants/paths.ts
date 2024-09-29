export const PATHS = {
  MEMBRO: {
    ID: ({ UUID }: { UUID: string | undefined }) =>
      UUID == null ? "" : `/membro/${UUID}`,
  },
}
