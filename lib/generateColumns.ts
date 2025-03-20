type FieldConfig = {
  name: string
  label: string
  type: 'text' | 'richtext' | 'image' | 'select' | 'datetime'
}

// lib/generateColumns.ts
export function generateColumns(fields: any[]) {
  return fields.map(field => ({
    accessorKey: field.name,
    header: field.label,
    // 仅保留可序列化属性
    cellClassName: field.cellClassName || "",
    sortable: field.sortable || false
  }))
}
