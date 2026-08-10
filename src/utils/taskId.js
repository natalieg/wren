/** Task ids have to be unique *forever*, not just within the current list. History keeps
 * entries long after their task is gone, and a recurring habit creates a fresh task every
 * day — so a counter that reuses freed numbers would let a new task inherit an old one's
 * archive. Existing numeric ids keep working, everything compares them with ===. */
export function newTaskId() {
    return crypto.randomUUID()
}

/** DOM datasets are always strings, so a raw === against a numeric legacy id never
 * matches. The one place that reads an id back out of the DOM goes through here. */
export function matchesTaskId(task, datasetId) {
    return String(task.id) === String(datasetId)
}
