"use server";

// 定义 FieldConfig 类型
type FieldConfig = {
  name: string;
  label: string;
  cellClassName?: string; // 可选属性
};

export function generateServerColumns(fields: FieldConfig[]) {
  return fields.map(field => ({
    accessorKey: field.name,
    header: field.label,
    // 仅传递可序列化的配置
    cellClassName: field.cellClassName || "",
    // 移除所有函数类型配置
  }));
}