export function useParentPath() {
  const route = useRoute()
  return computed(() =>
    route.path.split('/').slice(0, -1).join('/') || '/'
  )
}
