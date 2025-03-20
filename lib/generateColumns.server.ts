"use server";

export function generateServerColumns(fields: any[]) {
  return fields.map(field => ({
    accessorKey: field.name,
    header: field.label,
    // 仅传递可序列化的配置
    cellClassName: field.cellClassName || "",
    // 移除所有函数类型配置
  }));
}
