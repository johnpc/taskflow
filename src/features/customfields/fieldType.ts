/** Custom-field types and their human labels. One source of truth shared by the
 * add composer and the project-level field manager. */
export type FieldType = 'TEXT' | 'SELECT' | 'NUMBER' | 'DATE';

export const FIELD_TYPE_LABEL: Record<FieldType, string> = {
  TEXT: 'Text',
  SELECT: 'Select',
  NUMBER: 'Number',
  DATE: 'Date',
};
