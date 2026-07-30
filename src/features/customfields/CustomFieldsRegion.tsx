import { CustomFields } from './CustomFields';
import { useCustomFields } from './useCustomFields';
import { readCustomValues, setCustomValue, serializeCustomValues } from './customValues';
import type { TaskRecord } from '../../lib/dataClient';

/** Wires a task's custom fields to the detail: loads the project's field
 * definitions, reads the task's values, and patches customValues (a JSON string)
 * on edit. Split from TaskDetailBody so that composer stays under the line limit. */
export function CustomFieldsRegion({
  task,
  onPatch,
}: {
  task: TaskRecord;
  onPatch: (customValues: string) => void;
}) {
  const { fields, add } = useCustomFields(task.projectId);
  const values = readCustomValues(task);
  return (
    <CustomFields
      fields={fields}
      values={values}
      onSetValue={(fieldId, value) =>
        onPatch(serializeCustomValues(setCustomValue(values, fieldId, value)))
      }
      onAddField={(name) => add.mutate(name)}
    />
  );
}
