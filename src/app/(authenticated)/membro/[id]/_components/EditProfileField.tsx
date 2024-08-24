import { FormItem, FormLabel } from "@/components/ui/form"

interface EditProfileFieldProps {
  title: string
  description: string
  children: React.ReactNode
}

function EditProfileField(props: EditProfileFieldProps) {
  const { title, description, children } = props

  return (
    <FormItem className="grid grid-cols-2 items-center gap-8">
      <div className="flex flex-col gap-1 text-left">
        <FormLabel className="font-semibold">{title}</FormLabel>
        <p className="text-xs text-neutral-400">{description}</p>
      </div>
      {children}
    </FormItem>
  )
}

export default EditProfileField
