// lib/generateColumns.ts
type FieldConfig = {
  name: string
  label: string
  type: 'text' | 'richtext' | 'image' | 'select' | 'datetime'
  cellClassName?: string // 添加可选属性 cellClassName
  sortable?: boolean // 添加可选属性 sortable
}

export function generateColumns(fields: FieldConfig[]) {
  return fields.map(field => ({
    accessorKey: field.name,
    header: field.label,
    // 仅保留可序列化属性
    cellClassName: field.cellClassName || "",
    sortable: field.sortable || false
  }))
}